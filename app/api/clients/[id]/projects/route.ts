import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const { id } = await params;

  await connectMongoDB();

  const projects = await ProjectModel.find({ clientId: id }).select("_id title").lean();

  return NextResponse.json(
    projects.map((p) => ({ _id: String(p._id), title: (p.title as string) || "Untitled" }))
  );
}
