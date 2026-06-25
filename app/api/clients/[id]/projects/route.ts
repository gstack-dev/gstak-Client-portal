import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { rateLimitRoute } from "@/lib/rate-limiter";
import ProjectModel from "@/models/Project";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limitResponse = await rateLimitRoute(request);
  if (limitResponse) return limitResponse;

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const { id } = await params;
  if (!/^[0-9a-fA-F]{24}$/.test(id))
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

  await connectMongoDB();

  const projects = await ProjectModel.find({ clientId: id }).select("_id title").lean();

  return NextResponse.json(
    projects.map((p) => ({ _id: String(p._id), title: (p.title as string) || "Untitled" }))
  );
}
