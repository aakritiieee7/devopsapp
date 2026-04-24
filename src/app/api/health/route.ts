import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Monitor Stage 8: Critical Threshold Telemetry
    const proxyCount = await prisma.user.count({ where: { proxyFlag: true } });
    const healthStatus = proxyCount > 10 ? "critical" : "healthy";
    
    return NextResponse.json({
      status: healthStatus,
      timestamp: new Date().toISOString(),
      version: "1.0.4-devops",
      services: {
        database: "connected",
        api: "operational"
      },
      telemetry: {
        proxyFlags: proxyCount,
        threshold: 10,
        cluster: "industrial-governance-01"
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({
      status: "unhealthy",
      error: "Database connection failed",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
