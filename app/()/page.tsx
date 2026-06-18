import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
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

export default function LandingPage() {
  return (
    <div className="antialiased text-base text-slate-900 dark:text-slate-50 overflow-x-hidden">
      <NavBar />
      <main className="pt-32 pb-10">
        <Hero />
        <Features />
        <Process />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}