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
}, { timestamps: true });


export default mongoose.models.User || mongoose.model("User", userSchema);