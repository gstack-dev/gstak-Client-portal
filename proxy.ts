import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/lib/i18n";

const COOKIE_NAME = "NEXT_LOCALE";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // --- Locale detection ---
  if (!req.cookies.has(COOKIE_NAME)) {
    const acceptLanguage = req.headers.get("Accept-Language") ?? "";
    const preferred = acceptLanguage
      .split(",")
      .map((l) => l.split(";")[0].trim().split("-")[0])
      .find((l) => isValidLocale(l));
    const locale =
      preferred && isValidLocale(preferred) ? preferred : defaultLocale;

    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, locale, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
    });
    return response;
  }

  const localeCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (localeCookie && !isValidLocale(localeCookie)) {
    const response = NextResponse.next();
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
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  if (pathname.startsWith("/login") && isLoggedIn) {
    if (req.auth?.user?.role === "admin") {
      return Response.redirect(new URL("/admin", req.nextUrl));
    }
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (
    pathname.startsWith("/admin") &&
    isLoggedIn &&
    req.auth?.user?.role === "client"
  ) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (
    pathname.startsWith("/dashboard") &&
    isLoggedIn &&
    req.auth?.user?.role === "admin"
  ) {
    return Response.redirect(new URL("/admin", req.nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
