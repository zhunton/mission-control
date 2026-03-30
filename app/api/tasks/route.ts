import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Protected tasks (Zach-owned or backlog) are never deleted by automated syncs

const DATA_FILE = path.join(process.cwd(), "data", "tasks.json");

interface Task {
  id: string;
  title: string;
  description: string;
  why: string;
  agent: string;
  date: string;
  status: "backlog" | "in-progress" | "needs-review" | "complete";
  priority: "low" | "medium" | "high";
  protected: boolean;
}

function readTasks(): Task[] {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Task[];
}

function writeTasks(tasks: Task[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

function isProtected(task: Task): boolean {
  return task.protected || task.agent === "Zach" || task.status === "backlog";
}

export async function GET() {
  const tasks = readTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as Omit<Task, "id" | "protected">;
  const tasks = readTasks();

  const newTask: Task = {
    ...body,
    id: Date.now().toString(),
    protected: body.agent === "Zach" || body.status === "backlog",
  };

  tasks.push(newTask);
  writeTasks(tasks);
  return NextResponse.json(newTask, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json() as { id: string } & Partial<Task>;
  const { id, ...updates } = body;

  const tasks = readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const existing = tasks[idx];

  if (isProtected(existing)) {
    // Protected tasks: only allow status updates
    const safeUpdates: Partial<Task> = {};
    if (updates.status !== undefined) safeUpdates.status = updates.status;

    tasks[idx] = {
      ...existing,
      ...safeUpdates,
      // Re-evaluate protected flag after status change
      protected: existing.protected || existing.agent === "Zach" || (safeUpdates.status ?? existing.status) === "backlog",
    };
  } else {
    tasks[idx] = {
      ...existing,
      ...updates,
      id: existing.id,
      protected: updates.agent === "Zach" || (updates.status ?? existing.status) === "backlog",
    };
  }

  writeTasks(tasks);
  return NextResponse.json(tasks[idx]);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const tasks = readTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (isProtected(task)) {
    return NextResponse.json({ error: "Cannot delete a protected task" }, { status: 403 });
  }

  const filtered = tasks.filter((t) => t.id !== id);
  writeTasks(filtered);
  return NextResponse.json({ success: true });
}
