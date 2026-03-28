"use client";

import { useState } from "react";
import { Search, FileText, File, FileCode, FileSpreadsheet, X, Download, ExternalLink } from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: "pdf" | "markdown" | "code" | "spreadsheet" | "text";
  agent: string;
  date: string;
  size: string;
  preview: string;
  tags: string[];
}

const DOCUMENTS: Document[] = [
  {
    id: "1",
    title: "Mission Control PRD v1.0",
    type: "markdown",
    agent: "Wally",
    date: "Mar 28, 2026",
    size: "4.2 KB",
    preview: `# Mission Control — Product Requirements Document\n\n## Overview\nMission Control is a personal command center for Zach Hunton and his AI assistant Wally. It serves as the central hub for task management, scheduling, memory, documents, team structure, and agent visibility.\n\n## Goals\n- Unified interface for human-AI collaboration\n- Persistent memory and context across sessions\n- Clear task delegation and tracking\n- Real-time agent presence and status\n\n## Core Pages\n1. Tasks — Kanban-style task board with agent assignment\n2. Calendar — Weekly/daily view with event management\n3. Memory — Shared journal with structured entries\n4. Documents — File storage and search\n5. People — Org chart with agent hierarchy\n6. Office — 2D pixelated agent workspace`,
    tags: ["product", "planning", "MVP"],
  },
  {
    id: "2",
    title: "Agent Architecture Design",
    type: "markdown",
    agent: "Wally",
    date: "Mar 25, 2026",
    size: "2.8 KB",
    preview: `# Agent Architecture\n\n## Hierarchy\n\`\`\`\nZach Hunton (Owner)\n└── Wally (Director of Agents)\n    ├── Research Agent\n    ├── Dev Agent\n    └── Writing Agent\n\`\`\`\n\n## Routing Rules\n- All requests from Zach go to Wally by default\n- Wally delegates to sub-agents based on task type\n- Sub-agents report back through Wally\n- Emergency escalation goes directly to Zach\n\n## Agent States\n- Idle: Available, in Break Room\n- Working: Active on a task, at Workstation\n- In Meeting: Collaborative session, at Meeting Table`,
    tags: ["architecture", "agents", "design"],
  },
  {
    id: "3",
    title: "Q2 2026 Strategic Goals",
    type: "text",
    agent: "Wally",
    date: "Mar 22, 2026",
    size: "1.5 KB",
    preview: `Q2 2026 Strategic Priorities\n\n1. Ship Mission Control MVP\n   - Full navigation, placeholder data\n   - Deploy to production\n   - Internal use only\n\n2. Claude API Integration\n   - Connect Wally to live Claude API\n   - Memory persistence between sessions\n   - Task auto-creation from conversations\n\n3. Agent Expansion\n   - Add Research Agent\n   - Add Dev Agent\n   - Define sub-agent briefing system\n\n4. Documentation\n   - Document all agent roles and responsibilities\n   - Create onboarding guide for new agents\n   - Establish decision-making protocols`,
    tags: ["strategy", "Q2", "planning"],
  },
  {
    id: "4",
    title: "Tech Stack Research",
    type: "markdown",
    agent: "Research Agent",
    date: "Mar 20, 2026",
    size: "3.1 KB",
    preview: `# Tech Stack Analysis\n\n## Frontend\n- **Next.js 15** — App Router, RSC, excellent DX\n- **TypeScript** — Type safety, better collaboration\n- **Tailwind CSS** — Rapid styling, consistent design system\n- **lucide-react** — Clean, consistent icon set\n\n## Key Decision Points\n1. App Router vs Pages Router → App Router for RSC benefits\n2. CSS-in-JS vs Tailwind → Tailwind for performance\n3. State management → useState/useContext for MVP (no Redux)\n\n## Recommendations\n- Use inline styles for dynamic values, Tailwind for static classes\n- Deploy on Vercel for seamless Next.js integration\n- Use date-fns for lightweight date manipulation`,
    tags: ["research", "tech", "frontend"],
  },
  {
    id: "5",
    title: "Mission Control UI Spec",
    type: "code",
    agent: "Dev Agent",
    date: "Mar 19, 2026",
    size: "5.7 KB",
    preview: `// Design System Tokens\n\nconst colors = {\n  background: '#0a0a0a',\n  sidebar: '#111111',\n  card: '#161616',\n  border: '#2a2a2a',\n  accent: '#3b82f6',\n  accentHover: '#2563eb',\n  muted: '#6b7280',\n  mutedFg: '#9ca3af',\n};\n\nconst typography = {\n  heading: { fontSize: 22, fontWeight: 700, color: '#fff' },\n  subheading: { fontSize: 16, fontWeight: 600, color: '#e5e7eb' },\n  body: { fontSize: 13, color: '#d1d5db' },\n  caption: { fontSize: 11, color: '#6b7280' },\n  label: { fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' },\n};\n\nconst spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };`,
    tags: ["design", "UI", "code"],
  },
  {
    id: "6",
    title: "Competitor Analysis",
    type: "spreadsheet",
    agent: "Research Agent",
    date: "Mar 18, 2026",
    size: "8.3 KB",
    preview: `Competitor Analysis Matrix\n\n| Feature          | Mission Control | Linear | Notion AI | ClickUp |\n|------------------|----------------|--------|-----------|--------|\n| AI Integration   | Native (Wally) | Basic  | GPT-based | Basic  |\n| Agent Hierarchy  | Yes            | No     | No        | No     |\n| Memory System    | Yes            | No     | Limited   | No     |\n| Office/Presence  | Yes            | No     | No        | No     |\n| Dark Mode        | Only           | Yes    | Yes       | Yes    |\n| Custom Agents    | Yes            | No     | Limited   | No     |\n\nConclusion: No existing tool combines task management + AI agent orchestration + persistent memory. Clear market gap.`,
    tags: ["research", "competitive", "strategy"],
  },
];

