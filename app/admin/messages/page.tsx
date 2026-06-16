"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Trash2, Eye } from "lucide-react";
import { adminConversations } from "@/lib/data";

export default function AdminMessagesPage() {
  const [search, setSearch] = useState("");

  const filtered = adminConversations.filter(
    (c) =>
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>Messages</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Monitor all client conversations across the agency.</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations..." className="pl-10 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700" />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((conv) => (
          <Card key={conv.id} className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${conv.bg} flex items-center justify-center text-sm font-bold shrink-0`}>{conv.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{conv.client}</h3>
                      <span className="text-xs text-slate-400 dark:text-slate-500">({conv.contact})</span>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{conv.date}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{conv.subject}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{conv.lastMsg}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {conv.unread > 0 && (
                    <span className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold flex items-center justify-center">{conv.unread}</span>
                  )}
                  <Button variant="ghost" size="icon" className="text-slate-400"><Eye className="size-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500"><Trash2 className="size-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
