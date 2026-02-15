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
    const tasksPath = path.join(workspacePath, "state/suggested-tasks.json");

    let tasks = [];
    try {
      const tasksData = await fs.readFile(tasksPath, "utf-8");
      tasks = JSON.parse(tasksData);
    } catch (err) {
      console.warn("suggested-tasks.json not found, using empty array");
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error reading suggested tasks:", error);
    return NextResponse.json(
      { error: "Failed to read suggested tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, action } = body;

    if (!taskId || !action) {
      return NextResponse.json(
        { error: "taskId and action are required" },
        { status: 400 }
      );
    }

    const workspacePath = expandHome(WORKSPACE_PATH);
    const tasksPath = path.join(workspacePath, "state/suggested-tasks.json");

    let tasks = [];
    try {
      const tasksData = await fs.readFile(tasksPath, "utf-8");
      tasks = JSON.parse(tasksData);
    } catch (err) {
      console.warn("suggested-tasks.json not found");
    }

    // Update task status
    tasks = tasks.map((task: any) =>
      task.id === taskId ? { ...task, status: action } : task
    );

    // Write back
    await fs.writeFile(tasksPath, JSON.stringify(tasks, null, 2));

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
