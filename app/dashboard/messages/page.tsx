"use client";

import { Search, Bell } from "lucide-react";
import ChatSidebar from "@/components/web/messages/ChatSidebar";
import MessageList from "@/components/web/messages/MessageList";
import MessageInput from "@/components/web/messages/MessageInput";

export default function MessagesPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1221] h-[calc(100vh-4rem)]">
      <header className="bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm h-16 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-2 md:hidden">
          <span
            className="text-lg font-bold text-slate-900 dark:text-slate-50"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Messages
          </span>
        </div>

        <div className="hidden md:flex flex-col">
          <h2
            className="text-[20px] font-bold text-slate-900 dark:text-slate-50 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Rebrand &amp; Web Platform
          </h2>
          <span className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Active
            Project Chat
          </span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="relative hidden sm:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 dark:text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-600/20 dark:focus:ring-blue-400/20 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400"
              placeholder="Search messages..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] rounded-full transition-colors relative">
              <Bell className="size-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0F172A]" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <ChatSidebar />

        <main className="flex-1 flex flex-col bg-white dark:bg-[#0F172A]">
          <MessageList />
          <MessageInput />
        </main>
      </div>
    </div>
  );
}
