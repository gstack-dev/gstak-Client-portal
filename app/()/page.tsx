import Hero from "@/components/web/Home/Hero";
import Features from "@/components/web/Home/Features";
import Process from "@/components/web/Home/Process";
import Pricing from "@/components/web/Home/Pricing";
import CTA from "@/components/web/Home/CTA";
import Footer from "@/components/web/Home/Footer";
import NavBar from "@/components/web/Home/NavBar";

export default function LandingPage() {
  return (
    <div className="antialiased text-base text-slate-900 dark:text-slate-50 overflow-x-hidden">
      <NavBar />
      <main className="pt-32 pb-10">
        <Hero />
        <Features />
        <Process />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}