"use client";

import { useState } from "react";
import { Search, BookOpen, Lightbulb, CheckCircle, MessageSquare } from "lucide-react";

interface Discussion {
  title: string;
  thingsToRemember: string[];
  recommendations: string[];
  decisions: string[];
}

interface MemoryEntry {
  id: string;
  date: string;
  title: string;
  discussions: Discussion[];
}

const ENTRIES: MemoryEntry[] = [
  {
    id: "1",
    date: "March 28, 2026",
    title: "Mission Control MVP Scoping",
    discussions: [
      {
        title: "Core Pages, Navigation & Visual Design",
        thingsToRemember: [
          "Dark mode only — no light mode toggle needed. Design aesthetic is modern, minimal, dark.",
          "Accent color is #3b82f6 (blue). Background is #0a0a0a.",
          "Six core pages for MVP: Tasks, Calendar, Memory, Documents, People, Office.",
          "Left sidebar navigation with icon + label for all six sections.",
        ],
        recommendations: [
          "Tasks could eventually integrate with Claude API to auto-create tasks from conversation summaries.",
          "The People/Org Chart should expand as new agents are spun up — design it to be data-driven.",
        ],
        decisions: [
          "Next.js 15 App Router with TypeScript and Tailwind CSS chosen as tech stack.",
          "lucide-react for icons, date-fns for date utilities.",
          "No authentication for MVP — single-user app for Zach.",
        ],
      },
      {
        title: "Memory Page as Shared Journal",
        thingsToRemember: [
          "The Memory page serves as a human-readable log of conversations — a shared journal between Zach and Wally.",
          "Wally is the Director of Agents — all sub-agents report to Wally, who reports to Zach.",
        ],
        recommendations: [
          "Memory entries should eventually be auto-generated from actual conversations — consider a structured format early.",
          "Consider adding real-time agent status in the Office page once backend is connected.",
        ],
        decisions: [
          "First version is entirely hardcoded with placeholder data — no backend or auth needed.",
        ],
      },
      {
        title: "Office Page & Agent Presence",
        thingsToRemember: [
          "The Office page should use emoji-based pixel characters with CSS animations, not actual pixel art assets.",
          "Agents should have a visible sense of 'place' — their location conveys their status.",
        ],
        recommendations: [
          "Once backend is live, Office page should reflect real agent state (Idle → Break Room, Working → Workstation, In Meeting → Meeting Table).",
          "Consider ambient animations (like typing indicators) to make the office feel alive.",
        ],
        decisions: [
          "Office page is in MVP scope but functionality is deferred — visual scaffolding only for now.",
        ],
      },
    ],
  },
  {
    id: "2",
    date: "March 25, 2026",
    title: "Agent Architecture & Role Definitions",
    discussions: [
      {
        title: "Wally's Role & Chain of Command",
        thingsToRemember: [
          "Wally's full title is 'Director of Agents' — not just an AI assistant.",
          "Zach is the Owner — final decision-maker on all strategic direction.",
          "Sub-agents are specialized: Research for information gathering, Dev for code, Writing for content.",
        ],
        recommendations: [
          "Build a routing layer so Zach can address any agent but Wally coordinates by default.",
          "Consider an agent 'briefing' system where sub-agents get context from Wally before starting tasks.",
        ],
        decisions: [
          "Wally is the primary interface for Zach — all conversations start with Wally.",
          "Sub-agents are invoked by Wally as needed and report back through Wally.",
          "Org chart in People page reflects the hierarchy: Zach → Wally → Sub-agents.",
        ],
      },
      {
        title: "Agent State Visibility & Status System",
        thingsToRemember: [
          "Agents should have status: Idle (Break Room), Working (Workstation), In Meeting (Meeting Table).",
          "Wally should always know what each agent is doing — state is never opaque.",
        ],
        recommendations: [
          "Status indicators on the sidebar and Office page should stay in sync.",
          "Explore a notification model where Wally surfaces completed sub-agent work proactively.",
        ],
        decisions: [
          "Sub-agents report back through Wally rather than directly to Zach in most cases.",
        ],
      },
    ],
  },
  {
    id: "3",
    date: "March 20, 2026",
    title: "Project Genesis — Vision & Goals",
    discussions: [
      {
        title: "Problem Statement & Core Vision",
        thingsToRemember: [
          "Mission Control is not just a task manager — it's a collaboration hub between human and AI.",
          "The frustration driving this: tasks in one place, notes in another, conversations scattered.",
          "The goal is to make working with AI feel natural, organized, and persistent.",
        ],
        recommendations: [
          "Start with the visual shell and navigation first — get the 'feel' right before adding functionality.",
          "The Memory page is critical for continuity — prioritize getting the format right.",
        ],
        decisions: [
          "Project name: Mission Control.",
          "Wally is the AI assistant and Director of Agents.",
          "Six core sections for MVP: Tasks, Calendar, Memory, Documents, People, Office.",
        ],
      },
      {
        title: "Design Principles & Development Philosophy",
        thingsToRemember: [
          "Everything should feel like it belongs to Zach — personalized, not generic.",
          "Wally should feel like a real collaborator, not just a chatbot.",
          "The Office concept gives agents a sense of 'place' and presence — that's intentional.",
        ],
        recommendations: [
          "Don't over-engineer early. Get to a working MVP fast, then iterate.",
          "Resist adding features until the core loop (talk → task → memory) is solid.",
        ],
        decisions: [
          "Prioritize shipping over perfection in the first iteration.",
          "Design decisions should always serve Zach's workflow, not generic best practices.",
        ],
      },
    ],
  },
];

const SUBSECTION_ICONS = {
  thingsToRemember: BookOpen,
  recommendations: Lightbulb,
  decisions: CheckCircle,
};

const SUBSECTION_COLORS = {
  thingsToRemember: "#8b5cf6",
  recommendations: "#f59e0b",
  decisions: "#22c55e",
};

const SUBSECTION_LABELS = {
  thingsToRemember: "Things to Remember",
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
                <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 6 }}>{entry.date}</div>
                <div style={{ fontSize: 10, color: "#374151" }}>
                  {entry.discussions.length} discussion{entry.discussions.length !== 1 ? "s" : ""}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Entry Detail */}
        <div style={{ flex: 1, overflow: "auto", padding: "28px 36px" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 6 }}>{selectedEntry.date}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{selectedEntry.title}</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {selectedEntry.discussions.map((discussion, di) => (
              <div key={di}>
                {/* Discussion Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#3b82f618",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MessageSquare size={14} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 2 }}>
                      Discussion {di + 1}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e5e7eb" }}>{discussion.title}</div>
                  </div>
                </div>

                {/* Sub-sections */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingLeft: 18, borderLeft: "2px solid #1e2a3a" }}>
                  {(["thingsToRemember", "recommendations", "decisions"] as const).map((key) => {
                    const items = discussion[key];
                    if (!items.length) return null;
                    const Icon = SUBSECTION_ICONS[key];
                    const color = SUBSECTION_COLORS[key];
                    return (
                      <div key={key}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              background: `${color}18`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon size={12} color={color} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {SUBSECTION_LABELS[key]}
                          </span>
                        </div>
                        <div
                          style={{
                            background: "#111",
                            border: "1px solid #1e1e1e",
                            borderLeft: `3px solid ${color}40`,
                            borderRadius: 10,
                            padding: "12px 16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
