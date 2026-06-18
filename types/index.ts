// types/index.ts
// Shared type definitions — independent of dummy data.

// ── Dashboard: Files ───────────────────────────────────

export interface FileItem {
  id: string;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  projectId: string;
  projectTitle?: string;
  uploadedBy: string;
  uploaderName?: string;
  uploaderRole: "admin" | "user";
  canDelete: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "file_upload" | "invoice_created" | "invoice_paid" | "status_change";
  message: string;
  fromUser: string;
  fromUserName?: string;
  toUser: string;
  projectId?: string;
  projectTitle?: string;
  fileId?: string;
  fileName?: string;
  invoiceId?: string;
  read: boolean;
  createdAt: string;
}

// ── Admin: Clients ─────────────────────────────────────

export type ClientType = "starter" | "professional" | "agency";

export type ProjectStatus = "planning" | "in_progress" | "review" | "completed" | "on_hold" | "cancelled";

export interface ClientProject {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  progressPercentage: number;
  deadline: string;
  clientId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user";
  client_type: ClientType;
  image: string | null;
  projects: ClientProject[];
  since: string;
}

// ── Admin: Dashboard Overview ──────────────────────────

export interface ProjectStatusSegment {
  label: string;
  value: number;
  color: string;
}

// ── Admin: Analytics ───────────────────────────────────

export interface MonthlyStat {
  month: string;
  users: number;
  projects: number;
  revenue: number;
}

export interface TopClient {
  name: string;
  revenue: string;
  projects: number;
  messages: number;
  invoiceCount?: number;
}
