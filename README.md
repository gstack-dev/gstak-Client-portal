# G-Stack Client Portal

A full-featured client portal for digital agencies. Manage projects, share files, send invoices, and communicate with clients — all in one unified workspace.

Built with **Next.js 16**, **MongoDB**, and **NextAuth.js v5**.

---

## Features

### For Agencies (Admin)

| Feature | Description |
|---------|-------------|
| **Dashboard** | Real-time metrics: total clients, active projects, revenue, pending invoices |
| **Client Management** | Create, edit, and delete client accounts with assigned projects |
| **Project Management** | Full CRUD with status tracking (Planning, In Progress, Review, Completed, On Hold, Cancelled) |
| **File Management** | Upload, organize, and control files per project |
| **Messaging** | Direct 1-on-1 chat with every client |
| **Invoices & Billing** | Create, manage, and track invoices with payment status |
| **Analytics** | Revenue charts, top clients, monthly trends |

### For Clients

| Feature | Description |
|---------|-------------|
| **Dashboard** | Active projects, recent messages, upcoming deadlines, invoices overview |
| **Projects** | View project details, progress tracking, associated files and invoices |
| **Files** | Upload and download project files (self-service) |
| **Messages** | Direct communication with the agency |
| **Invoices** | View invoices, mark as paid |
| **Settings** | Profile, theme (light/dark/system), language, password, active sessions |

### Platform

- ✅ Authentication (email/password + Google OAuth)
- ✅ Password reset via email
- ✅ Role-based access (Admin / Client)
- ✅ Dark/Light/System theme
- ✅ i18n — English + Arabic (RTL)
- ✅ Session tracking across devices
- ✅ Notifications (file uploads, invoice events)
- ✅ SEO optimized (Open Graph, sitemap, robots, JSON-LD)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.9 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB with Mongoose 9 |
| **Auth** | NextAuth.js v5 (Credentials + Google OAuth) |
| **Forms** | React Hook Form + Zod |
| **Styling** | Tailwind CSS v4 + Shadcn UI |
| **Fonts** | Plus Jakarta Sans (headings), Inter (body) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Icons** | Lucide React |

---

## Project Structure

```
├── app/
│   ├── ()/                        # Landing page (public)
│   ├── login/                     # Auth pages
│   │   ├── page.tsx               # Sign in
│   │   ├── forget/                # Forgot password
│   │   └── reset/                 # Reset password
│   ├── admin/                     # Admin dashboard (7 pages)
│   │   ├── clients/               # Client CRUD
│   │   ├── projects/              # Project management
│   │   ├── invoices/              # Invoice management
│   │   ├── files/                 # File management
│   │   ├── messages/              # Messaging
│   │   └── analytics/             # Revenue & metrics
│   ├── dashboard/                 # Client portal (6 pages)
│   │   ├── projects/              # View projects
│   │   ├── invoices/              # View invoices
│   │   ├── files/                 # File upload/download
│   │   ├── messages/              # Chat with admin
│   │   └── settings/              # Profile, theme, security
│   ├── api/                       # API routes
│   │   ├── auth/[...nextauth]     # NextAuth handler
│   │   ├── clients/               # Client list API
│   │   └── clients/[id]/projects  # Client projects API
│   └── actions/                   # Server actions
│       ├── admin.ts               # Admin metrics & analytics
│       ├── client.ts              # Client CRUD
│       ├── files.ts               # File operations + notifications
│       ├── invoices.ts            # Invoice CRUD + stats
│       ├── messages.ts            # Chat operations
│       ├── user.ts                # Profile, projects, sessions
│       ├── resetPassword.ts       # Generate reset token
│       └── updatePassword.ts      # Update password
├── components/
│   ├── ui/                        # Shadcn UI primitives
│   └── web/                       # App components
│       ├── Home/                  # Landing page sections
│       ├── dashboard/             # Client sidebar, topbar, panels
│       └── admin/                 # Admin sidebar
├── lib/
│   ├── config/site.ts             # Site configuration
│   ├── mongodb.ts                 # DB connection (cached)
│   ├── email.ts                   # Nodemailer transporter
│   ├── i18n.ts                    # Locale utilities
│   └── utils.ts                   # cn() helper
├── models/                        # Mongoose schemas
│   ├── User.ts
│   ├── Project.ts
│   ├── Message.ts
│   ├── Notification.ts
│   ├── File.ts
│   ├── Invoice.ts
│   └── LoginSession.ts
├── schema/                        # Zod validation schemas
│   ├── client.ts
│   └── project.ts
├── types/                         # TypeScript type definitions
├── locales/                       # i18n translation files
│   ├── en.json
│   └── ar.json
├── auth.ts                        # NextAuth configuration
├── middleware.ts                  # Locale detection
├── proxy.ts                       # Route protection
└── public/
    └── uploads/                   # File storage
```

