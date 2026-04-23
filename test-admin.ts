import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      attendance: true,
      marks: true,
      assignments: true
    } as any
  });
  console.log("Students fetched:", students.length);
  
  const medicalDocs = await prisma.attendanceRecord.findMany({
    where: { status: "ABSENT" },
    include: { user: true, session: true }
  });
  console.log("Docs fetched:", medicalDocs.length);
}
main().catch(console.error)
