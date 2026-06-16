"use client";

import { Plus, Hash } from "lucide-react";
import { chatChannels, chatDMs } from "@/lib/data";

export default function ChatSidebar() {
  return (
    <aside className="w-72 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col shrink-0">
      <div className="p-6">
        <button className="w-full bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
          <Plus className="size-[18px]" />
          New Message
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6">
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              Project Channels
            </span>
            <button className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Plus className="size-4" />
            </button>
          </div>
          <div className="space-y-1">
            {chatChannels.map((ch) => (
              <button
                key={ch.name}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors ${
                  ch.active
                    ? "bg-slate-100 dark:bg-[#1E293B] text-slate-900 dark:text-slate-50"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Hash className="size-4 shrink-0" />
                <span className="text-sm truncate">{ch.name}</span>
                {ch.unread > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {ch.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              Direct Messages
            </span>
            <button className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Plus className="size-4" />
            </button>
          </div>
          <div className="space-y-1">
            {chatDMs.map((dm) => (
              <button
                key={dm.name}
                className="w-full flex items-center gap-3 px-2 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md text-left transition-colors"
              >
                <div className="relative shrink-0">
                  <img alt={dm.name} className="w-6 h-6 rounded-md object-cover" src={dm.avatar} />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-[#0F172A] ${
                    dm.online ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                  }`} />
                </div>
                <span className="text-sm truncate">{dm.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
