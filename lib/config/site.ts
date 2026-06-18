export const siteConfig = {
  name: "G-Stack",
  fullName: "G-Stack Digital Agency",
  description:
    "Premium client portal for digital agencies. Manage projects, share files, send invoices, and communicate with clients in one unified workspace.",
  tagline: "High-performance SaaS aesthetic for elite digital execution.",
  url:
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    "https://gstack-client-portal.vercel.app",
  adminEmail: "george.gstack@gmail.com",
  locales: ["en", "ar"] as const,
  defaultLocale: "en" as const,
  social: {
    twitter: "@gstack",
  },
};
