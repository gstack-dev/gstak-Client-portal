import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // 1. Group all your protected routes here using startsWith
    const isProtectedRoute = 
        pathname.startsWith("/dashboard") || 
        pathname.startsWith("/admin");

    // 2. If they try to access a protected route without logging in -> Kick to /login
    if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }

    // 3. If they are already logged in and try to view the login page -> Send to their portal
    if (pathname.startsWith("/login") && isLoggedIn) {
        if(req.auth?.user?.role === "admin") {
            return Response.redirect(new URL("/admin", req.nextUrl));
        }
        return Response.redirect(new URL("/dashboard", req.nextUrl)); 
    }

    // 4. If they are logged in as client and try to access admin -> Kick to dashboard
    if (pathname.startsWith("/admin") && isLoggedIn && req.auth?.user?.role === "client") {
        return Response.redirect(new URL("/dashboard", req.nextUrl));
    }

    // 5. If they are logged in as admin and try to access dashboard -> Kick to admin
    if (pathname.startsWith("/dashboard") && isLoggedIn && req.auth?.user?.role === "admin") {
        return Response.redirect(new URL("/admin", req.nextUrl));
    }

    return; 
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};