"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  FileUp,
  Receipt,
  ArrowRightLeft,
  Bell,
  CheckCheck,
} from "lucide-react";
import { getNotifications, markNotificationRead } from "@/app/actions/files";
import type { Notification } from "@/types";

const typeConfig: Record<
  string,
  { icon: typeof FileUp; bg: string; iconColor: string }
> = {
  file_upload: {
    icon: FileUp,
    bg: "bg-blue-600/10 dark:bg-blue-600/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  invoice_created: {
    icon: Receipt,
    bg: "bg-amber-600/10 dark:bg-amber-600/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  invoice_paid: {
    icon: Receipt,
    bg: "bg-emerald-600/10 dark:bg-emerald-600/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  status_change: {
    icon: ArrowRightLeft,
    bg: "bg-purple-600/10 dark:bg-purple-600/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
};

function getConfig(type: string) {
  return typeConfig[type] || {
    icon: Bell,
    bg: "bg-slate-600/10 dark:bg-slate-600/10",
    iconColor: "text-slate-600 dark:text-slate-400",
  };
}

function getTimeGroup(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);

  if (d >= startOfToday) return "Today";
  if (d >= startOfYesterday) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return `${Math.floor(diffMs / (1000 * 60))}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NotificationsPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      getNotifications().then(setNotifications);
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    for (const n of unread) {
      await markNotificationRead(n.id);
    }
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  if (!isOpen) return null;

  const groups: Record<string, Notification[]> = {};
  for (const n of notifications) {
    const group = getTimeGroup(n.createdAt);
    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  }
  const groupOrder = Object.keys(groups).sort((a, b) => {
    const rank = (g: string) => g === "Today" ? 0 : g === "Yesterday" ? 1 : 2;
    const diff = rank(a) - rank(b);
    if (diff !== 0) return diff;
    const dateA = new Date(groups[a][0].createdAt);
    const dateB = new Date(groups[b][0].createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div
      ref={popupRef}
      className="absolute top-20 right-8 w-80 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-slate-500 dark:text-slate-400" />
          <h2
            className="text-base font-bold text-slate-900 dark:text-slate-50"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Activity
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-all"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-all"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 max-h-96 overflow-y-auto px-3 py-2 space-y-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center mb-3">
              <Bell className="size-5 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No recent activity
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Updates will appear here
            </p>
          </div>
        ) : (
          groupOrder.map((group) => {
            const items = groups[group];
            if (!items || items.length === 0) return null;
            return (
              <div key={group}>
                <div className="sticky top-0 bg-white dark:bg-[#0F172A] z-10 pb-1 pt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {group}
                  </span>
                </div>
                <div className="space-y-1">
                  {items.map((n) => {
                    const cfg = getConfig(n.type);
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={n.id}
                        className={`group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                          !n.read
                            ? "bg-blue-600/5 dark:bg-blue-600/5 border border-blue-600/10 dark:border-blue-600/10"
                            : "hover:bg-slate-50 dark:hover:bg-[#1E293B] border border-transparent"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}
                        >
                          <Icon className={`size-4 ${cfg.iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">
                            {n.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              {formatTime(n.createdAt)}
                            </span>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
