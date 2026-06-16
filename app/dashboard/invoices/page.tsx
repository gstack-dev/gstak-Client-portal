import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Download, ArrowRight, CheckCircle, Clock, Calendar } from "lucide-react";
import { invoiceSummaryCards, invoiceItems } from "@/lib/data";

export default function InvoicesPage() {
  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Invoices
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
            Manage your billing and payment history.
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-1" />
          Make a Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {invoiceSummaryCards.map((card) => {
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
          Recent Invoices
        </h2>
        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center gap-1">
          View All
          <ArrowRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {invoiceItems.map((inv) => {
          const statusColor = inv.status === "Paid"
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
            : inv.status === "Overdue"
            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
          const dotColor = inv.status === "Paid" ? "bg-green-600 dark:bg-green-400" : inv.status === "Overdue" ? "bg-red-600 dark:bg-red-400" : "bg-blue-600 dark:bg-blue-400";
          return (
            <Card
              key={inv.id}
              className={`bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300 flex flex-col ${
                inv.overdue ? "border-red-300 dark:border-red-800 relative overflow-hidden" : ""
              }`}
            >
              {inv.overdue && (
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
              )}
              <CardHeader>
                <div className={`flex justify-between items-start ${inv.overdue ? "pl-3" : ""}`}>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">{inv.id}</p>
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50 mt-1" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{inv.title}</CardTitle>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor} flex items-center gap-1`}>
                    <div className={`w-2 h-2 rounded-full ${dotColor}`} /> {inv.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className={`flex-1 ${inv.overdue ? "pl-3" : ""}`}>
                <div className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Amount {inv.status === "Paid" ? "" : "Due"}</p>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{inv.amount}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm mb-1 ${inv.overdue ? "text-red-600 dark:text-red-400 font-medium" : "text-slate-500 dark:text-slate-400"}`}>{inv.dueLabel}</p>
                    <p className={`text-sm font-medium ${inv.overdue ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-50"}`}>{inv.dueValue}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className={`${inv.overdue ? "pl-3" : ""}`}>
                <div className="flex items-center justify-end gap-3 w-full">
                  <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
                    <Download className="size-[18px]" /> Download PDF
                  </button>
                  {inv.payNow ? (
                    <Button variant="destructive" size="sm">Pay Now</Button>
                  ) : (
                    <Button variant="outline" size="sm">View Invoice</Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
