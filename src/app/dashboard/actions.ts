"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import fs from "fs/promises";
import path from "path";

export async function submitAssignment(assignmentId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  // Save File
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const cleanName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9.\-_]/g, "");
  const uniqueName = `assignment-${assignmentId}-${cleanName}`;
  const uploadPath = path.join(process.cwd(), "storage", "uploads", "assignments", uniqueName);
  
  await fs.writeFile(uploadPath, buffer);

  // Update status and store reference
  await prisma.assignment.update({
    where: { id: assignmentId },
    data: { 
      status: "SUBMITTED",
      submissionUrl: uniqueName // Store unique internal name
    },
  });

  revalidatePath("/dashboard/coursework");
  revalidatePath("/admin/dashboard");
}

export async function unsubmitAssignment(assignmentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.assignment.update({
    where: { 
      id: assignmentId,
      userId: session.user.id 
    },
    data: { 
      status: "PENDING"
      // We keep the old submissionUrl in DB for history, but UI shows pending
    },
  });

  revalidatePath("/dashboard/coursework");
  revalidatePath("/admin/dashboard");
}

