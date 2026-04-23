import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.marks.updateMany({
    data: {
      midTerm: 28.5,
      endSem: 52.0,
      cap: 9.0,
      etip: 14.5
    }
  })
}
main().catch(console.error)
