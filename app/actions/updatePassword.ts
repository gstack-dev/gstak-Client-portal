"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import { rateLimitAction } from "@/lib/rate-limiter";
import User from "@/models/User";

export async function updatePassword(userId: string, newPasswordRaw: string, resetToken: string) {
    await rateLimitAction("updatePassword", 5, 60_000);
    try {
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            return { error: "Invalid user ID." };
        }

        if (newPasswordRaw.length < 8) {
            return { error: "Password must be at least 8 characters." };
        }

        await connectMongoDB();

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const user = await User.findOne({
            _id: userId,
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return { error: "Invalid or expired reset token. Please request a new password reset link." };
        }

        const hashedPassword = await bcrypt.hash(newPasswordRaw, 10);

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