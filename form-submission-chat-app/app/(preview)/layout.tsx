import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-roundtrips.vercel.app"),
  title: "Pica Agent Idea Submission",
  description: "Submit your AI agent idea to Pica in 1 minute",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo-box.svg', type: 'image/svg+xml' }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>
        <div className="h-full">
          <Toaster position="top-center" richColors />
          {children}
        </div>
      </body>
    </html>
  );
}
