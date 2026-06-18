import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProjects } from "@/app/actions/user";
import { getNotifications } from "@/app/actions/files";
import { getAdminId, getMessagesWithUser } from "@/app/actions/messages";
import { getClientInvoices } from "@/app/actions/invoices";
import { getDictionary, isValidLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your projects, messages, invoices, and recent activity.",
  openGraph: { title: "Dashboard", description: "View your projects, messages, invoices, and recent activity." },
};

function getStatusColor(status: string) {
  switch (status) {
    case "in_progress":
    case "review": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "planning":
    case "on_hold": return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "completed": return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "cancelled": return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    default: return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
  }
}

export default async function DashboardPage() {
  const session = await auth();
  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  const projects = await getUserProjects();
  const activeProjects = projects.filter((p) => p.status !== "completed" && p.status !== "cancelled");
  const notifications = await getNotifications();
  const adminId = await getAdminId();
  const messages = adminId ? await getMessagesWithUser(adminId) : [];
  const invoices = await getClientInvoices();

  const cookieStore = await cookies();
  const localeRaw = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;
  const locale: Locale = isValidLocale(localeRaw) ? localeRaw : defaultLocale;
  const dict = await getDictionary(locale);
  const t = (key: string, params?: Record<string, string | number>) => {
    const val = key.split(".").reduce((acc, part) => acc?.[part], dict as any);
    if (typeof val !== "string") return key;
    return params ? Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), val) : val;
  };

  const statusLabels: Record<string, string> = {
    planning: t("status.planning"),
    in_progress: t("status.inProgress"),
    review: t("status.review"),
    completed: t("status.completed"),
    on_hold: t("status.onHold"),
    cancelled: t("status.cancelled"),
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      <header className="mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          {t("dashboard.title")}
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          {t("dashboard.welcome")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Projects */}
        <section className="lg:col-span-2 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <h2
              className="text-xl font-semibold text-slate-900 dark:text-slate-50"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              {t("dashboard.activeProjects")}
            </h2>
            <Link className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline" href="/dashboard/projects">
              {t("common.viewAll")}
            </Link>
          </div>
          {activeProjects.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.noActiveProjects")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProjects.map((project) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`}
                  className="block border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 truncate">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{project.description}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2 ${getStatusColor(project.status)}`}>
                      {statusLabels[project.status] ?? project.status}
                    </span>
                  </div>
                  <div className="mb-2 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{t("dashboard.progress")}</span>
                    <span>{project.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${project.progressPercentage}%` }}></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Messages Preview */}
        <section className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <h2
              className="text-xl font-semibold text-slate-900 dark:text-slate-50"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              {t("dashboard.messages")}
            </h2>
            {messages.filter((m) => m.senderId === adminId).length > 0 && (
              <span className="bg-red-600 dark:bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {messages.filter((m) => m.senderId === adminId).length} {t("dashboard.new")}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.noMessages")}</p>
            ) : (
              messages.slice(-3).reverse().map((msg) => (
                <div key={msg.id} className="flex gap-3 items-start border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium shrink-0">
                    {(msg.senderName || "?").split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {msg.senderId === adminId ? msg.senderName || "Admin" : t("dashboard.you")}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link className="mt-auto text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline pt-2" href="/dashboard/messages">
            {t("dashboard.goToInbox")}
          </Link>
        </section>

        {/* Recent Activity Timeline */}
        <section className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-semibold text-slate-900 dark:text-slate-50"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              {t("dashboard.recentActivity")}
            </h2>
          </div>
          <div className="relative pl-6 border-l border-slate-200 dark:border-slate-700 space-y-4">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.noActivity")}</p>
            ) : (
              notifications.slice(0, 5).map((n) => {
                const d = new Date(n.createdAt);
                const now = new Date();
                const diffMs = now.getTime() - d.getTime();
                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                const time = diffHrs < 1
                  ? `${Math.floor(diffMs / (1000 * 60))}m ago`
                  : diffHrs < 24
                    ? `${diffHrs}h ago`
                    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return (
                  <div key={n.id} className="relative">
                    <span className="absolute left-[-30px] top-1 w-3 h-3 rounded-full ring-4 ring-white dark:ring-[#0F172A] bg-blue-600 dark:bg-blue-500"></span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{n.message}</p>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 mt-1 uppercase">{time}</p>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Invoices */}
        <section className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:col-span-1 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <h2
              className="text-xl font-semibold text-slate-900 dark:text-slate-50"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              {t("dashboard.invoices")}
            </h2>
            <Link className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline" href="/dashboard/invoices">
              {t("common.viewAll")}
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {invoices.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.noInvoices")}</p>
            ) : (
              invoices.slice(0, 3).map((inv) => (
                <div key={inv.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-[#0B1221] rounded-lg border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">#{inv.id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{inv.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-50">${inv.amount.toLocaleString()}</p>
                    <span className={`text-xs font-semibold ${inv.status === "paid" ? "text-green-700 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Upcoming Deadlines */}
        <section className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:col-span-1 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <h2
              className="text-xl font-semibold text-slate-900 dark:text-slate-50"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              {t("dashboard.upcomingDeadlines")}
            </h2>
          </div>
          <ul className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.noDeadlines")}</p>
            ) : (
              projects
                .filter((p) => p.deadline && p.status !== "completed" && p.status !== "cancelled")
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 5)
                .map((p) => {
                  const daysUntil = Math.ceil((new Date(p.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const urgent = daysUntil <= 3;
                  const label = daysUntil <= 0 ? t("dashboard.overdue") : daysUntil === 1 ? t("dashboard.dueTomorrow") : daysUntil <= 7 ? t("dashboard.dueInDays", { days: daysUntil }) : t("dashboard.dueOn", { date: new Date(p.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
                  return (
                    <li key={p.id} className="flex items-start gap-3">
                      <input className="mt-1 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-blue-600 focus:ring-blue-500" type="checkbox" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{p.title}</p>
                        <p className={`text-xs font-semibold mt-1 ${urgent ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>{label}</p>
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
        </section>

      </div>
    </div>
  );
}
