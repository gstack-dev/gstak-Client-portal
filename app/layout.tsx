import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { cookies } from "next/headers";
import {
  isValidLocale,
  getDictionary,
  getDir,
  defaultLocale,
  type Locale,
} from "@/lib/i18n";
import { siteConfig } from "@/lib/config/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = siteConfig.url;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1221" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteConfig.fullName,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "agency client portal",
    "project management",
    "client communication",
    "file sharing",
    "invoice management",
    "digital agency",
    "G-Stack",
  ],
  authors: [{ name: "George G-Stack" }],
  creator: "G-Stack",
  publisher: "G-Stack Digital Agency",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_AE"],
    url: baseUrl,
    siteName: siteConfig.fullName,
    title: siteConfig.fullName,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.fullName,
    description: siteConfig.description,
    images: ["/opengraph-image.png"],
    creator: siteConfig.social.twitter,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: baseUrl,
    languages: {
      en: `${baseUrl}/en`,
      ar: `${baseUrl}/ar`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeRaw = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;
  const locale: Locale = isValidLocale(localeRaw) ? localeRaw : defaultLocale;
  const dictionary = await getDictionary(locale);
  const dir = getDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head />
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} antialiased selection:bg-primary-shadcn selection:text-primary-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider dictionary={dictionary}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
