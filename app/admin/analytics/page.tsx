"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
} from "lucide-react";
import {
  analyticsStats,
  analyticsMonthlyStats,
  analyticsTopClients,
} from "@/lib/data";

const maxRevenue = Math.max(...analyticsMonthlyStats.map((d) => d.revenue));
const maxUsers = Math.max(...analyticsMonthlyStats.map((d) => d.users));

export default function AdminAnalyticsPage() {
  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Analytics</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Platform-wide analytics and insights. Dummy data — real backend integration coming soon.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsStats.map((s) => {
          const Icon = s.icon === "Users" ? Users : s.icon === "Clock" ? Clock : s.icon === "Eye" ? Eye : TrendingDown;
          return (
            <Card key={s.label} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</CardDescription>
                  <Icon className="size-5 text-slate-400 dark:text-slate-500" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{s.value}</CardTitle>
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold mt-2 ${s.up ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {s.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />} {s.change}
                </span>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Users Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40 pt-4">
              {analyticsMonthlyStats.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{d.users}</span>
                  <div className="w-full max-w-[36px] bg-blue-600 dark:bg-blue-500 rounded-t-md transition-all" style={{ height: `${(d.users / maxUsers) * 100}%` }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Revenue Over Time ($k)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40 pt-4">
              {analyticsMonthlyStats.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs text-slate-500 dark:text-slate-400">${d.revenue}k</span>
                  <div className="w-full max-w-[36px] bg-green-600 dark:bg-green-500 rounded-t-md transition-all" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
                <th className="px-6 py-3">Projects</th>
                <th className="px-6 py-3">Messages</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {analyticsTopClients.map((c) => (
                <tr key={c.name} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B1221]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">{c.name}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{c.revenue}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.projects}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.messages}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
