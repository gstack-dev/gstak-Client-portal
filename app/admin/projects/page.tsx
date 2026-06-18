"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ChevronDown, ChevronRight, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { getClients, addProject, updateProject, deleteProject } from "@/app/actions/client";
import type { Client, ClientProject } from "@/types";
import type { ProjectFormValues } from "@/schema/project";

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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-pink-500", "bg-indigo-500",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

type EditState = {
  title: string;
  description: string | undefined;
  status: ClientProject["status"];
  progressPercentage: number;
  deadline: string;
};

const defaultNewProject: ProjectFormValues = {
  title: "",
  description: "",
  status: "planning",
  progressPercentage: 0,
  deadline: "",
};

export default function AdminProjectsPage() {
  useEffect(() => { document.title = "Projects | Admin | G-Stack"; }, []);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "in_progress" | "planning" | "on_hold">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditState | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [addingClientId, setAddingClientId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<ProjectFormValues>(defaultNewProject);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getClients().then((res) => {
      setClients(res.clients);
    }).finally(() => setLoading(false));
  }, []);

  async function loadClients() {
    const res = await getClients();
    setClients(res.clients);
  }

  const filtered = clients
    .map((c) => ({
      ...c,
      projects: c.projects.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;
        if (filter === "all") return true;
        return p.status === filter;
      }),
    }))
    .filter((c) => c.projects.length > 0);

  function startEdit(project: ClientProject) {
    setEditingId(project.id);
    setEditValues({
      title: project.title,
      description: project.description ?? "",
      status: project.status,
      progressPercentage: project.progressPercentage,
      deadline: project.deadline,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues(null);
  }

  async function handleSave(projectId: string) {
    if (!editValues) return;
    setSaving(projectId);
    await updateProject(projectId, editValues);
    setSaving(null);
    setEditingId(null);
    setEditValues(null);
    await loadClients();
  }

  async function handleDelete(projectId: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleting(projectId);
    await deleteProject(projectId);
    setDeleting(null);
    await loadClients();
  }

  function startAdd(clientId: string) {
    setAddingClientId(clientId);
    setNewProject(defaultNewProject);
  }

  function cancelAdd() {
    setAddingClientId(null);
    setNewProject(defaultNewProject);
  }

  async function handleAdd(clientId: string) {
    if (!newProject.title.trim()) return;
    setAdding(true);
    await addProject([newProject], clientId);
    setAdding(false);
    setAddingClientId(null);
    setNewProject(defaultNewProject);
    await loadClients();
  }

  function toggleExpand(clientId: string) {
    setExpanded((prev) => ({ ...prev, [clientId]: !prev[clientId] }));
  }

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-8" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Projects</h1>
        <p className="text-slate-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Projects</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">View and manage all projects across all clients.</p>
        </div>
      </div>

      <div className="relative mb-4 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          defaultValue=""
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects or clients..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "in_progress", "planning", "on_hold"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}
            className={filter === f ? "bg-blue-600 text-white" : ""}>
            {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f === "on_hold" ? "On Hold" : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-sm">No projects found.</p>
      )}

      <div className="flex flex-col gap-6">
        {filtered.map((client) => (
          <Card key={client.id} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 overflow-hidden">
            <button onClick={() => toggleExpand(client.id)}
              className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B1221]/50 transition-colors text-left">
              <div className="flex items-center gap-3">
                {client.image ? (
                  <img src={client.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className={`w-10 h-10 rounded-full ${avatarColor(client.name)} flex items-center justify-center text-sm font-bold text-white`}>
                    {getInitials(client.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{client.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{client.projects.length} project{client.projects.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              {expanded[client.id] !== false ? <ChevronDown className="size-5 text-slate-400" /> : <ChevronRight className="size-5 text-slate-400" />}
            </button>

            {expanded[client.id] !== false && (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {client.projects.map((project) => {
                  const isEditing = editingId === project.id;
                  const isSaving = saving === project.id;
                  const isDeleting = deleting === project.id;

                  return (
                    <div key={project.id} className="px-6 py-4 transition-colors">
                      {isEditing && editValues ? (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <input
                                value={editValues.title}
                                onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm font-semibold text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <textarea
                                value={editValues.description ?? ""}
                                onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              />
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button size="sm" variant="ghost" onClick={() => handleSave(project.id)} disabled={isSaving} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                                <Save className="size-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={isSaving} className="text-slate-400 hover:text-slate-600">
                                <X className="size-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Status</label>
                              <select
                                value={editValues.status}
                                onChange={(e) => setEditValues({ ...editValues, status: e.target.value as ClientProject["status"] })}
                                className="w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {Object.entries(statusLabels).map(([k, v]) => (
                                  <option key={k} value={k}>{v}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Progress: {editValues.progressPercentage}%</label>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={editValues.progressPercentage}
                                onChange={(e) => setEditValues({ ...editValues, progressPercentage: Number(e.target.value) })}
                                className="w-full accent-blue-600"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Deadline</label>
                              <input
                                type="date"
                                value={editValues.deadline}
                                onChange={(e) => setEditValues({ ...editValues, deadline: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">{project.title}</h4>
                                {project.description && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">{project.description}</p>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Due: {project.deadline ? new Date(project.deadline + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No deadline"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {statusLabels[project.status] ?? project.status}
                              </span>
                              <button onClick={() => startEdit(project)} className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                <Pencil className="size-4" />
                              </button>
                              <button onClick={() => handleDelete(project.id)} disabled={isDeleting} className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all" style={{ width: `${project.progressPercentage}%` }} />
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-10 text-right">{project.progressPercentage}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {addingClientId === client.id ? (
                  <div className="px-6 py-4 bg-slate-50 dark:bg-[#0B1221]/30">
                    <div className="space-y-3">
                      <input
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="Project name"
                        className="w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={newProject.description ?? ""}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Status</label>
                          <select
                            value={newProject.status}
                            onChange={(e) => setNewProject({ ...newProject, status: e.target.value as ProjectFormValues["status"] })}
                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {Object.entries(statusLabels).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Progress: {newProject.progressPercentage}%</label>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={newProject.progressPercentage}
                            onChange={(e) => setNewProject({ ...newProject, progressPercentage: Number(e.target.value) })}
                            className="w-full accent-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Deadline</label>
                          <input
                            type="date"
                            value={newProject.deadline}
                            onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" onClick={() => handleAdd(client.id)} disabled={adding || !newProject.title.trim()}>
                          {adding ? "Adding..." : "Add Project"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelAdd} disabled={adding}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-3">
                    <Button size="sm" variant="ghost" onClick={() => startAdd(client.id)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Plus className="size-4 mr-1" /> Add Project
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
