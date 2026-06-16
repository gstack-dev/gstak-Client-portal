"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import ThemeToggle from "@/components/web/ThemeToggle";
import { Button } from "@/components/ui/button";

function NavLink({
  href,
  children,
  isActive = false,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative py-2 text-sm font-medium transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-blue-600 dark:after:bg-blue-400 after:transition-transform after:duration-300 ${
        isActive
          ? "text-slate-900 dark:text-slate-50 after:scale-x-100"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 after:scale-x-0 after:origin-bottom-right hover:after:origin-bottom-left hover:after:scale-x-100"
      }`}
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    getSession().then((s) => setSession(s));
  }, []);

  const isAdmin = session?.user?.role === "admin";
  const isUser = session?.user?.role === "user" || session?.user?.role === "client";
  const isLoggedIn = !!session;

  const buttonHref = isAdmin ? "/admin" : isUser ? "/dashboard" : "/login";
  const buttonLabel = isAdmin ? "Admin Dashboard" : isUser ? "Dashboard" : "Client Login";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center h-20 px-4 md:px-12">
        <Link
          href="/"
          className="text-xl font-bold text-slate-900 dark:text-slate-50 hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          G-Stack
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/" isActive>
            Home
          </NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href={buttonHref} className="hidden md:inline-flex">
            <Button>{buttonLabel}</Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-4 py-4 flex flex-col gap-4">
          <NavLink href="/" isActive>
            Home
          </NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <Link href={buttonHref} className="mt-2" onClick={() => setMobileOpen(false)}>
            <Button className="w-full">{buttonLabel}</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
