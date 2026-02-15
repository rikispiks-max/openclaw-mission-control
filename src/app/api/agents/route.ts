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

    // Read agents registry
    const registryPath = path.join(workspacePath, "agents/registry.json");
    let agents = [];
    try {
      const registryData = await fs.readFile(registryPath, "utf-8");
      agents = JSON.parse(registryData);
    } catch (err) {
      console.warn("registry.json not found, using empty array");
    }

    // Enhance with SOUL file data
    const enhancedAgents = await Promise.all(
      agents.map(async (agent: any) => {
        const soulPath = path.join(workspacePath, `agents/${agent.id}/SOUL.md`);
        let soul = "";
        try {
          soul = await fs.readFile(soulPath, "utf-8");
        } catch (err) {
          // Soul file not found
        }

        return {
          ...agent,
          soul: soul.substring(0, 500), // Preview only
          hasSoul: soul.length > 0,
        };
      })
    );

    return NextResponse.json({
      agents: enhancedAgents,
      count: enhancedAgents.length,
    });
  } catch (error) {
    console.error("Error reading agents:", error);
    return NextResponse.json(
      { error: "Failed to read agents" },
      { status: 500 }
    );
  }
}
