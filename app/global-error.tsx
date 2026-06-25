"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1221] p-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              A critical error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
