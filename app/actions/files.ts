"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { rateLimitAction } from "@/lib/rate-limiter";
import FileModel from "@/models/File";
import NotificationModel from "@/models/Notification";
import ProjectModel from "@/models/Project";
import User from "@/models/User";
import { sendFileUploadEmail } from "@/lib/email";
import type { FileItem, Notification } from "@/types";

const getAdminId = cache(async function getAdminId(): Promise<string | null> {
  const admin = await User.findOne({ role: "admin" }).lean();
  return admin ? String(admin._id) : null;
})

// ── Upload ────────────────────────────────────────────

export async function uploadFile(formData: FormData) {
  const limitResult = await rateLimitAction("uploadFile", 10, 60_000).catch(() => null);
  if (!limitResult) return { error: "Too many requests. Please try again later." };

  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;

  if (!file || !projectId) return { error: "Missing file or projectId" };
  if (file.size === 0) return { error: "File is empty" };
  if (!/^[0-9a-fA-F]{24}$/.test(projectId)) return { error: "Invalid project ID" };

  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) return { error: "File size exceeds the 50 MB limit" };

  const ALLOWED_MIME_TYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain", "text/csv",
    "application/zip", "application/x-zip-compressed",
    "application/x-rar-compressed",
    "video/mp4", "video/mpeg", "video/quicktime",
    "audio/mpeg", "audio/wav", "audio/ogg",
  ];

  const ALLOWED_EXTENSIONS = [
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
    ".pdf",
    ".doc", ".docx",
    ".xls", ".xlsx",
    ".ppt", ".pptx",
    ".txt", ".csv",
    ".zip", ".rar",
    ".mp4", ".mpeg", ".mov",
    ".mp3", ".wav", ".ogg",
  ];

  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { error: `File type "${ext}" is not allowed. Accepted types: ${ALLOWED_EXTENSIONS.join(", ")}` };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type) && file.type !== "") {
    return { error: `MIME type "${file.type}" is not allowed` };
  }

  await connectMongoDB();

  const project = await ProjectModel.findById(projectId).lean();
  if (!project) return { error: "Project not found" };

  const buffer = Buffer.from(await file.arrayBuffer());
  const blob = await put(`${Date.now()}_${file.name}`, buffer, { access: "private" });

  const role = session.user.role === "admin" ? "admin" : "user";

  const fileDoc = await FileModel.create({
    fileName: blob.url,
    originalName: file.name,
    size: file.size,
    mimeType: file.type,
    projectId,
    uploadedBy: session.user.id,
    uploaderRole: role,
  });

  // ── Create notification ──
  const projectTitle = (project.title as string) || "Untitled";
  const uploaderName = (session.user.name as string) || (role === "admin" ? "Admin" : "You");

  let message: string;
  let toUser: string | null = null;

  if (role === "admin") {
    // Notify the client
    toUser = String(project.clientId);
    message = `Admin uploaded ${file.name} to ${projectTitle}`;
  } else {
    // Notify all admins
    toUser = await getAdminId();
    message = `${uploaderName} uploaded ${file.name} to ${projectTitle}`;
  }

  const selfMessage =
    role === "admin"
      ? `You uploaded ${file.name} to ${projectTitle}`
      : `You uploaded a file to ${projectTitle}`;

  const notificationsToCreate = [];

  if (toUser) {
    notificationsToCreate.push({
      type: "file_upload",
      message,
      fromUser: session.user.id,
      toUser,
      projectId,
      fileId: fileDoc._id,
    });
  }

  notificationsToCreate.push({
    type: "file_upload",
    message: selfMessage,
    fromUser: session.user.id,
    toUser: session.user.id,
    projectId,
    fileId: fileDoc._id,
  });

  await NotificationModel.insertMany(notificationsToCreate);

  // ── Send email ──
  if (role === "admin") {
    const client = await User.findById(project.clientId).select("name email").lean();
    if (client && (client as any).email) {
      sendFileUploadEmail(
        (client as any).email,
        (client as any).name || "Client",
        projectTitle,
        file.name,
        (session.user.name as string) || "Admin"
      );
    }
  } else {
    const admin = await User.findOne({ role: "admin" }).select("email name").lean();
    if (admin && (admin as any).email) {
      sendFileUploadEmail(
        (admin as any).email,
        (admin as any).name || "Admin",
        projectTitle,
        file.name,
        (session.user.name as string) || "You"
      );
    }
  }

  revalidatePath("/dashboard/files");
  revalidatePath("/admin/files");
  revalidatePath("/dashboard");
  revalidatePath("/admin");

  return { success: true, fileId: String(fileDoc._id) };
}

