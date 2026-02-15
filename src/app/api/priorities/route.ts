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
    const prioPath = path.join(workspacePath, "shared-context/priorities.md");

    let priorities = "";
    try {
      priorities = await fs.readFile(prioPath, "utf-8");
    } catch (err) {
      console.warn("priorities.md not found");
    }

    return NextResponse.json({ priorities });
  } catch (error) {
    console.error("Error reading priorities:", error);
    return NextResponse.json(
      { error: "Failed to read priorities" },
      { status: 500 }
    );
  }
}
