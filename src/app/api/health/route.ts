import { NextResponse } from "next/server";

const startTime = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json({
    status: "ok",
    uptime,
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
}
