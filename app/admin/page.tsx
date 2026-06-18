import type { Metadata } from "next";
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
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Agency overview, metrics, and analytics.",
  openGraph: { title: "Admin Dashboard", description: "Agency overview, metrics, and analytics." },
};
import { getAdminMetrics } from "@/app/actions/admin";
import { getAdminInvoiceStats, getMonthlyRevenue } from "@/app/actions/invoices";
import { getDictionary, getDir, isValidLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { cookies } from "next/headers";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const localeRaw = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;
  const locale: Locale = isValidLocale(localeRaw) ? localeRaw : defaultLocale;
  const dict = await getDictionary(locale);
  const t = (key: string, params?: Record<string, string | number>) => {
    const val = key.split(".").reduce((acc, part) => acc?.[part], dict as any);
    if (typeof val !== "string") return key;
    return params ? Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), val) : val;
  };

  const { totalClients, activeProjects, projectStatusSegments } = await getAdminMetrics();
  const invoiceStats = await getAdminInvoiceStats();
  const monthlyRevenue = await getMonthlyRevenue();
  const totalRevenue = invoiceStats.totalCollected + invoiceStats.totalPending + invoiceStats.totalOverdue;
  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.value), 1);

  const adminMetrics = [
    {
      icon: "Users",
      label: t("admin.totalClients"),
      value: String(totalClients),
      trend: null,
      trendUp: false,
    },
    {
      icon: "FolderTree",
      label: t("admin.activeProjects"),
      value: String(activeProjects),
      trend: null,
      trendUp: false,
    },
    {
      icon: "DollarSign",
      label: t("admin.totalRevenue"),
      value: `$${totalRevenue.toLocaleString()}`,
      trend: null,
      trendUp: false,
    },
    {
      icon: "Receipt",
      label: t("admin.pendingInvoices"),
      value: String(invoiceStats.pendingCount),
      sub: `($${invoiceStats.totalPending.toLocaleString()})`,
      trend: null,
      trendUp: false,
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto">
      <header className="mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          {t("admin.overview")}
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          {t("admin.welcome")}
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminMetrics.map((m) => {
          const Icon = m.icon === "Users" ? Users : m.icon === "FolderTree" ? FolderTree : m.icon === "DollarSign" ? DollarSign : Receipt;
  const statusKeyMap: Record<string, string> = {
    planning: "status.planning",
    in_progress: "status.inProgress",
    review: "status.review",
    completed: "status.completed",
    on_hold: "status.onHold",
    cancelled: "status.cancelled",
  };

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
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{t("admin.revenueGrowth")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48 pt-4">
              {monthlyRevenue.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">${d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}</span>
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
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{t("admin.projectStatusDistribution")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" className="dark:stroke-slate-700" />
                {(() => {
                  const circumference = 2 * Math.PI * 40;
                  const segments = projectStatusSegments.map((s) => ({ ...s, seg: (s.value / 100) * circumference }));
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
                  {projectStatusSegments.reduce((a, b) => a + b.value, 0)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {projectStatusSegments.map((s) => (
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
    </div>
  );
}
