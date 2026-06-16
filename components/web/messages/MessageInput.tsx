"use client";

import { Bold, Italic, List, Code, Paperclip, Smile, Send } from "lucide-react";

export default function MessageInput() {
  return (
    <div className="p-6 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 shrink-0 z-10">
      <div className="flex flex-col gap-2 bg-slate-50 dark:bg-[#0B1221] border border-slate-200 dark:border-slate-700 focus-within:border-blue-600 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-600/20 dark:focus-within:ring-blue-400/20 rounded-xl transition-all shadow-sm">
        <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-[#1E293B]/50 rounded-t-xl">
          {[
            { icon: Bold, label: "Bold" },
            { icon: Italic, label: "Italic" },
          ].map((item) => (
            <button
              key={item.label}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
              title={item.label}
            >
              <item.icon className="size-[18px]" />
            </button>
          ))}
          <div className="w-px h-4 bg-slate-200 dark:border-slate-700 mx-1" />
          {[
            { icon: List, label: "List" },
            { icon: Code, label: "Code" },
          ].map((item) => (
            <button
              key={item.label}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
              title={item.label}
            >
              <item.icon className="size-[18px]" />
            </button>
          ))}
        </div>

        <textarea
          className="w-full bg-transparent border-none focus:ring-0 resize-none p-3 text-base text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 min-h-[80px] outline-none"
          placeholder="Message #Rebrand & Web Platform..."
        />

        <div className="flex items-center justify-between p-2 pt-0">
          <div className="flex items-center gap-1">
            <button
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors group relative"
              title="Attach file"
            >
              <Paperclip className="size-5" />
            </button>
            <button
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors group relative"
              title="Emoji"
            >
              <Smile className="size-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline-block">
              Return to send
            </span>
            <button className="bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors p-2 rounded-lg flex items-center justify-center shadow-sm">
              <Send className="size-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
