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

function parseClientMarkdown(markdown: string) {
  const lines = markdown.split("\n");
  const client: any = { contacts: [] };

  for (const line of lines) {
    if (line.startsWith("# ")) client.name = line.substring(2).trim();
    else if (line.startsWith("Status: ")) client.status = line.substring(8).trim();
    else if (line.startsWith("Contact: ")) client.contacts.push(line.substring(9).trim());
    else if (line.startsWith("Last Interaction: ")) client.lastInteraction = line.substring(18).trim();
    else if (line.startsWith("Next Action: ")) client.nextAction = line.substring(13).trim();
  }

  return client;
}

export async function GET() {
  try {
    const workspacePath = expandHome(WORKSPACE_PATH);
    const clientsDir = path.join(workspacePath, "clients");

    let clients: any[] = [];

    try {
      const files = await fs.readdir(clientsDir);
      const mdFiles = files.filter(f => f.endsWith(".md"));

      for (const file of mdFiles) {
        const filePath = path.join(clientsDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const client = parseClientMarkdown(content);
        client.id = file.replace(".md", "");
        clients.push(client);
      }
    } catch (err) {
      console.warn("clients directory not found");
    }

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Error reading clients:", error);
    return NextResponse.json(
      { error: "Failed to read clients" },
      { status: 500 }
    );
  }
}
