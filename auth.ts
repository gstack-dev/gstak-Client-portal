import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectMongoDB } from "@/lib/mongodb"
import { rateLimit } from "@/lib/rate-limiter"
import User from "@/models/User"
import { recordAuditEvent } from "@/lib/audit"

function getIPFromRequest(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
            rememberMe: { label: "Remember Me", type: "text" },
        },
        async authorize(credentials, request) {
            if (!credentials?.email || !credentials?.password) {
                return null;
            }

            const ip = request ? getIPFromRequest(request) : "unknown";

            const limitResult = await rateLimit(`login:${ip}`, 10, 60_000);
            if (!limitResult.allowed) {
                recordAuditEvent({ action: "login.rate_limited", email: credentials.email as string, ip });
                return null;
            }

            await connectMongoDB();

            const user = await User.findOne({ email: credentials.email });

            if (!user) {
                recordAuditEvent({ action: "login.failure", email: credentials.email as string, ip, success: false, error: "User not found" });
                return null;
            }

            if (!user.password) {
                recordAuditEvent({ action: "login.failure", email: credentials.email as string, ip, success: false, error: "No password set" });
                return null;
            }

            const passwordsMatch = await bcrypt.compare(
                credentials.password as string,
                user.password
            );

            if (!passwordsMatch) {
                recordAuditEvent({ action: "login.failure", email: credentials.email as string, ip, success: false, error: "Wrong password" });
                return null;
            }

            recordAuditEvent({ action: "login.success", userId: user._id.toString(), email: user.email, role: user.role, ip });

            return {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                name: user.name,
                isRememberMe: credentials.rememberMe === "true",
            };
        }
        })
    ],
    trustHost: true,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account }) {
        if (account?.provider === "google") {
            await connectMongoDB();

            const existingUser = await User.findOne({ email: user.email });

            if (!existingUser) {
                return "/login?error=AccessDenied";
            }
            return true;
        }
        return true;
        },

        async jwt({ token, user }) {
        if (user) {
            await connectMongoDB();
            const dbUser = await User.findOne({ email: user.email });
            token.role = dbUser?.role || "client";
            token.name = dbUser?.name;
            token.email = dbUser?.email;
            token.id = dbUser?._id.toString();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isRememberMe = (user as any).isRememberMe;
            if (isRememberMe === false) {
                token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
            }

            if (dbUser?.passwordChangedAt) {
                token.passwordChangedAt = Math.floor(
                    new Date(dbUser.passwordChangedAt as Date).getTime() / 1000
                );
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pwa = (token as any).passwordChangedAt;
        if (pwa && token.iat) {
            if (token.iat < pwa) {
                return { ...token, exp: Math.floor(Date.now() / 1000) - 1 };
            }
        }

        return token;
        },

        async session({ session, token }) {
        if (token?.role && session.user) {
            session.user.role = token.role as string;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
            session.user.id = token.id as string;
        }
        return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
})
