"use server";

import crypto from "crypto";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendResetEmail } from "@/lib/email";

export async function generateResetToken(email: string) {
    await connectMongoDB();

    const user = await User.findOne({ email });

    // Security best practice: Even if the user doesn't exist, we return success 
    // so hackers can't use this form to guess which emails are registered.
    if (!user) {
        return { success: true };
    }

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