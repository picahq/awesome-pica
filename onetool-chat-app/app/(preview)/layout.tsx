import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-roundtrips.vercel.app"),
  title: "Pica OneTool Demo",
  description: "Unleash the Potential of Agentic AI",
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
      <body>
        <div className={`${jetbrainsMono.className} flex min-h-screen`}>
          <div className="max-w-[1200px] w-full mx-auto px-8">
            <Toaster position="top-center" richColors />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
