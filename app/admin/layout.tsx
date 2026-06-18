import type { Metadata } from "next";
import AdminClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Admin",
  description: "Agency administration panel for managing clients, projects, files, invoices, and communications.",
  openGraph: {
    title: "Admin",
    description: "Agency administration panel for managing clients, projects, files, invoices, and communications.",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
