"use client";

import { useTranslation } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/config/site";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="px-4 md:px-12 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
      <div className="flex flex-col gap-4">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          {t("landing.heroTitle")}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-[512px] leading-relaxed">
          {t("landing.heroDesc")}
        </p>
        <div className="flex flex-wrap gap-4 mt-2">
          <Link
            href={`mailto:${siteConfig.adminEmail}?subject=StartProject&body=Hi%20G-Stack%20Team,%0A%0AI%20am%20interested%20in%20starting%20a%20new%20project%20with%20you.%0A%0AName:%20%0AEmail:%20%0AProject%20Description:%20`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg">{t("landing.getStarted")}</Button>
          </Link>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-500 opacity-5 dark:opacity-20 blur-[100px] rounded-full" />
        <img
          alt={t("landing.heroTitle")}
          className="w-full rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.05),0px_8px_10px_-6px_rgba(0,0,0,0.01)] border border-slate-200 dark:border-slate-800 relative z-10 object-cover aspect-video"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBolyJ4fROEQqhINx7KeICsZRtTyQUzisSCYPPNRFpQgOl6LXCymnZp6IzxulXebyIv3rg-7tPdCsdw3AsPOmMhn1vi-qt1ZNSuK4xayfGZdHVjbKV1KS1YB1h7F-1VM-ijYehPF5o8uqxWkDZe9Mr9TQq3VwGnOmeVrB3A2rYmWmHdH_FtHTQlcMGB58oLKbP6trsDLs6bCCGKkw2b9ygZWVe11Xm0cBY8NbY-2TJ26mGdnNiuQvvuDV9mSDx4z2P3N83Fr9j4EOvT"
        />
      </div>
    </section>
  );
}
