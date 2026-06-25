import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    resetPasswordToken: { 
        type: String, 
        required: false 
    },
    resetPasswordExpires: { 
        type: Date, 
        required: false 
    },
    image: { type: String, required: false },
    clientType: {
        type: String,
        required: false,
        enum: ["Starter", "Professional", "Agency"]
    },
    company: { type: String, required: false },
    phone: { type: String, required: false },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model("User", userSchema);