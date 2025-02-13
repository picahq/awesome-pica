"use client";

import { useRef } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { useChat } from "ai/react";
import Image from "next/image";
import { GitHubIcon, GlobeIcon, VercelIcon, HelpIcon } from "@/components/icons";
import { ColorfulLoadingAnimation } from "@/components/loading-spinner";

export default function Home() {
  const { messages, handleSubmit, input, setInput, append, isLoading } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "List Available Connections",
      label: "Show me my 5 latest connections",
      action: "List my 5 latest available connections",
    },
    {
      title: "List Supported Actions for Gmail",
      label: "What actions are supported for gmail?",
      action: "What actions are supported for gmail messages?",
    },
    {
      title: "Create a Shopify Product",
      label: "Create a new product in my Shopify store",
      action: "Create a new product in my Shopify",
    },
    {
      title: "Search using Exa AI",
      label: "Search for Paul McCartney using Exa AI",
      action: "Search for Paul McCartney using Exa AI",
    }
  ];

  const gradients = [
    "bg-gradient-to-r from-orange-600/20 via-orange-500/20 to-orange-400/20",
    "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
    "bg-gradient-to-r from-indigo-600/20 via-purple-500/20 to-fuchsia-500/20",
    "bg-gradient-to-r from-rose-500/20 to-pink-500/20"
  ];

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-gradient-to-b from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))]">
      <div className="flex flex-col justify-between gap-4">
        <header className="w-full pt-6 px-4 md:px-0">
          <div className="flex items-center justify-center max-w-[800px] mx-auto w-full">
            <div className="flex items-center justify-between w-full">

              <a href="https://picaos.com" target="_blank">
                <Image src="/logo-white.svg" alt="Pica Logo" width={150} height={40} />
              </a>

              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/picahq/pica"
                  target="_blank"
                  className="flex items-center gap-2 text-[rgb(var(--text-dim-rgb))] hover:text-[rgb(var(--primary-green-rgb))] transition-colors text-sm"
                >
                  <GitHubIcon size={16} />
                  <span>picahq/pica</span>
                </a>
                <div className="h-4 w-px bg-[rgba(var(--primary-green-rgb),0.2)]" />
                <a
                  href="https://docs.picaos.com/sdk/vercel-ai"
                  target="_blank"
                  className="flex items-center gap-2 text-[rgb(var(--primary-green-rgb))] hover:text-[rgb(var(--primary-green-rgb))] transition-colors text-sm bg-[rgba(var(--primary-green-rgb),0.05)] px-2 py-1 rounded-md border border-[rgba(var(--primary-green-rgb),0.2)] hover:bg-[rgba(var(--primary-green-rgb),0.1)]"
                >
                  <HelpIcon size={14} />
                  <span>Docs</span>
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-[800px] mx-auto w-full mt-4">
            <div className="h-px w-full bg-[rgba(var(--primary-green-rgb),0.1)]" />
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[rgb(var(--text-dim-rgb))]">Join our community of</span>
                <a href="https://www.picaos.com/community" target="_blank" className="text-xs font-medium text-[rgb(var(--primary-green-rgb))] hover:underline">passionate developers</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[rgb(var(--text-dim-rgb))]">Used with</span>
                <a href="https://sdk.vercel.ai" target="_blank" className="flex items-center gap-1.5 text-[rgb(var(--text-dim-rgb))] hover:text-[rgb(var(--primary-green-rgb))] transition-colors">
                  <VercelIcon size={13} />
                  <span className="text-xs">AI SDK</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-6 h-full w-dvw items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-[rgb(var(--dark-green-rgb))] scrollbar-track-[rgba(var(--green-glow-rgb))]"
        >
          {messages.length === 0 && (
            <motion.div className="h-[350px] px-4 w-full md:w-[800px] md:px-0 pt-20">
              <div className="silver-box rounded-lg p-6 flex flex-col gap-4 text-[rgb(var(--text-dim-rgb))] text-sm text-center">
                <h1 className="text-2xl font-bold">
                  Pica OneTool Demo
                </h1>
                <p className="welcome-text text-lg">
                  Experience the future of AI agent connectivity with seamless access to 100+ APIs and tools.
                </p>
                <p className="welcome-text">
                  Unlock limitless possibilities for your AI agents with just one line of code. Connect to any service, automate workflows, and build powerful integrations instantly.
                </p>
              </div>
            </motion.div>
          )}

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
            if (message.role === "assistant" && (
              message.content ||
              (message.toolInvocations && message.toolInvocations.length > 0)
            )) {
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
                    scale={.8}
                    colorScheme="picaGreen"
                    animationPattern="default"
                  />
                </div>
                <span className="text-sm text-[rgb(var(--text-dim-rgb))]">Thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[800px] mb-4">
          {messages.length === 0 &&
            suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className={`w-full text-left ${gradients[index]} hover-glow border border-white/20 text-[rgb(var(--foreground-rgb))] rounded-lg p-2 text-sm hover:border-white/40 transition-all duration-300 flex flex-col`}
                >
                  <span className="font-medium text-white/90">{suggestedAction.title}</span>
                  <span className="text-white/70">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative flex items-center w-full md:max-w-[800px]">
            <input
              ref={inputRef}
              className="terminal-bg bg-gradient-to-r from-[rgba(var(--primary-green-rgb),0.03)] to-[rgba(var(--primary-green-rgb),0.07)] border border-[rgba(var(--primary-green-rgb),0.2)] rounded-md px-4 py-1.5 w-full outline-none text-[rgb(var(--foreground-rgb))] focus:border-[rgb(var(--primary-green-rgb))] transition-colors duration-300"
              placeholder={isLoading ? "Waiting for response..." : "Send a message..."}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2 w-full md:max-w-[800px] justify-center">
            {messages.length > 0 && (
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
            <motion.a
              href="https://app.picaos.com/connections"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 px-3 py-1.5 rounded-full bg-[rgba(var(--terminal-black-rgb),0.8)] backdrop-blur-sm border border-[rgba(var(--primary-green-rgb),0.2)] text-[rgb(var(--text-dim-rgb))] hover:text-[rgb(var(--primary-green-rgb))] hover:border-[rgb(var(--primary-green-rgb))] hover:bg-[rgba(var(--primary-green-rgb),0.05)] transition-all duration-300 text-xs shadow-lg hover:shadow-[0_0_10px_rgba(var(--primary-green-rgb),0.1)]"
            >
              + New Connection
            </motion.a>
          </div>
        </form>
      </div>
    </div>
  );
}
