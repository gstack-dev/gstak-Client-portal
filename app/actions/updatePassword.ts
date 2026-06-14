"use server";

import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function updatePassword(userId: string, newPasswordRaw: string) {
    try {
        await connectMongoDB();

        const user = await User.findById(userId);

        if (!user) {
            return { error: "User not found." };
        }

        // 1. Hash the new password securely
        const hashedPassword = await bcrypt.hash(newPasswordRaw, 10);

        // 2. Update the password and instantly invalidate the reset tokens
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Error updating password:", error);
        return { error: "Failed to update password. Please try again." };
    }
}