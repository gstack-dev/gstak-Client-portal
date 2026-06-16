"use client";

import ViewToggle from "@/components/web/ViewToggle";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText, FileArchive, FileImage, File } from "lucide-react";
import { useState } from "react";
import { dashboardFiles } from "@/lib/data";

const iconMap: Record<string, typeof File> = {
  image: FileImage,
  picture_as_pdf: FileText,
  folder_zip: FileArchive,
  description: FileText,
};

export default function FilesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"recent" | "all">("recent");

  const files = dashboardFiles;

  return (
    <div className="max-w-[1280px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-1"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Files
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage and organize your project assets.
          </p>
        </div>
        <Button>
          <Upload className="size-4 mr-1" />
          Upload
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-6">
          {["recent", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "recent" | "all")}
              className={`text-sm font-medium pb-2 px-1 transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-slate-900 dark:text-slate-50 border-blue-600 dark:border-blue-400"
                  : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-50"
              }`}
            >
              {tab === "recent" ? "Recent" : "All Files"}
            </button>
          ))}
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            : "flex flex-col gap-2"
        }
      >
        {files.map((file) => (
          <FileCard key={file.id} {...file} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}

function FileCard({
  icon,
  fileName,
  size,
  date,
  preview,
  viewMode,
  client,
}: {
  icon: string;
  fileName: string;
  size: string;
  date: string;
  preview: string | null;
  client: string;
  viewMode: "grid" | "list";
}) {
  const Icon = iconMap[icon] || File;

  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#0F172A] rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-all cursor-pointer">
        <Icon className="size-5 text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{fileName}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400 w-20 shrink-0">{size}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400 w-24 text-right shrink-0">{date}</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col">
      <div className={`h-32 flex items-center justify-center relative overflow-hidden ${
        !preview ? "bg-slate-100 dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800"
          : "bg-slate-50 dark:bg-[#0B1221]"
      }`}>
        {preview ? (
          <img alt={fileName} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" src={preview} />
        ) : (
          <Icon className={`size-12 ${icon === "picture_as_pdf" ? "text-red-500 dark:text-red-400" : "text-blue-600 dark:text-blue-400"} opacity-80`} />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-2 rounded-full shadow-md hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-colors">
            <Download className="size-5" />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-1 text-slate-900 dark:text-slate-100">
          {!preview && <Icon className="size-5 text-blue-600 dark:text-blue-400 shrink-0" />}
          <span className="text-sm font-medium truncate">{fileName}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mt-auto">
          <span>{size}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
