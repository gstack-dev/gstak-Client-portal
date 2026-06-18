"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/app/actions/user";
import ThemeToggle from "@/components/web/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Menu, Bell } from "lucide-react";

interface TopbarProps {
  onMenuToggle: () => void;
  onNotifToggle: () => void;
  onAccountToggle: () => void;
  sessionRefreshKey?: number;
  profileData?: { name?: string; image?: string | null } | null;
}

export default function Topbar({
  onMenuToggle,
  onNotifToggle,
  onAccountToggle,
  sessionRefreshKey = 0,
  profileData,
}: TopbarProps) {
  const [user, setUser] = useState<{ name?: string | null; image?: string | null } | null>(null);

  const displayUser = profileData ?? user;

  useEffect(() => {
    getProfile().then((p) => {
      if (p) setUser({ name: p.name, image: p.image });
    });
  }, [sessionRefreshKey]);

  return (
    <header className="fixed top-0 right-0 z-30 flex justify-between items-center px-6 h-16 w-full md:w-[calc(100%-256px)] bg-slate-50/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 ml-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-slate-50 transition-all"
          aria-label="Open Menu"
        >
          <Menu className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />

        <button
          onClick={onNotifToggle}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>

        <button
          onClick={onAccountToggle}
          className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
          aria-label="Account Menu"
        >
          {displayUser?.image ? (
            <img
              src={displayUser.image}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-slate-200 dark:bg-[#1E293B] flex items-center justify-center text-slate-500 dark:text-slate-400 text-lg font-semibold">
              {displayUser?.name ? displayUser.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
