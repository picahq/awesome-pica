'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef } from 'react';

interface Message {
  id: string;
  threadId: string;
}

interface EmailResponse {
  messages: Message[];
  nextPageToken?: string;
}

export default function Home() {
  const [emails, setEmails] = useState<Message[]>([]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(-1);
  const [processedCount, setProcessedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, setMessages } = useChat({
    api: '/api/chat',
    onFinish: () => {
      setIsProcessing(false);
      // Check the last message to see if processing was successful
      const lastMessage = messages[messages.length - 1];
      const isProcessingComplete = lastMessage?.parts.some(part => 
        part.type === 'text' && (
          part.text.includes('Email successfully labeled as "Wellfound Candidate found"') &&
          part.text.includes('Candidate details successfully stored in Airtable')
        )
      );

      if (isProcessingComplete) {
        setProcessedCount(prev => prev + 1);
        setMessages([]);
        
        // Move to next email and start processing
        if (currentEmailIndex < emails.length - 1) {
          const nextIndex = currentEmailIndex + 1;
          setCurrentEmailIndex(nextIndex);
          const nextEmail = emails[nextIndex];
          handleInputChange({
            target: { value: `Start the candidate tracking process for messageId: ${nextEmail.id}` }
          } as React.ChangeEvent<HTMLInputElement>);
          
          // Submit the next email
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.dispatchEvent(
                new Event('submit', { bubbles: true, cancelable: true })
              );
            }
          }, 100);
        } else if (nextPageToken) {
          loadNextPage();
        }
      } else {
        setProcessedCount(prev => prev + 1);
        setMessages([]);
        
        if (currentEmailIndex < emails.length - 1) {
          const nextIndex = currentEmailIndex + 1;
          setCurrentEmailIndex(nextIndex);
          const nextEmail = emails[nextIndex];
          handleInputChange({
            target: { value: `Start the candidate tracking process for messageId: ${nextEmail.id}` }
          } as React.ChangeEvent<HTMLInputElement>);
          
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.dispatchEvent(
                new Event('submit', { bubbles: true, cancelable: true })
              );
            }
          }, 100);
        } else if (nextPageToken) {
          loadNextPage();
        }
      }
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsProcessing(true);
    originalHandleSubmit(e);
  };

  // Manual control for processing next email
  const processNextEmail = () => {
    if (currentEmailIndex >= emails.length - 1) {
      return;
    }
    const nextIndex = currentEmailIndex + 1;
    const nextEmail = emails[nextIndex];
    handleInputChange({
      target: { value: `Start the candidate tracking process for messageId: ${nextEmail.id}` }
    } as React.ChangeEvent<HTMLInputElement>);
    
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true })
        );
      }
    }, 100);
  };

  const loadEmails = async (pageToken?: string) => {
    try {
      const url = new URL('https://api.picaos.com/v1/passthrough/users/me/messages');
      url.searchParams.append('q', 'subject:"is interested in Software Engineer (Integrations) at Pica" -label:Wellfound Candidate found');
      if (pageToken) {
        url.searchParams.append('pageToken', pageToken);
      }

      // Make sure the secret key is present
      if (!process.env.NEXT_PUBLIC_PICA_SECRET_KEY) {
        throw new Error('PICA_SECRET_KEY is not present');
      }

      // Make sure the connection key is present
      if (!process.env.NEXT_PUBLIC_GMAIL_CONNECTION_KEY) {
        throw new Error('GMAIL_CONNECTION_KEY is not present');
      }

      const response = await fetch(url.toString(), {
        headers: {
          'x-pica-secret': process.env.NEXT_PUBLIC_PICA_SECRET_KEY,
          'x-pica-connection-key': process.env.NEXT_PUBLIC_GMAIL_CONNECTION_KEY,
          'content-type': 'application/json'
        }
      });
      const data: EmailResponse = await response.json();
      
      // If this is a new page (not the first load), append the new emails
      if (pageToken) {
        setEmails(prevEmails => [...prevEmails, ...data.messages]);
      } else {
        setEmails(data.messages);
      }
      
      setNextPageToken(data.nextPageToken);
      setMessages([]);
      setProcessedCount(0);
      setCurrentEmailIndex(0);
      
      // Start processing first email of the new batch
      if (data.messages.length > 0) {
        const firstEmail = data.messages[0];
        handleInputChange({
          target: { value: `Start the candidate tracking process for messageId: ${firstEmail.id}` }
        } as React.ChangeEvent<HTMLInputElement>);
        
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.dispatchEvent(
              new Event('submit', { bubbles: true, cancelable: true })
            );
          }
        }, 100);
      }
    } catch (error) {
      console.error('❌ Error loading emails:', error);
    }
  };

  // Function to load next page when current page is complete
  const loadNextPage = () => {
    if (nextPageToken) {
      loadEmails(nextPageToken);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch bg-zinc-900 min-h-screen text-zinc-100">
      {/* Progress Status */}
      <div className="fixed top-0 left-0 right-0 bg-zinc-800 p-4 text-zinc-100 border-b border-zinc-700">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <span>Processed: {processedCount} / {emails.length}</span>
            {emails.length > 0 && (
              <div className="w-64 h-2 bg-zinc-700 rounded-full">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(processedCount / emails.length) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Display */}
      <div className="mb-20">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`whitespace-pre-wrap mb-4 p-4 rounded break-words ${
              message.role === 'user' 
                ? 'bg-zinc-800 border border-zinc-700' 
                : 'bg-zinc-800 border-l-4 border-l-emerald-500 border-y border-r border-zinc-700'
            }`}
          >
            <div className={`font-medium mb-1 ${
              message.role === 'user' ? 'text-blue-400' : 'text-emerald-400'
            }`}>
              {message.role === 'user' ? 'User: ' : 'AI: '}
            </div>
            {message.parts.map((part, partIndex) => {
              switch (part.type) {
                case 'text':
                  return (
                    <div 
                      key={`${message.id}-part-${partIndex}`} 
                      className="text-zinc-300 overflow-hidden overflow-wrap-break-word"
                    >
                      {part.text}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>

      {/* Chat Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md p-2 mb-8">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={isProcessing ? "Processing email..." : "Ready to process emails"}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded shadow-xl text-zinc-100 placeholder-zinc-500"
          disabled={true}
        />
      </form>

      {/* Control Buttons */}
      <div className="fixed bottom-0 w-full max-w-md p-2 mb-24 flex gap-2">
        <button
          onClick={() => loadEmails()}
          disabled={isProcessing || (emails.length > 0 && currentEmailIndex === 0)}
          className={`flex-1 p-2 rounded shadow-xl transition-all
            ${isProcessing || (emails.length > 0 && currentEmailIndex === 0)
              ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-600 hover:border-zinc-500'
            }`}
        >
          {emails.length === 0 ? 'Load Emails' : 'Reload Emails'}
        </button>
        
        <button
          onClick={processNextEmail}
          disabled={isProcessing || emails.length === 0 || currentEmailIndex >= emails.length - 1}
          className={`flex-1 p-2 rounded shadow-xl transition-all
            ${isProcessing || emails.length === 0 || currentEmailIndex >= emails.length - 1
              ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
              : 'bg-emerald-700 hover:bg-emerald-600 text-zinc-100 border border-emerald-600'
            }`}
        >
          Next Email
        </button>
      </div>
      
      {/* Status Message */}
      <div className="fixed bottom-0 w-full max-w-md p-2 mb-16 text-center">
        {emails.length > 0 && currentEmailIndex >= emails.length ? (
          <span className="text-emerald-500 font-medium">All emails processed!</span>
        ) : emails.length > 0 && processedCount === currentEmailIndex + 1 ? (
          <span className="text-blue-500 font-medium">Ready for next email</span>
        ) : null}
      </div>
    </div>
  );
}