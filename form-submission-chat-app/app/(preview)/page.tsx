"use client";

import { useRef, useEffect } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { useChat } from "ai/react";
import Image from "next/image";
import {
  GitHubIcon,
  GlobeIcon,
  VercelIcon,
  HelpIcon,
} from "@/components/icons";
import { ColorfulLoadingAnimation } from "@/components/loading-spinner";
import HeroGeometric from "@/components/share-agent-idea/hero-section";
export default function Home() {
  const { messages, handleSubmit, input, setInput, append, isLoading } =
    useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "Share Your Idea",
      label: "Submit your AI agent idea and get it built for free",
      action: "I'd like to share my idea for an AI agent",
    },
  ];

  const gradients = [
    "bg-gradient-to-r from-orange-600/20 via-orange-500/20 to-orange-400/20",
    "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
    "bg-gradient-to-r from-indigo-600/20 via-purple-500/20 to-fuchsia-500/20",
    "bg-gradient-to-r from-rose-500/20 to-pink-500/20",
  ];

  const coolGradient = "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500";

  const isComplete = messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    typeof messages[messages.length - 1].content === 'string' &&
    messages[messages.length - 1].content.includes('Thank you for your submission!') &&
    messages[messages.length - 1].toolInvocations?.every(tool =>
      tool.state === 'result'
    );

  useEffect(() => {
    // Refocus the input after message submission
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-b from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))]">
      <header className="w-full pt-4 sm:pt-6 px-4 md:px-0 flex-shrink-0">
        <div className="flex items-center justify-center max-w-[800px] mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-0">
            <Image
              src="/logo-white.svg"
              alt="Pica Logo"
              width={120}
              height={32}
              className="hover-glow sm:w-[150px] sm:h-[40px]"
            />

            <div className="flex items-center gap-3 sm:gap-6">
              <a
                href="https://picaos.com"
                target="_blank"
                className="flex items-center gap-1 sm:gap-2 text-[rgb(var(--text-dim-rgb))] hover:text-[rgb(var(--primary-green-rgb))] transition-colors text-xs sm:text-sm"
              >
                <GlobeIcon size={14} className="sm:w-4 sm:h-4" />
                <span>picaos.com</span>
              </a>
              <a
                href="https://github.com/picahq/pica"
                target="_blank"
                className="flex items-center gap-1 sm:gap-2 text-[rgb(var(--text-dim-rgb))] hover:text-[rgb(var(--primary-green-rgb))] transition-colors text-xs sm:text-sm"
              >
                <GitHubIcon size={14} className="sm:w-4 sm:h-4" />
                <span>picahq/pica</span>
              </a>
              <div className="h-4 w-px bg-[rgba(var(--primary-green-rgb),0.2)]" />
              <a
                href="https://docs.picaos.com/sdk/vercel-ai"
                target="_blank"
                className="flex items-center gap-1 sm:gap-2 text-[rgb(var(--primary-green-rgb))] hover:text-[rgb(var(--primary-green-rgb))] transition-colors text-xs sm:text-sm bg-[rgba(var(--primary-green-rgb),0.05)] px-1.5 sm:px-2 py-1 rounded-md border border-[rgba(var(--primary-green-rgb),0.2)] hover:bg-[rgba(var(--primary-green-rgb),0.1)]"
              >
                <HelpIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Docs</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-[800px] mx-auto w-full mt-3 sm:mt-4">
          <div className="h-px w-full bg-[rgba(var(--primary-green-rgb),0.1)]" />
          <div className="flex flex-col sm:flex-row items-center justify-between mt-2 sm:mt-3 px-1 gap-2 sm:gap-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs text-[rgb(var(--text-dim-rgb))]">
                Join our community of
              </span>
              <a
                href="https://www.picaos.com/community"
                target="_blank"
                className="text-[10px] sm:text-xs font-medium text-[rgb(var(--primary-green-rgb))] hover:underline"
              >
                passionate developers
              </a>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs text-[rgb(var(--text-dim-rgb))]">
                Used with
              </span>
              <a
                href="https://sdk.vercel.ai"
                target="_blank"
                className="flex items-center gap-1 sm:gap-1.5 text-[rgb(var(--text-dim-rgb))] hover:text-[rgb(var(--primary-green-rgb))] transition-colors"
              >
                <VercelIcon size={11} className="sm:w-[13px] sm:h-[13px]" />
                <span className="text-[10px] sm:text-xs">AI SDK</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 relative">
        <div
          ref={messagesContainerRef}
          className="flex-1 flex flex-col gap-6 overflow-y-auto min-h-0 items-center"
        >
          {messages.length === 0 && <HeroGeometric />}

          {messages.map((message) => {
            // Always render user messages
            if (message.role === "user") {
              return (
                <Message
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  toolInvocations={message.toolInvocations}
                />
              );
            }

            // For assistant messages, render if there's content or tool invocations
            if (
              message.role === "assistant" &&
              (message.content ||
                (message.toolInvocations && message.toolInvocations.length > 0))
            ) {
              return (
                <Message
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  toolInvocations={message.toolInvocations}
                />
              );
            }

            return null;
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:max-w-[800px] px-4 md:px-0"
            >
              <div className="flex items-center gap-3 rounded-lg p-4 bg-[rgba(var(--terminal-black-rgb),0.3)] border border-[rgba(var(--primary-green-rgb),0.1)]">
                <div className="w-6 h-6 flex items-center justify-center">
                  <ColorfulLoadingAnimation
                    scale={0.8}
                    colorScheme="picaGreen"
                    animationPattern="default"
                  />
                </div>
                <span className="text-sm text-[rgb(var(--text-dim-rgb))]">
                  Thinking...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="w-full px-4 md:px-0 mx-auto md:max-w-[800px] flex-shrink-0">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <button
                onClick={async () => {
                  append({
                    role: "user",
                    content: suggestedActions[0].action,
                  });
                }}
                className={`w-full ${coolGradient} hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] group relative overflow-hidden rounded-full p-4 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex flex-col items-center gap-2">
                  <span className="font-bold text-xl text-white">
                    {suggestedActions[0].title}
                  </span>
                  <span className="text-white/80">
                    {suggestedActions[0].label}
                  </span>
                </div>
              </button>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
              className="w-full rounded-xl bg-gradient-to-br from-[rgba(var(--primary-green-rgb),0.1)] to-[rgba(var(--primary-green-rgb),0.05)] border border-[rgba(var(--primary-green-rgb),0.2)] p-6 shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[rgba(var(--primary-green-rgb),0.1)] border border-[rgba(var(--primary-green-rgb),0.2)] flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[rgb(var(--primary-green-rgb))]">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-[rgb(var(--primary-green-rgb))]">
                    Thank you for your submission!
                  </h3>
                  <p className="text-[rgb(var(--text-dim-rgb))] leading-relaxed">
                    I&apos;ve sent you a confirmation email and notified our team. They&apos;ll be in touch soon!
                  </p>
                  <div className="h-px w-full bg-[rgba(var(--primary-green-rgb),0.2)] my-2" />
                  <p className="text-[rgb(var(--text-dim-rgb))] leading-relaxed">
                    Would you like to build something similar?{" "}
                    <a
                      href="https://github.com/picahq/pica"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgb(var(--primary-green-rgb))] hover:underline"
                    >
                      Check out our documentation
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <form
          className={`flex flex-col gap-2 items-center bg-[rgb(var(--background-end-rgb))] pt-4 pb-6 px-4 md:px-0 flex-shrink-0 ${messages.length > 0 ? "border-t border-[rgba(var(--primary-green-rgb),0.1)]" : ""}`}
          onSubmit={handleSubmit}
        >
          {messages.length > 0 && !isComplete && (
            <div className="relative flex items-center w-full md:max-w-[800px]">
              <input
                ref={inputRef}
                className="terminal-bg bg-gradient-to-r from-[rgba(var(--primary-green-rgb),0.03)] to-[rgba(var(--primary-green-rgb),0.07)] border border-[rgba(var(--primary-green-rgb),0.2)] rounded-md px-4 py-1.5 w-full outline-none text-[rgb(var(--foreground-rgb))] focus:border-[rgb(var(--primary-green-rgb))] transition-colors duration-300"
                placeholder={
                  isLoading ? "Waiting for response..." : "Send a message..."
                }
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                disabled={isLoading}
              />
            </div>
          )}
          <div className="flex gap-2 w-full md:max-w-[800px] justify-center">
            {messages.length > 0 && !isComplete && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 px-3 py-1.5 rounded-full bg-[rgba(var(--terminal-black-rgb),0.8)] backdrop-blur-sm border border-[rgba(var(--primary-green-rgb),0.2)] text-[rgb(var(--text-dim-rgb))] hover:text-[rgb(var(--primary-green-rgb))] hover:border-[rgb(var(--primary-green-rgb))] hover:bg-[rgba(var(--primary-green-rgb),0.05)] transition-all duration-300 text-xs shadow-lg hover:shadow-[0_0_10px_rgba(var(--primary-green-rgb),0.1)]"
                onClick={() => window.location.reload()}
              >
                Clear chat
              </motion.button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
