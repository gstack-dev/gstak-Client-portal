"use client";

import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateResetToken } from "@/app/actions/resetPassword";

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address.");
            setIsSubmitting(false);
            return;
        }

        // 2. Call your Server Action
        try {
            await generateResetToken(email);
            setIsSubmitted(true);
        } catch (err: unknown) {
            // Check if the caught error is actually a standard Error object
            if (err instanceof Error) {
                setError(err.message);
            } else {
                // Fallback for weird edge cases (e.g., if a string was thrown)
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#020817] relative p-margin-mobile md:p-margin-desktop overflow-hidden transition-colors duration-300">
            
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-fixed/30 dark:bg-blue-900/20 blur-[120px]"></div>
                <div className="absolute top-[60%] right-[-10%] w-[40%] h-[60%] rounded-full bg-primary-fixed/20 dark:bg-emerald-900/10 blur-[150px]"></div>
            </div>

            <main className="w-full max-w-[440px] relative z-10 flex flex-col items-center">
                
                {/* Header / Logo */}
                <div className="text-center mb-xl">
                    <h1 className="font-headline-md text-headline-md text-primary dark:text-slate-50 tracking-tight">
                        G-Stack
                    </h1>
                </div>

                {/* Card */}
                <div className="w-full glass-panel dark:bg-[#0F172A]/80 dark:border-slate-800 rounded-2xl p-xl bg-surface-container-lowest shadow-xl dark:shadow-2xl dark:shadow-black/50 backdrop-blur-xl">
                    
                    {!isSubmitted ? (
                        <>
                            <div className="mb-lg">
                                <Link 
                                    href="/login" 
                                    className="inline-flex items-center text-sm font-label-md text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-4"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to login
                                </Link>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-slate-50">
                                    Reset Password
                                </h2>
                                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400 mt-xs">
                                    Enter your email address and we will send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-lg">
                                {error && (
                                    <div className="p-3 bg-error-container text-on-error-container text-sm rounded-md border border-red-200 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-sm">
                                    <label htmlFor="email" className="font-label-md text-label-md text-on-surface dark:text-slate-200 block">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground dark:text-slate-500">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder="name@company.com"
                                            type="email"
                                            required
                                            className="pl-10 py-6 bg-surface dark:bg-[#020817] border-outline-variant dark:border-slate-800 font-body-md text-body-md text-on-surface dark:text-slate-50 placeholder:text-on-surface-variant/50 dark:placeholder:text-slate-600 focus-visible:ring-ring dark:focus-visible:ring-blue-600"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full py-6 font-label-md text-label-md shadow-sm text-white dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending Link..." : "Send Reset Link"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-slate-50 mb-2">
                                Check your email
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400 mb-6">
                                If an account exists for that email, we have sent password reset instructions.
                            </p>
                            <Link href="/login">
                                <Button 
                                    variant="outline"
                                    className="w-full py-6 border-outline-variant dark:border-slate-800 bg-surface-container-lowest dark:bg-[#020817] hover:bg-surface-container-low dark:hover:bg-slate-800 font-label-md text-label-md text-on-surface dark:text-slate-200 transition-colors duration-200"
                                >
                                    Return to Login
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}