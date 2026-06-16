"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Plus,
  Trash2,
  Mail,
  Lock,
  UserPlus,
  Search,
  FolderTree,
  X,
} from "lucide-react";
import { adminClients as initialClients, type Client, type ClientProject } from "@/lib/data";

const defaultProject: ClientProject = { name: "", status: "Pending", due: "", progress: 0 };

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([{ ...defaultProject }]);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setClients([{
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      projects: projects.filter((p) => p.name.trim()),
      since: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    }, ...clients]);
    setName("");
    setEmail("");
    setPassword("");
    setProjects([{ ...defaultProject }]);
    setShowForm(false);
  }

  function handleDelete(id: number) {
    const client = clients.find((c) => c.id === id);
    if (client && client.projects.length > 0) {
      const msg = `This will also delete ${client.projects.length} project(s) associated with "${client.name}". Are you sure?`;
      if (!window.confirm(msg)) { setConfirmDelete(null); return; }
    }
    setClients(clients.filter((c) => c.id !== id));
    setConfirmDelete(null);
  }

  function updateProject(index: number, field: keyof ClientProject, value: string | number) {
    setProjects((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  }

  function addProject() {
    setProjects((prev) => [...prev, { ...defaultProject }]);
  }

  function removeProject(index: number) {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Clients</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Manage all agency clients. Create or remove clients and their projects.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); if (!showForm) setProjects([{ ...defaultProject }]); }}>
          <UserPlus className="size-4 mr-1" /> {showForm ? "Cancel" : "Add Client"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>New Client</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">Create a new client account and their initial projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate}>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 ml-1">Company / Client Name</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Stark Industries" className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" required />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" required />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" required minLength={8} />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Projects</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addProject}>
                    <Plus className="size-3.5 mr-1" /> Add Project
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  {projects.map((project, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end p-3 rounded-lg bg-slate-50 dark:bg-[#0B1221]">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">Project Name</label>
                        <Input value={project.name} onChange={(e) => updateProject(i, "name", e.target.value)} placeholder="e.g. Website Redesign" className="dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
                      </div>
                      <div className="w-full sm:w-32">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">Status</label>
                        <select value={project.status} onChange={(e) => updateProject(i, "status", e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-slate-50 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Active</option>
                          <option>Pending</option>
                          <option>At Risk</option>
                        </select>
                      </div>
                      <div className="w-full sm:w-36">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">Due Date</label>
                        <Input type="date" value={project.due} onChange={(e) => updateProject(i, "due", e.target.value)} className="dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
                      </div>
                      <div className="w-full sm:w-32">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">Progress ({project.progress}%)</label>
                        <input type="range" min={0} max={100} value={project.progress} onChange={(e) => updateProject(i, "progress", Number(e.target.value))}
                          className="w-full accent-blue-600" />
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeProject(i)} className="text-red-400 shrink-0 mb-0.5" disabled={projects.length <= 1}>
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="size-4 mr-1" /> Create Client</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..." className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-12">No clients found.</p>
        ) : (
          filtered.map((client) => (
            <Card key={client.id} className={`bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 transition-all ${confirmDelete === client.id ? "border-red-400 dark:border-red-500" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 text-lg font-bold">{client.name.charAt(0)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{client.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1"><Mail className="size-3.5" /> {client.email}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Client since {client.since}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#1E293B] px-3 py-1 rounded-full flex items-center gap-1">
                      <FolderTree className="size-3.5" /> {client.projects.length} project{client.projects.length !== 1 ? "s" : ""}
                    </span>
                    {confirmDelete === client.id ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(client.id)}>Confirm Delete</Button>
                        <Button size="sm" variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(client.id)} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {client.projects.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Projects</p>
                    <div className="flex flex-col gap-2">
                      {client.projects.map((p) => {
                        const statusColor = p.status === "Active"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : p.status === "Pending"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
                        return (
                          <div key={p.name} className="flex items-center justify-between bg-slate-50 dark:bg-[#0B1221] rounded-lg px-4 py-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">{p.name}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>{p.status}</span>
                              <span className="text-xs text-slate-400 dark:text-slate-500">Due: {p.due}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-4 shrink-0">
                              <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                              </div>
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8 text-right">{p.progress}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
