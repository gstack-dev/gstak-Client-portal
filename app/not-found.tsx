import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1221] p-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-slate-200 dark:text-slate-800 mb-4" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
          Page not found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
