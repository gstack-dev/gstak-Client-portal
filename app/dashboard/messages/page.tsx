"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, MessageSquare } from "lucide-react";
import {
  getAdminId,
  getMessagesWithUser,
  sendMessage,
  markMessagesAsRead,
} from "@/app/actions/messages";
import type { MessageData } from "@/app/actions/messages";
import { useTranslation } from "@/components/LanguageProvider";

export default function DashboardMessagesPage() {
  useEffect(() => { document.title = "Messages | G-Stack"; }, []);
  const { t } = useTranslation();
  const formatTime = (iso: string): string => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return t("messages.yesterday");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const [adminId, setAdminId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAdminId().then((id) => {
      setAdminId(id);
      if (id) {
        getMessagesWithUser(id).then((msgs) => {
          setMessages(msgs);
          setLoading(false);
          markMessagesAsRead(id);
        });
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !adminId || sending) return;
      setSending(true);
      const formData = new FormData();
      formData.set("content", input);
      formData.set("receiverId", adminId);
      const result = await sendMessage(formData);
      if (result.success) {
        setInput("");
        const msgs = await getMessagesWithUser(adminId);
        setMessages(msgs);
      }
      setSending(false);
    },
    [input, adminId, sending]
  );

  if (loading) {
    return (
      <div className="max-w-[960px] mx-auto h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="animate-pulse text-slate-400">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto h-[calc(100vh-10rem)]">
      <Card className="h-full bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h1
            className="text-xl font-semibold text-slate-900 dark:text-slate-50"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            {t("messages.title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {adminId ? t("messages.subtitle") : t("messages.noAdmin")}
          </p>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="size-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {t("messages.noMessages")}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {t("messages.startConversation")}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const sentByMe = msg.senderId !== adminId;

              return (
                <div
                  key={msg.id}
                  className={`flex ${sentByMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      sentByMe
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-slate-100 dark:bg-[#1E293B] text-slate-900 dark:text-slate-50 rounded-bl-md"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        sentByMe
                          ? "text-blue-200"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        {/* ── Input ── */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("messages.typePlaceholder")}
              disabled={!adminId}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={!input.trim() || sending || !adminId}
              size="icon"
              className="size-10 rounded-xl shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
