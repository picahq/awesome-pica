'use client';

import Image from "next/image";
import { useAuthKit } from "@picahq/authkit";

export default function Home() {
  const { open } = useAuthKit({
    token: {
      url: "http://localhost:3000/api/authkit",
      headers: {},
    },
    onSuccess: (connection) => {
      console.log('Successfully connected:', connection);
    },
    onError: (error) => {
      console.error('AuthKit error:', error);
    },
    onClose: () => {
      console.log('AuthKit modal closed');
    },
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg max-w-2xl border border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">Important Setup Steps</h2>
          <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Add your <code className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded">PICA_SECRET_KEY</code> environment variable. You can find this in the <a href="https://app.picaos.com/settings/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-300">Pica Dashboard</a>.</li>
            <li>Enable the connections you want to use in AuthKit from the <a href="https://app.picaos.com/authkit" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-300">AuthKit Dashboard</a>.</li>
          </ul>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            onClick={() => open()}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto cursor-pointer"
          >
            <Image
              className="dark:invert"
              src="/logo.png"
              alt="Pica logo"
              width={20}
              height={20}
            />
            Add a new connection
          </button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://docs.picaos.com/core/authkit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Read the AuthKit docs →
        </a>
      </footer>
    </div>
  );
}
