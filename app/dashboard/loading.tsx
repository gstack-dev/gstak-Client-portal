export default function DashboardLoading() {
  return (
    <div className="max-w-[1280px] mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded mt-3" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="h-64 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="h-48 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="h-48 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="h-6 w-28 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="h-48 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
