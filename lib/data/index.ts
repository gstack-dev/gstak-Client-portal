// lib/data/index.ts
// Dummy data layer — replace imports with real API calls when backend is ready.

// ── Dashboard ──────────────────────────────────────────

export interface DashboardProject {
  id: number;
  name: string;
  description: string;
  status: "On Track" | "At Risk" | "Pending" | "Completed";
  progress: number;
}

export const dashboardProjects: DashboardProject[] = [
  { id: 1, name: "Acme Corp Rebrand", description: "Brand Identity & Web", status: "On Track", progress: 75 },
  { id: 2, name: "GlobalTech App UI", description: "Mobile Application", status: "At Risk", progress: 30 },
];

export interface DashboardMessage {
  initials: string;
  name: string;
  message: string;
  bg: string;
  text: string;
}

export const dashboardMessages: DashboardMessage[] = [
  { initials: "JD", name: "Jane Doe (Acme Corp)", message: "The latest wireframes look great, can we schedule a call?", bg: "bg-blue-600/10 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-300" },
  { initials: "PM", name: "Project Manager", message: "Updated the timeline for the GlobalTech app.", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-300" },
];

export interface DashboardActivity {
  user: string;
  action: string;
  target: string;
  time: string;
  isPrimary: boolean;
}

export const dashboardActivities: DashboardActivity[] = [
  { user: "You", action: "uploaded a new file", target: "Homepage_v2.fig", time: "2 hours ago", isPrimary: true },
  { user: "System", action: "updated", target: "Acme Corp Rebrand", time: "5 hours ago", isPrimary: false },
  { user: "John Smith", action: "commented on", target: "Invoice #1024", time: "Yesterday", isPrimary: false },
];

export interface DashboardInvoice {
  id: string;
  client: string;
  amount: string;
  status: string;
}

export const dashboardInvoices: DashboardInvoice[] = [
  { id: "#INV-2024-001", client: "Acme Corp", amount: "$4,500", status: "Paid" },
  { id: "#INV-2024-002", client: "GlobalTech", amount: "$2,100", status: "Pending" },
];

export interface DashboardDeadline {
  task: string;
  due: string;
  urgent: boolean;
}

export const dashboardDeadlines: DashboardDeadline[] = [
  { task: "Finalize Homepage Copy", due: "Due Today", urgent: true },
  { task: "Review App Wireframes", due: "Due in 2 days", urgent: false },
  { task: "Send Monthly Report", due: "Due next week", urgent: false },
];

// ── Dashboard: Invoices ────────────────────────────────

export interface InvoiceSummaryCard {
  icon: string;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}

export interface InvoiceItem {
  id: string;
  title: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
  dueLabel: string;
  dueValue: string;
  overdue?: boolean;
  payNow?: boolean;
  projectId?: number;
}

export const invoiceSummaryCards: InvoiceSummaryCard[] = [
  { icon: "CheckCircle", label: "Total Paid", value: "$42,500.00", sub: "Across 12 invoices" },
  { icon: "Clock", label: "Total Pending", value: "$8,250.00", sub: "Action required", accent: true },
  { icon: "Calendar", label: "Next Due Date", value: "Oct 15, 2024", sub: "Invoice #INV-2024-089" },
];

export const invoiceItems: InvoiceItem[] = [
  { id: "INV-2024-089", title: "Q3 Retainer Services", amount: "$8,250.00", status: "Pending", dueLabel: "Due Date", dueValue: "Oct 15, 2024", projectId: 1 },
  { id: "INV-2024-088", title: "Website Redesign Phase 2", amount: "$12,400.00", status: "Paid", dueLabel: "Paid On", dueValue: "Sep 28, 2024", projectId: 1 },
  { id: "INV-2024-085", title: "Q2 Retainer Services", amount: "$8,250.00", status: "Paid", dueLabel: "Paid On", dueValue: "Jul 12, 2024", projectId: 2 },
  { id: "INV-2024-080", title: "Ad-hoc Consultation", amount: "$1,200.00", status: "Overdue", dueLabel: "Due Date", dueValue: "Sep 01, 2024", overdue: true, payNow: true, projectId: 3 },
];

// ── Dashboard: Files ───────────────────────────────────

export interface FileItem {
  id: number;
  icon: string;
  fileName: string;
  size: string;
  date: string;
  preview: string | null;
  client: string;
}

export const dashboardFiles: FileItem[] = [
  { id: 1, icon: "image", fileName: "Homepage_Hero_v2.jpg", size: "2.4 MB", date: "Today", preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlD-xeLIVQzXRaXWHRJPRbzlvwP7KKS26bbkodIz0XJmTNF4SuMGogIYX0vulvC6EYQEh2ZBOZv8b_fkfUY0cR6YeEDOojTISi5vyGrdipCu339sv1SW_EeX_WZLa1gM1yWmER12NwcxZh5b56eUumRfDbI1sbL2kpThhLV1pO-W4pvSFUrnIjX1kq0g8S4XljAXO7Dy0envDWahf4UqBxK5tK3Wz5V4OZde5ci_nMSL2GQ1c9Jgd5GVviDCM18wvR3QbLG_2WbBOs", client: "Acme Corp" },
  { id: 2, icon: "picture_as_pdf", fileName: "Q3_Marketing_Report.pdf", size: "4.1 MB", date: "Yesterday", preview: null, client: "Globex Inc" },
  { id: 3, icon: "folder_zip", fileName: "Brand_Assets_2024.zip", size: "156 MB", date: "Oct 12", preview: null, client: "Acme Corp" },
  { id: 4, icon: "description", fileName: "Client_Brief_Final.docx", size: "845 KB", date: "Oct 10", preview: null, client: "Soylent Corp" },
];

// ── Dashboard: Messages/Chat ───────────────────────────

export interface ChatChannel {
  name: string;
  active: boolean;
  unread: number;
}

export const chatChannels: ChatChannel[] = [
  { name: "Rebrand & Web Platform", active: true, unread: 0 },
  { name: "Marketing Assets", active: false, unread: 0 },
  { name: "General Client Chat", active: false, unread: 2 },
];

export interface ChatDM {
  name: string;
  online: boolean;
  avatar: string;
}

export const chatDMs: ChatDM[] = [
  { name: "Sarah Jenkins (PM)", online: true, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrvRKHwxdOJWlJI38FB_hG7VpM43UEcn_Hpp_7X7KU1DuiKZ_YZ7DPiKc6BQAK-cwrXtiLI2z6OK78o7JJY9fw7xio0HP-FzftGHc-4AYAi9auQ2gM53JrsKQrqiuTBVZYx-X5kpjYIoLCfPeFkBXpC4Lj7HhIeUFLnMZeVC-6-q6ObYu69ZoUVH3yt003ABQ36-HHV-Pbkovmi0FMWAUk8vehCUSq-0fBLPTUdspQ6u6rU9Y8ncRrJ-67kDAhkcQOxHFKSz1kudYh" },
  { name: "David Chen (Design)", online: false, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmPn9wgp2sujmRMaN75F-eMVCStsaO8fShu7SDIPJOnnmpN1hYhG7PFk0qiZuDz-Nj8cvyZdx7Bh7A2JeVSPmFn-sewM9043P4HCnjUyzxUIPW8llLu4VBPrDmJqojAsujtN1qdWBnNKMR2gT8Eyt_NWr__CnnqL79YiN8f0B6VU--kMVOZQ49mUj-yp2JAkNMcjwNeGJQiwQpqtqCU90zHvugbeM7r9nBy_OU1Cu25TQ0KuZKYbQcZZrhtOBB80BYpHV0zghcwtMV" },
];

export interface ChatMessage {
  type: "agent" | "client";
  name: string;
  role?: string;
  time: string;
  avatar?: string;
  content: string;
  attachment?: { name: string; size: string; type: string };
}

export const chatMessages: ChatMessage[] = [
  { type: "agent", name: "Sarah Jenkins", role: "G-Stack PM", time: "09:41 AM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2YAdjqDnp2S28ex9w_Csb5zgji99KVzSFsRWxSRast3d1yWFtdPPT3qRNJlW_4EYj9Pow0zJeYBaH3Sa4rAm_jUXa2d5PpPi_-loS8nTiTQAz9OMl96_c_RvKicXJQgB3sGw21k2O_bUq-GlT0VAAPZgHHvOrkVMkTPkgibwazx9-UK2G380elAxhIKpAkGNjh-dLDFvyTq5oxnybydF5wIb89vzdkKFzBnL2h1O00ka2hA6A4IjAZfAWqKPTNpHDbgZEg9XdpBqA", content: "Good morning team! We've finalized the first round of wireframes for the new platform. I've attached the PDF review deck below. Please take a look and let us know your initial thoughts before our sync tomorrow.", attachment: { name: "Acme_Wireframes_v1.pdf", size: "4.2 MB", type: "PDF Document" } },
  { type: "client", name: "You", time: "10:15 AM", content: "Thanks Sarah! These look incredibly clean. The navigation flow makes a lot more sense now. One question: on page 4, the hero section feels a bit cramped. Can we explore opening up the whitespace there?" },
  { type: "agent", name: "David Chen", role: "G-Stack Design", time: "10:22 AM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlVqss3wqtUDSxxN2axZ-I6Uh6nIm3mf9-44JfFvMCfKg0gVWt_In4aZPmS9M4cspdZkLckXxaO9bHoZs12xzGfLTuc-01vOaJ3pBxfMblOdhwLnRZnPoujdvNgvQA7iNZ4ycLVOP98WnM3U6yvpKZI-z45tgk5SVBHVBFPHnGHpj7i6R-_azxhGYRtj1Di_A2FbemTry5XR9T7xKVsbfkdmvZmS2LzpE0grf6XQJlyGoxXpCLS-iWbSoIXZI0ob8d3dW-IUUtBANE", content: "Absolutely. We originally tightened it to keep the primary CTA above the fold on smaller desktop screens, but we can definitely increase the padding to let it breathe more. I'll drop a quick visual revision here shortly." },
];

// ── Dashboard: Projects / Deliverables ─────────────────

export interface Deliverable {
  title: string;
  description: string;
  type: "prototype" | "source" | "document" | "assets";
  status: string;
  image?: string;
  meta?: string;
}

export interface Project {
  id: number;
  clientId: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  due: string;
  started: string;
  tasksRemaining: number;
  deliverables: Deliverable[];
}

export const projects: Project[] = [
  {
    id: 1, clientId: 1, name: "Acme Corp Rebrand & Web Platform", description: "Brand Identity & Web",
    status: "In Progress", progress: 68, due: "Oct 24, 2026", started: "Sep 1", tasksRemaining: 12,
    deliverables: [
      { title: "Interactive Prototype", description: "Fully responsive staging environment with implemented animations and CMS integration.", type: "prototype", status: "V2.4 REVIEW", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAGcE8Qda2zH5_FuHd05cLzxwRlaq4Rj3DJzu893mfTC5yhKGFnyRKLxwaYu9y23YIbyBph2ufNj5gp820Zn1ar436gmq3_fgBEn4jP6gn6l_Prf_0KwUEdtDgPbXwfWSgPXI4djiOY6aickO_p1368LC4KeMqKHbHiNLFmPbN1qdpra2JNY5Bfusdx5Gvj6TJNcf9-QjMyyZcW_0KVHc5esqQya8vWRNjnRsXGR9mxscDxGReWrjOTrjpiAaUMZRCgkDPkXZi5n9B" },
      { title: "Figma Source Files", description: "Complete design system, components, and high-fidelity mockups.", type: "source", status: "", meta: "Design_System.fig / 24 MB" },
      { title: "Brand Guidelines", description: "Typography, color palette rules, and logo usage documentation.", type: "document", status: "", meta: "Download PDF" },
      { title: "Media & Asset Library", description: "Exported SVG icons, high-res photography, and web-optimized graphic assets.", type: "assets", status: "", meta: "SVG WEBP PNG", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwxf3d9WCs7oEsDIZbblq32y8VUtAl8_7or362OLaZOW6xXi4fOgkIBeCDTGd9xNaredW4KsAYQufj7bQwQnCTfGc8JkxBL4Q_GD14o8eBa6rZ01_DnjbdY8Rs0pT6aI0ihyzuABhjY4cFn_WLGh_FRVIBI-2FkxfGURQ7x8xUHxK9tY6S6wO-rTwJKchK9BUos3nr60FaSIY3QvKC1gmpQBs1YzYI3Fw02x8YAjXfwp0sXX7XcJGHiSPUvIOsq9ry08Ew4mUBV4Vq" },
    ],
  },
  {
    id: 2, clientId: 1, name: "Marketing Assets", description: "Brand collateral and marketing materials",
    status: "Pending", progress: 20, due: "Nov 30, 2026", started: "Oct 15", tasksRemaining: 8,
    deliverables: [
      { title: "Social Media Kit", description: "Template designs for LinkedIn, Twitter, and Instagram.", type: "source", status: "" },
      { title: "Brochure Design", description: "Print-ready trifold brochure for trade shows.", type: "document", status: "", meta: "Download PDF" },
    ],
  },
  {
    id: 3, clientId: 2, name: "GlobalTech App UI", description: "Mobile Application",
    status: "In Progress", progress: 30, due: "Dec 05, 2026", started: "Oct 1", tasksRemaining: 15,
    deliverables: [
      { title: "Mobile Wireframes", description: "Low-fidelity wireframes for all core screens.", type: "document", status: "DRAFT", meta: "Figma file" },
      { title: "Design System", description: "Component library and style guide for the app.", type: "source", status: "", meta: "Component_Library.fig / 16 MB" },
    ],
  },
  {
    id: 4, clientId: 3, name: "Soylent Corp Brand Identity", description: "Full brand identity package",
    status: "In Progress", progress: 45, due: "Feb 18, 2027", started: "Nov 1", tasksRemaining: 6,
    deliverables: [
      { title: "Logo Concepts", description: "Three distinct logo directions with variations.", type: "prototype", status: "REVIEW", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwxf3d9WCs7oEsDIZbblq32y8VUtAl8_7or362OLaZOW6xXi4fOgkIBeCDTGd9xNaredW4KsAYQufj7bQwQnCTfGc8JkxBL4Q_GD14o8eBa6rZ01_DnjbdY8Rs0pT6aI0ihyzuABhjY4cFn_WLGh_FRVIBI-2FkxfGURQ7x8xUHxK9tY6S6wO-rTwJKchK9BUos3nr60FaSIY3QvKC1gmpQBs1YzYI3Fw02x8YAjXfwp0sXX7XcJGHiSPUvIOsq9ry08Ew4mUBV4Vq" },
      { title: "Brand Guidelines", description: "Complete brand rules and usage documentation.", type: "document", status: "", meta: "Download PDF" },
    ],
  },
  {
    id: 5, clientId: 3, name: "E-commerce Platform", description: "Online store development",
    status: "At Risk", progress: 20, due: "Jan 30, 2027", started: "Dec 1", tasksRemaining: 22,
    deliverables: [
      { title: "Information Architecture", description: "Sitemap, user flows, and content structure.", type: "document", status: "DRAFT" },
    ],
  },
];

// ── Admin: Clients ─────────────────────────────────────

export interface ClientProject {
  name: string;
  status: string;
  due: string;
  progress: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  projects: ClientProject[];
  since: string;
}

export const adminClients: Client[] = [
  { id: 1, name: "Acme Corp", email: "admin@acmecorp.com", projects: [{ name: "Website Redesign", status: "Active", due: "Oct 24, 2026", progress: 75 }, { name: "Brand Identity", status: "Pending", due: "Nov 10, 2026", progress: 30 }], since: "Jan 2024" },
  { id: 2, name: "Globex Inc", email: "contact@globex.io", projects: [{ name: "Mobile App Dev", status: "Active", due: "Dec 05, 2026", progress: 60 }], since: "Mar 2024" },
  { id: 3, name: "Soylent Corp", email: "hello@soylentcorp.com", projects: [{ name: "Brand Identity", status: "Active", due: "Feb 18, 2027", progress: 45 }, { name: "E-commerce Platform", status: "At Risk", due: "Jan 30, 2027", progress: 20 }], since: "Jun 2024" },
];

// ── Admin: Dashboard Overview ──────────────────────────

export interface AdminMetric {
  icon: string;
  label: string;
  value: string;
  trend: string | null;
  trendUp: boolean;
  sub?: string;
}

export const adminMetrics: AdminMetric[] = [
  { icon: "Users", label: "Total Clients", value: "124", trend: "+12%", trendUp: true },
  { icon: "FolderTree", label: "Active Projects", value: "48", trend: null, trendUp: false },
  { icon: "DollarSign", label: "Revenue (MTD)", value: "$45.2k", trend: "+8%", trendUp: true },
  { icon: "Receipt", label: "Pending Invoices", value: "12", sub: "($12.4k)", trend: null, trendUp: false },
];

export interface MonthlyRevenue {
  month: string;
  value: number;
}

export const adminMonthlyRevenue: MonthlyRevenue[] = [
  { month: "Jan", value: 30 }, { month: "Feb", value: 45 }, { month: "Mar", value: 42 },
  { month: "Apr", value: 50 }, { month: "May", value: 48 }, { month: "Jun", value: 60 },
  { month: "Jul", value: 65 },
];

export interface ProjectStatusSegment {
  label: string;
  value: number;
  color: string;
}

export const adminProjectStatus: ProjectStatusSegment[] = [
  { label: "Active", value: 60, color: "bg-blue-600 dark:bg-blue-500" },
  { label: "Pending", value: 25, color: "bg-slate-300 dark:bg-slate-600" },
  { label: "Completed", value: 15, color: "bg-green-500 dark:bg-green-400" },
];

export interface RecentClientRow {
  name: string;
  initials: string;
  avatarBg: string;
  project: string;
  status: string;
  statusColor: string;
  activity: string;
}

export const adminRecentClients: RecentClientRow[] = [
  { name: "Acme Corp", initials: "A", avatarBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", project: "Website Redesign", status: "Active", statusColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", activity: "2 hours ago" },
  { name: "Globex Inc", initials: "G", avatarBg: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", project: "Mobile App Dev", status: "Pending", statusColor: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400", activity: "1 day ago" },
  { name: "Soylent Corp", initials: "S", avatarBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", project: "Brand Identity", status: "Active", statusColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", activity: "3 days ago" },
];

// ── Admin: Invoices ────────────────────────────────────

export interface AdminInvoiceSummary {
  icon: string;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}

export const adminInvoiceSummaries: AdminInvoiceSummary[] = [
  { icon: "CheckCircle", label: "Total Collected", value: "$142,500.00", sub: "Across 38 invoices" },
  { icon: "Clock", label: "Pending", value: "$24,250.00", sub: "8 invoices awaiting payment", accent: true },
  { icon: "AlertTriangle", label: "Overdue", value: "$8,400.00", sub: "3 invoices past due" },
];

export interface AdminInvoice {
  id: string;
  client: string;
  title: string;
  amount: string;
  status: string;
}

export const adminInvoices: AdminInvoice[] = [
  { id: "INV-2024-089", client: "Acme Corp", title: "Q3 Retainer Services", amount: "$8,250.00", status: "Pending" },
  { id: "INV-2024-088", client: "Globex Inc", title: "Mobile App Phase 1", amount: "$12,400.00", status: "Paid" },
  { id: "INV-2024-085", client: "Soylent Corp", title: "Brand Identity Package", amount: "$8,250.00", status: "Paid" },
  { id: "INV-2024-080", client: "Acme Corp", title: "Consultation Fees", amount: "$1,200.00", status: "Overdue" },
];

// ── Admin: Projects ────────────────────────────────────

export interface AdminProjectGroup {
  client: string;
  initials: string;
  bg: string;
  projects: {
    name: string;
    status: "Active" | "Pending" | "At Risk";
    progress: number;
    due: string;
  }[];
}

export const adminProjectGroups: AdminProjectGroup[] = [
  { client: "Acme Corp", initials: "A", bg: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", projects: [
    { name: "Website Redesign", status: "Active", progress: 75, due: "Oct 24, 2026" },
    { name: "Brand Identity", status: "Pending", progress: 30, due: "Nov 10, 2026" },
  ]},
  { client: "Globex Inc", initials: "G", bg: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", projects: [
    { name: "Mobile App Dev", status: "Active", progress: 60, due: "Dec 05, 2026" },
  ]},
  { client: "Soylent Corp", initials: "S", bg: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", projects: [
    { name: "Brand Identity", status: "Active", progress: 45, due: "Feb 18, 2027" },
    { name: "E-commerce Platform", status: "At Risk", progress: 20, due: "Jan 30, 2027" },
  ]},
];

// ── Admin: Messages ────────────────────────────────────

export interface AdminConversation {
  id: number;
  client: string;
  contact: string;
  subject: string;
  lastMsg: string;
  unread: number;
  date: string;
  avatar: string;
  bg: string;
}

export const adminConversations: AdminConversation[] = [
  { id: 1, client: "Acme Corp", contact: "Jane Doe", subject: "Website wireframes feedback", lastMsg: "Looks great! Let's schedule a call for next week.", unread: 2, date: "2h ago", avatar: "JD", bg: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  { id: 2, client: "Globex Inc", contact: "Mark Lee", subject: "App development timeline", lastMsg: "We need to push the beta launch by two weeks.", unread: 0, date: "1d ago", avatar: "ML", bg: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" },
  { id: 3, client: "Soylent Corp", contact: "Sarah Connor", subject: "Brand guidelines review", lastMsg: "The typography section looks perfect. Approved.", unread: 1, date: "3d ago", avatar: "SC", bg: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
];

// ── Admin: Files ───────────────────────────────────────

export interface AdminFileItem {
  id: number;
  icon: string;
  name: string;
  client: string;
  size: string;
  date: string;
}

export const adminFiles: AdminFileItem[] = [
  { id: 1, icon: "image", name: "Acme_Brand_Assets.zip", client: "Acme Corp", size: "156 MB", date: "Today" },
  { id: 2, icon: "image", name: "Globex_App_Mockups.fig", client: "Globex Inc", size: "24 MB", date: "Yesterday" },
  { id: 3, icon: "pdf", name: "Q3_Report_Soylent.pdf", client: "Soylent Corp", size: "4.1 MB", date: "Oct 12" },
  { id: 4, icon: "doc", name: "Client_Brief_Acme.docx", client: "Acme Corp", size: "845 KB", date: "Oct 10" },
  { id: 5, icon: "zip", name: "Brand_Assets_2024.zip", client: "Soylent Corp", size: "156 MB", date: "Oct 08" },
  { id: 6, icon: "image", name: "Homepage_Hero_v2.jpg", client: "Acme Corp", size: "2.4 MB", date: "Oct 05" },
];

// ── Admin: Analytics ───────────────────────────────────

export interface AnalyticsStat {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: string;
}

export const analyticsStats: AnalyticsStat[] = [
  { label: "Total Users", value: "1,847", change: "+12.5%", up: true, icon: "Users" },
  { label: "Avg. Session Duration", value: "4m 32s", change: "+8.1%", up: true, icon: "Clock" },
  { label: "Page Views (MTD)", value: "48,203", change: "+23.7%", up: true, icon: "Eye" },
  { label: "Bounce Rate", value: "32.1%", change: "-3.2%", up: false, icon: "TrendingDown" },
];

export interface MonthlyStat {
  month: string;
  users: number;
  projects: number;
  revenue: number;
}

export const analyticsMonthlyStats: MonthlyStat[] = [
  { month: "Jan", users: 1200, projects: 32, revenue: 28 },
  { month: "Feb", users: 1350, projects: 36, revenue: 32 },
  { month: "Mar", users: 1420, projects: 38, revenue: 35 },
  { month: "Apr", users: 1580, projects: 42, revenue: 40 },
  { month: "May", users: 1620, projects: 44, revenue: 42 },
  { month: "Jun", users: 1750, projects: 46, revenue: 48 },
  { month: "Jul", users: 1847, projects: 48, revenue: 52 },
];

export interface TopClient {
  name: string;
  revenue: string;
  projects: number;
  messages: number;
}

export const analyticsTopClients: TopClient[] = [
  { name: "Acme Corp", revenue: "$18,450", projects: 3, messages: 24 },
  { name: "Globex Inc", revenue: "$12,400", projects: 2, messages: 18 },
  { name: "Soylent Corp", revenue: "$9,250", projects: 2, messages: 12 },
  { name: "Initech", revenue: "$7,800", projects: 1, messages: 8 },
  { name: "Hooli", revenue: "$6,200", projects: 1, messages: 5 },
];

// ── Dashboard: Settings ────────────────────────────────

export interface SettingsProject {
  id: number;
  name: string;
  role: string;
}

export const settingsProjects: SettingsProject[] = [
  { id: 1, name: "Rebrand & Web Platform", role: "Client" },
  { id: 2, name: "Marketing Assets", role: "Client" },
  { id: 3, name: "General Consulting", role: "Client" },
];

export interface NotificationPref {
  key: string;
  label: string;
  desc: string;
  icon: string;
}

export const notificationPrefs: NotificationPref[] = [
  { key: "project_updates", label: "Project Updates", desc: "When milestones are completed or status changes", icon: "Globe" },
  { key: "file_uploads", label: "File Uploads", desc: "When new files or assets are shared with you", icon: "FileUp" },
  { key: "messages", label: "Messages", desc: "When you receive a new message from the team", icon: "MessageSquare" },
  { key: "review_requests", label: "Review Requests", desc: "When your feedback or approval is needed", icon: "Eye" },
  { key: "weekly_digest", label: "Weekly Digest", desc: "A summary of all activity from the past week", icon: "Clock" },
];

export interface ActiveSession {
  device: string;
  active: boolean;
  time: string;
}

export const activeSessions: ActiveSession[] = [
  { device: "Chrome on macOS", active: true, time: "Current session" },
  { device: "Safari on iPhone", active: false, time: "Last active 2h ago" },
];