const TYPE_ICONS: Record<Document["type"], React.ElementType> = {
  markdown: FileText,
  code: FileCode,
  spreadsheet: FileSpreadsheet,
  text: File,
  pdf: File,
};

const TYPE_COLORS: Record<Document["type"], string> = {
  markdown: "#3b82f6",
  code: "#22c55e",
  spreadsheet: "#f59e0b",
  text: "#9ca3af",
  pdf: "#ef4444",
};

const AGENT_COLORS: Record<string, string> = {
  Wally: "#3b82f6",
  "Research Agent": "#8b5cf6",
  "Dev Agent": "#06b6d4",
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const allTags = ["all", ...Array.from(new Set(DOCUMENTS.flatMap((d) => d.tags)))];

  const filtered = DOCUMENTS.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === "all" || doc.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: "32px 32px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>Documents</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{DOCUMENTS.length} documents across all agents</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16, maxWidth: 480 }}>
        <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents, agents, tags..."
          style={{
            width: "100%",
            background: "#161616",
            border: "1px solid #222",
            borderRadius: 10,
            padding: "10px 14px 10px 36px",
            fontSize: 13,
            color: "#e5e7eb",
            outline: "none",
          }}
        />
      </div>

      {/* Tags Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              border: "1px solid",
              cursor: "pointer",
              borderColor: activeFilter === tag ? "#3b82f6" : "#222",
              background: activeFilter === tag ? "#3b82f620" : "transparent",
              color: activeFilter === tag ? "#3b82f6" : "#6b7280",
              textTransform: "capitalize",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {filtered.map((doc) => {
          const Icon = TYPE_ICONS[doc.type];
          const color = TYPE_COLORS[doc.type];
          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              style={{
                background: "#161616",
                border: "1px solid #222",
                borderRadius: 12,
                padding: 18,
                cursor: "pointer",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#333";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#222";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb", lineHeight: 1.4, marginBottom: 2 }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{doc.size} · {doc.date}</div>
                </div>
              </div>

              {/* Preview text */}
              <div
                style={{
                  fontSize: 11,
                  color: "#4b5563",
                  lineHeight: 1.5,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  marginBottom: 12,
                  fontFamily: doc.type === "code" ? "monospace" : "inherit",
                  whiteSpace: "pre-wrap",
                }}
              >
                {doc.preview.slice(0, 120)}...
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: AGENT_COLORS[doc.agent] || "#9ca3af",
                    background: `${AGENT_COLORS[doc.agent] || "#9ca3af"}18`,
                    padding: "2px 7px",
                    borderRadius: 4,
                  }}
                >
                  {doc.agent}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {doc.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 10,
                        color: "#4b5563",
                        background: "#1a1a1a",
                        border: "1px solid #222",
                        padding: "1px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Modal */}
      {selectedDoc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            backdropFilter: "blur(4px)",
            padding: 24,
          }}
          onClick={(e) => e.target === e.currentTarget && setSelectedDoc(null)}
        >
          <div
            style={{
              background: "#141414",
              border: "1px solid #2a2a2a",
              borderRadius: 14,
              width: "100%",
              maxWidth: 700,
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #1f1f1f",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {(() => {
                  const Icon = TYPE_ICONS[selectedDoc.type];
                  return (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: `${TYPE_COLORS[selectedDoc.type]}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={17} color={TYPE_COLORS[selectedDoc.type]} />
                    </div>
                  );
                })()}
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{selectedDoc.title}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>
                    {selectedDoc.agent} · {selectedDoc.date} · {selectedDoc.size}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#1f1f1f",
                    border: "1px solid #2a2a2a",
                    color: "#9ca3af",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#1f1f1f",
                    border: "1px solid #2a2a2a",
                    color: "#9ca3af",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            {/* Content */}
            <div
              style={{
                flex: 1,
                overflow: "auto",
                padding: "20px 24px",
                fontFamily: selectedDoc.type === "code" ? "monospace" : "inherit",
                fontSize: 13,
                color: "#d1d5db",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedDoc.preview}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
