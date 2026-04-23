"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function submitJustification(recordId: string, formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("File not found");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Clean filename: remove spaces/special chars
  const cleanFileName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9.\-_]/g, "");

  // Save to private storage folder (outside /public)
  const uploadDir = path.join(process.cwd(), "storage", "uploads");
  const uniqueName = `${recordId}-${cleanFileName}`;
  const filePath = path.join(uploadDir, uniqueName);
  
  await fs.writeFile(filePath, buffer);

  await (prisma.attendanceRecord as any).update({
    where: { id: recordId },
    data: {
      medicalDocUrl: uniqueName, // Store only the unique internal filename
      justificationStatus: "PENDING"
    }
  });

  revalidatePath("/dashboard/attendance");
  revalidatePath("/admin/dashboard");
}
