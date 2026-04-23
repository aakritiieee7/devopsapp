import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()
async function main() {
  const hashedPassword = await bcrypt.hash("Aakriti_Safe_Admin2026", 10);
  
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: { password: hashedPassword },
    create: {
      email: "admin@admin.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN"
    }
  });
  console.log("Updated admin@admin.com with safe password");
}
main().catch(console.error).finally(() => prisma.$disconnect());
