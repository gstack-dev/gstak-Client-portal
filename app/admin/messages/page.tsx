"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, MessageSquare, Search, ChevronRight, ChevronLeft } from "lucide-react";
import {
  getConversations,
  getMessagesWithUser,
  sendMessage,
  markMessagesAsRead,
} from "@/app/actions/messages";
import type { MessageData, ConversationData } from "@/app/actions/messages";

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminMessagesPage() {
  useEffect(() => { document.title = "Messages | Admin | G-Stack"; }, []);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getConversations().then(setConversations);
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      getMessagesWithUser(selectedUserId).then((msgs) => {
        setMessages(msgs);
        markMessagesAsRead(selectedUserId);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const convs = await getConversations();
      setConversations(convs);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    const interval = setInterval(async () => {
      const msgs = await getMessagesWithUser(selectedUserId);
      setMessages(msgs);
      await markMessagesAsRead(selectedUserId);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedUserId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelect = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !selectedUserId || sending) return;
      setSending(true);
      const formData = new FormData();
      formData.set("content", input);
      formData.set("receiverId", selectedUserId);
      const result = await sendMessage(formData);
      if (result.success) {
        setInput("");
        const [msgs, convs] = await Promise.all([
          getMessagesWithUser(selectedUserId),
          getConversations(),
        ]);
        setMessages(msgs);
        setConversations(convs);
      }
      setSending(false);
    },
    [input, selectedUserId, sending]
  );

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.userId === selectedUserId);

  return (
    <div className="max-w-[1280px] mx-auto h-[calc(100vh-10rem)]">
      <div className="flex gap-4 h-full">
        {/* ── Conversation List ── */}
        <div className={`w-80 shrink-0 flex-col gap-4 ${selectedUserId ? "hidden md:flex" : "flex"}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
            />
          </div>

          <Card className="flex-1 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-y-auto h-full space-y-0.5 p-2">
              {filteredConvs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <MessageSquare className="size-10 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {search ? "No conversations found" : "No conversations yet"}
                  </p>
                </div>
              ) : (
                filteredConvs.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => handleSelect(conv.userId)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                      selectedUserId === conv.userId
                        ? "bg-blue-600/10 dark:bg-blue-600/10"
                        : "hover:bg-slate-100 dark:hover:bg-[#1E293B]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 dark:bg-blue-600/10 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0">
                      {conv.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                          {conv.name}
                        </span>
                        <span className="text-xs text-slate-400 shrink-0 ml-2">
                          {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ""}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                      {conv.unread > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-blue-600 text-white text-xs font-medium mt-1">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="size-4 text-slate-400 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* ── Chat Panel ── */}
        <Card className={`flex-1 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 flex-col overflow-hidden ${!selectedUserId ? "hidden md:flex" : "flex"}`}>
          {!selectedUserId ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <MessageSquare className="size-16 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-base font-medium text-slate-500 dark:text-slate-400">
                Select a conversation
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Choose a client from the list to view their messages.
              </p>
            </div>
          ) : (
            <>
              {/* ── Header ── */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-3">
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="md:hidden p-1 -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E293B]"
                  aria-label="Back to conversations"
                >
                  <ChevronLeft className="size-5 text-slate-600 dark:text-slate-400" />
                </button>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {selectedConv?.name || "Unknown"}
                </h2>
              </div>

              {/* ── Messages ── */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No messages yet. Send one to start the conversation.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const sentByMe = msg.senderId !== selectedUserId;
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
                              sentByMe ? "text-blue-200" : "text-slate-400 dark:text-slate-500"
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
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || sending}
                    size="icon"
                    className="size-10 rounded-xl shrink-0"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
