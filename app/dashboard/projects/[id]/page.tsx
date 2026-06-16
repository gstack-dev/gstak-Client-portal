"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { projects as initialProjects, adminClients, invoiceItems } from "@/lib/data";
import { ArrowLeft, Download, ExternalLink, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const clientId = Number(params.id);
  const client = adminClients.find((c) => c.id === clientId);
  const [projects, setProjects] = useState(initialProjects);
  const [closedIds, setClosedIds] = useState<Set<number>>(new Set());
  const clientProjects = projects.filter((p) => p.clientId === clientId);

  if (!client || clientProjects.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto text-center py-20">
        <p className="text-slate-500 dark:text-slate-400">Client not found or no projects available.</p>
        <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  function handleCloseProject(projectId: number) {
    setClosedIds((prev) => new Set(prev).add(projectId));
    setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, status: "Closed" } : p));
  }

  return (
    <div className="max-w-[1280px] mx-auto w-full">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 mb-6 transition-colors">
        <ArrowLeft className="size-4" /> Back to Dashboard
      </Link>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 text-sm font-bold">
            {client.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
              {client.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{clientProjects.length} project{clientProjects.length !== 1 ? "s" : ""} &middot; {client.email}</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-8">
        {clientProjects.map((project) => {
          const isClosed = closedIds.has(project.id);
          const projectInvoices = invoiceItems.filter((inv) => inv.projectId === project.id);
          const unpaidInvoices = projectInvoices.filter((inv) => inv.status !== "Paid");
          const canClose = !isClosed && unpaidInvoices.length === 0;

          return (
            <div key={project.id} className={`relative ${isClosed ? "opacity-60" : ""}`}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      isClosed
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        : project.status === "In Progress"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        : project.status === "At Risk"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}>
                      {isClosed ? "Closed" : project.status}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Due: {project.due}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
                    {project.name}
                  </h2>
                </div>
              </div>

              {!isClosed && (
                <>
                  <div className="bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Progress</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Started: {project.started}</span>
                      <span>{project.tasksRemaining} Tasks Remaining</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {project.deliverables.map((d, i) => {
                      if (d.type === "prototype" && d.image) {
                        return (
                          <div key={i} className="md:col-span-2 bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group cursor-pointer hover:-translate-y-0.5 transition-transform">
                            <div className="h-40 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                              <img alt={d.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" src={d.image} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 dark:from-[#0F172A]/80 to-transparent"></div>
                              {d.status && (
                                <div className="absolute bottom-3 left-3">
                                  <span className="px-1.5 py-0.5 rounded bg-blue-600 dark:bg-blue-600 text-white text-[10px] font-semibold shadow-sm">{d.status}</span>
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{d.title}</h3>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{d.description}</p>
                              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 mt-3">
                                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                  <ExternalLink className="size-3.5" /> Open Link
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      if (d.type === "source") {
                        return (
                          <div key={i} className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col hover:-translate-y-0.5 transition-transform cursor-pointer">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">{d.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">{d.description}</p>
                            {d.meta && (
                              <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 flex items-center justify-between border dark:border-slate-700/50">
                                <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{d.meta}</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      if (d.type === "document") {
                        return (
                          <div key={i} className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col hover:-translate-y-0.5 transition-transform cursor-pointer">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-emerald-600 dark:text-emerald-400">
                              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">{d.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 mb-3">{d.description}</p>
                            <div className="mt-auto flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-medium">
                              <Download className="size-3.5" /> {d.meta || "Download"}
                            </div>
                          </div>
                        );
                      }
                      if (d.type === "assets") {
                        return (
                          <div key={i} className="md:col-span-2 bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-center hover:-translate-y-0.5 transition-transform cursor-pointer">
                            <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                              {d.image && <img alt={d.title} className="w-full h-full object-cover opacity-80" src={d.image} />}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
                                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">{d.title}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{d.description}</p>
                              {d.meta && (
                                <div className="flex gap-2">
                                  {d.meta.split(" ").map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700">{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </>
              )}

              <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Invoices</h3>
                {projectInvoices.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500">No invoices linked to this project.</p>
                ) : (
                  <div className="flex flex-col gap-2 mb-4">
                    {projectInvoices.map((inv) => {
                      const invStatusColor = inv.status === "Paid"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : inv.status === "Overdue"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
                      return (
                        <div key={inv.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-[#0B1221]">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0">{inv.id}</span>
                            <span className="text-sm text-slate-900 dark:text-slate-50 truncate">{inv.title}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{inv.amount}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${invStatusColor}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${inv.status === "Paid" ? "bg-green-600 dark:bg-green-400" : inv.status === "Overdue" ? "bg-red-600 dark:bg-red-500" : "bg-blue-600 dark:bg-blue-400"}`} />
                              {inv.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isClosed ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">This project has been closed.</span>
                  </div>
                ) : unpaidInvoices.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <AlertTriangle className="size-4 text-red-600 dark:text-red-400 shrink-0" />
                      <span className="text-sm text-red-700 dark:text-red-400">
                        {unpaidInvoices.length === 1
                          ? "You have 1 unpaid invoice. Pay it before closing this project."
                          : `You have ${unpaidInvoices.length} unpaid invoices. Pay them before closing this project.`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/dashboard/invoices">
                        <Button size="sm" variant="destructive">
                          <XCircle className="size-3.5 mr-1" /> Pay Outstanding Invoices
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" disabled className="text-slate-400">
                        Close Project
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <CheckCircle className="size-4 text-green-600 dark:text-green-400 shrink-0" />
                      <span className="text-sm text-green-700 dark:text-green-400">All invoices paid. You can close this project.</span>
                    </div>
                    <Button size="sm" onClick={() => handleCloseProject(project.id)} className="bg-blue-600 hover:bg-blue-700 text-white w-fit">
                      <CheckCircle className="size-3.5 mr-1" /> Close Project
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
