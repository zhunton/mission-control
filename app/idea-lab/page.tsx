"use client";

import { useState, useEffect } from "react";

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

const AMBER = "#f59e0b";
const AMBER_DIM = "#92400e";

function statusColor(status: Idea["status"]): string {
  switch (status) {
    case "exploring": return "#3b82f6";
    case "viable": return "#22c55e";
    case "building": return "#f59e0b";
    case "shelved": return "#6b7280";
  }
}

function statusLabel(status: Idea["status"]): string {
  switch (status) {
    case "exploring": return "Exploring";
    case "viable": return "Viable";
    case "building": return "Building";
    case "shelved": return "Shelved";
  }
}

function potentialBorderColor(potential: Idea["potential"]): string {
  switch (potential) {
    case "high": return "#22c55e";
    case "medium": return "#eab308";
    case "low": return "#374151";
  }
}

function potentialLabel(potential: Idea["potential"]): string {
  switch (potential) {
    case "high": return "High";
    case "medium": return "Medium";
    case "low": return "Low";
  }
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      result.push(
        <ul key={key++} style={{ margin: "6px 0 10px 0", paddingLeft: 20, listStyleType: "disc" }}>
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  const renderInline = (s: string): React.ReactNode => {
    const parts = s.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong key={i}>{p.slice(2, -2)}</strong>
      ) : (
        p
      )
    );
  };

  for (const raw of lines) {
    const line = raw;

    if (/^### /.test(line)) {
      flushList();
      result.push(
        <div key={key++} style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb", marginTop: 16, marginBottom: 4 }}>
          {renderInline(line.slice(4))}
        </div>
      );
    } else if (/^## /.test(line)) {
      flushList();
      result.push(
        <div key={key++} style={{ fontSize: 15, fontWeight: 700, color: "#f3f4f6", marginTop: 20, marginBottom: 6, borderBottom: "1px solid #2a2a2a", paddingBottom: 4 }}>
          {renderInline(line.slice(3))}
        </div>
      );
    } else if (/^# /.test(line)) {
      flushList();
      result.push(
        <div key={key++} style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
          {renderInline(line.slice(2))}
        </div>
      );
    } else if (/^- /.test(line)) {
      listItems.push(
        <li key={key++} style={{ marginBottom: 3 }}>
          {renderInline(line.slice(2))}
        </li>
      );
    } else if (/^\d+\. /.test(line)) {
      flushList();
      result.push(
        <div key={key++} style={{ marginBottom: 4, paddingLeft: 4 }}>
          {renderInline(line)}
        </div>
      );
    } else if (line.trim() === "") {
      flushList();
      result.push(<div key={key++} style={{ height: 8 }} />);
    } else {
      flushList();
      result.push(
        <div key={key++} style={{ marginBottom: 2 }}>
          {renderInline(line)}
        </div>
      );
    }
  }

  flushList();
  return result;
}

