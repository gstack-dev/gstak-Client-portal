export default function AdminLoading() {
  return (
    <div className="max-w-[1280px] mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded mt-3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
      <div className="h-96 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
