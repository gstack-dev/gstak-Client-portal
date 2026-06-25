"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1221] p-6">
      <div className="text-center max-w-md">
        <div className="size-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <span className="text-3xl">!</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
          Something went wrong
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
