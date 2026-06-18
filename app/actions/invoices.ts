"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import InvoiceModel from "@/models/Invoice";
import User from "@/models/User";
import NotificationModel from "@/models/Notification";
import { sendInvoiceCreatedEmail } from "@/lib/email";

export interface ClientInvoiceData {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  amount: number;
  status: "pending" | "paid" | "overdue" | "cancelled";
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
}

export interface AdminInvoiceData extends ClientInvoiceData {
  clientId: string;
  clientName: string;
}

export interface InvoiceStats {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  nextDue: string | null;
  nextDueId: string | null;
}

export interface ClientRevenue {
  clientId: string;
  clientName: string;
  revenue: number;
  invoiceCount: number;
}

export async function getClientInvoices(): Promise<ClientInvoiceData[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const docs = await InvoiceModel.find({ clientId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return docs.map((d) => ({
    id: String(d._id),
    projectId: d.projectId ? String(d.projectId) : undefined,
    title: d.title as string,
    description: (d.description as string) || "",
    amount: d.amount as number,
    status: d.status as ClientInvoiceData["status"],
    dueDate: (d.dueDate as Date).toISOString(),
    paidAt: d.paidAt ? (d.paidAt as Date).toISOString() : null,
    createdAt: (d.createdAt as Date).toISOString(),
  }));
}

export async function getClientInvoiceStats(): Promise<InvoiceStats> {
  const session = await auth();
  if (!session?.user?.id) {
    return { totalPaid: 0, totalPending: 0, totalOverdue: 0, paidCount: 0, pendingCount: 0, overdueCount: 0, nextDue: null, nextDueId: null };
  }

  await connectMongoDB();

  const [paidAgg, pendingAgg, overdueAgg, nextDueDoc] = await Promise.all([
    InvoiceModel.aggregate<{ total: number; count: number }>([
      { $match: { clientId: session.user.id, status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    InvoiceModel.aggregate<{ total: number; count: number }>([
      { $match: { clientId: session.user.id, status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    InvoiceModel.aggregate<{ total: number; count: number }>([
      { $match: { clientId: session.user.id, status: "overdue" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    InvoiceModel.findOne({ clientId: session.user.id, status: { $in: ["pending", "overdue"] } })
      .sort({ dueDate: 1 })
      .select("dueDate _id")
      .lean(),
  ]);

  return {
    totalPaid: paidAgg[0]?.total ?? 0,
    totalPending: pendingAgg[0]?.total ?? 0,
    totalOverdue: overdueAgg[0]?.total ?? 0,
    paidCount: paidAgg[0]?.count ?? 0,
    pendingCount: pendingAgg[0]?.count ?? 0,
    overdueCount: overdueAgg[0]?.count ?? 0,
    nextDue: nextDueDoc ? (nextDueDoc.dueDate as Date).toISOString() : null,
    nextDueId: nextDueDoc ? String(nextDueDoc._id) : null,
  };
}

export async function getAdminInvoices(): Promise<AdminInvoiceData[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const docs = await InvoiceModel.find()
    .sort({ createdAt: -1 })
    .lean();

  const clientIds = [...new Set(docs.map((d) => String(d.clientId)))];
  const clients = await User.find({ _id: { $in: clientIds } }).select("name").lean();
  const nameMap: Record<string, string> = {};
  for (const c of clients) nameMap[String(c._id)] = (c.name as string) || "Unknown";

  return docs.map((d) => ({
    id: String(d._id),
    clientId: String(d.clientId),
    clientName: nameMap[String(d.clientId)] || "Unknown",
    projectId: d.projectId ? String(d.projectId) : undefined,
    title: d.title as string,
    description: (d.description as string) || "",
    amount: d.amount as number,
    status: d.status as AdminInvoiceData["status"],
    dueDate: (d.dueDate as Date).toISOString(),
    paidAt: d.paidAt ? (d.paidAt as Date).toISOString() : null,
    createdAt: (d.createdAt as Date).toISOString(),
  }));
}

export async function getAdminInvoiceStats() {
  const session = await auth();
  if (!session?.user?.id) {
    return { totalCollected: 0, totalPending: 0, totalOverdue: 0, collectedCount: 0, pendingCount: 0, overdueCount: 0 };
  }

  await connectMongoDB();

  const [collectedAgg, pendingAgg, overdueAgg] = await Promise.all([
    InvoiceModel.aggregate<{ total: number; count: number }>([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    InvoiceModel.aggregate<{ total: number; count: number }>([
      { $match: { status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    InvoiceModel.aggregate<{ total: number; count: number }>([
      { $match: { status: "overdue" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
  ]);

  return {
    totalCollected: collectedAgg[0]?.total ?? 0,
    totalPending: pendingAgg[0]?.total ?? 0,
    totalOverdue: overdueAgg[0]?.total ?? 0,
    collectedCount: collectedAgg[0]?.count ?? 0,
    pendingCount: pendingAgg[0]?.count ?? 0,
    overdueCount: overdueAgg[0]?.count ?? 0,
  };
}

export async function createInvoice(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const clientId = formData.get("clientId") as string | null;
  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const amountStr = formData.get("amount") as string | null;
  const dueDateStr = formData.get("dueDate") as string | null;
  const projectId = formData.get("projectId") as string | null;

  if (!clientId || !title || !amountStr || !dueDateStr) {
    return { error: "Missing required fields" };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return { error: "Invalid amount" };

  const dueDate = new Date(dueDateStr);
  if (isNaN(dueDate.getTime())) return { error: "Invalid due date" };

  await connectMongoDB();

  await InvoiceModel.create({
    clientId,
    projectId: projectId || undefined,
    title: title.trim(),
    description: description?.trim() || "",
    amount,
    dueDate,
    status: "pending",
  });

  const formattedAmount = `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  await NotificationModel.create({
    type: "invoice_created",
    message: `New invoice: ${title.trim()} — ${formattedAmount} due ${dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    fromUser: session.user.id,
    toUser: clientId,
  });

  // ── Send email ──
  const client = await User.findById(clientId).select("name email").lean();
  if (client && (client as any).email) {
    sendInvoiceCreatedEmail(
      (client as any).email,
      (client as any).name || "Client",
      title.trim(),
      amount,
      dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    );
  }

  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function payInvoice(invoiceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectMongoDB();

  const invoice = await InvoiceModel.findOne({ _id: invoiceId, clientId: session.user.id });
  if (!invoice) return { error: "Invoice not found" };
  if (invoice.status !== "pending" && invoice.status !== "overdue") {
    return { error: "Invoice is not payable" };
  }

  invoice.status = "paid";
  invoice.paidAt = new Date();
  await invoice.save();

  const admin = await User.findOne({ role: "admin" }).select("_id").lean();
  if (admin) {
    const formattedAmount = `$${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const client = await User.findById(session.user.id).select("name").lean();
    await NotificationModel.create({
      type: "invoice_paid",
      message: `${(client?.name as string) || "A client"} paid invoice "${invoice.title}" — ${formattedAmount}`,
      fromUser: session.user.id,
      toUser: String(admin._id),
    });
  }

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");

  return { success: true };
}

export async function updateInvoice(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const invoiceId = formData.get("invoiceId") as string | null;
  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const amountStr = formData.get("amount") as string | null;
  const dueDateStr = formData.get("dueDate") as string | null;
  const projectId = formData.get("projectId") as string | null;

  if (!invoiceId || !title || !amountStr || !dueDateStr) {
    return { error: "Missing required fields" };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return { error: "Invalid amount" };

  const dueDate = new Date(dueDateStr);
  if (isNaN(dueDate.getTime())) return { error: "Invalid due date" };

  await connectMongoDB();

  await InvoiceModel.findByIdAndUpdate(invoiceId, {
    $set: {
      title: title.trim(),
      description: description?.trim() || "",
      amount,
      dueDate,
      projectId: projectId || undefined,
    },
  });

  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteInvoice(invoiceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectMongoDB();

  await InvoiceModel.findByIdAndDelete(invoiceId);

  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function markInvoiceAsPaid(invoiceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectMongoDB();

  const invoice = await InvoiceModel.findById(invoiceId);
  if (!invoice) return { error: "Invoice not found" };

  invoice.status = "paid";
  invoice.paidAt = new Date();
  await invoice.save();

  const client = await User.findById(invoice.clientId).select("name").lean();
  if (client) {
    const formattedAmount = `$${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    await NotificationModel.create({
      type: "invoice_paid",
      message: `Invoice "${invoice.title}" — ${formattedAmount} was marked as paid.`,
      fromUser: session.user.id,
      toUser: String(invoice.clientId),
    });
  }

  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function getRevenueByClient(): Promise<ClientRevenue[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const revenueAgg = await InvoiceModel.aggregate<{ _id: string; revenue: number; invoiceCount: number }>([
    { $match: { status: "paid" } },
    { $group: { _id: "$clientId", revenue: { $sum: "$amount" }, invoiceCount: { $sum: 1 } } },
    { $sort: { revenue: -1 } },
  ]);

  const clientIds = revenueAgg.map((r) => r._id);
  const clients = await User.find({ _id: { $in: clientIds } }).select("name").lean();
  const nameMap: Record<string, string> = {};
  for (const c of clients) nameMap[String(c._id)] = (c.name as string) || "Unknown";

  return revenueAgg.map((r) => ({
    clientId: r._id,
    clientName: nameMap[r._id] || "Unknown",
    revenue: r.revenue,
    invoiceCount: r.invoiceCount,
  }));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface MonthlyRevenueEntry {
  month: string;
  value: number;
}

export async function getMonthlyRevenue(): Promise<MonthlyRevenueEntry[]> {
  const session = await auth();
  if (!session?.user?.id) return MONTHS.map((m) => ({ month: m, value: 0 }));

  await connectMongoDB();

  const revenueAgg = await InvoiceModel.aggregate<{ _id: number; value: number }>([
    { $match: { status: "paid", paidAt: { $exists: true } } },
    { $group: { _id: { $month: "$paidAt" }, value: { $sum: "$amount" } } },
    { $sort: { _id: 1 } },
  ]);

  const revenueMap: Record<number, number> = {};
  for (const r of revenueAgg) {
    revenueMap[r._id] = (revenueMap[r._id] || 0) + r.value;
  }

  return MONTHS.map((month, i) => ({
    month,
    value: revenueMap[i + 1] || 0,
  }));
}

export async function getProjectInvoices(projectId: string): Promise<ClientInvoiceData[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectMongoDB();

  const docs = await InvoiceModel.find({ projectId, clientId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return docs.map((d) => ({
    id: String(d._id),
    projectId: d.projectId ? String(d.projectId) : undefined,
    title: d.title as string,
    description: (d.description as string) || "",
    amount: d.amount as number,
    status: d.status as ClientInvoiceData["status"],
    dueDate: (d.dueDate as Date).toISOString(),
    paidAt: d.paidAt ? (d.paidAt as Date).toISOString() : null,
    createdAt: (d.createdAt as Date).toISOString(),
  }));
}

export async function areProjectInvoicesPaid(projectId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return true;

  await connectMongoDB();

  const unpaid = await InvoiceModel.countDocuments({
    projectId,
    clientId: session.user.id,
    status: { $in: ["pending", "overdue"] },
  });

  return unpaid === 0;
}
