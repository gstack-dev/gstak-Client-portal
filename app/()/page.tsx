import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { siteConfig } from "@/lib/config/site";
import {
  getDictionary,
  isValidLocale,
  defaultLocale,
  createT,
  type Locale,
} from "@/lib/i18n";
import {
  GitBranch,
  FolderOpen,
  MessageSquare,
  Receipt,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";
import Hero from "@/components/web/Home/Hero";
import Features from "@/components/web/Home/Features";
import Process from "@/components/web/Home/Process";
import CTA from "@/components/web/Home/CTA";
import Footer from "@/components/web/Home/Footer";
import NavBar from "@/components/web/Home/NavBar";

export const metadata: Metadata = {
  title: siteConfig.fullName,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.fullName,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.fullName,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
};

function LandingSkeleton() {
  return (
    <div className="antialiased text-base text-slate-900 dark:text-slate-50 overflow-x-hidden">
      <NavBar />
      <main className="pt-32 pb-10">
        <div className="max-w-4xl mx-auto px-6 animate-pulse">
          <div className="h-16 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-lg mb-6" />
          <div className="h-8 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-lg mb-8" />
          <div className="h-12 w-40 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
      </main>
    </div>
  );
}

export default async function LandingPage() {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <LandingContent />
    </Suspense>
  );
}

async function LandingContent() {
  const cookieStore = await cookies();
  const localeRaw = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;
  const locale: Locale = isValidLocale(localeRaw) ? localeRaw : defaultLocale;
  const dict = await getDictionary(locale);
  const t = createT(dict);

  return (
    <div className="antialiased text-base text-slate-900 dark:text-slate-50 overflow-x-hidden">
      <NavBar />
      <main className="pt-32 pb-10">
        <Hero
          heroTitle={t("landing.heroTitle")}
          heroDesc={t("landing.heroDesc")}
          getStarted={t("landing.getStarted")}
        />
        <Features
          title={t("landing.featuresTitle")}
          description={t("landing.featuresDesc")}
          features={[
            { icon: GitBranch, title: t("landing.featureProjectTracking"), description: t("landing.featureProjectTrackingDesc") },
            { icon: FolderOpen, title: t("landing.featureFileSharing"), description: t("landing.featureFileSharingDesc") },
            { icon: MessageSquare, title: t("landing.featureTeamCommunication"), description: t("landing.featureTeamCommunicationDesc") },
            { icon: Receipt, title: t("landing.featureInvoiceManagement"), description: t("landing.featureInvoiceManagementDesc") },
            { icon: RefreshCw, title: t("landing.featureProgressUpdates"), description: t("landing.featureProgressUpdatesDesc") },
            { icon: LayoutDashboard, title: t("landing.featureClientDashboard"), description: t("landing.featureClientDashboardDesc") },
          ]}
        />
        <Process
          title={t("landing.processTitle")}
          steps={[
            { number: "01", title: t("landing.stepDiscoveryCall"), description: t("landing.stepDiscoveryCallDesc") },
            { number: "02", title: t("landing.stepDesignPlanning"), description: t("landing.stepDesignPlanningDesc") },
            { number: "03", title: t("landing.stepDevelopment"), description: t("landing.stepDevelopmentDesc") },
            { number: "04", title: t("landing.stepDelivery"), description: t("landing.stepDeliveryDesc") },
          ]}
        />
        <CTA
          title={t("landing.ctaTitle")}
          description={t("landing.ctaDesc")}
          startProject={t("landing.startProject")}
        />
        <Footer
          copyright={t("landing.footerCopyright", { year: new Date().getFullYear() })}
          support={t("landing.support")}
        />
      </main>
    </div>
  );
}
