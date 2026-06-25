export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1221]">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
