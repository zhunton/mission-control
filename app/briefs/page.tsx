"use client";

import { useState, useEffect } from "react";

interface BriefEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Briefs {
  morning: BriefEntry[];
  ai: BriefEntry[];
}

function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.trim() === "") return <div key={i} style={{ height: 12 }} />;

    // Bold markdown (**text**)
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j} style={{ color: "#f3f4f6", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={j}>{part}</span>;
    });

    return (
      <div key={i} style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.75, marginBottom: 2 }}>
        {rendered}
      </div>
    );
  });
}

function getPreview(content: string) {
  const firstLine = content.split("\n").find((l) => l.trim() !== "");
  if (!firstLine) return "";
  // Strip markdown bold
  return firstLine.replace(/\*\*/g, "").slice(0, 72);
}

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Briefs>({ morning: [], ai: [] });
  const [activeTab, setActiveTab] = useState<"morning" | "ai">("morning");
  const [selectedBrief, setSelectedBrief] = useState<BriefEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/briefs")
      .then((r) => r.json())
      .then((data: Briefs) => {
        setBriefs(data);
        // Auto-select first entry of morning tab
        if (data.morning.length > 0) setSelectedBrief(data.morning[0]);
        setLoading(false);
      });
  }, []);

  const currentList = briefs[activeTab];
  const accentColor = activeTab === "morning" ? "#10b981" : "#3b82f6";

  function handleTabChange(tab: "morning" | "ai") {
    setActiveTab(tab);
    const list = briefs[tab];
    setSelectedBrief(list.length > 0 ? list[0] : null);
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "32px 32px 20px", borderBottom: "1px solid #1a1a1a" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>Briefs</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Morning briefings and AI news — archived and searchable</p>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel */}
        <div
          style={{
            width: 280,
            borderRight: "1px solid #1a1a1a",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #1a1a1a",
              padding: "0 8px",
            }}
          >
            {(["morning", "ai"] as const).map((tab) => {
              const isActive = activeTab === tab;
              const color = tab === "morning" ? "#10b981" : "#3b82f6";
              const label = tab === "morning" ? "🌅 Morning" : "🤖 AI Brief";
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    background: "transparent",
                    border: "none",
                    borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? color : "#6b7280",
                    transition: "all 0.15s ease",
                    marginBottom: -1,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Entry List */}
          <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
            {loading ? (
              <div style={{ padding: 16, fontSize: 13, color: "#4b5563" }}>Loading...</div>
            ) : currentList.length === 0 ? (
              <div style={{ padding: 16, fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>
                No briefs yet. Your first Morning Brief arrives tomorrow at 7:30am.
              </div>
            ) : (
              currentList.map((entry) => {
                const isSelected = selectedBrief?.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedBrief(entry)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 12px",
                      borderRadius: 8,
                      background: isSelected ? "#1d2433" : "transparent",
                      border: isSelected ? `1px solid ${accentColor}30` : "1px solid transparent",
                      cursor: "pointer",
                      marginBottom: 4,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: isSelected ? accentColor : "#4b5563",
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {entry.date}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: isSelected ? "#d1d5db" : "#6b7280",
                        lineHeight: 1.5,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                      }}
                    >
                      {getPreview(entry.content)}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, overflow: "auto", padding: "28px 36px" }}>
          {selectedBrief ? (
            <>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, color: accentColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  {selectedBrief.date}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{selectedBrief.title}</h2>
              </div>
              <div
                style={{
                  background: "#111",
                  border: "1px solid #1e1e1e",
                  borderLeft: `3px solid ${accentColor}60`,
                  borderRadius: 10,
                  padding: "20px 24px",
                }}
              >
                {renderContent(selectedBrief.content)}
              </div>
            </>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 32 }}>📰</div>
              <div style={{ fontSize: 14, color: "#4b5563" }}>Select a brief to read</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
