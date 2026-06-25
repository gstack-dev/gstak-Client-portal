"use server";

import { cache } from "react";
import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { rateLimitAction } from "@/lib/rate-limiter";
import { sendWelcomeEmail, sendStatusChangeEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import ProjectModel from "@/models/Project";
import FileModel from "@/models/File";
import InvoiceModel from "@/models/Invoice";
import NotificationModel from "@/models/Notification";
import MessageModel from "@/models/Message";
import LoginSessionModel from "@/models/LoginSession";
import type { ClientFormValues } from "@/schema/client";
import type { ProjectFormValues } from "@/schema/project";
import type { Client, ClientProject } from "@/types";

export async function createClient(
    client: ClientFormValues,
    projects: ProjectFormValues[]
){
    await rateLimitAction("createClient", 5, 60_000);
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
        return { error: "Unauthorized", success: false };
    }
    await connectMongoDB();
    try {
        const isUser = await User.findOne({email: client.email});
        if(isUser){
            return { error: "User already exists", success: false }
        }

        const hashedPassword = await bcrypt.hash(client.password, 10);
        const newUser = await User.create({
            name: client.name,
            email: client.email,
            password: hashedPassword,
            role: "user",
            clientType: client.client_type.charAt(0).toUpperCase() + client.client_type.slice(1),
            image: client.image,
        });

        await sendWelcomeEmail(client.email, client.password);

        const projectDocs = projects
            .filter((p) => p.title.trim())
            .map((p) => ({
                title: p.title,
                description: p.description ?? "",
                status: p.status,
                progressPercentage: p.progressPercentage,
                deadLine: p.deadline ? new Date(p.deadline) : undefined,
                clientId: newUser._id,
            }));

        if (projectDocs.length > 0) {
            await ProjectModel.insertMany(projectDocs);
        }

        return { success: true }
    } catch (error) {
        console.error(error);
        return { error: "Error creating client", success: false }
    }
}

export const getClients = cache(async function getClients() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
        return { clients: [] };
    }
    await connectMongoDB();
    const docs = await User.aggregate([
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
            $addFields: {
                projectCount: { $size: "$projects" },
            },
        },
        { $sort: { createdAt: -1 } },
    ]);
    const clients: Client[] = docs.map((doc) => ({
        id: String(doc._id),
        name: doc.name as string,
        email: doc.email as string,
        password: "",
        role: "user",
        client_type: ((doc.clientType as string)?.toLowerCase() ?? "starter") as Client["client_type"],
        image: (doc.image as string) ?? null,
        projects: (doc.projects as any[]).map((p: any) => ({
            id: String(p._id),
            title: p.title as string,
            description: p.description as string | undefined,
            status: p.status as ClientProject["status"],
            progressPercentage: p.progressPercentage as number,
            deadline: p.deadLine
                ? new Date(p.deadLine as string).toISOString().split("T")[0]
                : "",
            clientId: String(doc._id),
        })),
        since: doc.createdAt
            ? new Date(doc.createdAt as string).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : "",
    }));
    return { clients };
})

export async function deleteClient(clientId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
        return { error: "Unauthorized", success: false };
    }
    await connectMongoDB();
    try {
        await User.deleteOne({ _id: clientId });
        await ProjectModel.deleteMany({ clientId });
        await FileModel.deleteMany({ uploadedBy: clientId });
        await InvoiceModel.deleteMany({ clientId });
        await NotificationModel.deleteMany({
            $or: [{ fromUser: clientId }, { toUser: clientId }],
        });
        await MessageModel.deleteMany({
            $or: [{ senderId: clientId }, { receiverId: clientId }],
        });
        await LoginSessionModel.deleteMany({ userId: clientId });
        return { success: true }
    } catch (error) {
        console.error(error);
        return { error: "Error deleting client", success: false }
    }
}

