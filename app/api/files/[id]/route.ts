import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { rateLimitRoute } from "@/lib/rate-limiter";
import FileModel from "@/models/File";
import ProjectModel from "@/models/Project";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limitResponse = await rateLimitRoute(req);
  if (limitResponse) return limitResponse;

  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const _req = req;

  const { id } = await params;
  if (!/^[0-9a-fA-F]{24}$/.test(id))
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });

  await connectMongoDB();

  const fileDoc = await FileModel.findById(id).lean();
  if (!fileDoc)
    return NextResponse.json({ error: "File not found" }, { status: 404 });

  const isAdmin = session.user.role === "admin";
  const isUploader = String(fileDoc.uploadedBy) === session.user.id;

  if (!isAdmin && !isUploader) {
    const project = await ProjectModel.findById(fileDoc.projectId)
      .select("clientId")
      .lean();
    const isClient = project && String(project.clientId) === session.user.id;
    if (!isClient) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const blobUrl = fileDoc.fileName as string;

  try {
    const result = await get(blobUrl, { access: "private" });

    if (!result || result.statusCode !== 200) {
      return NextResponse.json({ error: "Blob not found" }, { status: 404 });
    }

    const contentType = result.blob.contentType || "application/octet-stream";
    const originalName = (fileDoc.originalName as string) || "file";
    const downloadParam = _req.nextUrl.searchParams.get("download");

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Length": String(result.blob.size),
      "Cache-Control": "private, max-age=3600",
    };

    if (downloadParam !== null) {
      headers["Content-Disposition"] = `attachment; filename="${originalName}"`;
    } else {
      headers["Content-Disposition"] = `inline; filename="${originalName}"`;
    }

    return new NextResponse(result.stream, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve blob" },
      { status: 500 }
    );
  }
}