// ── List files for a project ───────────────────────────

export const getProjectFiles = cache(async function getProjectFiles(projectId: string): Promise<FileItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  if (!/^[0-9a-fA-F]{24}$/.test(projectId)) return [];

  await connectMongoDB();

  const docs = await FileModel.find({ projectId })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const project = await ProjectModel.findById(projectId).select("title").lean();
  const projectTitle = (project?.title as string) || "";

  const userIds = [...new Set(docs.map((d) => String(d.uploadedBy)))];
  const users = await User.find({ _id: { $in: userIds } })
    .select("name")
    .lean();
  const userMap: Record<string, string> = {};
  for (const u of users) {
    userMap[String(u._id)] = (u.name as string) || "Unknown";
  }

  return docs.map((d) => ({
    id: String(d._id),
    fileName: d.fileName as string,
    originalName: d.originalName as string,
    size: d.size as number,
    mimeType: d.mimeType as string,
    url: `/api/files/${String(d._id)}`,
    projectId,
    projectTitle,
    uploadedBy: String(d.uploadedBy),
    uploaderName: userMap[String(d.uploadedBy)] || "Unknown",
    uploaderRole: d.uploaderRole as "admin" | "user",
    canDelete: session.user.role === "admin" || String(d.uploadedBy) === session.user.id,
    createdAt: (d.createdAt as Date).toISOString(),
  }));
})

// ── Client: all files across their projects ────────────

export const getClientFiles = cache(async function getClientFiles(): Promise<FileItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const projects = await ProjectModel.find({ clientId: session.user.id })
    .select("_id title")
    .limit(100)
    .lean();
  const projectIds = projects.map((p) => p._id);
  const projectTitles: Record<string, string> = {};
  for (const p of projects) {
    projectTitles[String(p._id)] = (p.title as string) || "Untitled";
  }

  const docs = await FileModel.find({ projectId: { $in: projectIds } })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const userIds = [...new Set(docs.map((d) => String(d.uploadedBy)))];
  const users = await User.find({ _id: { $in: userIds } })
    .select("name")
    .lean();
  const userMap: Record<string, string> = {};
  for (const u of users) {
    userMap[String(u._id)] = (u.name as string) || "Unknown";
  }

  return docs.map((d) => ({
    id: String(d._id),
    fileName: d.fileName as string,
    originalName: d.originalName as string,
    size: d.size as number,
    mimeType: d.mimeType as string,
    url: `/api/files/${String(d._id)}`,
    projectId: String(d.projectId),
    projectTitle: projectTitles[String(d.projectId)] || "Untitled",
    uploadedBy: String(d.uploadedBy),
    uploaderName: userMap[String(d.uploadedBy)] || "Unknown",
    uploaderRole: d.uploaderRole as "admin" | "user",
    canDelete: session.user.role === "admin" || String(d.uploadedBy) === session.user.id,
    createdAt: (d.createdAt as Date).toISOString(),
  }));
})

// ── Admin: all files grouped by client → project ───────

export interface AdminFileGroup {
  clientId: string;
  clientName: string;
  projects: {
    projectId: string;
    projectTitle: string;
    files: FileItem[];
  }[];
}

export const getAdminFilesGrouped = cache(async function getAdminFilesGrouped(): Promise<AdminFileGroup[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const clients = await User.find({ role: "user" }).select("name").lean();
  const clientIds = clients.map((c) => c._id);

  const projects = await ProjectModel.find({ clientId: { $in: clientIds } })
    .select("title clientId")
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const projectIds = projects.map((p) => p._id);
  const files = await FileModel.find({ projectId: { $in: projectIds } })
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  const userIds = [...new Set(files.map((d) => String(d.uploadedBy)))];
  const users = await User.find({ _id: { $in: userIds } })
    .select("name")
    .lean();
  const userMap: Record<string, string> = {};
  for (const u of users) {
    userMap[String(u._id)] = (u.name as string) || "Unknown";
  }

  const fileItems: FileItem[] = files.map((d) => ({
    id: String(d._id),
    fileName: d.fileName as string,
    originalName: d.originalName as string,
    size: d.size as number,
    mimeType: d.mimeType as string,
    url: `/api/files/${String(d._id)}`,
    projectId: String(d.projectId),
    uploadedBy: String(d.uploadedBy),
    uploaderName: userMap[String(d.uploadedBy)] || "Unknown",
    uploaderRole: d.uploaderRole as "admin" | "user",
    canDelete: session.user.role === "admin" || String(d.uploadedBy) === session.user.id,
    createdAt: (d.createdAt as Date).toISOString(),
  }));

  const filesByProject: Record<string, FileItem[]> = {};
  for (const f of fileItems) {
    if (!filesByProject[f.projectId]) filesByProject[f.projectId] = [];
    filesByProject[f.projectId].push(f);
  }

  const result: AdminFileGroup[] = [];
  for (const c of clients) {
    const cid = String(c._id);
    const clientName = (c.name as string) || "Unnamed";
    const clientProjects = projects
      .filter((p) => String(p.clientId) === cid)
      .map((p) => ({
        projectId: String(p._id),
        projectTitle: (p.title as string) || "Untitled",
        files: filesByProject[String(p._id)] || [],
      }));

    if (clientProjects.length > 0) {
      result.push({ clientId: cid, clientName, projects: clientProjects });
    }
  }

  return result;
})

