import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);
const PROJECTS_DIR = path.join(process.env.HOME || "", "Desktop/Projects");

export async function GET() {
  try {
    let repos: any[] = [];

    try {
      const dirs = await fs.readdir(PROJECTS_DIR);

      for (const dir of dirs) {
        const repoPath = path.join(PROJECTS_DIR, dir);
        const stat = await fs.stat(repoPath);

        if (!stat.isDirectory()) continue;

        // Check if it's a git repo
        const gitPath = path.join(repoPath, ".git");
        try {
          await fs.stat(gitPath);
        } catch {
          continue; // Not a git repo
        }

        // Get git info
        try {
          const { stdout: branch } = await execAsync(`cd "${repoPath}" && git branch --show-current`);
          const { stdout: status } = await execAsync(`cd "${repoPath}" && git status --porcelain`);
          const { stdout: lastCommit } = await execAsync(`cd "${repoPath}" && git log -1 --pretty=format:"%h - %s (%cr)"`);

          repos.push({
            name: dir,
            path: repoPath,
            branch: branch.trim(),
            dirty: status.trim().split("\n").length,
            lastCommit: lastCommit.trim(),
          });
        } catch (err) {
          console.warn(`Failed to get git info for ${dir}`);
        }
      }
    } catch (err) {
      console.warn("Projects directory not found");
    }

    return NextResponse.json({ repos });
  } catch (error) {
    console.error("Error reading repos:", error);
    return NextResponse.json(
      { error: "Failed to read repos" },
      { status: 500 }
    );
  }
}
