"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
//@ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
  //@ts-ignore
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, DotIcon } from "lucide-react";
import { useState, useEffect } from "react";

export function Markdown({
  content,
  fontSize = "sm",
  truncate = false,
  maxLength = 150,
}: {
  content: string;
  fontSize?: "xs" | "sm" | "md" | "lg";
  truncate?: boolean;
  maxLength?: number;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const processedContent = truncate
    ? content.length > maxLength
      ? content.slice(0, maxLength).split(" ").slice(0, 50).join(" ") + "..."
      : content
    : content;

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handleChange);

    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  const fontSizeClasses = {
    xs: "text-xs leading-5",
    sm: "text-sm leading-6",
    md: "text-base leading-7",
    lg: "text-lg leading-8",
  };

  return (
    <ReactMarkdown
      className={`prose max-w-none ${isDarkMode ? "prose-invert" : ""} ${fontSizeClasses[fontSize]} max-w-full overflow-x-auto`}
      remarkPlugins={[rehypeHighlight as any]}
      components={{
        h1: ({ node, ...props }) => (
          <h1
            {...props}
            className="first:mt-0 mb-4 mt-8 text-4xl font-bold tracking-tight dark:text-gray-100 text-gray-900"
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            {...props}
            className="first:mt-0 mb-3 mt-6 text-3xl font-semibold tracking-tight dark:text-gray-200 text-gray-800"
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            {...props}
            className="first:mt-0 mb-3 mt-5 text-2xl font-medium tracking-tight dark:text-gray-300 text-gray-700"
          />
        ),
        h4: ({ node, ...props }) => (
          <h4
            {...props}
            className="first:mt-0 mb-2 mt-4 text-xl font-medium tracking-tight dark:text-gray-400 text-gray-600"
          />
        ),
        h5: ({ node, ...props }) => (
          <h5
            {...props}
            className="first:mt-0 mb-2 mt-4 text-lg font-medium dark:text-gray-400 text-gray-600"
          />
        ),
        h6: ({ node, ...props }) => (
          <h6
            {...props}
            className="first:mt-0 mb-2 mt-3 text-base font-medium dark:text-gray-500 text-gray-500"
          />
        ),
        p: ({ node, ...props }) => (
          <p
            {...props}
            className={`first:my-0 my-2 dark:text-gray-300 text-gray-700 ${fontSizeClasses[fontSize]}`}
          />
        ),
        a: ({ node, ...props }) => (
          <a
            {...props}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200"
          />
        ),
        ul: ({ node, children, ...props }) => (
          <ul
            className={`list-item list-inside pl-6 space-y-1 dark:text-gray-300 text-gray-700 ${fontSizeClasses[fontSize]}`}
          >
            {children}
          </ul>
        ),
        ol: ({ node, children, ...props }) => (
          <ol
            className={`list-decimal space-y-1 dark:text-gray-300 text-gray-700 ${fontSizeClasses[fontSize]}`}
          >
            {children}
          </ol>
        ),
        li: ({ node, ...props }) => (
          <li {...props} className="flex justify-start items-start">
            <DotIcon className=" dark:text-gray-500 text-gray-400" />
            <span>{props.children}</span>
          </li>
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            {...props}
            className="border-l-4 border-blue-500 pl-4 italic dark:text-gray-400 text-gray-600"
          />
        ),
        hr: ({ node, ...props }) => (
          <hr
            {...props}
            className="my-6 border-gray-300 dark:border-gray-700"
          />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto">
            <table
              {...props}
              className="min-w-full divide-y dark:divide-gray-700 divide-gray-200"
            />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th
            {...props}
            className="px-4 py-3 text-left text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider"
          />
        ),
        td: ({ node, ...props }) => (
          <td
            {...props}
            className="px-4 py-3 text-sm dark:text-gray-300 text-gray-700"
          />
        ),
        tr: ({ node, ...props }) => (
          <tr
            {...props}
            className="dark:bg-gray-800 bg-white dark:even:bg-gray-750 even:bg-gray-50"
          />
        ),
        //@ts-ignore
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              style={oneDark}
              language={match[1]}
              PreTag="div"
              className={`${className} px-1 py-0.5 rounded bg-muted text-muted-foreground`}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              {...props}
              className={`${className} px-1 py-0.5 rounded bg-muted text-muted-foreground`}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}
