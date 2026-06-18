"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  FileText,
  Image,
  FileArchive,
  File,
  Trash2,
  Download,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Users,
  FolderKanban,
} from "lucide-react";
import {
  getAdminFilesGrouped,
  uploadFile,
  deleteFile,
} from "@/app/actions/files";
import { getClients } from "@/app/actions/client";
import type { FileItem } from "@/types";
import type { AdminFileGroup } from "@/app/actions/files";

const iconMap: Record<string, typeof FileText> = {
  "image/": Image,
  "application/pdf": FileText,
  "application/zip": FileArchive,
  "application/x-zip-compressed": FileArchive,
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return `${Math.floor(diffMs / (1000 * 60))}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ClientOption {
  id: string;
  name: string;
  projects: { id: string; title: string }[];
}

export default function AdminFilesPage() {
  useEffect(() => { document.title = "Files | Admin | G-Stack"; }, []);
  const [groups, setGroups] = useState<AdminFileGroup[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [expandedClients, setExpandedClients] = useState<Record<string, boolean>>({});
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    Promise.all([
      getAdminFilesGrouped(),
      getClients().then((data) =>
        data.clients.map((c: { id: string; name: string; projects: { id: string; title: string }[] }) => ({
          id: c.id,
          name: c.name,
          projects: c.projects.map((p: { id: string; title: string }) => ({ id: p.id, title: p.title })),
        }))
      ),
    ]).then(([g, cs]) => {
      setGroups(g);
      setClients(cs);
      const expanded: Record<string, boolean> = {};
      g.forEach((grp: AdminFileGroup) => {
        expanded[grp.clientId] = true;
        grp.projects.forEach((p: AdminFileGroup["projects"][number]) => {
          expanded[p.projectId] = true;
        });
      });
      setExpandedClients(expanded);
      setExpandedProjects(expanded);
    });
  }, []);

  const toggleClient = (id: string) =>
    setExpandedClients((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleProject = (id: string) =>
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleUpload = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const fileInput = form.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (!fileInput?.files?.length) {
        setUploadError("Please select a file");
        return;
      }
      if (!selectedProjectId) {
        setUploadError("Please select a client and project");
        return;
      }
      setUploading(true);
      setUploadError("");
      const result = await uploadFile(formData);
      if (result.error) {
        setUploadError(result.error);
      } else {
        form.reset();
        const updated = await getAdminFilesGrouped();
        setGroups(updated);
      }
      setUploading(false);
    },
    [selectedProjectId]
  );

  const handleDelete = useCallback(async (fileId: string) => {
    const result = await deleteFile(fileId);
    if (result.error) {
      setUploadError(result.error);
    } else {
      const updated = await getAdminFilesGrouped();
      setGroups(updated);
    }
  }, []);

  const filteredGroups = groups
    .map((g) => ({
      ...g,
      projects: g.projects
        .map((p) => ({
          ...p,
          files: p.files.filter(
            (f) =>
              f.originalName.toLowerCase().includes(search.toLowerCase()) ||
              g.clientName.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((p) => p.files.length > 0 || search === ""),
    }))
    .filter((g) => g.projects.length > 0);

  const currentClientProjects =
    selectedClientId
      ? clients.find((c) => c.id === selectedClientId)?.projects || []
      : [];

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Files
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
            Manage files across all clients and projects.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Upload Panel ── */}
        <div className="lg:w-80 shrink-0 space-y-4">
          <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Upload className="size-4" /> Upload File
              </h3>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Client
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setSelectedProjectId("");
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select a client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={!selectedClientId}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                >
                  <option value="">Select a project</option>
                  {currentClientProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <form onSubmit={handleUpload} className="space-y-3">
                <input
                  type="hidden"
                  name="projectId"
                  value={selectedProjectId}
                />
                <input
                  type="file"
                  name="file"
                  className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600/10 dark:file:bg-blue-600/10 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-600/20 cursor-pointer"
                />
                {uploadError && (
                  <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="size-3" /> {uploadError}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={uploading || !selectedProjectId}
                  className="w-full"
                >
                  <Upload className="size-4 mr-1" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files or clients..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Files Browser ── */}
        <div className="flex-1 min-w-0 space-y-4">
          {filteredGroups.length === 0 ? (
            <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="size-12 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  No files found
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {search
                    ? "Try a different search term."
                    : "Upload files to get started."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredGroups.map((group) => (
              <Card
                key={group.clientId}
                className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                {/* ── Client Header ── */}
                <button
                  onClick={() => toggleClient(group.clientId)}
                  className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B1221] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {expandedClients[group.clientId] ? (
                      <ChevronDown className="size-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="size-4 text-slate-400" />
                    )}
                    <Users className="size-5 text-slate-500 dark:text-slate-400" />
                    <span className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      {group.clientName}
                    </span>
                  </div>
                </button>

                {expandedClients[group.clientId] && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {group.projects.map((proj) => (
                      <div key={proj.projectId}>
                        {/* ── Project Header ── */}
                        <button
                          onClick={() => toggleProject(proj.projectId)}
                          className="w-full flex items-center justify-between px-6 py-3 pl-14 hover:bg-slate-50 dark:hover:bg-[#0B1221] transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            {expandedProjects[proj.projectId] ? (
                              <ChevronDown className="size-3.5 text-slate-400" />
                            ) : (
                              <ChevronRight className="size-3.5 text-slate-400" />
                            )}
                            <FolderKanban className="size-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {proj.projectTitle}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {proj.files.length} file
                            {proj.files.length !== 1 ? "s" : ""}
                          </span>
                        </button>

                        {/* ── Files ── */}
                        {expandedProjects[proj.projectId] && (
                          <div className="pl-14 pr-6 pb-3 space-y-1">
                            {proj.files.map((f) => {
                              const isImage = f.mimeType.startsWith("image/");
                              const Icon =
                                Object.entries(iconMap).find(([key]) =>
                                  f.mimeType.startsWith(key)
                                )?.[1] || File;
                              return (
                                <div
                                  key={f.id}
                                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#0B1221] transition-colors group/file"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {isImage ? (
                                      <div className="w-8 h-8 rounded-md overflow-hidden bg-slate-100 dark:bg-[#1E293B] shrink-0">
                                        <img
                                          src={f.url}
                                          alt={f.originalName}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center shrink-0">
                                        <Icon className="size-4 text-slate-400" />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="text-sm text-slate-900 dark:text-slate-50 truncate">
                                        {f.originalName}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        {formatSize(f.size)} &middot;{" "}
                                        {formatDate(f.createdAt)} &middot; by{" "}
                                        {f.uploaderRole === "admin"
                                          ? "Admin"
                                          : f.uploaderName}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group/file-hover:opacity-100 transition-opacity">
                                    <a
                                      href={f.url}
                                      download={f.originalName}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                                      >
                                        <Download className="size-3.5" />
                                      </Button>
                                    </a>
                                    {f.canDelete && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                                        onClick={() => handleDelete(f.id)}
                                      >
                                        <Trash2 className="size-3.5" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {proj.files.length === 0 && (
                              <p className="text-xs text-slate-400 py-2 italic">
                                No files in this project yet.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
