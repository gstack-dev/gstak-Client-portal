"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, type ClientFormValues } from "@/schema/client";
import { projectStatuses, projectSchema, type ProjectFormValues } from "@/schema/project";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import type { Client } from "@/types";
import { createClient, deleteClient, getClients } from "@/app/actions/client";
import { useTranslation } from "@/components/LanguageProvider";

const defaultProject: ProjectFormValues = {
  title: "",
  description: "",
  status: "planning",
  progressPercentage: 0,
  deadline: "",
};

type FormProject = ProjectFormValues;

const statusKeyMap: Record<string, string> = {
  planning: "status.planning",
  in_progress: "status.inProgress",
  review: "status.review",
  completed: "status.completed",
  on_hold: "status.onHold",
  cancelled: "status.cancelled",
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
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const avatarColors = [
  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
  "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function AdminClientsPage() {
  useEffect(() => { document.title = "Clients | Admin | G-Stack"; }, []);
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [projects, setProjects] = useState<FormProject[]>([{ ...defaultProject }]);
  useEffect(() => {
    getClients().then((res) => {
      if (res.clients) {
        setClients(res.clients);
      }
    }).finally(() => setLoading(false));
  }, [])

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      client_type: undefined,
      image: null,
    },
  });

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(data: ClientFormValues) {
    if (!data.client_type) return;
    const result = await createClient(data, projects);
    if (result.success) {
      const { clients: updated } = await getClients();
      if (updated) setClients(updated);
      form.reset();
      setProjects([{ ...defaultProject }]);
      setShowForm(false);
    } else {
      alert(result.error);
    }
  }

  function onSubmit(data: ClientFormValues) {
    handleCreate(data);
  }

  async function handleDelete(id: string) {
    const client = clients.find((c) => c.id === id);
    if (client && client.projects.length > 0) {
      const msg = `This will also delete ${client.projects.length} project(s) associated with "${client.name}". Are you sure?`;
      if (!window.confirm(msg)) { setConfirmDelete(null); return; }
    }
    const result = await deleteClient(id);
    if (result.success) {
      const { clients: updated } = await getClients();
      if (updated) setClients(updated);
    } else {
      alert(result.error);
    }
    setConfirmDelete(null);
  }

  function updateProject(index: number, field: keyof FormProject, value: string | number) {
    setProjects((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  }

  function addProject() {
    setProjects((prev) => [...prev, { ...defaultProject }]);
  }

  function removeProject(index: number) {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }

  function formatDeadline(dateStr: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{t("admin.clientsPage")}</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">{t("admin.clientsDesc")}</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); if (!showForm) { form.reset(); setProjects([{ ...defaultProject }]); } }}>
          <UserPlus className="size-4 mr-1" /> {showForm ? t("common.cancel") : t("admin.addClient")}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{t("admin.newClient")}</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">{t("admin.newClientDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("admin.companyClientName")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <Input {...field} placeholder={t("admin.namePlaceholder")} className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("admin.emailAddress")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <Input {...field} type="email" placeholder={t("admin.emailPlaceholder")} className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("admin.password")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <Input {...field} type="password" placeholder={t("admin.passwordPlaceholder")} className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="client_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("admin.clientType")}</FormLabel>
                        <FormControl>
                          <select
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value || undefined)}
                            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-slate-50 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="" disabled>{t("admin.selectType")}</option>
                            <option value="starter">{t("admin.starter")}</option>
                            <option value="professional">{t("admin.professional")}</option>
                            <option value="agency">{t("admin.agency")}</option>
                          </select>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{t("admin.projects")}</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addProject}>
                      <Plus className="size-3.5 mr-1" /> {t("admin.addProject")}
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {projects.map((project, i) => (
                      <div key={i} className="flex flex-col gap-3 p-4 rounded-lg bg-slate-50 dark:bg-[#0B1221]">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">{t("admin.title")}</label>
                            <Input
                              value={project.title}
                              onChange={(e) => updateProject(i, "title", e.target.value)}
                              placeholder={t("admin.title")}
                              className="dark:bg-[#1E293B] border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">{t("admin.status")}</label>
                            <select
                              value={project.status}
                              onChange={(e) => updateProject(i, "status", e.target.value)}
                              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-slate-50 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {projectStatuses.map((s) => (
                                <option key={s} value={s}>{t(statusKeyMap[s])}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">{t("admin.deadline")}</label>
                            <Input
                              type="date"
                              value={project.deadline}
                              onChange={(e) => updateProject(i, "deadline", e.target.value)}
                              className="dark:bg-[#1E293B] border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">{t("admin.descriptionOptional")}</label>
                            <Input
                              value={project.description ?? ""}
                              onChange={(e) => updateProject(i, "description", e.target.value)}
                              placeholder={t("admin.descPlaceholder")}
                              className="dark:bg-[#1E293B] border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{t("admin.progress", { value: project.progressPercentage })}</span>
                              <input
                                type="range"
                                min={0} max={100}
                                value={project.progressPercentage}
                                onChange={(e) => updateProject(i, "progressPercentage", Number(e.target.value))}
                                className="w-20 accent-blue-600"
                              />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeProject(i)} className="text-red-400 shrink-0" disabled={projects.length <= 1}>
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    {t("admin.firstProjectNote")}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t("common.cancel")}</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="size-4 mr-1" /> {t("admin.createClient")}</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="relative mb-6 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input defaultValue="" onChange={(e) => setSearch(e.target.value)} placeholder={t("common.search")}
          className="w-full h-10 pl-10 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-12">Loading clients...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-12">No clients found.</p>
        ) : (
          filtered.map((client) => (
            <Card key={client.id} className={`bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 transition-all ${confirmDelete === client.id ? "border-red-400 dark:border-red-500" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {client.image ? (
                        <img src={client.image} alt={client.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className={`w-12 h-12 rounded-full ${avatarColor(client.name)} flex items-center justify-center text-lg font-bold`}>{getInitials(client.name)}</div>
                      )}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{client.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1"><Mail className="size-3.5" /> {client.email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400 dark:text-slate-500">Client since {client.since}</span>
                        <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {client.client_type}
                        </span>
                      </div>
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
                      {client.projects.map((p) => (
                        <div key={p.title} className="flex items-center justify-between bg-slate-50 dark:bg-[#0B1221] rounded-lg px-4 py-2.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">{p.title}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>
                              {t(statusKeyMap[p.status] ?? p.status)}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Due: {formatDeadline(p.deadline)}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-4 shrink-0">
                            <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${p.progressPercentage}%` }} />
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8 text-right">{p.progressPercentage}%</span>
                          </div>
                        </div>
                      ))}
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
