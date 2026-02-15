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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workspacePath = expandHome(WORKSPACE_PATH);
    const agentDir = path.join(workspacePath, `agents/${id}`);

    // Read SOUL.md
    const soulPath = path.join(agentDir, "SOUL.md");
    let soul = "";
    try {
      soul = await fs.readFile(soulPath, "utf-8");
    } catch (err) {
      console.warn(`SOUL.md not found for agent ${id}`);
    }

    // Read RULES.md
    const rulesPath = path.join(agentDir, "RULES.md");
    let rules = "";
    try {
      rules = await fs.readFile(rulesPath, "utf-8");
    } catch (err) {
      console.warn(`RULES.md not found for agent ${id}`);
    }

    // Read recent outputs
    const outputsDir = path.join(workspacePath, `shared-context/agent-outputs/${id}`);
    let outputs: string[] = [];
    try {
      outputs = await fs.readdir(outputsDir);
      outputs = outputs.slice(0, 10); // Latest 10
    } catch (err) {
      console.warn(`outputs not found for agent ${id}`);
    }

    return NextResponse.json({
      id,
      soul,
      rules,
      outputs,
    });
  } catch (error) {
    console.error("Error reading agent details:", error);
    return NextResponse.json(
      { error: "Failed to read agent details" },
      { status: 500 }
    );
  }
}
