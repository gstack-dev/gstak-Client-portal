"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/web/dashboard/Sidebar";
import Topbar from "@/components/web/dashboard/Topbar";
import NotificationsSidebar from "@/components/web/dashboard/NotificationsSidebar";
import AccountSidebar from "@/components/web/dashboard/AccountSidebar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [profileData, setProfileData] = useState<{ name?: string; image?: string | null } | null>(null);

  const closeAccount = useCallback(() => {
    setIsAccountOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1221]">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <Topbar 
        onMenuToggle={() => setIsMenuOpen(true)}
        onNotifToggle={() => setIsNotifOpen(!isNotifOpen)}
        onAccountToggle={() => setIsAccountOpen(!isAccountOpen)}
        profileData={profileData}
      />
      
      <NotificationsSidebar isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <AccountSidebar isOpen={isAccountOpen} onClose={closeAccount} onSaved={setProfileData} />
      
      <main className="md:ml-64 pt-20 px-4 md:px-8 pb-16 min-h-screen relative z-0" style={{ transform: 'translateZ(0)' }}>
        {children}
      </main>
    </div>
  );
}
