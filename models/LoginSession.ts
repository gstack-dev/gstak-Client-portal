import mongoose from "mongoose";

const loginSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  device: { type: String, default: "Unknown" },
  ip: { type: String, default: "" },
  userAgent: { type: String, default: "" },
  loggedInAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
}, { timestamps: true });

loginSessionSchema.index({ userId: 1, lastActiveAt: -1 });
loginSessionSchema.index({ userId: 1, loggedInAt: -1 });
loginSessionSchema.index({ userId: 1, device: 1, loggedInAt: -1 });

export default mongoose.models.LoginSession || mongoose.model("LoginSession", loginSessionSchema);
