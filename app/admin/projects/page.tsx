"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { adminProjectGroups } from "@/lib/data";

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "atrisk">("all");

  const filtered = adminProjectGroups
    .map((group) => ({
      ...group,
      projects: group.projects.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || group.client.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;
        if (filter === "all") return true;
        if (filter === "active") return p.status === "Active";
        if (filter === "pending") return p.status === "Pending";
        if (filter === "atrisk") return p.status === "At Risk";
        return true;
      }),
    }))
    .filter((g) => g.projects.length > 0);

  function toggleExpand(client: string) {
    setExpanded((prev) => ({ ...prev, [client]: !prev[client] }));
  }

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Projects</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">View and manage all projects across all clients.</p>
        </div>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects or clients..." className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
      </div>
      <div className="flex gap-2 mb-6">
          {(["all", "active", "pending", "atrisk"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}
              className={filter === f ? "bg-blue-600 text-white" : ""}>
              {f === "all" ? "All" : f === "atrisk" ? "At Risk" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

      <div className="flex flex-col gap-6">
        {filtered.map((group) => (
          <Card key={group.client} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 overflow-hidden">
            <button onClick={() => toggleExpand(group.client)}
              className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B1221]/50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${group.bg} flex items-center justify-center text-sm font-bold`}>{group.initials}</div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>{group.client}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{group.projects.length} project{group.projects.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              {expanded[group.client] !== false ? <ChevronDown className="size-5 text-slate-400" /> : <ChevronRight className="size-5 text-slate-400" />}
            </button>

            {expanded[group.client] !== false && (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {group.projects.map((project) => {
                  const statusColor = project.status === "Active"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : project.status === "Pending"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
                  const dotColor = project.status === "Active" ? "bg-green-600 dark:bg-green-400"
                    : project.status === "Pending" ? "bg-slate-400 dark:bg-slate-500"
                    : "bg-red-600 dark:bg-red-500";
                  return (
                    <div key={project.name} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-[#0B1221]/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{project.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Due: {project.due}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} /> {project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-10 text-right">{project.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
