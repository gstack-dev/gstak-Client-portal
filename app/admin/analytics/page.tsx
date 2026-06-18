import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Platform-wide analytics and insights.",
  openGraph: { title: "Analytics", description: "Platform-wide analytics and insights." },
};
import { getAdminAnalytics } from "@/app/actions/admin";
import { getRevenueByClient } from "@/app/actions/invoices";

export default async function AdminAnalyticsPage() {
  const { totalUsers, monthlyStats, topClients } = await getAdminAnalytics();
  const revenueByClient = await getRevenueByClient();
  const maxRevenue = Math.max(...monthlyStats.map((d) => d.revenue), 1);
  const maxClientRevenue = Math.max(...revenueByClient.map((c) => c.revenue), 1);

  const totalRevenue = revenueByClient.reduce((sum, c) => sum + c.revenue, 0);

  const analyticsStats = [
    { label: "Total Clients", value: String(totalUsers), change: "", up: true, icon: "Users" },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "", up: true, icon: "TrendingUp" },
    { label: "Paid Invoices", value: String(revenueByClient.reduce((s, c) => s + c.invoiceCount, 0)), change: "", up: true, icon: "Eye" },
    { label: "Avg Revenue/Client", value: `$${(totalRevenue / (revenueByClient.length || 1)).toLocaleString()}`, change: "", up: true, icon: "Clock" },
  ];

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Analytics</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Platform-wide analytics and insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsStats.map((s) => {
          const Icon = s.icon === "Users" ? Users : s.icon === "TrendingUp" ? TrendingUp : s.icon === "Eye" ? Eye : Clock;
          return (
            <Card key={s.label} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</CardDescription>
                  <Icon className="size-5 text-slate-400 dark:text-slate-500" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{s.value}</CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 mb-8">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40 pt-4">
              {monthlyStats.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs text-slate-500 dark:text-slate-400">${d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}k` : d.revenue}</span>
                  <div className="w-full max-w-[36px] bg-green-600 dark:bg-green-500 rounded-t-md transition-all" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Revenue by Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 pt-2">
              {revenueByClient.slice(0, 5).map((c) => (
                <div key={c.clientId} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium shrink-0">
                    {c.clientName.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">{c.clientName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.invoiceCount} invoice{c.invoiceCount !== 1 ? "s" : ""}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">${c.revenue.toLocaleString()}</span>
                </div>
              ))}
              {revenueByClient.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">No paid invoices yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

      <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Top Clients by Revenue</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0B1221] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Invoices</th>
                <th className="px-6 py-3">Projects</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {topClients.map((c) => (
                <tr key={c.name} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B1221]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">{c.name}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{c.revenue}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.invoiceCount || "-"}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.projects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
