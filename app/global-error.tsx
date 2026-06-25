"use client";

import { TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-slate-50 dark:bg-[#0B1221]">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="relative max-w-md w-full">
            <div className="absolute -top-20 -right-20 size-64 rounded-full bg-red-600/5 blur-3xl" />
            <div className="relative text-center">
              <div className="flex justify-center mb-6">
                <div className="size-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <TriangleAlert className="size-9 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h1
                className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2"
                style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                Something went wrong
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                A critical error occurred. Please try refreshing the page.
              </p>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
