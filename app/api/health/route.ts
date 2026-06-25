import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.timestamp = new Date().toISOString();

  try {
    await connectMongoDB();
    const state = mongoose.connection.readyState;
    checks.mongodb = state === 1 ? "connected" : `state_${state}`;
  } catch (err) {
    checks.mongodb = "error";
    checks.mongodb_error = err instanceof Error ? err.message : String(err);
  }

  const isHealthy = checks.mongodb === "connected";

  return NextResponse.json(
    { status: isHealthy ? "healthy" : "degraded", checks },
    { status: isHealthy ? 200 : 503 }
  );
}
