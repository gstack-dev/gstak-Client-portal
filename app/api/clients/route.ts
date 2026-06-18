import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  await connectMongoDB();

  const clients = await User.find({ role: "user" }).select("_id name").lean();

  return NextResponse.json(
    clients.map((c) => ({ _id: String(c._id), name: (c.name as string) || "Unknown" }))
  );
}
