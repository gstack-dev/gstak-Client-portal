import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
}, { timestamps: false });

rateLimitSchema.index({ key: 1 }, { unique: true });
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RateLimit || mongoose.model("RateLimit", rateLimitSchema);
