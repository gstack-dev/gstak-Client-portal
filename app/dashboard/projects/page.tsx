import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Projects",
  description: "View and manage your projects.",
  openGraph: { title: "Projects", description: "View and manage your projects." },
};
import { getUserProjects } from "@/app/actions/user";
import { getDictionary, isValidLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { cookies } from "next/headers";

function getStatusColor(status: string) {
  switch (status) {
    case "in_progress": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "planning":
    case "on_hold": return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
    case "review": return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "completed": return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "cancelled": return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    default: return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
  }
}

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session?.user?.role === "admin") redirect("/admin");

  const projects = await getUserProjects();

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
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
          {t("projects.title")}
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-1">{t("projects.subtitle")}</p>
      </header>

      {projects.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">{t("projects.noProjects")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}
              className="block bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 truncate">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{project.description}</p>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ml-3 ${getStatusColor(project.status)}`}>
                  {statusLabels[project.status] ?? project.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${project.progressPercentage}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-10 text-right">{project.progressPercentage}%</span>
              </div>
              {project.deadline && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {t("projects.due", { date: new Date(project.deadline + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) })}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
