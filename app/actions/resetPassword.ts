"use server";

import crypto from "crypto";
import { connectMongoDB } from "@/lib/mongodb";
import { rateLimitAction } from "@/lib/rate-limiter";
import User from "@/models/User";
import { sendResetEmail } from "@/lib/email";

export async function generateResetToken(email: string) {
    await rateLimitAction("generateResetToken", 5, 60_000);
    await connectMongoDB();

    const user = await User.findOne({ email });

    if (!user) {
        console.warn("Password reset requested for non-existent account");
        return { success: true };
    }

    console.log("Password reset token generated");

    // 1. Generate a random, secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. Hash the token before saving it to the database (prevents database leaks)
    const passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // 3. Set token to expire in 1 hour
    const passwordResetExpires = new Date(Date.now() + 3600000); 

    // 4. Save to MongoDB
    user.resetPasswordToken = passwordResetToken;
    user.resetPasswordExpires = passwordResetExpires;
    await user.save();

    await sendResetEmail(email, resetToken);

    return { success: true };
}