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
  FolderKanban,
  Download,
  AlertCircle,
} from "lucide-react";
import { getUserProjects } from "@/app/actions/user";
import {
  getProjectFiles,
  uploadFile,
  deleteFile,
} from "@/app/actions/files";
import type { ClientProject, FileItem } from "@/types";
import { useTranslation } from "@/components/LanguageProvider";

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

export default function DashboardFilesPage() {
  useEffect(() => { document.title = "Files | G-Stack"; }, []);
  const { t } = useTranslation();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserProjects().then((data) => {
      setProjects(data);
      if (data.length > 0) setSelectedProjectId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    setLoading(true);
    getProjectFiles(selectedProjectId).then((data) => {
      setFiles(data);
      setLoading(false);
    });
  }, [selectedProjectId]);

  const handleUpload = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const fileInput = form.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (!fileInput?.files?.length) {
        setError(t("files.selectFile"));
        return;
      }
      setUploading(true);
      setError("");
      const result = await uploadFile(formData);
      if (result.error) {
        setError(result.error);
      } else {
        form.reset();
        const updated = await getProjectFiles(selectedProjectId);
        setFiles(updated);
      }
      setUploading(false);
    },
    [selectedProjectId]
  );

  const handleDelete = useCallback(
    async (fileId: string) => {
      const result = await deleteFile(fileId);
      if (result.error) {
        setError(result.error);
      } else {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    },
    []
  );

  const selectedProject = projects.find(
    (p) => p.id === selectedProjectId
  );

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            {t("files.title")}
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
            {t("files.subtitleClient")}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Project Selector + Upload ── */}
        <div className="lg:w-72 shrink-0 space-y-4">
          <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 space-y-3">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t("files.selectProject")}
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <form onSubmit={handleUpload} className="space-y-3">
                <input type="hidden" name="projectId" value={selectedProjectId} />
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {t("files.uploadFile")}
                </label>
                <input
                  type="file"
                  name="file"
                  className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600/10 dark:file:bg-blue-600/10 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-600/20 cursor-pointer"
                />
                {error && (
                  <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="size-3" /> {error}
                  </p>
                )}
                <Button type="submit" disabled={uploading || !selectedProjectId} className="w-full">
                  <Upload className="size-4 mr-1" />
                  {uploading ? t("common.uploading") : t("common.upload")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ── Files Grid ── */}
        <div className="flex-1 min-w-0">
          {selectedProject && (
            <div className="flex items-center gap-2 mb-4">
              <FolderKanban className="size-5 text-slate-500 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {selectedProject.title}
              </h2>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl bg-slate-100 dark:bg-[#1E293B] animate-pulse"
                />
              ))}
            </div>
          ) : files.length === 0 ? (
            <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="size-12 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t("files.noFiles")}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {t("files.uploadFirst")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((f) => {
                const isImage = f.mimeType.startsWith("image/");
                const Icon =
                  Object.entries(iconMap).find(([key]) =>
                    f.mimeType.startsWith(key)
                  )?.[1] || File;
                return (
                  <Card
                    key={f.id}
                    className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          {isImage ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-[#1E293B] shrink-0">
                              <img
                                src={f.url}
                                alt={f.originalName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center shrink-0">
                              <Icon className="size-6 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                              {f.originalName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {formatSize(f.size)} &middot;{" "}
                              {formatDate(f.createdAt)}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {t("files.by")} {f.uploaderName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3">
                        <a
                          href={`${f.url}?download=1`}
                          download={f.originalName}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Download className="size-4" />
                          </Button>
                        </a>
                        {f.canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                            onClick={() => handleDelete(f.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
