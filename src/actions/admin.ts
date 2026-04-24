"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveMedical(recordId: string) {
  await (prisma.attendanceRecord as any).update({
    where: { id: recordId },
    data: {
      status: "PRESENT",
      justificationStatus: "APPROVED",
    }
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/dashboard/attendance");
}

export async function rejectMedical(recordId: string) {
  await (prisma.attendanceRecord as any).update({
    where: { id: recordId },
    data: {
      justificationStatus: "REJECTED",
    }
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/dashboard/attendance");
}

export async function updateStudentProfile(userId: string, data: any) {
  const { name, enrollmentId, marks } = data;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      enrollmentId,
    }
  });

  if (marks) {
    const existingMarks = await (prisma as any).marks.findFirst({
      where: { userId }
    });

    if (existingMarks) {
      await (prisma as any).marks.update({
        where: { id: existingMarks.id },
        data: {
          midTerm: parseFloat(marks.midTerm),
          endSem: parseFloat(marks.endSem),
          cap: parseFloat(marks.cap),
          etip: parseFloat(marks.etip),
        }
      });
    } else {
      await (prisma as any).marks.create({
        data: {
          userId,
          midTerm: parseFloat(marks.midTerm),
          endSem: parseFloat(marks.endSem),
          cap: parseFloat(marks.cap),
          etip: parseFloat(marks.etip),
        }
      });
    }
  }

  revalidatePath("/admin/dashboard");
}

export async function gradeAssignment(assignmentId: string, data: { grade: string, feedback: string }) {
  await (prisma.assignment as any).update({
    where: { id: assignmentId },
    data: {
      grade: data.grade,
      feedback: data.feedback,
      status: "GRADED"
    }
  });
  revalidatePath("/admin/dashboard");
}

export async function toggleProxyFlag(userId: string, currentStatus: boolean) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      proxyFlag: !currentStatus,
    }
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/dashboard");
}
