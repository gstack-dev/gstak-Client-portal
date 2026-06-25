import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploaderRole: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
}, { timestamps: true });

fileSchema.index({ projectId: 1, createdAt: -1 });
fileSchema.index({ uploadedBy: 1, createdAt: -1 });
fileSchema.index({ createdAt: -1 });

export default mongoose.models.File || mongoose.model("File", fileSchema);
