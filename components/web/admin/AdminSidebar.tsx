"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  MessageSquare,
  Receipt,
  Folder,
  BarChart3,
  X,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/clients", icon: Users, label: "Clients" },
  { href: "/admin/projects", icon: FolderTree, label: "Projects" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  { href: "/admin/invoices", icon: Receipt, label: "Invoices" },
  { href: "/admin/files", icon: Folder, label: "Files" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

function NavItem({
  href,
  icon: Icon,
  label,
  pathname,
  onClick,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
  pathname: string;
  onClick: () => void;
}) {
  const isActive =
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
          isActive
            ? "bg-blue-600/10 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-slate-50"
        }`}
      >
        <Icon className="size-5" />
        {label}
      </Link>
    </li>
  );
}

export default function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <nav
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col p-4 shadow-2xl
          bg-white dark:bg-[#0F172A]
          border-r border-slate-200 dark:border-slate-800
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8 px-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
              <Shield className="size-5 text-white" />
            </div>
            <div>
              <h1
                className="text-base font-bold text-slate-900 dark:text-slate-50"
                style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                G-Stack Admin
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Agency Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <ul className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              pathname={pathname}
              onClick={onClose}
            />
          ))}
        </ul>
      </nav>
    </>
  );
}
