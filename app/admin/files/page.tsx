"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Download, FileText, FileImage, FileArchive, File, Upload, Trash2 } from "lucide-react";
import { adminFiles } from "@/lib/data";

const iconMap: Record<string, typeof File> = {
  image: FileImage,
  pdf: FileText,
  zip: FileArchive,
  doc: FileText,
};

export default function AdminFilesPage() {
  const [search, setSearch] = useState("");

  const filtered = adminFiles.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Files</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Manage all client files across the agency.</p>
        </div>
        <Button><Upload className="size-4 mr-1" /> Upload File</Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((file) => {
          const Icon = iconMap[file.icon] || File;
          return (
            <Card key={file.id} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center">
                    <Icon className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="size-8 text-slate-400"><Download className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-8 text-red-400"><Trash2 className="size-4" /></Button>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate mb-1">{file.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{file.client}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                  <span>{file.size}</span>
                  <span>{file.date}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
