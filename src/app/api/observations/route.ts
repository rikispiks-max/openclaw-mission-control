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
    const obsPath = path.join(workspacePath, "state/observations.md");

    let observations = "";
    try {
      observations = await fs.readFile(obsPath, "utf-8");
    } catch (err) {
      console.warn("observations.md not found");
    }

    return NextResponse.json({ observations });
  } catch (error) {
    console.error("Error reading observations:", error);
    return NextResponse.json(
      { error: "Failed to read observations" },
      { status: 500 }
    );
  }
}
