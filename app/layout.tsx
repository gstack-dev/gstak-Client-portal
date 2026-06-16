import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "@/app/globals.css";
// 1. Import your new ThemeProvider
import { ThemeProvider } from "@/components/ThemeProvider";

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

export const metadata: Metadata = {
  title: "G-Stack Agency Workspace",
  description: "High-performance SaaS aesthetic for elite digital execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Add suppressHydrationWarning here
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head />
      <body className={`${plusJakartaSans.variable} ${inter.variable} antialiased selection:bg-primary-shadcn selection:text-primary-foreground`}>
        
        {/* 3. Wrap your app */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}