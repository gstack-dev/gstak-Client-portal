import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["file_upload", "invoice_created", "invoice_paid", "status_change"],
    required: true,
  },
  message: { type: String, required: true },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  },
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ toUser: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
