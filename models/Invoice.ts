import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "paid", "overdue", "cancelled"],
        default: "pending",
    },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
