import Link from "next/link";
import { SearchX } from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1221] p-6">
      <div className="relative w-full">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-blue-600/5 dark:bg-blue-600/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-slate-200/50 dark:bg-slate-800/30 blur-2xl" />
        <div className="relative text-center">
          <div className="flex justify-center mb-6">
            <div className="size-20 rounded-2xl bg-blue-600/10 dark:bg-blue-600/10 flex items-center justify-center">
              <SearchX className="size-9 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1
            className="text-7xl font-bold text-slate-200 dark:text-slate-800 leading-none mb-2"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            404
          </h1>
          <h2
            className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Page not found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
