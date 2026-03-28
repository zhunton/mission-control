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
    title: "Day One — Wally comes online",
    discussions: [
      {
        title: "Identity & Setup",
        thingsToRemember: [
          "Zach Hunton, 26, Houston TX, married to Blair, schnoodle Dobby",
          "Wally is the AI assistant name — strategic right-hand man",
          "Strong opinions, brevity, humor, directness are the vibe",
        ],
        recommendations: [
          "Keep SOUL.md updated as preferences evolve",
        ],
        decisions: [
          "Established Wally identity, rewrote SOUL.md with Zach's personality rules",
        ],
      },
      {
        title: "The Hunton Group",
        thingsToRemember: [
          "4 companies: HT, HD, HS, CVZ — all HVAC Houston",
          "Zach in accelerated dev program at HS, future CEO track",
          "Data centers now huge profit driver for HT",
          "HS is the most complex — 5 divisions, 12+ teams",
          "Brett Lutz leads Special Projects/HEP, Stephen Ingram is Director of Operations",
        ],
        recommendations: [
          "Data center work needs its own playbook tracked separately from core business",
          "HEP catalog is a strong opportunity if product selection is right",
        ],
        decisions: [
          "Saved full Hunton Group business overview to memory/hunton-group.md",
        ],
      },
      {
        title: "Mission Control",
        thingsToRemember: [
          "Live at https://mission-control-five-red.vercel.app",
          "GitHub: github.com/zhunton/mission-control",
          "Next.js 15, TypeScript, Tailwind CSS",
          "Wally is Director of Agents — spins up sub-agents on demand, stays lean",
        ],
        recommendations: [
          "Build lean — complexity should earn its keep",
          "Wally pushes tasks into Mission Control directly from conversations",
        ],
        decisions: [
          "Built Mission Control as the central hub",
          "Deployed to Vercel for access from any device",
          "Agent architecture: Wally orchestrates, sub-agents spun up on demand",
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
