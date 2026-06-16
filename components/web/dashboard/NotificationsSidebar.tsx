"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function NotificationsPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  const items = [
    { type: "notif", title: "New File Uploaded", time: "2m ago" },
    { type: "message", title: "Jane Doe: Project update", time: "1h ago" },
  ];

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

      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-3 bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">
              {item.title}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
