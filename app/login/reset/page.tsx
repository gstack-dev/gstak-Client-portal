import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import ResetPasswordForm from "./ResetPasswordForm";
import Link from "next/link";
import { XCircle } from "lucide-react"; // Added an error icon
import { Button } from "@/components/ui/button"; // Brought in your Shadcn button

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token: string }>;
}) {
    const params = await searchParams;

    // 1. Check if the token exists in the URL
    if (!params.token) {
        return (
            <InvalidTokenUI message="Invalid or missing token. Please request a new password reset link." />
        );
    }

    // 2. Hash the URL token so we can compare it to the database
    const hashedToken = crypto
        .createHash("sha256")
        .update(params.token)
        .digest("hex");

    await connectMongoDB();

    // 3. Find the user with this exact token AND ensure it hasn't expired
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return (
            <InvalidTokenUI message="This password reset link is invalid or has expired." />
        );
    }

    // 4. If valid, render the client-side form to accept the new password
    return <ResetPasswordForm userId={user._id.toString()} />;
}

// Extracted the UI into a clean helper component for reuse
function InvalidTokenUI({ message }: { message: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#020817] relative p-margin-mobile md:p-margin-desktop overflow-hidden transition-colors duration-300">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-fixed/30 dark:bg-blue-900/20 blur-[120px]"></div>
                <div className="absolute top-[60%] right-[-10%] w-[40%] h-[60%] rounded-full bg-primary-fixed/20 dark:bg-emerald-900/10 blur-[150px]"></div>
            </div>

            <main className="w-full max-w-[440px] relative z-10 flex flex-col items-center">
                <div className="text-center mb-xl">
                    <h1 className="font-headline-md text-headline-md text-primary dark:text-slate-50 tracking-tight">
                        G-Stack
                    </h1>
                </div>

                <div className="w-full glass-panel dark:bg-[#0F172A]/80 dark:border-slate-800 rounded-2xl p-xl bg-surface-container-lowest shadow-xl dark:shadow-2xl dark:shadow-black/50 backdrop-blur-xl text-center py-10">
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    
                    <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-slate-50 mb-2">
                        Link Expired
                    </h2>
                    
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400 mb-8">
                        {message}
                    </p>
                    
                    {/* Fixed the href to point to the correct forgot-password route */}
                    <Link href="/forgot-password" className="w-full block">
                        <Button 
                            className="w-full py-6 font-label-md text-label-md shadow-sm text-white dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                        >
                            Request New Link
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}