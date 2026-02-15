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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, channel = "webchat" } = body;

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    const workspacePath = expandHome(WORKSPACE_PATH);
    const queuePath = path.join(workspacePath, "queue/incoming.jsonl");

    const entry = {
      role: "user",
      content: message,
      channel,
      timestamp: new Date().toISOString(),
    };

    await fs.appendFile(queuePath, JSON.stringify(entry) + "\n");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
