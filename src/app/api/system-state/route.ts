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

    // Read servers.json
    const serversPath = path.join(workspacePath, "state/servers.json");
    let servers = [];
    try {
      const serversData = await fs.readFile(serversPath, "utf-8");
      servers = JSON.parse(serversData);
    } catch (err) {
      console.warn("servers.json not found, using empty array");
    }

    // Read branch-check.json
    const branchPath = path.join(workspacePath, "state/branch-check.json");
    let branchStatus = null;
    try {
      const branchData = await fs.readFile(branchPath, "utf-8");
      branchStatus = JSON.parse(branchData);
    } catch (err) {
      console.warn("branch-check.json not found");
    }

    return NextResponse.json({
      servers,
      branchStatus,
      lastCheck: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error reading system state:", error);
    return NextResponse.json(
      { error: "Failed to read system state" },
      { status: 500 }
    );
  }
}
