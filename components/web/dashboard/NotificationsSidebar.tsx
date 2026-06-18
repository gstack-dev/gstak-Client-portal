"use client";

import { useEffect, useRef, useState } from "react";
import { X, FileUp } from "lucide-react";
import { getNotifications } from "@/app/actions/files";
import type { Notification } from "@/types";

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

  if (!isOpen) return null;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1)
      return `${Math.floor(diffMs / (1000 * 60))}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      ref={popupRef}
      className="absolute top-20 right-8 w-80 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-md"
    >
      <div className="flex justify-between items-center mb-4 px-1">
        <h2
          className="text-lg font-bold text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          Activity
        </h2>
        <button
          onClick={onClose}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
            No recent activity
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 p-3 bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-blue-600/10 flex items-center justify-center shrink-0 mt-0.5">
                <FileUp className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-900 dark:text-slate-100 font-medium leading-snug">
                  {n.message}
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTime(n.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
