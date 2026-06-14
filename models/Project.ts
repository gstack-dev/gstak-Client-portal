import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ["planning", "in_progress", "review", "completed", "on_hold", "cancelled"],
        default: "planning",
    },
    progressPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    deadLine: Date,
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", projectSchema);