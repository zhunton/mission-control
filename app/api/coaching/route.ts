import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "coaching.json");

interface CategoryResult {
  score: number;
  total: number;
}

interface Question {
  id: number;
  category: string;
  question: string;
  userAnswer: string;
  correct: boolean;
  feedback: string;
}

interface Session {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  categories: Record<string, CategoryResult>;
  questions: Question[];
  strengths: string[];
  weaknesses: string[];
  note: string;
}

interface CoachingData {
  sessions: Session[];
}

function readData(): CoachingData {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as CoachingData;
}

function writeData(data: CoachingData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data.sessions);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as Session;
  const data = readData();

  data.sessions.push(body);
  writeData(data);
  return NextResponse.json(body, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json() as { id: string } & Partial<Session>;
  const { id, ...updates } = body;

  const data = readData();
  const idx = data.sessions.findIndex((s) => s.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  data.sessions[idx] = { ...data.sessions[idx], ...updates, id };
  writeData(data);
  return NextResponse.json(data.sessions[idx]);
}
