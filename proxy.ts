import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/lib/i18n";

const COOKIE_NAME = "NEXT_LOCALE";

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.blob.vercel-storage.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.blob.vercel-storage.com",
  "frame-src https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

function addSecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  response.headers.set("Content-Security-Policy", CSP_DIRECTIVES.join("; "));
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const response = NextResponse.next();
  addSecurityHeaders(response);

  // --- Locale detection ---
  if (!req.cookies.has(COOKIE_NAME)) {
    const acceptLanguage = req.headers.get("Accept-Language") ?? "";
    const preferred = acceptLanguage
      .split(",")
      .map((l) => l.split(";")[0].trim().split("-")[0])
      .find((l) => isValidLocale(l));
    const locale =
      preferred && isValidLocale(preferred) ? preferred : defaultLocale;

    response.cookies.set(COOKIE_NAME, locale, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
    });
    return response;
  }

  const localeCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (localeCookie && !isValidLocale(localeCookie)) {
    response.cookies.set(COOKIE_NAME, defaultLocale, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
    });
    return response;
  }

  // --- Auth-based route protection ---
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/login") && isLoggedIn) {
    if (req.auth?.user?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (
    pathname.startsWith("/admin") &&
    isLoggedIn &&
    req.auth?.user?.role === "client"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (
    pathname.startsWith("/dashboard") &&
    isLoggedIn &&
    req.auth?.user?.role === "admin"
  ) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
