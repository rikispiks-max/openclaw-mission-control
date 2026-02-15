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

function parseContentQueue(markdown: string) {
  const lines = markdown.split("\n");
  const drafts = [];
  const reviews = [];
  const approved = [];
  const published = [];

  let currentSection = "";

  for (const line of lines) {
    if (line.startsWith("## Draft")) currentSection = "draft";
    else if (line.startsWith("## Review")) currentSection = "review";
    else if (line.startsWith("## Approved")) currentSection = "approved";
    else if (line.startsWith("## Published")) currentSection = "published";
    else if (line.startsWith("- ")) {
      const item = line.substring(2).trim();
      if (currentSection === "draft") drafts.push(item);
      else if (currentSection === "review") reviews.push(item);
      else if (currentSection === "approved") approved.push(item);
      else if (currentSection === "published") published.push(item);
    }
  }

  return { drafts, reviews, approved, published };
}

export async function GET() {
  try {
    const workspacePath = expandHome(WORKSPACE_PATH);
    const queuePath = path.join(workspacePath, "content/queue.md");

    let pipeline = {
      drafts: [],
      reviews: [],
      approved: [],
      published: [],
    };

    try {
      const queueData = await fs.readFile(queuePath, "utf-8");
      pipeline = parseContentQueue(queueData);
    } catch (err) {
      console.warn("queue.md not found, using empty pipeline");
    }

    return NextResponse.json(pipeline);
  } catch (error) {
    console.error("Error reading content pipeline:", error);
    return NextResponse.json(
      { error: "Failed to read content pipeline" },
      { status: 500 }
    );
  }
}
