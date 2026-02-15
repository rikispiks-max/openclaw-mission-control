import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const WORKSPACE_PATH = process.env.OPENCLAW_WORKSPACE_PATH || "~/.openclaw/workspace/";

function expandHome(filepath: string): string {
  if (filepath.startsWith("~/")) {
    return path.join(process.env.HOME || "", filepath.slice(2));
  }
  return filepath;
}

export async function GET() {
  try {
    const workspacePath = expandHome(WORKSPACE_PATH);
    const cronsPath = path.join(workspacePath, "state/crons.json");

    let crons = [];
    try {
      const cronsData = await fs.readFile(cronsPath, "utf-8");
      crons = JSON.parse(cronsData);
    } catch (err) {
      console.warn("crons.json not found, using empty array");
    }

    return NextResponse.json({
      crons,
      healthy: crons.filter((c: any) => c.status === "success").length,
      total: crons.length,
    });
  } catch (error) {
    console.error("Error reading cron health:", error);
    return NextResponse.json(
      { error: "Failed to read cron health" },
      { status: 500 }
    );
  }
}
