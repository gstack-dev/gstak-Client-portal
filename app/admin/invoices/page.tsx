"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Download, Plus, CheckCircle, Clock, AlertTriangle, X, Pencil, Trash2, DollarSign } from "lucide-react";
import { createInvoice, updateInvoice, deleteInvoice, markInvoiceAsPaid, getAdminInvoices, getAdminInvoiceStats } from "@/app/actions/invoices";
import type { AdminInvoiceData } from "@/app/actions/invoices";
import { useTranslation } from "@/components/LanguageProvider";

export default function AdminInvoicesPage() {
  useEffect(() => { document.title = "Invoices | Admin | G-Stack"; }, []);
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminInvoiceData | null>(null);
  const [invoices, setInvoices] = useState<AdminInvoiceData[]>([]);
  const [stats, setStats] = useState({ totalCollected: 0, totalPending: 0, totalOverdue: 0, collectedCount: 0, pendingCount: 0, overdueCount: 0 });

  const refresh = () => {
    getAdminInvoices().then(setInvoices);
    getAdminInvoiceStats().then(setStats);
  };

  useEffect(() => { refresh(); }, []);

  const filtered = invoices.filter(
    (inv) =>
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.title.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const summaryCards = [
    { icon: "CheckCircle", label: t("invoices.totalCollected"), value: `$${stats.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: t("invoices.acrossInvoicesPlural", { count: stats.collectedCount }) },
    { icon: "Clock", label: t("invoices.pending"), value: `$${stats.totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: t("invoices.awaitingPaymentPlural", { count: stats.pendingCount }), accent: true },
    { icon: "AlertTriangle", label: t("invoices.overdue"), value: `$${stats.totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: `${stats.overdueCount} ${stats.overdueCount !== 1 ? "invoices" : "invoice"}` },
  ];

  const colorMap: Record<string, string> = {
    CheckCircle: "bg-green-100 dark:bg-green-900/30",
    Clock: "bg-blue-100 dark:bg-blue-900/30",
    AlertTriangle: "bg-red-100 dark:bg-red-900/30",
  };
  const iconColorMap: Record<string, string> = {
    CheckCircle: "text-green-700 dark:text-green-400",
    Clock: "text-blue-600 dark:text-blue-400",
    AlertTriangle: "text-red-700 dark:text-red-400",
  };

  const statusColor = (status: string) => {
    if (status === "paid") return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
    if (status === "overdue") return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
    if (status === "cancelled") return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
  };
  const dot = (status: string) => {
    if (status === "paid") return "bg-green-600 dark:bg-green-400";
    if (status === "overdue") return "bg-red-600 dark:bg-red-500";
    if (status === "cancelled") return "bg-slate-400";
    return "bg-blue-600 dark:bg-blue-400";
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{t("invoices.title")}</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">{t("invoices.subtitleAdmin")}</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); }}><Plus className="size-4 mr-1" /> {t("invoices.createInvoice")}</Button>
      </div>

      {showForm && <CreateInvoiceForm onClose={() => { setShowForm(false); refresh(); }} />}
      {editing && <EditInvoiceForm invoice={editing} onClose={() => { setEditing(null); refresh(); }} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon === "CheckCircle" ? CheckCircle : card.icon === "Clock" ? Clock : AlertTriangle;
          return (
            <Card key={card.label} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
                   <div className={`w-8 h-8 rounded-full ${colorMap[card.icon]} flex items-center justify-center`}>
                     <Icon className={`size-[18px] ${iconColorMap[card.icon]}`} />
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

      <div className="relative mb-6 w-full debug-search">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
        <input defaultValue="" onChange={(e) => setSearch(e.target.value)} placeholder={t("invoices.searchInvoices")} className="w-full h-10 pl-10 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0B1221] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">{t("invoices.invoice")}</th>
                <th className="px-6 py-3">{t("invoices.client")}</th>
                <th className="px-6 py-3">{t("invoices.description")}</th>
                <th className="px-6 py-3">{t("invoices.amount")}</th>
                <th className="px-6 py-3">{t("invoices.status")}</th>
                <th className="px-6 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B1221]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">#{inv.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{inv.clientName}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{inv.title}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">${inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(inv.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dot(inv.status)}`} /> {t(`invoices.${inv.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {inv.status !== "paid" && (
                        <button
                          onClick={async () => { await markInvoiceAsPaid(inv.id); refresh(); }}
                          className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          title={t("invoices.markAsPaid")}
                        >
                          <DollarSign className="size-4" />
                        </button>
                      )}
                      <button
                        onClick={() => { setEditing(inv); setShowForm(false); }}
                        className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title={t("common.edit")}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={async () => { if (confirm(t("invoices.deleteConfirm"))) { await deleteInvoice(inv.id); refresh(); } }}
                        className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title={t("common.delete")}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function CreateInvoiceForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [clients, setClients] = useState<{ _id: string; name: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [projects, setProjects] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then(setClients).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClient) {
      setProjects([]);
      return;
    }
    fetch(`/api/clients/${selectedClient}/projects`).then((r) => r.json()).then(setProjects).catch(() => {});
  }, [selectedClient]);

  return (
    <Card className="mb-8 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
        <X className="size-5" />
      </button>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{t("invoices.createInvoiceTitle")}</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">{t("invoices.createInvoiceDesc")}</CardDescription>
      </CardHeader>
      <form action={async (formData) => {
        await createInvoice(formData);
        onClose();
      }} className="px-6 pb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.client")}</label>
          <select name="clientId" required value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{t("invoices.selectClientPlaceholder")}</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.projectOptional")}</label>
          <select name="projectId" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{t("invoices.noProject")}</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.titleLabel")}</label>
          <Input name="title" required placeholder={t("invoices.titlePlaceholder")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.description")}</label>
          <Input name="description" placeholder={t("invoices.descPlaceholder")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.amountLabel")}</label>
            <Input name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.dueDate")}</label>
            <Input name="dueDate" type="date" required />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit">{t("invoices.createInvoice")}</Button>
          <Button type="button" variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
        </div>
      </form>
    </Card>
  );
}

function EditInvoiceForm({ invoice, onClose }: { invoice: AdminInvoiceData; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Card className="mb-8 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
        <X className="size-5" />
      </button>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{t("invoices.editInvoice")}</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">{t("invoices.editInvoiceDesc", { name: invoice.clientName })}</CardDescription>
      </CardHeader>
      <form action={async (formData) => {
        formData.set("invoiceId", invoice.id);
        await updateInvoice(formData);
        onClose();
      }} className="px-6 pb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.client")}</label>
          <Input value={invoice.clientName} disabled className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B] opacity-60" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.titleLabel")}</label>
          <Input name="title" required defaultValue={invoice.title} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.description")}</label>
          <Input name="description" defaultValue={invoice.description} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.amountLabel")}</label>
            <Input name="amount" type="number" step="0.01" min="0.01" required defaultValue={invoice.amount} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("invoices.dueDate")}</label>
            <Input name="dueDate" type="date" required defaultValue={invoice.dueDate.split("T")[0]} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit">{t("invoices.saveChanges")}</Button>
          <Button type="button" variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
        </div>
      </form>
    </Card>
  );
}
