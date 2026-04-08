"use client";

import { useState, useEffect } from "react";

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

const BLUE = "#3b82f6";

function statusColor(status: App["status"]): string {
  switch (status) {
    case "planning": return "#3b82f6";
    case "building": return "#f59e0b";
    case "testing": return "#a855f7";
    case "launched": return "#22c55e";
    case "paused": return "#6b7280";
  }
}

function statusLabel(status: App["status"]): string {
  switch (status) {
    case "planning": return "Planning";
    case "building": return "Building";
    case "testing": return "Testing";
    case "launched": return "Launched";
    case "paused": return "Paused";
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
    const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**")) {
        return <strong key={i}>{p.slice(2, -2)}</strong>;
      }
      if (p.startsWith("`") && p.endsWith("`")) {
        return (
          <code
            key={i}
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              background: "#1f1f1f",
              border: "1px solid #2a2a2a",
              borderRadius: 4,
              padding: "1px 5px",
              color: "#93c5fd",
            }}
          >
            {p.slice(1, -1)}
          </code>
        );
      }
      return p;
    });
  };

  for (const raw of lines) {
    if (/^### /.test(raw)) {
      flushList();
      result.push(
        <div key={key++} style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb", marginTop: 16, marginBottom: 4 }}>
          {renderInline(raw.slice(4))}
        </div>
      );
    } else if (/^## /.test(raw)) {
      flushList();
      result.push(
        <div
          key={key++}
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#f3f4f6",
            marginTop: 20,
            marginBottom: 6,
            borderBottom: "1px solid #2a2a2a",
            paddingBottom: 4,
          }}
        >
          {renderInline(raw.slice(3))}
        </div>
      );
    } else if (/^# /.test(raw)) {
      flushList();
      result.push(
        <div key={key++} style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
          {renderInline(raw.slice(2))}
        </div>
      );
    } else if (/^- /.test(raw)) {
      listItems.push(
        <li key={key++} style={{ marginBottom: 3 }}>
          {renderInline(raw.slice(2))}
        </li>
      );
    } else if (/^\d+\. /.test(raw)) {
      flushList();
      result.push(
        <div key={key++} style={{ marginBottom: 4, paddingLeft: 4 }}>
          {renderInline(raw)}
        </div>
      );
    } else if (raw.trim() === "") {
      flushList();
      result.push(<div key={key++} style={{ height: 8 }} />);
    } else {
      flushList();
      result.push(
        <div key={key++} style={{ marginBottom: 2 }}>
          {renderInline(raw)}
        </div>
      );
    }
  }

  flushList();
  return result;
}