export default function IdeaLabPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((data: Idea[]) => {
        setIdeas(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
        setLoading(false);
      });
  }, []);

  const sorted = [...ideas].sort(
    (a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
  );
  const selected = ideas.find((i) => i.id === selectedId) ?? null;

  const totalCount = ideas.length;
  const viableCount = ideas.filter((i) => i.status === "viable" || i.status === "building").length;
  const highPotentialCount = ideas.filter((i) => i.potential === "high").length;
  const inProgressCount = ideas.filter((i) => i.status === "building").length;

  if (loading) {
    return (
      <div style={{ flex: 1, background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#6b7280", fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#e5e7eb",
        fontFamily: "inherit",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "28px 32px 0",
          borderBottom: "1px solid #1a1a1a",
          paddingBottom: 20,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Idea Lab</h1>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Track ideas, side projects, and business opportunities.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ padding: "20px 32px 0", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
          {[
            { label: "Total Ideas", value: totalCount, color: AMBER },
            { label: "Viable", value: viableCount, color: "#22c55e" },
            { label: "High Potential", value: highPotentialCount, color: "#3b82f6" },
            { label: "In Progress", value: inProgressCount, color: "#f59e0b" },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: "#161616",
                border: "1px solid #1f1f1f",
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                {card.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      {ideas.length === 0 ? (
        <div style={{ padding: "0 32px 32px", flex: 1 }}>
          <div
            style={{
              border: `1px solid ${AMBER_DIM}`,
              borderRadius: 12,
              background: "rgba(245,158,11,0.05)",
              padding: "48px 32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>💡</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: AMBER, marginBottom: 8 }}>
              No ideas yet
            </div>
            <div style={{ fontSize: 14, color: "#9ca3af" }}>
              No ideas yet. The team is researching opportunities...
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", padding: "0 32px 32px", gap: 20, marginTop: 4 }}>
          {/* Left panel — idea list */}
          <div
            style={{
              width: 300,
              minWidth: 300,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {sorted.map((idea) => {
              const isActive = selectedId === idea.id;
              const borderColor = potentialBorderColor(idea.potential);
              const sc = statusColor(idea.status);
              return (
                <div
                  key={idea.id}
                  onClick={() => setSelectedId(idea.id)}
                  style={{
                    background: isActive ? "#1d2433" : "#161616",
                    border: `1px solid ${isActive ? "#2a3a5a" : "#1f1f1f"}`,
                    borderLeft: `3px solid ${borderColor}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb", marginBottom: 8, lineHeight: 1.3 }}>
                    {idea.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {/* Category badge */}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: AMBER,
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.2)",
                        borderRadius: 4,
                        padding: "2px 6px",
                      }}
                    >
                      {idea.category}
                    </span>
                    {/* Status badge */}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#fff",
                        background: sc,
                        borderRadius: 4,
                        padding: "2px 6px",
                      }}
                    >
                      {statusLabel(idea.status)}
                    </span>
                    {/* Potential */}
                    <span
                      style={{
                        fontSize: 10,
                        color: borderColor,
                        marginLeft: "auto",
                      }}
                    >
                      ▲ {potentialLabel(idea.potential)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right panel — detail view */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {selected ? (
              <div>
                {/* Title & metadata */}
                <div
                  style={{
                    background: "#161616",
                    border: "1px solid #1f1f1f",
                    borderRadius: 12,
                    padding: "24px 28px",
                    marginBottom: 16,
                  }}
                >
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 16px 0" }}>
                    {selected.title}
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Category</div>
                      <div style={{ fontSize: 13, color: AMBER, fontWeight: 600 }}>{selected.category}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Status</div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#fff",
                          background: statusColor(selected.status),
                          borderRadius: 4,
                          padding: "2px 8px",
                          display: "inline-block",
                        }}
                      >
                        {statusLabel(selected.status)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Potential</div>
                      <div style={{ fontSize: 13, color: potentialBorderColor(selected.potential), fontWeight: 600 }}>
                        {potentialLabel(selected.potential)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Time Required</div>
                      <div style={{ fontSize: 13, color: "#d1d5db" }}>{selected.timeRequired}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Added By</div>
                      <div style={{ fontSize: 13, color: "#d1d5db" }}>{selected.addedBy}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Added</div>
                      <div style={{ fontSize: 13, color: "#d1d5db" }}>{selected.addedDate}</div>
                    </div>
                  </div>
                  {selected.summary && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#9ca3af",
                        fontStyle: "italic",
                        padding: "12px 16px",
                        background: "rgba(245,158,11,0.05)",
                        border: `1px solid ${AMBER_DIM}`,
                        borderRadius: 8,
                        lineHeight: 1.6,
                      }}
                    >
                      {selected.summary}
                    </div>
                  )}
                </div>

                {/* Markdown content */}
                {selected.details && (
                  <div
                    style={{
                      background: "#161616",
                      border: "1px solid #222",
                      borderRadius: 12,
                      padding: "28px 32px",
                      color: "#d1d5db",
                      fontSize: 14,
                      lineHeight: 1.75,
                      fontFamily: "inherit",
                    }}
                  >
                    {renderMarkdown(selected.details)}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
