"use server";

import crypto from "crypto";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

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

    // 5. Construct the reset URL
    // In production, this should be your actual domain (e.g., https://g-stack.com)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/login/reset?token=${resetToken}`;

    // TODO: Actually send the email here using Resend, SendGrid, or Nodemailer
    // For now, we will just log it to your terminal so you can click it!
    console.log("=========================================");
    console.log(`🔐 SEND PASSWORD RESET EMAIL TO: ${email}`);
    console.log(`🔗 RESET LINK: ${resetUrl}`);
    console.log("=========================================");

    return { success: true };
}