export default function AppLabPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/apps")
      .then((r) => r.json())
      .then((data: App[]) => {
        setApps(data);
        if (data.length > 0) setSelectedId(data[0].id);
        setLoading(false);
      });
  }, []);

  const selected = apps.find((a) => a.id === selectedId) ?? null;

  const totalCount = apps.length;
  const buildingCount = apps.filter((a) => a.status === "building").length;
  const launchedCount = apps.filter((a) => a.status === "launched").length;
  const planningCount = apps.filter((a) => a.status === "planning").length;

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
          padding: "28px 32px 20px",
          borderBottom: "1px solid #1a1a1a",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>App Lab</h1>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Apps in active development — from concept to launch.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ padding: "20px 32px 0", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
          {[
            { label: "Total Apps", value: totalCount, color: BLUE },
            { label: "Building", value: buildingCount, color: "#f59e0b" },
            { label: "Launched", value: launchedCount, color: "#22c55e" },
            { label: "Planning", value: planningCount, color: "#a855f7" },
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
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                }}
              >
                {card.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      {apps.length === 0 ? (
        <div style={{ padding: "0 32px 32px", flex: 1 }}>
          <div
            style={{
              border: "1px solid #1e3a5f",
              borderRadius: 12,
              background: "rgba(59,130,246,0.05)",
              padding: "48px 32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: BLUE, marginBottom: 8 }}>
              No apps in development yet.
            </div>
            <div style={{ fontSize: 14, color: "#9ca3af" }}>
              Apps being actively built will appear here.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            padding: "0 32px 32px",
            gap: 20,
            marginTop: 4,
          }}
        >
          {/* Left panel — app list */}
          <div
            style={{
              width: 280,
              minWidth: 280,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {apps.map((app) => {
              const isActive = selectedId === app.id;
              const sc = statusColor(app.status);
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  style={{
                    background: isActive ? "#1a2540" : "#161616",
                    border: `1px solid ${isActive ? "#2a3a5a" : "#1f1f1f"}`,
                    borderLeft: `3px solid ${sc}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#f3f4f6",
                      marginBottom: 4,
                    }}
                  >
                    {app.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      marginBottom: 10,
                      lineHeight: 1.4,
                    }}
                  >
                    {app.tagline}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {/* Status badge */}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#fff",
                        background: sc,
                        borderRadius: 4,
                        padding: "2px 7px",
                      }}
                    >
                      {statusLabel(app.status)}
                    </span>
                    {/* Platform badge */}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: BLUE,
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        borderRadius: 4,
                        padding: "2px 7px",
                      }}
                    >
                      {app.platform}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "#4b5563", marginTop: 8 }}>{app.stage}</div>
                </div>
              );
            })}
          </div>

          {/* Right panel — detail view */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {selected ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* 1. Header */}
                <div
                  style={{
                    background: "#161616",
                    border: "1px solid #1f1f1f",
                    borderRadius: 12,
                    padding: "24px 28px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 6px 0" }}>
                        {selected.name}
                      </h2>
                      <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 14 }}>
                        {selected.tagline}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#fff",
                        background: statusColor(selected.status),
                        borderRadius: 6,
                        padding: "4px 12px",
                        flexShrink: 0,
                      }}
                    >
                      {statusLabel(selected.status)}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Platform</div>
                      <div style={{ fontSize: 13, color: BLUE, fontWeight: 600 }}>{selected.platform}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Stage</div>
                      <div style={{ fontSize: 13, color: "#d1d5db" }}>{selected.stage}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Added</div>
                      <div style={{ fontSize: 13, color: "#d1d5db" }}>{selected.addedDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Last Updated</div>
                      <div style={{ fontSize: 13, color: "#d1d5db" }}>{selected.lastUpdated}</div>
                    </div>
                  </div>
                </div>

                {/* 2. Overview + Pain Point */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div
                    style={{
                      background: "#161616",
                      border: "1px solid #1f1f1f",
                      borderRadius: 12,
                      padding: "20px 24px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: BLUE,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 10,
                      }}
                    >
                      Overview
                    </div>
                    <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.65 }}>
                      {selected.overview}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#161616",
                      border: "1px solid #1f1f1f",
                      borderRadius: 12,
                      padding: "20px 24px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#f59e0b",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 10,
                      }}
                    >
                      Pain Point
                    </div>
                    <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.65 }}>
                      {selected.painPoint}
                    </div>
                  </div>
                </div>

                {/* 3. Strengths + Challenges */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div
                    style={{
                      background: "#161616",
                      border: "1px solid #1f1f1f",
                      borderRadius: 12,
                      padding: "20px 24px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#22c55e",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 12,
                      }}
                    >
                      Strengths
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {selected.strengths.map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "#22c55e", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                          <span style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.5 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#161616",
                      border: "1px solid #1f1f1f",
                      borderRadius: 12,
                      padding: "20px 24px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#f59e0b",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 12,
                      }}
                    >
                      Challenges
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {selected.challenges.map((c, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "#f59e0b", fontSize: 13, flexShrink: 0, marginTop: 1 }}>⚠</span>
                          <span style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.5 }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Monetization, Timeline, Tech Stack */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Monetization", value: selected.monetization, color: "#22c55e" },
                    { label: "Timeline", value: selected.timeline, color: "#a855f7" },
                    { label: "Tech Stack", value: selected.techStack, color: BLUE },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      style={{
                        background: "#161616",
                        border: "1px solid #1f1f1f",
                        borderRadius: 12,
                        padding: "18px 20px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 8,
                        }}
                      >
                        {label}
                      </div>
                      <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* 5. Game Plan */}
                {selected.gamePlan && (
                  <div
                    style={{
                      background: "#161616",
                      border: "1px solid #1f1f1f",
                      borderRadius: 12,
                      padding: "24px 28px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: BLUE,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 16,
                      }}
                    >
                      Game Plan
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#d1d5db",
                        lineHeight: 1.75,
                      }}
                    >
                      {renderMarkdown(selected.gamePlan)}
                    </div>
                  </div>
                )}

                {/* 6. Notes */}
                {selected.notes && (
                  <div
                    style={{
                      background: "#161616",
                      border: "1px solid #1f1f1f",
                      borderRadius: 12,
                      padding: "24px 28px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 16,
                      }}
                    >
                      Notes
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#d1d5db",
                        lineHeight: 1.75,
                      }}
                    >
                      {renderMarkdown(selected.notes)}
                    </div>
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
