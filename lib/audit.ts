import AuditLog from "@/models/AuditLog";
import { connectMongoDB } from "@/lib/mongodb";

export type AuditAction =
  | "login.success" | "login.failure"
  | "login.rate_limited"
  | "logout"
  | "password.change" | "password.reset"
  | "client.create" | "client.delete"
  | "project.create" | "project.update" | "project.delete"
  | "file.upload" | "file.delete"
  | "invoice.create" | "invoice.update" | "invoice.delete"
  | "invoice.pay" | "invoice.mark_paid"
  | "message.send"
  | "profile.update"
  | "session.revoke";

export async function recordAuditEvent(params: {
  action: AuditAction;
  userId?: string;
  email?: string;
  role?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
  success?: boolean;
  error?: string;
}) {
  try {
    await connectMongoDB();
    await AuditLog.create({
      action: params.action,
      userId: params.userId,
      email: params.email,
      role: params.role,
      ip: params.ip || "",
      metadata: params.metadata || {},
      success: params.success ?? true,
      error: params.error,
    });
  } catch (err) {
    console.error("Failed to record audit event:", err);
  }
}
