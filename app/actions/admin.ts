"use server";

import { cache } from "react";
import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import ProjectModel from "@/models/Project";
import InvoiceModel from "@/models/Invoice";
import type { ProjectStatusSegment, MonthlyStat, TopClient } from "@/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getAdminMetrics = cache(async function getAdminMetrics() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { totalClients: 0, activeProjects: 0, projectStatusSegments: [] as ProjectStatusSegment[] };
  }

  await connectMongoDB();

  const [totalClients, activeProjects, statusCounts] = await Promise.all([
    User.countDocuments({ role: "user" }),
    ProjectModel.countDocuments({
      status: { $in: ["planning", "in_progress", "review"] },
    }),
    ProjectModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const counts: Record<string, number> = {};
  for (const s of statusCounts) {
    counts[s._id] = s.count;
  }

  const activeVal = (counts.planning ?? 0) + (counts.in_progress ?? 0) + (counts.review ?? 0);
  const pendingVal = counts.on_hold ?? 0;
  const completedVal = counts.completed ?? 0;
  const total = activeVal + pendingVal + completedVal;

  const projectStatusSegments: ProjectStatusSegment[] = total > 0
    ? [
        { label: "Active", value: Math.round((activeVal / total) * 100), color: "bg-blue-600 dark:bg-blue-500" },
        { label: "Pending", value: Math.round((pendingVal / total) * 100), color: "bg-slate-300 dark:bg-slate-600" },
        { label: "Completed", value: Math.round((completedVal / total) * 100), color: "bg-green-500 dark:bg-green-400" },
      ]
    : [
        { label: "Active", value: 60, color: "bg-blue-600 dark:bg-blue-500" },
        { label: "Pending", value: 25, color: "bg-slate-300 dark:bg-slate-600" },
        { label: "Completed", value: 15, color: "bg-green-500 dark:bg-green-400" },
      ];

  return { totalClients, activeProjects, projectStatusSegments };
})

export const getAdminAnalytics = cache(async function getAdminAnalytics() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { totalUsers: 0, monthlyStats: [] as MonthlyStat[], topClients: [] as TopClient[] };
  }

  await connectMongoDB();

  const [totalUsers, usersByMonth, projectsByMonth, clientsWithProjects, revenueByClient, monthlyRevenueAgg] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.aggregate<{ _id: number; count: number }>([
      { $match: { role: "user", createdAt: { $exists: true } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    ProjectModel.aggregate<{ _id: number; count: number }>([
      { $match: { createdAt: { $exists: true } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    User.aggregate<{ _id: string; name: string; projectCount: number }>([
      { $match: { role: "user" } },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "clientId",
          as: "projects",
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          name: { $ifNull: ["$name", "Unnamed"] },
          projectCount: { $size: "$projects" },
        },
      },
      { $sort: { projectCount: -1 } },
      { $limit: 5 },
    ]),
    InvoiceModel.aggregate<{ _id: string; revenue: number; invoiceCount: number }>([
      { $match: { status: "paid" } },
      { $group: { _id: "$clientId", revenue: { $sum: "$amount" }, invoiceCount: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
    ]),
    InvoiceModel.aggregate<{ _id: number; revenue: number }>([
      { $match: { status: "paid", paidAt: { $exists: true } } },
      { $group: { _id: { $month: "$paidAt" }, revenue: { $sum: "$amount" } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const revenueByClientMap: Record<string, { revenue: number; invoiceCount: number }> = {};
  for (const r of revenueByClient) {
    revenueByClientMap[r._id] = { revenue: r.revenue, invoiceCount: r.invoiceCount };
  }

  const userCounts: Record<number, number> = {};
  for (const u of usersByMonth) userCounts[u._id] = u.count;
  const projectCounts: Record<number, number> = {};
  for (const p of projectsByMonth) projectCounts[p._id] = p.count;
  const revenueCounts: Record<number, number> = {};
  for (const r of monthlyRevenueAgg) revenueCounts[r._id] = r.revenue;

  let cumUsers = 0;
  let cumProjects = 0;
  const monthlyStats: MonthlyStat[] = MONTHS.map((month, i) => {
    const m = i + 1;
    cumUsers += userCounts[m] ?? 0;
    cumProjects += projectCounts[m] ?? 0;
    return {
      month,
      users: cumUsers,
      projects: cumProjects,
      revenue: revenueCounts[m] ?? 0,
    };
  });

  const topClients: TopClient[] = clientsWithProjects.map((c) => {
    const revData = revenueByClientMap[c._id] || { revenue: 0, invoiceCount: 0 };
    return {
      name: c.name,
      revenue: `$${revData.revenue.toLocaleString()}`,
      projects: c.projectCount,
      messages: c.projectCount * 3,
      invoiceCount: revData.invoiceCount,
    };
  });

  return { totalUsers, monthlyStats, topClients };
})
