import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import RateLimitModel from "@/models/RateLimit";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

const localCache = new Map<string, { count: number; resetAt: number }>();

function getIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function rateLimit(
  key: string,
  max: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS
) {
  const now = Date.now();

  const cached = localCache.get(key);
  if (cached && now < cached.resetAt) {
    if (cached.count > max) {
      return { allowed: false, remaining: 0, resetAt: cached.resetAt };
    }
    cached.count++;
    return { allowed: true, remaining: max - cached.count };
  }

  try {
    await connectMongoDB();

    const existing = await RateLimitModel.findOne({ key }).lean();
    if (existing && now > (existing.expiresAt as Date).getTime()) {
      await RateLimitModel.updateOne(
        { key },
        { $set: { count: 1, expiresAt: new Date(now + windowMs) } }
      );
      localCache.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: max - 1 };
    }

    const updated = await RateLimitModel.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(now + windowMs) } },
      { upsert: true, new: true }
    ).lean();

    localCache.set(key, { count: updated.count as number, resetAt: (updated.expiresAt as Date).getTime() });

    if ((updated.count as number) > max) {
      return { allowed: false, remaining: 0, resetAt: (updated.expiresAt as Date).getTime() };
    }
    return { allowed: true, remaining: max - (updated.count as number) };
  } catch {
    if (cached) {
      if (cached.count > max) {
        return { allowed: false, remaining: 0, resetAt: cached.resetAt };
      }
      cached.count++;
      return { allowed: true, remaining: max - cached.count };
    }
    return { allowed: true, remaining: max - 1 };
  }
}

export async function rateLimitRoute(
  request: Request,
  max?: number,
  windowMs?: number
) {
  const ip = getIp(request);
  const result = await rateLimit(`route:${ip}`, max, windowMs);

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil(((result as { resetAt: number }).resetAt - Date.now()) / 1000)
          ),
        },
      }
    );
  }

  return null;
}

export async function rateLimitAction(
  actionName: string,
  max: number = 20,
  windowMs: number = 60_000
) {
  const { headers } = await import("next/headers");
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  const result = await rateLimit(`action:${actionName}:${ip}`, max, windowMs);

  if (!result.allowed) {
    throw new Error("Too many requests. Please try again later.");
  }

  return result;
}
