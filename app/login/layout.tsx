import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to ${siteConfig.fullName} client portal to manage your projects, files, invoices, and communications.`,
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
