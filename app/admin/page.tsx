import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Users,
  FolderTree,
  DollarSign,
  Receipt,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  adminMetrics,
  adminMonthlyRevenue,
  adminProjectStatus,
  adminRecentClients,
} from "@/lib/data";

export default function AdminDashboardPage() {
  const maxRevenue = Math.max(...adminMonthlyRevenue.map((d) => d.value));

  return (
    <div className="max-w-[1280px] mx-auto">
      <header className="mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          Overview
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          Welcome back. Here&apos;s what&apos;s happening with your agency today.
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminMetrics.map((m) => {
          const Icon = m.icon === "Users" ? Users : m.icon === "FolderTree" ? FolderTree : m.icon === "DollarSign" ? DollarSign : Receipt;
          return (
            <Card key={m.label} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">{m.label}</CardDescription>
                  <Icon className="size-5 text-slate-400 dark:text-slate-500" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{m.value}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  {m.trend && (
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${m.trendUp ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
                      <TrendingUp className="size-3" /> {m.trend}
                    </span>
                  )}
                  {m.sub && <span className="text-xs text-slate-500 dark:text-slate-400">{m.sub}</span>}
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Bar Chart */}
        <Card className="lg:col-span-2 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48 pt-4">
              {adminMonthlyRevenue.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">${d.value}k</span>
                  <div className="w-full max-w-[40px] bg-blue-600 dark:bg-blue-500 rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer"
                    style={{ height: `${(d.value / maxRevenue) * 100}%` }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Status Doughnut */}
        <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" className="dark:stroke-slate-700" />
                {(() => {
                  const circumference = 2 * Math.PI * 40;
                  const segments = adminProjectStatus.map((s) => ({ ...s, seg: (s.value / 100) * circumference }));
                  const offsets = segments.map((_, i) => -segments.slice(0, i).reduce((a, b) => a + b.seg, 0));
                  return segments.map((s, i) => (
                    <circle key={s.label} cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12"
                      strokeDasharray={`${s.seg} ${circumference - s.seg}`} strokeDashoffset={offsets[i]}
                      className={s.color.replace("bg-", "text-")} />
                  ));
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
                  {adminProjectStatus.reduce((a, b) => a + b.value, 0)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {adminProjectStatus.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${s.color}`} />
                    <span className="text-slate-600 dark:text-slate-400">{s.label}</span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-slate-50">{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Clients Table */}
      <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Recent Clients</h2>
          <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 text-sm">
            View All <ArrowUpRight className="size-4 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0B1221] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Last Activity</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {adminRecentClients.map((c) => (
                <tr key={c.name} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B1221]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${c.avatarBg} flex items-center justify-center text-xs font-bold`}>{c.initials}</div>
                      <span className="font-medium text-slate-900 dark:text-slate-50">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.project}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.statusColor}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
