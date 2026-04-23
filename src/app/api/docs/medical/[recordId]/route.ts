import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { recordId } = await params;
  
  const record = await prisma.attendanceRecord.findUnique({
    where: { id: recordId },
    include: { user: true }
  });

  if (!record || !record.medicalDocUrl) {
    return new NextResponse("Document not found", { status: 404 });
  }

  // Security: Check if user is Admin or the owner
  if (session.user.role !== "ADMIN" && session.user.id !== record.userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const filePath = path.join(process.cwd(), "storage", "uploads", record.medicalDocUrl);
    
    // Check if file actually exists on disk
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse("FILE_NOT_FOUND_ON_DISK", { status: 404 });
    }

    const data = await fs.readFile(filePath);

    // Determine content type
    const ext = path.extname(record.medicalDocUrl).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    else if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      contentType = `image/${ext.replace(".", "") === "jpg" ? "jpeg" : ext.replace(".", "")}`;
    }

    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": data.byteLength.toString(),
        "Content-Disposition": `inline; filename="${encodeURIComponent(record.medicalDocUrl.split("-").slice(1).join("-"))}"`
      }
    });
  } catch (err) {
    console.error("SECURE_VAULT_STREAM_ERROR:", err);
    return new NextResponse("SECURE_VAULT_ACCESS_ERROR", { status: 500 });
  }
}
