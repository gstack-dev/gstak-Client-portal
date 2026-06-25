"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Mail, Lock } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { siteConfig } from "@/lib/config/site";
import GoogleSignInButton from "@/components/web/GoogleSingInButton";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslation } from "@/components/LanguageProvider";

const loginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long.",
    }),
    rememberMe: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error");
    const router = useRouter();
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });
    
    async function onSubmit(data: LoginFormValues) {
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe ? "true" : "false", // Convert to string
            redirect: false,
        });

        if (result?.error) {
            form.setError("root", {
                type: "manual",
                message: "Invalid email or password. Please try again.",
            });
        } else {
            router.push("/dashboard");
        }
    }

    return (
        // Added dark:bg-[#020817] for a deep, premium background
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
                {t("auth.gStack")}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400 mt-sm">
                {t("auth.premiumServices")}
            </p>
            </div>

            {/* Login Card - Mapped to Midnight Navy in dark mode */}
            <div className="w-full glass-panel dark:bg-[#0F172A]/80 dark:border-slate-800 rounded-2xl p-xl bg-surface-container-lowest shadow-xl dark:shadow-2xl dark:shadow-black/50 backdrop-blur-xl">
            <div className="mb-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-slate-50">
                {t("auth.welcomeBack")}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400 mt-xs">
                {t("auth.welcomeDesc")}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-lg">
                
                {form.formState.errors.root && (
                    <div className="p-3 bg-error-container text-on-error-container text-sm rounded-md border border-red-200">
                        {form.formState.errors.root.message}
                    </div>
                )}
                
                {urlError === "AccessDenied" && (
                    <div className="p-3 bg-error-container text-on-error-container text-sm rounded-md border border-red-200">
                        {t("auth.accessDenied")}
                    </div>
                )}

                {/* Email Field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem className="space-y-sm">
                        <FormLabel className="font-label-md text-label-md text-on-surface dark:text-slate-200">
                        {t("auth.email")}
                        </FormLabel>
                        <FormControl>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground dark:text-slate-500">
                            <Mail className="h-5 w-5" />
                            </div>
                            <Input
                            placeholder={t("auth.emailPlaceholder")}
                            type="email"
                            className="pl-10 py-6 bg-surface dark:bg-[#020817] border-outline-variant dark:border-slate-800 font-body-md text-body-md text-on-surface dark:text-slate-50 placeholder:text-on-surface-variant/50 dark:placeholder:text-slate-600 focus-visible:ring-ring dark:focus-visible:ring-blue-600"
                            {...field}
                            />
                        </div>
                        </FormControl>
                        <FormMessage className="text-error dark:text-red-400 font-body-sm text-[13px]" />
                    </FormItem>
                    )}
                />

                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem className="space-y-sm">
                        <FormLabel className="font-label-md text-label-md text-on-surface dark:text-slate-200">
                        {t("auth.password")}
                        </FormLabel>
                        <FormControl>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground dark:text-slate-500">
                            <Lock className="h-5 w-5" />
                            </div>
                            <Input
                            placeholder={t("auth.passwordPlaceholder")}
                            type="password"
                            className="pl-10 py-6 bg-surface dark:bg-[#020817] border-outline-variant dark:border-slate-800 font-body-md text-body-md text-on-surface dark:text-slate-50 placeholder:text-on-surface-variant/50 dark:placeholder:text-slate-600 focus-visible:ring-ring dark:focus-visible:ring-blue-600"
                            {...field}
                            />
                        </div>
                        </FormControl>
                        <FormMessage className="text-error dark:text-red-400 font-body-sm text-[13px]" />
                    </FormItem>
                    )}
                />

                {/* Actions */}
                <div className="flex items-center justify-between mt-sm mb-lg">
                    <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="dark:border-slate-700 dark:data-[state=checked]:bg-blue-600 dark:data-[state=checked]:border-blue-600"
                            />
                        </FormControl>
                        <FormLabel className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-300 cursor-pointer font-normal mt-0">
                            {t("auth.rememberMe")}
                        </FormLabel>
                        </FormItem>
                    )}
                    />
                    
                    <div className="text-sm">
                    <Link
                        href="/login/forget"
                        className="font-label-md text-label-md text-primary dark:text-white hover:opacity-80 dark:hover:text-blue-400 transition-opacity duration-200"
                    >
                        {t("auth.forgotPassword")}
                    </Link>
                    </div>
                </div>

                {/* Submit Button */}
                <Button 
                    type="submit" 
                    className="w-full py-6 font-label-md text-label-md shadow-sm text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white transition-colors"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
                </Button>
                </form>
            </Form>

            {/* Divider */}
            <div className="mt-lg relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-surface-container-highest dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center">
                <span className="px-sm bg-surface-container-lowest dark:bg-[#0F172A] font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">
                    {t("auth.orContinueWith")}
                </span>
                </div>
            </div>

            {/* SSO Options */}
            <GoogleSignInButton />

            <div className="mt-xl text-center">
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">
                {t("auth.noAccount")}{" "}
                <Link target="_blank" href={`mailto:${siteConfig.adminEmail}?subject=G-Stack%20Portal%20Access%20Request`} className="font-label-md text-label-md text-primary dark:text-white hover:underline dark:hover:text-blue-400 transition-all">
                    {t("auth.contactAdmin")}
                </Link>
                </p>
            </div>
            </div>
            
        </main>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}