import type { Metadata } from "next";
import WorkspaceLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Client portal dashboard for managing projects, files, invoices, and communications.",
  openGraph: {
    title: "Dashboard",
    description: "Client portal dashboard for managing projects, files, invoices, and communications.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
