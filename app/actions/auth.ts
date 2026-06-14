// app/actions/auth.ts
"use server";

import { signIn } from "@/auth";

export async function loginWithGoogle() {
    // Ensure the user is redirected to the workspace after logging in
    await signIn("google", { redirectTo: "/" });
}