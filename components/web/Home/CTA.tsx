import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="px-4 md:px-12 max-w-[1280px] mx-auto py-16">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-8 md:p-16 text-center shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.05),0px_8px_10px_-6px_rgba(0,0,0,0.01)] relative overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent dark:from-blue-500/10 z-0" />
        <div className="relative z-10 max-w-[672px] mx-auto flex flex-col items-center gap-6">
          <h2
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Ready to simplify client communication?
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400">
            Join elite agencies who have upgraded their service delivery pipeline
            with G-Stack.
          </p>
          <Link
            href={`mailto:${siteConfig.adminEmail}?subject=StartProject&body=Hi%20G-Stack%20Team,%0A%0AI%20am%20interested%20in%20starting%20a%20new%20project%20with%20you.%0A%0AName:%20%0AEmail:%20%0AProject%20Description:%20`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="mt-2">
              Start Your Project
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
