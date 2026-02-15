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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get("channel");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");

    const workspacePath = expandHome(WORKSPACE_PATH);
    const chatsDir = path.join(workspacePath, "chats");

    let sessions: any[] = [];

    try {
      const files = await fs.readdir(chatsDir);
      const jsonlFiles = files.filter(f => f.endsWith(".jsonl"));

      for (const file of jsonlFiles) {
        const filePath = path.join(chatsDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const lines = content.trim().split("\n");
        const messages = lines.map(line => JSON.parse(line));

        // Filter by channel if specified
        if (channel && !messages.some((m: any) => m.channel === channel)) {
          continue;
        }

        // Filter by search if specified
        if (search) {
          const filtered = messages.filter((m: any) => 
            m.content?.toLowerCase().includes(search.toLowerCase())
          );
          if (filtered.length === 0) continue;
        }

        sessions.push({
          id: file.replace(".jsonl", ""),
          filename: file,
          messages: messages.slice(-limit),
          lastMessage: messages[messages.length - 1],
        });
      }
    } catch (err) {
      console.warn("chats directory not found");
    }

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error reading chat history:", error);
    return NextResponse.json(
      { error: "Failed to read chat history" },
      { status: 500 }
    );
  }
}
