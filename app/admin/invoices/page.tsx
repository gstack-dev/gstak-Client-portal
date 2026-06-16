"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Download, Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { adminInvoiceSummaries, adminInvoices } from "@/lib/data";

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState("");

  const filtered = adminInvoices.filter(
    (inv) =>
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.title.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Invoices</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Manage all client invoices across the agency.</p>
        </div>
        <Button><Plus className="size-4 mr-1" /> Create Invoice</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {adminInvoiceSummaries.map((card) => {
          const Icon = card.icon === "CheckCircle" ? CheckCircle : card.icon === "Clock" ? Clock : AlertTriangle;
          const colorMap: Record<string, string> = {
            "Total Collected": "bg-green-100 dark:bg-green-900/30",
            "Pending": "bg-blue-100 dark:bg-blue-900/30",
            "Overdue": "bg-red-100 dark:bg-red-900/30",
          };
          const iconColorMap: Record<string, string> = {
            "Total Collected": "text-green-700 dark:text-green-400",
            "Pending": "text-blue-600 dark:text-blue-400",
            "Overdue": "text-red-700 dark:text-red-400",
          };
          return (
            <Card key={card.label} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
                  <div className={`w-8 h-8 rounded-full ${colorMap[card.label]} flex items-center justify-center`}>
                    <Icon className={`size-[18px] ${iconColorMap[card.label]}`} />
                  </div>
                  <CardDescription className="text-sm font-medium">{card.label}</CardDescription>
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{card.value}</CardTitle>
                <p className={`text-sm mt-2 ${card.accent ? "text-blue-600 dark:text-blue-400 font-medium" : "text-slate-500 dark:text-slate-400"}`}>{card.sub}</p>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoices..." className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
      </div>

      <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0B1221] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((inv) => {
                const statusColor = inv.status === "Paid"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                  : inv.status === "Overdue"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
                const dot = inv.status === "Paid" ? "bg-green-600 dark:bg-green-400" : inv.status === "Overdue" ? "bg-red-600 dark:bg-red-500" : "bg-blue-600 dark:bg-blue-400";
                return (
                  <tr key={inv.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B1221]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">{inv.id}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{inv.client}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{inv.title}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">{inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} /> {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-slate-400"><Download className="size-4" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
