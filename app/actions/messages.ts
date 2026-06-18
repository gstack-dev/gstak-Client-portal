"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import MessageModel from "@/models/Message";
import User from "@/models/User";

export interface MessageData {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  senderName?: string;
}

export interface ConversationData {
  userId: string;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const content = formData.get("content") as string | null;
  const receiverId = formData.get("receiverId") as string | null;

  if (!content?.trim() || !receiverId) return { error: "Missing content or receiver" };

  await connectMongoDB();

  await MessageModel.create({
    senderId: session.user.id,
    receiverId,
    content: content.trim(),
  });

  revalidatePath("/dashboard/messages");
  revalidatePath("/admin/messages");

  return { success: true };
}

export async function getUnreadMessageCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  await connectMongoDB();

  return MessageModel.countDocuments({ receiverId: session.user.id, read: false });
}

export async function getMessagesWithUser(otherUserId: string): Promise<MessageData[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const docs = await MessageModel.find({
    $or: [
      { senderId: session.user.id, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: session.user.id },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  const userIds = [session.user.id, otherUserId];
  const users = await User.find({ _id: { $in: userIds } }).select("name").lean();
  const userMap: Record<string, string> = {};
  for (const u of users) userMap[String(u._id)] = (u.name as string) || "Unknown";

  return docs.map((d) => ({
    id: String(d._id),
    senderId: String(d.senderId),
    receiverId: String(d.receiverId),
    content: d.content as string,
    read: (d.read as boolean) || false,
    createdAt: (d.createdAt as Date).toISOString(),
    senderName: userMap[String(d.senderId)] || "Unknown",
  }));
}

export async function getConversations(): Promise<ConversationData[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const allMessages = await MessageModel.find({
    $or: [
      { senderId: session.user.id },
      { receiverId: session.user.id },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  const otherUserIds = new Set<string>();
  const lastMessageMap: Record<string, { content: string; createdAt: Date }> = {};
  const unreadMap: Record<string, number> = {};

  for (const m of allMessages) {
    const otherId = String(m.senderId) === session.user.id ? String(m.receiverId) : String(m.senderId);
    otherUserIds.add(otherId);

    if (!lastMessageMap[otherId]) {
      lastMessageMap[otherId] = {
        content: m.content as string,
        createdAt: m.createdAt as Date,
      };
    }

    if (String(m.receiverId) === session.user.id && !m.read) {
      unreadMap[otherId] = (unreadMap[otherId] || 0) + 1;
    }
  }

  const users = await User.find({ _id: { $in: [...otherUserIds] } }).select("name").lean();
  const userMap: Record<string, string> = {};
  for (const u of users) userMap[String(u._id)] = (u.name as string) || "Unknown";

  return [...otherUserIds]
    .map((id) => ({
      userId: id,
      name: userMap[id] || "Unknown",
      lastMessage: lastMessageMap[id]?.content || "",
      lastMessageAt: lastMessageMap[id]?.createdAt.toISOString() || "",
      unread: unreadMap[id] || 0,
    }))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export async function getAdminId(): Promise<string | null> {
  await connectMongoDB();
  const admin = await User.findOne({ role: "admin" }).select("_id").lean();
  return admin ? String(admin._id) : null;
}

export async function markMessagesAsRead(senderId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await connectMongoDB();

  await MessageModel.updateMany(
    { senderId, receiverId: session.user.id, read: false },
    { read: true },
  );

  revalidatePath("/dashboard/messages");
  revalidatePath("/admin/messages");
}