---

## Models

### User
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Optional |
| `email` | String | Optional, used for login |
| `password` | String | bcrypt-hashed |
| `role` | Enum | `"admin"` or `"user"` (client) |
| `clientType` | Enum | `"Starter"`, `"Professional"`, `"Agency"` |
| `company` | String | Optional |
| `phone` | String | Optional |
| `image` | String | Base64 data URL |
| `resetPasswordToken` | String | For password reset flow |
| `resetPasswordExpires` | Date | Token expiration |

### Project
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | |
| `description` | String | |
| `status` | Enum | `planning`, `in_progress`, `review`, `completed`, `on_hold`, `cancelled` |
| `progressPercentage` | Number | 0–100 |
| `deadLine` | Date | |
| `clientId` | ObjectId | Ref: `User` |

### Message
| Field | Type | Notes |
|-------|------|-------|
| `senderId` | ObjectId | Ref: `User` |
| `receiverId` | ObjectId | Ref: `User` |
| `content` | String | |
| `read` | Boolean | Default: `false` |

### Notification
| Field | Type | Notes |
|-------|------|-------|
| `type` | Enum | `file_upload`, `invoice_created`, `invoice_paid` |
| `fromUser` | ObjectId | Ref: `User` |
| `toUser` | ObjectId | Ref: `User` |
| `projectId` | ObjectId | Optional, Ref: `Project` |
| `fileId` | ObjectId | Optional, Ref: `File` |
| `invoiceId` | ObjectId | Optional, Ref: `Invoice` |
| `read` | Boolean | Default: `false` |

### File
| Field | Type | Notes |
|-------|------|-------|
| `fileName` | String | Unique server-side name |
| `originalName` | String | Original uploaded filename |
| `size` | Number | Bytes |
| `mimeType` | String | |
| `projectId` | ObjectId | Ref: `Project` |
| `uploadedBy` | ObjectId | Ref: `User` |
| `uploaderRole` | Enum | `"admin"` or `"user"` |

### Invoice
| Field | Type | Notes |
|-------|------|-------|
| `clientId` | ObjectId | Ref: `User` |
| `projectId` | ObjectId | Optional, Ref: `Project` |
| `title` | String | |
| `amount` | Number | |
| `status` | Enum | `pending`, `paid`, `overdue`, `cancelled` |
| `dueDate` | Date | |
| `paidAt` | Date | Optional |

### LoginSession
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Ref: `User` |
| `device` | String | |
| `ip` | String | |
| `userAgent` | String | |
| `loggedInAt` | Date | |
| `lastActiveAt` | Date | |

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- Google OAuth credentials (optional, for Google SSO)
- Gmail app password (optional, for email)

### Environment Variables

Copy these to `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/Portal
AUTH_SECRET=<generate with: openssl rand -hex 32>
AUTH_GOOGLE_ID=<Google OAuth client ID>
AUTH_GOOGLE_SECRET=<Google OAuth client secret>
GMAIL_USER=<your-email@gmail.com>
GMAIL_APP_PASSWORD=<Gmail app password>
NEXTAUTH_URL=http://localhost:3000
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed Data

The first user is created via the admin panel at `/admin/clients`. Sign in with an existing admin account or use the Google OAuth login (if the email is registered as admin in the database).

---

## Role System

| Route | Access |
|-------|--------|
| `/` | Public |
| `/login*` | Public |
| `/admin/*` | Admin only |
| `/dashboard/*` | Client only |

- **Admins** are redirected from `/dashboard/*` to `/admin/*`
- **Clients** are redirected from `/admin/*` to `/dashboard/*`
- Unauthenticated users are redirected to `/login`

---

## Internationalization

- Locales: **English** (en) and **Arabic** (ar) with RTL support
- Detection: `Accept-Language` header → `NEXT_LOCALE` cookie
- Translation files: `locales/en.json` and `locales/ar.json`

---

## SEO & Social

- Open Graph images auto-generated at `/opengraph-image.png`
- Sitemap at `/sitemap.xml`
- Robots config at `/robots.txt`
- Web manifest at `/manifest.webmanifest`
- Structured data ready for Organization schema

---

## Deployment

The app can be deployed on any platform that supports Next.js:

### Vercel

```bash
npm i -g vercel
vercel
```

Set all environment variables in the Vercel dashboard. File uploads (`public/uploads/`) should use an external storage service (S3, R2, etc.) in production.

---

## License

Private — G-Stack Digital Agency
