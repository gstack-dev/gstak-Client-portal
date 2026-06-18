"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, FileText, Image as ImageIcon, File, Trash2, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { getUserProjectById, deleteUserProject } from "@/app/actions/user";
import { getProjectFiles, getProjectActivity } from "@/app/actions/files";
import { getProjectInvoices, areProjectInvoicesPaid } from "@/app/actions/invoices";
import { Button } from "@/components/ui/button";
import type { ClientProject } from "@/types";
import type { FileItem, Notification } from "@/types";
import type { ClientInvoiceData } from "@/app/actions/invoices";

const statusLabels: Record<string, string> = {
  planning: "Planning",
  in_progress: "In Progress",
  review: "Review",
  completed: "Completed",
  on_hold: "On Hold",
  cancelled: "Cancelled",
};

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

function fileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <ImageIcon className="size-4" />;
  if (mimeType.includes("pdf") || mimeType.includes("document")) return <FileText className="size-4" />;
  return <File className="size-4" />;
}

function invStatusColor(status: string) {
  switch (status) {
    case "paid": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "pending": return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "overdue": return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    default: return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<{
    project: ClientProject;
    clientName: string;
    clientEmail: string;
    clientImage: string | null;
  } | null>(null);
  const [invoices, setInvoices] = useState<ClientInvoiceData[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activity, setActivity] = useState<Notification[]>([]);
  const [allPaid, setAllPaid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = data ? `${data.project.title} | Projects | G-Stack` : "Project Details | G-Stack";
  }, [data]);

  useEffect(() => {
    const id = params.id;
    Promise.all([
      getUserProjectById(id),
      getProjectInvoices(id),
      getProjectFiles(id),
      getProjectActivity(id),
      areProjectInvoicesPaid(id),
    ]).then(([proj, invs, fils, acts, paid]) => {
      if (!proj) {
        router.replace("/dashboard/projects");
        return;
      }
      setData(proj);
      setInvoices(invs);
      setFiles(fils);
      setActivity(acts);
      setAllPaid(paid);
    }).finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleDelete() {
    if (!allPaid) {
      setError("Pay all invoices before deleting this project.");
      return;
    }
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;

    setDeleting(true);
    setError("");
    try {
      await deleteUserProject(params.id);
      router.replace("/dashboard/projects");
    } catch {
      setError("Failed to delete project.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto">
        <p className="text-slate-500 dark:text-slate-400">Loading project...</p>
      </div>
    );
  }

  if (!data) return null;

  const { project, clientName, clientEmail, clientImage } = data;
  const unpaidCount = invoices.filter((i) => i.status !== "paid").length;
  const displayAllPaid = unpaidCount === 0;

  return (
    <div className="max-w-[1280px] mx-auto w-full">
      <Link href="/dashboard/projects" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 mb-6 transition-colors">
        <ArrowLeft className="size-4" /> Back to Projects
      </Link>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {clientImage ? (
            <img src={clientImage} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 text-sm font-bold">
              {clientName.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
              {project.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{clientName} &middot; {clientEmail}</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {statusLabels[project.status] ?? project.status}
            </span>
            {project.deadline && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Due: {new Date(project.deadline + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
        </div>

        {project.description && (
          <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
              Description
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Progress</span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{project.progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${project.progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
              Invoices
            </h3>
            <div className="flex flex-col gap-2">
              {invoices.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No invoices for this project.</p>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-[#0B1221]">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-24 shrink-0">#{inv.id.slice(-6).toUpperCase()}</span>
                      <span className="text-sm text-slate-900 dark:text-slate-50 truncate">{inv.title}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">${inv.amount.toLocaleString()}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${invStatusColor(inv.status)}`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
              Files
            </h3>
            <div className="flex flex-col gap-2">
              {files.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No files uploaded yet.</p>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-[#0B1221] hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-blue-600 dark:text-blue-400 shrink-0">{fileIcon(file.mimeType)}</span>
                      <span className="text-sm text-slate-900 dark:text-slate-50 truncate">{file.originalName}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatSize(file.size)}</span>
                      <a href={file.url} download={file.originalName}><Download className="size-4 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" /></a>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/files" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              View All Files <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
            <Activity className="size-4 text-blue-600 dark:text-blue-400" />
            Activity Timeline
          </h3>
          <div className="relative pl-6 border-l border-slate-200 dark:border-slate-700 space-y-5">
            {activity.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No activity yet.</p>
            ) : (
              activity.map((n) => {
                const d = new Date(n.createdAt);
                const now = new Date();
                const diffMs = now.getTime() - d.getTime();
                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                const time = diffHrs < 1
                  ? `${Math.floor(diffMs / (1000 * 60))}m ago`
                  : diffHrs < 24
                    ? `${diffHrs}h ago`
                    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const dotColor = n.type === "status_change"
                  ? "bg-amber-500"
                  : n.type === "file_upload"
                    ? "bg-blue-500"
                    : "bg-emerald-500";
                return (
                  <div key={n.id} className="relative">
                    <span className={`absolute left-[-30px] top-1 w-3 h-3 rounded-full ring-4 ring-white dark:ring-[#0F172A] ${dotColor}`}></span>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{n.message}</p>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 mt-0.5 uppercase">{time}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-red-200 dark:border-red-900/50 p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
            Danger Zone
          </h3>

          {displayAllPaid ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-3">
              <CheckCircle className="size-4 text-green-600 dark:text-green-400 shrink-0" />
              <span className="text-sm text-green-700 dark:text-green-400">All invoices are paid. You can delete this project.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-3">
              <AlertTriangle className="size-4 text-red-600 dark:text-red-400 shrink-0" />
              <span className="text-sm text-red-700 dark:text-red-400">
                {unpaidCount === 1
                  ? "1 unpaid invoice remaining. Pay it before deleting."
                  : `${unpaidCount} unpaid invoices remaining. Pay them before deleting.`}
              </span>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
          )}

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={!displayAllPaid || deleting}
          >
            <Trash2 className="size-4 mr-1" />
            {deleting ? "Deleting..." : "Delete Project"}
          </Button>
        </div>
      </div>
    </div>
  );
}
