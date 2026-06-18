import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectMongoDB } from "@/lib/mongodb" // Import your DB client
import User from "@/models/User"

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
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                return null;
            }

            await connectMongoDB();

            const user = await User.findOne({ email: credentials.email });

            if (!user) {
                return null;
            }

            if (!user.password) {
                return null;
            }

            const passwordsMatch = await bcrypt.compare(
                credentials.password as string,
                user.password
            );

            if (!passwordsMatch) {
                return null;
            }

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
    pages: {
        signIn: "/login", // Tells Auth.js to use your custom page for logins and errors
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
        return true; // Credentials provider returns true by default
        },

        // 2. Attach the role + basic info to the JWT Token
        // NOTE: image is NOT stored in JWT — base64 data URLs are too large for cookies.
        // The client fetches the image separately via getProfile() server action.
        async jwt({ token, user }) {
        // 'user' is only passed in on sign-in; on subsequent calls it's undefined
        if (user) {
            await connectMongoDB();
            const dbUser = await User.findOne({ email: user.email });
            token.role = dbUser?.role || "client";
            token.name = dbUser?.name;
            token.email = dbUser?.email;
            token.id = dbUser?._id.toString();

            const isRememberMe = (user as any).isRememberMe;
            if (isRememberMe === false) { 
                // token.exp is in seconds since epoch
                token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60); 
            }
        }
        return token;
        },

        // 3. Expose the role to the frontend session
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
        maxAge: 30 * 24 * 60 * 60, // 30 Days
    },
})