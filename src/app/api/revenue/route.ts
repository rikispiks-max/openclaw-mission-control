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
    const revenuePath = path.join(workspacePath, "state/revenue.json");

    let revenue = {
      current: 0,
      monthly_burn: 0,
      net: 0,
      updated_at: new Date().toISOString(),
    };

    try {
      const revenueData = await fs.readFile(revenuePath, "utf-8");
      revenue = JSON.parse(revenueData);
    } catch (err) {
      console.warn("revenue.json not found, using defaults");
    }

    return NextResponse.json(revenue);
  } catch (error) {
    console.error("Error reading revenue:", error);
    return NextResponse.json(
      { error: "Failed to read revenue" },
      { status: 500 }
    );
  }
}
