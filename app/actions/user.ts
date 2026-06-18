"use server";

import { auth } from "@/auth"; 
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import ProjectModel from "@/models/Project";
import FileModel from "@/models/File";
import InvoiceModel from "@/models/Invoice";
import LoginSessionModel from "@/models/LoginSession";
import type { ClientProject } from "@/types";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(prevState: { success: boolean } | null, formData: FormData) {
  const session = await auth(); 
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;
  const imageEntry = formData.get("image");
  
  let imageUrl: string | undefined;
  if (imageEntry && typeof imageEntry !== "string" && imageEntry.size > 0) {
    const buffer = Buffer.from(await imageEntry.arrayBuffer());
    imageUrl = `data:${imageEntry.type};base64,${buffer.toString("base64")}`;
  }
  
  await connectMongoDB();

  const updateFields: Record<string, any> = { name, company, phone };
  if (imageUrl) {
    updateFields.image = imageUrl;
  }

  // Update using the Mongoose model
  await User.findOneAndUpdate(
    { _id: session.user.id },
    { $set: updateFields },
    { new: true }
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  
  return { success: true, name, image: imageUrl ?? null };
}

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectMongoDB();
  const user = await User.findOne({ _id: session.user.id }).select("name email image company phone").lean();

  if (!user) return null;

  return {
    name: user.name as string,
    email: user.email as string,
    image: user.image as string | null,
    company: user.company as string | undefined,
    phone: user.phone as string | undefined,
  };
}

export async function getUserProjects() {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();
  const projects = await ProjectModel.find({ clientId: session.user.id }).lean();

  return projects.map((p) => ({
    id: String(p._id),
    title: p.title as string,
    description: p.description as string | undefined,
    status: p.status as ClientProject["status"],
    progressPercentage: p.progressPercentage as number,
    deadline: p.deadLine
      ? new Date(p.deadLine as string).toISOString().split("T")[0]
      : "",
    clientId: String(p.clientId),
  })) satisfies ClientProject[];
}

export async function getUserProjectById(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectMongoDB();
  const project = await ProjectModel.findOne({
    _id: projectId,
    clientId: session.user.id,
  }).lean();

  if (!project) return null;

  const result: ClientProject = {
    id: String(project._id),
    title: project.title as string,
    description: project.description as string | undefined,
    status: project.status as ClientProject["status"],
    progressPercentage: project.progressPercentage as number,
    deadline: project.deadLine
      ? new Date(project.deadLine as string).toISOString().split("T")[0]
      : "",
    clientId: String(project.clientId),
  };

  const user = await User.findById(project.clientId).select("name email image").lean();

  return {
    project: result,
    clientName: user?.name as string ?? "",
    clientEmail: user?.email as string ?? "",
    clientImage: user?.image as string | null ?? null,
  };
}

export async function deleteUserProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await connectMongoDB();
  const project = await ProjectModel.findOneAndDelete({
    _id: projectId,
    clientId: session.user.id,
  });

  if (!project) throw new Error("Project not found");

  await FileModel.deleteMany({ projectId });
  await InvoiceModel.deleteMany({ projectId });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleProjectStatus(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await connectMongoDB();

  const project = await ProjectModel.findOne({ _id: projectId, clientId: session.user.id });
  if (!project) throw new Error("Project not found");

  project.status = project.status === "completed" ? "planning" : "completed";
  await project.save();

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true, newStatus: project.status };
}

export async function changePassword(prevState: { success: boolean; error?: string } | null, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "All fields are required" };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  await connectMongoDB();

  const user = await User.findById(session.user.id).select("password");
  if (!user || !user.password) {
    return { success: false, error: "No password set on this account" };
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect" };
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  user.password = hashed;
  await user.save();

  return { success: true };
}

export async function logSession(device: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await connectMongoDB();

  const existing = await LoginSessionModel.findOne({
    userId: session.user.id,
    device,
    loggedInAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).lean();

  if (existing) return;

  await LoginSessionModel.create({
    userId: session.user.id,
    device,
    loggedInAt: new Date(),
    lastActiveAt: new Date(),
  });
}

export async function getUserSessions() {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();
  const docs = await LoginSessionModel.find({ userId: session.user.id })
    .sort({ loggedInAt: -1 })
    .lean();

  const seen = new Set<string>();
  const unique: { device: string; lastActive: Date }[] = [];
  for (const d of docs) {
    const key = (d.device as string).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push({ device: d.device as string, lastActive: d.loggedInAt as Date });
    }
  }

  return unique.map((u, i) => ({
    id: u.device,
    device: u.device,
    active: i === 0,
    time: i === 0 ? "Current session" : timeAgo(new Date(u.lastActive)),
  }));
}

export interface SessionEntry {
  id: string;
  device: string;
  active: boolean;
  time: string;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}