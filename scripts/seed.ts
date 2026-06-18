import * as fs from "fs";
import * as path from "path";

function loadEnv(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const envLocal = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envLocal)) loadEnv(envLocal);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../lib/mongodb";
import User from "../models/User";
import ProjectModel from "../models/Project";
import MessageModel from "../models/Message";
import FileModel from "../models/File";
import InvoiceModel from "../models/Invoice";

async function seed() {
  console.log("Connecting to MongoDB...");
  await connectMongoDB();

  const existingAdmin = await User.findOne({ role: "admin" });
  let adminId: string;
  if (!existingAdmin) {
    const hashed = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "George G-Stack",
      email: "admin@gstack.com",
      password: hashed,
      role: "admin",
    });
    adminId = admin._id.toString();
    console.log(`Admin created: admin@gstack.com / admin123`);
  } else {
    adminId = existingAdmin._id.toString();
    console.log(`Admin already exists: ${existingAdmin.email}`);
  }

  const clientData = [
    { name: "Nexus Creative Agency", email: "nexus@demo.com", clientType: "Starter" },
    { name: "Pinnacle Media Group", email: "pinnacle@demo.com", clientType: "Professional" },
    { name: "Vertex Digital Solutions", email: "vertex@demo.com", clientType: "Agency" },
  ];

  const clientIds: string[] = [];
  for (const c of clientData) {
    const existing = await User.findOne({ email: c.email });
    if (existing) {
      clientIds.push(existing._id.toString());
      console.log(`Client already exists: ${c.email}`);
      continue;
    }
    const hashed = await bcrypt.hash("demo1234", 10);
    const user = await User.create({
      name: c.name,
      email: c.email,
      password: hashed,
      role: "user",
      clientType: c.clientType,
    });
    clientIds.push(user._id.toString());
    console.log(`Client created: ${c.email} / demo1234`);
  }

  const projectTemplates = [
    { title: "Brand Identity Refresh", description: "Complete rebrand including logo, typography, and color system.", status: "in_progress", progress: 65, clientIdx: 0 },
    { title: "E-Commerce Platform", description: "Shopify store with custom theme, product catalog, and payment integration.", status: "planning", progress: 15, clientIdx: 0 },
    { title: "Mobile App MVP", description: "Cross-platform mobile application for service booking and payments.", status: "in_progress", progress: 40, clientIdx: 1 },
    { title: "SEO Overhaul", description: "Comprehensive SEO audit, on-page optimization, and content strategy.", status: "review", progress: 85, clientIdx: 1 },
    { title: "Corporate Website Redesign", description: "Modern responsive website with CMS integration and animations.", status: "completed", progress: 100, clientIdx: 1 },
    { title: "SaaS Dashboard", description: "Analytics dashboard with real-time data visualizations and user management.", status: "planning", progress: 5, clientIdx: 2 },
    { title: "Social Media Campaign", description: "Q2 campaign creative, scheduling, and performance tracking.", status: "in_progress", progress: 50, clientIdx: 2 },
    { title: "API Integration Hub", description: "Custom middleware connecting CRM, email marketing, and analytics platforms.", status: "on_hold", progress: 30, clientIdx: 2 },
  ];

  const projectIds: string[] = [];
  for (const pt of projectTemplates) {
    const existing = await ProjectModel.findOne({ title: pt.title, clientId: clientIds[pt.clientIdx] });
    if (existing) {
      projectIds.push(existing._id.toString());
      continue;
    }
    const project = await ProjectModel.create({
      title: pt.title,
      description: pt.description,
      status: pt.status,
      progressPercentage: pt.progress,
      clientId: clientIds[pt.clientIdx],
      deadLine: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });
    projectIds.push(project._id.toString());
    console.log(`Project created: ${pt.title}`);
  }

  const messages = [
    { content: "Hi! We're excited to start the project. When can we schedule the kickoff meeting?" },
    { content: "Thanks for reaching out! Let's schedule it for next Monday at 10 AM." },
    { content: "Perfect, Monday at 10 works for us. We'll send the agenda beforehand." },
    { content: "I've reviewed the initial wireframes. The layout looks great, but I'd like to adjust the color scheme." },
    { content: "Absolutely! Please share your brand guidelines or any reference you have in mind." },
    { content: "Just uploaded the brand style guide to the project files. Let me know what you think." },
    { content: "Got it! The team will review and incorporate the changes into the next iteration." },
    { content: "When can we expect the first prototype? The stakeholders are asking for a timeline." },
    { content: "We're on track for a prototype by next Thursday. I'll send a preview link once it's ready." },
    { content: "The latest revision looks fantastic! Just a few minor tweaks on the mobile layout." },
    { content: "Great feedback! We'll have the mobile adjustments done by end of day tomorrow." },
    { content: "We're approaching the deadline. How's everything looking on your end?" },
    { content: "All good! We're finalizing the last few pages. Should be ready for final review on Friday." },
    { content: "The project is live! Thank you for the seamless collaboration throughout." },
    { content: "Thank you! It's been a pleasure working with you. Looking forward to future projects!" },
  ];

  let msgCount = 0;
  for (const m of messages) {
    const sender = msgCount % 2 === 0 ? adminId : clientIds[msgCount % clientIds.length];
    const receiver = msgCount % 2 === 0 ? clientIds[msgCount % clientIds.length] : adminId;
    const existing = await MessageModel.findOne({ content: m.content, senderId: sender, receiverId: receiver });
    if (existing) continue;
    await MessageModel.create({
      senderId: sender,
      receiverId: receiver,
      content: m.content,
      read: Math.random() > 0.3,
    });
    msgCount++;
  }
  console.log(`Messages created: ${msgCount}`);

  const fileNames = [
    { name: "brand-style-guide.pdf", mime: "application/pdf", size: 2_400_000, projectIdx: 0 },
    { name: "logo-variants.zip", mime: "application/zip", size: 8_200_000, projectIdx: 0 },
    { name: "wireframes-v2.fig", mime: "application/octet-stream", size: 5_600_000, projectIdx: 1 },
    { name: "product-photos.zip", mime: "application/zip", size: 15_000_000, projectIdx: 1 },
    { name: "app-mockup-v3.png", mime: "image/png", size: 3_200_000, projectIdx: 2 },
    { name: "seo-audit-report.pdf", mime: "application/pdf", size: 1_800_000, projectIdx: 3 },
    { name: "content-strategy.docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 900_000, projectIdx: 3 },
    { name: "hero-animation.mp4", mime: "video/mp4", size: 12_000_000, projectIdx: 4 },
    { name: "social-media-creatives.zip", mime: "application/zip", size: 6_500_000, projectIdx: 6 },
    { name: "api-documentation.pdf", mime: "application/pdf", size: 1_200_000, projectIdx: 7 },
  ];

  let fileCount = 0;
  for (const f of fileNames) {
    const existing = await FileModel.findOne({ originalName: f.name, projectId: projectIds[f.projectIdx] });
    if (existing) continue;
    await FileModel.create({
      fileName: f.name,
      originalName: f.name,
      size: f.size,
      mimeType: f.mime,
      projectId: projectIds[f.projectIdx],
      uploadedBy: adminId,
      uploaderRole: "admin",
    });
    fileCount++;
  }
  console.log(`Files created: ${fileCount}`);

  const invoices = [
    { title: "Brand Identity - Phase 1", amount: 5000, status: "paid", clientIdx: 0, projectIdx: 0 },
    { title: "E-Commerce Platform - Deposit", amount: 8500, status: "pending", clientIdx: 0, projectIdx: 1 },
    { title: "Mobile App MVP - Milestone 1", amount: 12000, status: "overdue", clientIdx: 1, projectIdx: 2 },
    { title: "Corporate Website - Final Payment", amount: 7500, status: "paid", clientIdx: 1, projectIdx: 4 },
    { title: "SaaS Dashboard - Initial Deposit", amount: 10000, status: "pending", clientIdx: 2, projectIdx: 5 },
  ];

  let invCount = 0;
  for (const inv of invoices) {
    const existing = await InvoiceModel.findOne({ title: inv.title, clientId: clientIds[inv.clientIdx] });
    if (existing) continue;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    await InvoiceModel.create({
      clientId: clientIds[inv.clientIdx],
      projectId: projectIds[inv.projectIdx],
      title: inv.title,
      description: `Invoice for ${inv.title}`,
      amount: inv.amount,
      status: inv.status,
      dueDate: inv.status === "paid" ? new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) : dueDate,
      paidAt: inv.status === "paid" ? new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) : undefined,
    });
    invCount++;
  }
  console.log(`Invoices created: ${invCount}`);

  console.log("\nSeed complete!");
  console.log("── Login Credentials ──");
  console.log("Admin:    george.gstack@gmail.com / Shnwnw2006@");
  console.log("Clients:  nexus@demo.com / demo1234");
  console.log("          pinnacle@demo.com / demo1234");
  console.log("          vertex@demo.com / demo1234");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
