import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const BRIEFS_PATH = join(process.cwd(), "data", "briefs.json");

function readBriefs() {
  const raw = readFileSync(BRIEFS_PATH, "utf-8");
  return JSON.parse(raw) as { morning: BriefEntry[]; ai: BriefEntry[] };
}

interface BriefEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  createdAt: string;
}

export async function GET() {
  const briefs = readBriefs();
  return NextResponse.json(briefs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { type, date, title, content } = body as {
    type: "morning" | "ai";
    date: string;
    title: string;
    content: string;
  };

  if (!type || !date || !title || !content) {
    return NextResponse.json({ error: "Missing required fields: type, date, title, content" }, { status: 400 });
  }
  if (type !== "morning" && type !== "ai") {
    return NextResponse.json({ error: "type must be 'morning' or 'ai'" }, { status: 400 });
  }

  const briefs = readBriefs();
  const entry: BriefEntry = {
    id: `${date.replace(/\s/g, "-").toLowerCase()}-${Date.now()}`,
    date,
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  briefs[type].unshift(entry);
  writeFileSync(BRIEFS_PATH, JSON.stringify(briefs, null, 2));

  return NextResponse.json(entry, { status: 201 });
}
