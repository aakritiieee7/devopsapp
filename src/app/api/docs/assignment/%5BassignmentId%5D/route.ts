import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { assignmentId } = await params;
  
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId }
  });

  if (!assignment || !assignment.submissionUrl) {
    return new NextResponse("Assignment file not found", { status: 404 });
  }

  // Security: Check if user is Admin or the owner
  if (session.user.role !== "ADMIN" && session.user.id !== assignment.userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const filePath = path.join(process.cwd(), "storage", "uploads", "assignments", assignment.submissionUrl);
    const data = await fs.readFile(filePath);

    // Determine content type
    const ext = path.extname(assignment.submissionUrl).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    else if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      contentType = `image/${ext.replace(".", "") === "jpg" ? "jpeg" : ext.replace(".", "")}`;
    }

    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": data.byteLength.toString(),
        "Content-Disposition": `inline; filename="${encodeURIComponent(assignment.submissionUrl.split("-").slice(2).join("-"))}"`
      }
    });
  } catch (err) {
    console.error("ASSIGNMENT_SECURE_VAULT_STREAM_ERROR:", err);
    return new NextResponse("SECURE_VAULT_ACCESS_ERROR", { status: 500 });
  }
}