// ── Delete a file ──────────────────────────────────────

export async function deleteFile(fileId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectMongoDB();

  const fileDoc = await FileModel.findById(fileId).lean();
  if (!fileDoc) return { error: "File not found" };

  if (session.user.role !== "admin" && String(fileDoc.uploadedBy) !== session.user.id) {
    return { error: "You can only delete files you uploaded" };
  }

  await del(fileDoc.fileName as string);

  await FileModel.findByIdAndDelete(fileId);

  revalidatePath("/dashboard/files");
  revalidatePath("/admin/files");
  revalidatePath("/dashboard");
  revalidatePath("/admin");

  return { success: true };
}

// ── Download a file ────────────────────────────────────

export async function getFileUrl(fileId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectMongoDB();

  const fileDoc = await FileModel.findById(fileId).lean();
  if (!fileDoc) return { error: "File not found" };

  return { url: `/api/files/${fileId}`, name: fileDoc.originalName };
}

// ── Notifications ──────────────────────────────────────

export const getNotifications = cache(async function getNotifications(): Promise<Notification[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const docs = await NotificationModel.find({ toUser: session.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const fromIds = [...new Set(docs.map((d) => String(d.fromUser)))];
  const users = await User.find({ _id: { $in: fromIds } })
    .select("name")
    .lean();
  const userMap: Record<string, string> = {};
  for (const u of users) {
    userMap[String(u._id)] = (u.name as string) || "Unknown";
  }

  const projectIds: string[] = docs
    .map((d) => d.projectId)
    .filter((id): id is NonNullable<typeof id> => id != null)
    .map((id) => String(id));
  const uniqueIds = [...new Set(projectIds)];
  const projects = uniqueIds.length > 0
    ? await ProjectModel.find({ _id: { $in: uniqueIds } })
        .select("title")
        .lean()
    : [];
  const projectMap: Record<string, string> = {};
  for (const p of projects) {
    projectMap[String(p._id)] = (p.title as string) || "Untitled";
  }

  return docs.map((d) => ({
    id: String(d._id),
    type: d.type as "file_upload",
    message: d.message as string,
    fromUser: String(d.fromUser),
    fromUserName: userMap[String(d.fromUser)] || "Unknown",
    toUser: String(d.toUser),
    projectId: String(d.projectId),
    projectTitle: projectMap[String(d.projectId)] || "Untitled",
    fileId: String(d.fileId),
    read: (d.read as boolean) || false,
    createdAt: (d.createdAt as Date).toISOString(),
  }));
})

export async function markNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectMongoDB();

  await NotificationModel.findByIdAndUpdate(notificationId, { read: true });

  revalidatePath("/dashboard");
  revalidatePath("/admin");

  return { success: true };
}

export const getProjectActivity = cache(async function getProjectActivity(projectId: string): Promise<Notification[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const docs = await NotificationModel.find({ projectId, toUser: session.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const fromIds = [...new Set(docs.map((d) => String(d.fromUser)))];
  const users = await User.find({ _id: { $in: fromIds } })
    .select("name")
    .lean();
  const userMap: Record<string, string> = {};
  for (const u of users) {
    userMap[String(u._id)] = (u.name as string) || "Unknown";
  }

  return docs.map((d) => ({
    id: String(d._id),
    type: d.type as Notification["type"],
    message: d.message as string,
    fromUser: String(d.fromUser),
    fromUserName: userMap[String(d.fromUser)] || "Unknown",
    toUser: String(d.toUser),
    projectId: String(d.projectId || ""),
    read: (d.read as boolean) || false,
    createdAt: (d.createdAt as Date).toISOString(),
  }));
})

export const getUnreadCount = cache(async function getUnreadCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  await connectMongoDB();

  return NotificationModel.countDocuments({ toUser: session.user.id, read: false });
})

