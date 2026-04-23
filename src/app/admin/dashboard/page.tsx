import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminControlHub from "./AdminControlHub";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "ADMIN") redirect("/dashboard");
  }

  // 1. Fetch Students
  let students = [];
  try {
    students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        attendance: true,
        marks: true,
      } as any,
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) { console.error(e); }

  // 2. Fetch Medical Docs
  let medicalDocs = [];
  try {
    medicalDocs = await prisma.attendanceRecord.findMany({
      where: { justificationStatus: { not: "NONE" } } as any,
      include: { user: true, session: true } as any,
      orderBy: { timestamp: 'desc' }
    } as any);
  } catch (e) {
    console.error("Admin Dashboard Docs Fetch Error", e);
  }

  // 3. Fetch Assignments for Eval
  let submissions = [];
  try {
    submissions = await prisma.assignment.findMany({
      where: { status: { in: ["SUBMITTED", "GRADED"] } } as any,
      include: { user: true } as any,
      orderBy: { createdAt: 'desc' }
    } as any);
  } catch (e) { console.error(e); }

  return (
    <AdminControlHub 
      initialStudents={students}
      initialMedicalDocs={medicalDocs}
      initialSubmissions={submissions}
    />
  );
}
