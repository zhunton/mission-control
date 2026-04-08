import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "apps.json");

interface App {
  id: string;
  name: string;
  tagline: string;
  status: "planning" | "building" | "testing" | "launched" | "paused";
  platform: string;
  stage: string;
  overview: string;
  painPoint: string;
  strengths: string[];
  challenges: string[];
  monetization: string;
  timeline: string;
  techStack: string;
  gamePlan: string;
  notes: string;
  addedDate: string;
  lastUpdated: string;
}

interface AppsData {
  apps: App[];
}

function readData(): AppsData {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as AppsData;
}

function writeData(data: AppsData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data.apps);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as App;
  const data = readData();
  data.apps.push(body);
  writeData(data);
  return NextResponse.json(body, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json() as Partial<App> & { id: string };
  const data = readData();
  const idx = data.apps.findIndex((a) => a.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }
  data.apps[idx] = { ...data.apps[idx], ...body };
  writeData(data);
  return NextResponse.json(data.apps[idx]);
}
