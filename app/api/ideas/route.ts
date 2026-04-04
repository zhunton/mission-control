import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "ideas.json");

interface Idea {
  id: string;
  title: string;
  category: string;
  status: "exploring" | "viable" | "building" | "shelved";
  potential: "low" | "medium" | "high";
  timeRequired: string;
  summary: string;
  details: string;
  addedDate: string;
  addedBy: string;
}

interface IdeasData {
  ideas: Idea[];
}

function readData(): IdeasData {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as IdeasData;
}

function writeData(data: IdeasData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data.ideas);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as Idea;
  const data = readData();
  data.ideas.push(body);
  writeData(data);
  return NextResponse.json(body, { status: 201 });
}
