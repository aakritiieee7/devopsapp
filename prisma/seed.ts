import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Aakr0007", 10);

  const user = await prisma.user.upsert({
    where: { email: "aakriti002btit24@igdtuw.ac.in" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "aakriti002btit24@igdtuw.ac.in",
      name: "Aakriti Rajhans",
      password: hashedPassword,
      enrollmentId: "002BTIT24",
      branch: "Information Technology",
      semester: "6th",
      role: "STUDENT",
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const session = await prisma.session.create({
    data: {
      subject: "DevOps & Cloud Computing",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      isOpen: true,
    },
  });

  await prisma.attendanceRecord.create({
    data: {
      userId: user.id,
      sessionId: session.id,
      status: "PRESENT",
    },
  });

  const absentSession = await prisma.session.create({
    data: {
      subject: "Cloud Security Labs",
      startTime: new Date(Date.now() - 604800000), // 1 week ago
      endTime: new Date(Date.now() - 604440000),
      isOpen: false,
    },
  });

  await prisma.attendanceRecord.create({
    data: {
      userId: user.id,
      sessionId: absentSession.id,
      status: "ABSENT",
    },
  });

  await prisma.assignment.createMany({
    data: [
      {
        title: "UNIT-I: Jenkins CI Pipeline Setup",
        description: "Configure a CI pipeline using Jenkins that pulls from a Git repo and builds a Node.js project.",
        subject: "DevOps",
        deadline: new Date(Date.now() - 86400000 * 5),
        status: "SUBMITTED",
        userId: user.id,
      },
      {
        title: "UNIT-II: Docker & Kubernetes Deployment",
        description: "Create a Dockerfile and deploy the image to a local Kubernetes cluster using minikube.",
        subject: "DevOps",
        deadline: new Date(Date.now() - 86400000 * 2),
        status: "SUBMITTED",
        userId: user.id,
      },
      {
        title: "UNIT-III: Subversion vs Git Analysis",
        description: "Prepare a detailed 2-page report analyzing the shift from SVN to Git in modern SCM.",
        subject: "DevOps",
        deadline: new Date(Date.now() + 86400000 * 3),
        status: "PENDING",
        userId: user.id,
      },
      {
        title: "UNIT-IV: GitHub Conflict Resolution",
        description: "Fork the provided repository, create an artificial merge conflict, and submit a PR with resolution.",
        subject: "DevOps",
        deadline: new Date(Date.now() + 86400000 * 7),
        status: "PENDING",
        userId: user.id,
      },
    ],
  });

  await prisma.marks.create({
    data: {
      userId: user.id,
      midTerm: 28.5, // out of 30
      endSem: 52.0,  // out of 60
      cap: 9.0,      // out of 10
      etip: 14.5,    // out of 15
    }
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
