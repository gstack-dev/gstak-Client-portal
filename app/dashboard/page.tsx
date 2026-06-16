import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  dashboardProjects,
  dashboardMessages,
  dashboardActivities,
  dashboardInvoices,
  dashboardDeadlines,
} from "@/lib/data";

export default async function DashboardPage() {
  const session = await auth();
  if (session?.user?.role === "admin") {
    redirect("/admin");
  }
  return (
    <div className="max-w-[1280px] mx-auto">
      <header className="mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          Dashboard
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          Welcome back. Here is what is happening with your projects today.
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
              Active Projects
            </h2>
            <Link className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline" href="/workspace/projects">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardProjects.map((project) => (
              <div key={project.id} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{project.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    project.status === "On Track"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      project.status === "On Track" ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-500"
                    }`}></span> {project.status}
                  </span>
                </div>
                <div className="mb-2 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Messages Preview */}
        <section className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <h2
              className="text-xl font-semibold text-slate-900 dark:text-slate-50"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              Messages
            </h2>
            <span className="bg-red-600 dark:bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">{dashboardMessages.length} New</span>
          </div>
          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            {dashboardMessages.map((msg, i) => (
              <div key={i} className="flex gap-3 items-start border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className={`w-8 h-8 rounded-full ${msg.bg} ${msg.text} flex items-center justify-center text-sm font-medium shrink-0`}>{msg.initials}</div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50">{msg.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
          <Link className="mt-auto text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline pt-2" href="/workspace/messages">
            Go to Inbox
          </Link>
        </section>

        {/* Recent Activity Timeline */}
        <section className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-semibold text-slate-900 dark:text-slate-50"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              Recent Activity
            </h2>
          </div>
          <div className="relative pl-6 border-l border-slate-200 dark:border-slate-700 space-y-4">
            {dashboardActivities.map((a, i) => (
              <div key={i} className="relative">
                <span className={`absolute left-[-30px] top-1 w-3 h-3 rounded-full ring-4 ring-white dark:ring-[#0F172A] ${
                  a.isPrimary ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                }`}></span>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-900 dark:text-slate-50">{a.user}</span> {a.action} <span className="font-medium">{a.target}</span>
                </p>
                <p className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 mt-1 uppercase">{a.time}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Invoices */}
        <section className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:col-span-1 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <h2
              className="text-xl font-semibold text-slate-900 dark:text-slate-50"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              Invoices
            </h2>
            <Link className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline" href="/workspace/invoices">
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {dashboardInvoices.map((inv) => (
              <div key={inv.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-[#0B1221] rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{inv.id}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{inv.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{inv.amount}</p>
                  <span className={`text-xs font-semibold ${inv.status === "Paid" ? "text-green-700 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}`}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Deadlines */}
        <section className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:col-span-1 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <h2
              className="text-xl font-semibold text-slate-900 dark:text-slate-50"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              Upcoming Deadlines
            </h2>
          </div>
          <ul className="space-y-3">
            {dashboardDeadlines.map((d, i) => (
              <li key={i} className="flex items-start gap-3">
                <input className="mt-1 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-blue-600 focus:ring-blue-500" type="checkbox" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{d.task}</p>
                  <p className={`text-xs font-semibold mt-1 ${d.urgent ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>{d.due}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  );
}
