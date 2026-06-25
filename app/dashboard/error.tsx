"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function DashboardError({
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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-6">
      <div className="relative max-w-md w-full">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-red-600/5 dark:bg-red-600/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-slate-200/50 dark:bg-slate-800/30 blur-2xl" />
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
            An unexpected error occurred in your dashboard. Please try again.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-all"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
