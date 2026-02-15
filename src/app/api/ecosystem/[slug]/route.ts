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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const workspacePath = expandHome(WORKSPACE_PATH);
    const ecosystemDir = path.join(workspacePath, `ecosystem/${slug}`);

    const data: any = { slug };

    // Read various memory files
    const files = ["overview.md", "brand.md", "community.md", "content.md", "legal.md", "product.md", "website.md"];

    for (const file of files) {
      const filePath = path.join(ecosystemDir, file);
      try {
        data[file.replace(".md", "")] = await fs.readFile(filePath, "utf-8");
      } catch (err) {
        data[file.replace(".md", "")] = "";
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading ecosystem data:", error);
    return NextResponse.json(
      { error: "Failed to read ecosystem data" },
      { status: 500 }
    );
  }
}
