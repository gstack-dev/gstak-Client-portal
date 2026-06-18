import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Calendar } from "lucide-react";
import { getClientInvoices, getClientInvoiceStats } from "@/app/actions/invoices";
import { getDictionary, isValidLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Invoices",
  description: "Manage your billing and payment history.",
  openGraph: { title: "Invoices", description: "Manage your billing and payment history." },
};

export default async function InvoicesPage() {
  const cookieStore = await cookies();
  const localeRaw = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;
  const locale: Locale = isValidLocale(localeRaw) ? localeRaw : defaultLocale;
  const dict = await getDictionary(locale);
  const t = (key: string, params?: Record<string, string | number>) => {
    const val = key.split(".").reduce((acc, part) => acc?.[part], dict as any);
    if (typeof val !== "string") return key;
    return params ? Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), val) : val;
  };

  const invoices = await getClientInvoices();
  const stats = await getClientInvoiceStats();

  const summaryCards = [
    { icon: "CheckCircle", label: t("invoices.totalPaid"), value: `$${stats.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: stats.paidCount === 1 ? t("invoices.acrossInvoices", { count: stats.paidCount }) : t("invoices.acrossInvoicesPlural", { count: stats.paidCount }) },
    { icon: "Clock", label: t("invoices.totalPending"), value: `$${stats.totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: stats.pendingCount === 1 ? t("invoices.awaitingPayment", { count: stats.pendingCount }) : t("invoices.awaitingPaymentPlural", { count: stats.pendingCount }), accent: true },
    { icon: "Calendar", label: t("invoices.nextDueDate"), value: stats.nextDue ? new Date(stats.nextDue).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : t("invoices.noPending"), sub: stats.nextDueId ? `Invoice #${stats.nextDueId.slice(-6).toUpperCase()}` : t("invoices.allPaid") },
  ];

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            {t("invoices.title")}
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
            {t("invoices.subtitleClient")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {summaryCards.map((card) => {
          const Icon = card.icon === "CheckCircle" ? CheckCircle : card.icon === "Clock" ? Clock : Calendar;
          return (
            <Card key={card.label} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
                  <div className={`w-8 h-8 rounded-full ${card.accent ? "bg-blue-100 dark:bg-blue-900/30" : "bg-slate-100 dark:bg-[#1E293B]"} flex items-center justify-center`}>
                    <Icon className={`size-[18px] ${card.accent ? "text-blue-600 dark:text-blue-400" : ""}`} />
                  </div>
                  <CardDescription className="text-sm font-medium">{card.label}</CardDescription>
                </div>
                <CardTitle
                  className="text-3xl font-bold text-slate-900 dark:text-slate-50"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
                >
                  {card.value}
                </CardTitle>
                <p className={`text-sm mt-2 ${card.accent ? "text-blue-600 dark:text-blue-400 font-medium" : "text-slate-500 dark:text-slate-400"}`}>
                  {card.sub}
                </p>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          {t("invoices.recentInvoices")}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {invoices.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 col-span-full">{t("invoices.noInvoices")}</p>
        ) : (
          invoices.map((inv) => {
            const statusLabel = inv.status === "paid" ? "Paid" : inv.status === "overdue" ? "Overdue" : inv.status === "cancelled" ? "Cancelled" : "Pending";
            const statusColor = statusLabel === "Paid"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
              : statusLabel === "Overdue"
              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            const dotColor = statusLabel === "Paid" ? "bg-green-600 dark:bg-green-400" : statusLabel === "Overdue" ? "bg-red-600 dark:bg-red-400" : "bg-blue-600 dark:bg-blue-400";
            return (
              <Card
                key={inv.id}
                className={`bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300 flex flex-col ${
                  inv.status === "overdue" ? "border-red-300 dark:border-red-800 relative overflow-hidden" : ""
                }`}
              >
                {inv.status === "overdue" && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                )}
                <CardHeader>
                  <div className={`flex justify-between items-start ${inv.status === "overdue" ? "pl-3" : ""}`}>
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">#{inv.id.slice(-6).toUpperCase()}</p>
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50 mt-1" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{inv.title}</CardTitle>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor} flex items-center gap-1`}>
                      <div className={`w-2 h-2 rounded-full ${dotColor}`} /> {statusLabel}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className={`flex-1 ${inv.status === "overdue" ? "pl-3" : ""}`}>
                  <div className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Amount {statusLabel === "Paid" ? "" : "Due"}</p>
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>${inv.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm mb-1 ${inv.status === "overdue" ? "text-red-600 dark:text-red-400 font-medium" : "text-slate-500 dark:text-slate-400"}`}>
                        {statusLabel === "Paid" ? "Paid On" : "Due Date"}
                      </p>
                      <p className={`text-sm font-medium ${inv.status === "overdue" ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-50"}`}>
                        {statusLabel === "Paid" && inv.paidAt
                          ? new Date(inv.paidAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : new Date(inv.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
