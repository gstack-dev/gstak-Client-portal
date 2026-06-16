"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

export default function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1E293B] rounded-full p-0.5 border border-slate-200 dark:border-slate-700 w-fit">
      <Button
        type="button"
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="icon-xs"
        onClick={() => setViewMode("grid")}
        className={`rounded-full transition-all ${
          viewMode === "grid"
            ? "bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
        }`}
        aria-label="Grid View"
      >
        <LayoutGrid className="size-[18px]" />
      </Button>
      <Button
        type="button"
        variant={viewMode === "list" ? "default" : "ghost"}
        size="icon-xs"
        onClick={() => setViewMode("list")}
        className={`rounded-full transition-all ${
          viewMode === "list"
            ? "bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
        }`}
        aria-label="List View"
      >
        <List className="size-[18px]" />
      </Button>
    </div>
  );
}
