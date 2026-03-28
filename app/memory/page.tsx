"use client";

import { useState } from "react";
import { Search, BookOpen, Lightbulb, CheckCircle, MessageSquare } from "lucide-react";

interface MemoryEntry {
  id: string;
  date: string;
  title: string;
  discussions: string[];
  remember: string[];
  recommendations: string[];
  decisions: string[];
}

const ENTRIES: MemoryEntry[] = [
  {
    id: "1",
    date: "March 28, 2026",
    title: "Mission Control MVP Scoping",
    discussions: [
      "Discussed the six core pages for Mission Control: Tasks, Calendar, Memory, Documents, People, Office.",
      "Explored the idea of a pixelated 2D office where agents have visible presence and move between rooms.",
      "Agreed that the first version should be entirely hardcoded with placeholder data — no backend or auth needed.",
      "Talked about the 'Memory' page serving as a human-readable log of conversations, similar to a shared journal between Zach and Wally.",
    ],
    remember: [
      "Dark mode only — no light mode toggle needed. Design aesthetic is modern, minimal, dark.",
      "Accent color is #3b82f6 (blue). Background is #0a0a0a.",
      "Wally is the Director of Agents — all sub-agents report to Wally, who reports to Zach.",
      "The Office page should use emoji-based pixel characters with CSS animations, not actual pixel art assets.",
    ],
    recommendations: [
      "Consider adding real-time agent status in the Office page once backend is connected.",
      "Memory entries should eventually be auto-generated from actual conversations — consider a structured format early.",
      "Tasks could eventually integrate with Claude API to auto-create tasks from conversation summaries.",
      "The People/Org Chart should expand as new agents are spun up — design it to be data-driven.",
    ],
    decisions: [
      "Next.js 15 App Router with TypeScript and Tailwind CSS chosen as tech stack.",
      "lucide-react for icons, date-fns for date utilities.",
      "Left sidebar navigation with icon + label for all six sections.",
      "No authentication for MVP — single-user app for Zach.",
    ],
  },
  {
    id: "2",
    date: "March 25, 2026",
    title: "Agent Architecture & Role Definitions",
    discussions: [
      "Defined Wally's role: Director of Agents — responsible for task delegation, memory management, and coordination.",
      "Discussed the concept of specialized sub-agents: Research Agent, Dev Agent, Writing Agent.",
      "Explored how sub-agents should communicate through Wally rather than directly with Zach in most cases.",
      "Talked about agent state visibility — Wally should always know what each agent is doing.",
    ],
    remember: [
      "Wally's full title is 'Director of Agents' — not just an AI assistant.",
      "Zach is the Owner — final decision-maker on all strategic direction.",
      "Sub-agents are specialized: Research for information gathering, Dev for code, Writing for content.",
      "Agents should have status: Idle (Break Room), Working (Workstation), In Meeting (Meeting Table).",
    ],
    recommendations: [
      "Build a routing layer so Zach can address any agent but Wally coordinates by default.",
      "Consider an agent 'briefing' system where sub-agents get context from Wally before starting tasks.",
      "Status indicators on the sidebar and Office page should stay in sync.",
    ],
    decisions: [
      "Wally is the primary interface for Zach — all conversations start with Wally.",
      "Sub-agents are invoked by Wally as needed and report back through Wally.",
      "Org chart in People page reflects the hierarchy: Zach → Wally → Sub-agents.",
    ],
  },
  {
    id: "3",
    date: "March 20, 2026",
    title: "Project Genesis — Vision & Goals",
    discussions: [
      "Introduced the concept of Mission Control: a personal command center for Zach's work with AI.",
      "Discussed frustration with fragmented tools — tasks in one place, notes in another, conversations scattered.",
      "Explored the vision: a single interface where Zach and Wally work together seamlessly.",
      "Talked about the Office concept as a way to give agents a sense of 'place' and presence.",
    ],
    remember: [
      "Mission Control is not just a task manager — it's a collaboration hub between human and AI.",
      "The goal is to make working with AI feel natural, organized, and persistent.",
      "Everything should feel like it belongs to Zach — personalized, not generic.",
      "Wally should feel like a real collaborator, not just a chatbot.",
    ],
    recommendations: [
      "Start with the visual shell and navigation first — get the 'feel' right before adding functionality.",
      "The Memory page is critical for continuity — prioritize getting the format right.",
      "Don't over-engineer early. Get to a working MVP fast, then iterate.",
    ],
    decisions: [
      "Project name: Mission Control.",
      "Wally is the AI assistant and Director of Agents.",
      "Six core sections for MVP: Tasks, Calendar, Memory, Documents, People, Office.",
      "Prioritize shipping over perfection in the first iteration.",
    ],
  },
];

const SECTION_ICONS = {
  discussions: MessageSquare,
  remember: BookOpen,
  recommendations: Lightbulb,
  decisions: CheckCircle,
};

const SECTION_COLORS = {
  discussions: "#3b82f6",
  remember: "#8b5cf6",
  recommendations: "#f59e0b",
  decisions: "#22c55e",
};

const SECTION_LABELS = {
  discussions: "Key Discussions",
  remember: "Things to Remember",
  recommendations: "Recommendations",
  decisions: "Decisions Made",
};

export default function MemoryPage() {
  const [selectedEntry, setSelectedEntry] = useState<MemoryEntry>(ENTRIES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = ENTRIES.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "32px 32px 20px", borderBottom: "1px solid #1a1a1a" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>Memory</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Shared journal — conversations, decisions, and context</p>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel - Entry List */}
        <div
          style={{
            width: 280,
            borderRight: "1px solid #1a1a1a",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Search */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                style={{
                  width: "100%",
                  background: "#0f0f0f",
                  border: "1px solid #222",
                  borderRadius: 8,
                  padding: "7px 12px 7px 30px",
                  fontSize: 12,
                  color: "#e5e7eb",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Entry List */}
          <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
            {filteredEntries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 12px",
                  borderRadius: 8,
                  background: selectedEntry.id === entry.id ? "#1d2433" : "transparent",
                  border: selectedEntry.id === entry.id ? "1px solid #2a3a5a" : "1px solid transparent",
                  cursor: "pointer",
                  marginBottom: 4,
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: selectedEntry.id === entry.id ? "#e5e7eb" : "#9ca3af", marginBottom: 3, lineHeight: 1.4 }}>
                  {entry.title}
                </div>
                <div style={{ fontSize: 11, color: "#4b5563" }}>{entry.date}</div>
                <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                  {(["discussions", "remember", "recommendations", "decisions"] as const).map((section) => (
                    <div
                      key={section}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: SECTION_COLORS[section],
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Entry Detail */}
        <div style={{ flex: 1, overflow: "auto", padding: "28px 36px" }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 6 }}>{selectedEntry.date}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{selectedEntry.title}</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {(["discussions", "remember", "recommendations", "decisions"] as const).map((section) => {
              const Icon = SECTION_ICONS[section];
              const color = SECTION_COLORS[section];
              const items = selectedEntry[section];
              return (
                <div key={section}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: `${color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={14} color={color} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {SECTION_LABELS[section]}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#111",
                      border: "1px solid #1e1e1e",
                      borderLeft: `3px solid ${color}40`,
                      borderRadius: 10,
                      padding: "14px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: color,
                            marginTop: 7,
                            flexShrink: 0,
                            opacity: 0.7,
                          }}
                        />
                        <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
