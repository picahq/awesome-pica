"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";
import { ToolInvocation } from "ai";
import { toast } from "sonner";

const toTitleCase = (str: string) => {
  return str
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[800px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-[rgb(var(--primary-green-rgb))]">
        <BotIcon />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-[rgb(var(--foreground-rgb))] flex flex-col gap-4">
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
  toolInvocations,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[800px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-[rgb(var(--primary-green-rgb))]">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-6 w-full">
        {content && (
          <div className="text-[rgb(var(--foreground-rgb))] flex flex-col gap-4">
            <Markdown>{content as string}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                // Display error in error styling
                if (!result?.success) {
                  return (
                    <div key={toolCallId} className="text-[rgb(var(--foreground-rgb))] text-sm">
                      <div className="mt-2 p-4 border border-red-800/50 rounded-lg bg-red-900/10 relative overflow-hidden">
                        {/* Error indicator pulse */}
                        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8">
                          <div className="absolute inset-0 bg-red-900/10 rounded-full animate-ping" />
                          <div className="absolute inset-0 bg-red-900/5 rounded-full" />
                        </div>

                        <div className="flex items-center justify-between relative">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-red-900/20 border border-red-800/50 flex items-center justify-center relative z-10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="12" y1="8" x2="12" y2="12" />
                                  <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                              </div>
                              {/* Error X mark */}
                              <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-[rgb(var(--background-start-rgb))] rounded-full border border-red-800/50 flex items-center justify-center z-20">
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-red-400">
                                Failed to Execute Action
                              </div>
                              <div className="text-xs text-red-400/70">
                                {result.message}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Error details preview */}
                        {result.raw && (
                          <div className="mt-3 relative">
                            <div className="relative group">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(typeof result.raw === 'string' ? result.raw : JSON.stringify(result.raw, null, 2));
                                  toast.success('Error details copied to clipboard');
                                }}
                                className="absolute top-2 right-2 px-3 py-1.5 text-red-400/50 hover:text-red-400 transition-colors rounded-md hover:bg-red-900/20 flex items-center gap-2 z-10"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                              </button>
                              <pre className="max-h-[150px] overflow-y-scroll p-2 bg-red-900/20 border border-red-800/50 rounded pr-10">
                                <code className="font-mono whitespace-pre-wrap break-all text-xs">${result.raw}</code>
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Display regular message in normal styling
                if (result?.message || result?.content) {
                  if (toolName === "getAvailableActions" && result?.actions) {
                    return (
                      <div key={toolCallId} className="text-[rgb(var(--foreground-rgb))] text-sm">
                        <div className="mt-2 p-4 terminal-bg border border-[rgba(var(--primary-green-rgb),0.2)] rounded-lg hover-glow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://assets.buildable.dev/catalog/node-templates/${result?.platform.toLowerCase()}.svg`}
                                alt={`${result?.platform} logo`}
                                className="w-8 h-8"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://assets.buildable.dev/catalog/node-templates/question.svg';
                                }}
                              />
                              <div>
                                <div className="text-lg font-semibold text-[rgb(var(--primary-green-rgb))]">
                                  Fetched {toTitleCase(result?.platform)} Actions
                                </div>
                                <div className="text-xs text-[rgb(var(--text-dim-rgb))]">
                                  Found {result?.actions?.length} actions available
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (toolName === "getActionKnowledge" && result?.action) {
                    return (
                      <div key={toolCallId} className="text-[rgb(var(--foreground-rgb))] text-sm">
                        <div className="mt-2 p-4 terminal-bg border border-[rgba(var(--primary-green-rgb),0.2)] rounded-lg hover-glow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://assets.buildable.dev/catalog/node-templates/${result?.platform.toLowerCase()}.svg`}
                                alt={`${result?.platform} logo`}
                                className="w-8 h-8"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://assets.buildable.dev/catalog/node-templates/question.svg';
                                }}
                              />
                              <div>
                                <div className="text-lg font-semibold text-[rgb(var(--primary-green-rgb))]">
                                  Fetched Pica Action Knowledge
                                </div>
                                <div className="text-xs text-[rgb(var(--text-dim-rgb))]">
                                  Loaded documentation for {toTitleCase(result?.action?.title)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  if (toolName === "execute" && result?.success) {
                    return (
                      <div key={toolCallId} className="text-[rgb(var(--foreground-rgb))] text-sm">
                        <div className="mt-2 p-4 terminal-bg border border-[rgba(var(--primary-green-rgb),0.2)] rounded-lg hover-glow relative overflow-hidden">
                          {/* Success indicator pulse */}
                          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8">
                            <div className="absolute inset-0 bg-[rgba(var(--primary-green-rgb),0.1)] rounded-full animate-ping" />
                            <div className="absolute inset-0 bg-[rgba(var(--primary-green-rgb),0.05)] rounded-full" />
                          </div>

                          <div className="flex items-center justify-between relative">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={`https://assets.buildable.dev/catalog/node-templates/${result.platform.toLowerCase()}.svg`}
                                  alt={`${result.platform} logo`}
                                  className="w-8 h-8 relative z-10"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://assets.buildable.dev/catalog/node-templates/question.svg';
                                  }}
                                />
                                {/* Success checkmark */}
                                <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-[rgb(var(--background-start-rgb))] rounded-full border border-[rgba(var(--primary-green-rgb),0.2)] flex items-center justify-center z-20">
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[rgb(var(--primary-green-rgb))]">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <div className="text-lg font-semibold text-[rgb(var(--primary-green-rgb))]">
                                  Action Executed Successfully
                                </div>
                                <div className="text-xs text-[rgb(var(--text-dim-rgb))]">
                                  {result.action} via {toTitleCase(result.platform)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Response data preview */}
                          {result.data && (
                            <div className="mt-3 relative">
                              <div className="relative group">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
                                    toast.success('Response data copied to clipboard');
                                  }}
                                  className="absolute top-2 right-2 px-3 py-1.5 text-[rgb(var(--primary-green-rgb))] opacity-50 hover:opacity-100 transition-colors rounded-md hover:bg-[rgba(var(--primary-green-rgb),0.1)] flex items-center gap-2 z-10"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                  </svg>
                                </button>
                                <pre className="max-h-[150px] overflow-y-scroll p-2 bg-[rgba(var(--primary-green-rgb),0.05)] border border-[rgba(var(--primary-green-rgb),0.2)] rounded">
                                  <code className="font-mono whitespace-pre-wrap break-all text-xs">{JSON.stringify(result.data, null, 2)}</code>
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                }
              }
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
