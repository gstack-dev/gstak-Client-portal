"use client";

import { useTranslation } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/config/site";
import Link from "next/link";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full py-10 px-4 md:px-12 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 mb-4 md:mb-0 uppercase">
        {t("landing.footerCopyright", { year: new Date().getFullYear() })}
      </p>
      <div className="flex gap-6">
        <Link
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
          href={`mailto:${siteConfig.adminEmail}?subject=support`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("landing.support")}
        </Link>
      </div>
    </footer>
  );
}