export async function addProject(projects: ProjectFormValues[], clientId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
        return { error: "Unauthorized", success: false };
    }
    await connectMongoDB();
    try {

        const projectDocs = projects
            .filter((p) => p.title.trim())
            .map((p) => ({
                title: p.title,
                description: p.description ?? "",
                status: p.status,
                progressPercentage: p.progressPercentage,
                deadLine: p.deadline ? new Date(p.deadline) : undefined,
                clientId: clientId,
            }));

        if (projectDocs.length > 0) {
            const created = await ProjectModel.insertMany(projectDocs);
            const admin = await User.findOne({ role: "admin" }).select("_id").lean();
            for (const proj of created) {
                await NotificationModel.create({
                    type: "status_change",
                    message: `Project "${proj.title}" created`,
                    fromUser: session?.user?.id || admin?._id,
                    toUser: clientId,
                    projectId: proj._id,
                });
            }
        }

        return { success: true }
    } catch (error) {
        console.error(error);
        return { error: "Error adding project", success: false }
    }
}

const statusLabels: Record<string, string> = {
    planning: "Planning",
    in_progress: "In Progress",
    review: "Review",
    completed: "Completed",
    on_hold: "On Hold",
    cancelled: "Cancelled",
};

export async function updateProject(
    projectId: string,
    data: Partial<ProjectFormValues>
) {
    if (!/^[0-9a-fA-F]{24}$/.test(projectId)) return { error: "Invalid project ID", success: false };
    await connectMongoDB();
    try {
        const update: Record<string, unknown> = {};
        if (data.title !== undefined) update.title = data.title;
        if (data.description !== undefined) update.description = data.description;
        if (data.status !== undefined) update.status = data.status;
        if (data.progressPercentage !== undefined) update.progressPercentage = data.progressPercentage;
        if (data.deadline !== undefined) update.deadLine = data.deadline ? new Date(data.deadline) : undefined;

        const prevProject = await ProjectModel.findById(projectId).lean();
        await ProjectModel.updateOne({ _id: projectId }, { $set: update });

        if (data.status !== undefined && prevProject && prevProject.status !== data.status) {
            const projectTitle = (prevProject.title as string) || "Untitled";
            const clientId = String(prevProject.clientId);
            const oldStatus = statusLabels[prevProject.status as string] || (prevProject.status as string);
            const newStatus = statusLabels[data.status] || data.status;
            const session = await auth();

            const admin = await User.findOne({ role: "admin" }).select("_id name").lean();
            const client = await User.findById(clientId).select("name email").lean();

            if (client) {
                await NotificationModel.create({
                    type: "status_change",
                    message: `Project "${projectTitle}" status changed from ${oldStatus} to ${newStatus}`,
                    fromUser: session?.user?.id || admin?._id,
                    toUser: String(client._id),
                    projectId,
                });

                if ((client as any).email) {
                    sendStatusChangeEmail(
                        (client as any).email,
                        (client as any).name || "Client",
                        projectTitle,
                        oldStatus,
                        newStatus
                    );
                }
            }

            if (admin && String(admin._id) !== session?.user?.id) {
                await NotificationModel.create({
                    type: "status_change",
                    message: `Project "${projectTitle}" status changed from ${oldStatus} to ${newStatus}`,
                    fromUser: clientId,
                    toUser: String(admin._id),
                    projectId,
                });
            }
        }

        return { success: true }
    } catch (error) {
        console.error(error);
        return { error: "Error updating project", success: false }
    }
}

export async function deleteProject(projectId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
        return { error: "Unauthorized", success: false };
    }
    if (!/^[0-9a-fA-F]{24}$/.test(projectId)) return { error: "Invalid project ID", success: false };
    await connectMongoDB();
    try {
        await ProjectModel.deleteOne({ _id: projectId });
        await FileModel.deleteMany({ projectId });
        await InvoiceModel.deleteMany({ projectId });
        return { success: true }
    } catch (error) {
        console.error(error);
        return { error: "Error deleting project", success: false }
    }
}