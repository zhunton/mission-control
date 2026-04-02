"use client";

import { useState, useEffect } from "react";

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

const CATEGORY_LABELS: Record<string, string> = {
  hvac: "HVAC Technical",
  financial: "Financial Analysis",
  hunton: "Hunton Operations",
};

const GOLD = "#f59e0b";
const GOLD_DIM = "#92400e";

function pct(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

function badgeColor(percentage: number): string {
  if (percentage >= 80) return "#16a34a";
  if (percentage >= 60) return "#ca8a04";
  return "#dc2626";
}

function barColor(percentage: number): string {
  if (percentage >= 80) return "#22c55e";
  if (percentage >= 60) return "#eab308";
  return "#ef4444";
}

function calcStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const sorted = [...sessions].sort((a, b) => b.id.localeCompare(a.id));
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].id);
    const curr = new Date(sorted[i].id);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diff) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calcCategoryAvg(sessions: Session[], cat: string): number {
  const relevant = sessions.filter((s) => s.categories[cat]);
  if (relevant.length === 0) return 0;
  const total = relevant.reduce((sum, s) => sum + s.categories[cat].score, 0);
  const max = relevant.reduce((sum, s) => sum + s.categories[cat].total, 0);
  return pct(total, max);
}

function getLast14Days(sessions: Session[]): { label: string; pct: number | null }[] {
  const days: { label: string; pct: number | null }[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const id = d.toISOString().slice(0, 10);
    const session = sessions.find((s) => s.id === id);
    const label = d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
    days.push({ label, pct: session ? session.percentage : null });
  }
  return days;
}

export default function CoachingPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/coaching")
      .then((r) => r.json())
      .then((data: Session[]) => {
        setSessions(data);
        setLoading(false);
      });
  }, []);

  const sorted = [...sessions].sort((a, b) => b.id.localeCompare(a.id));
  const overallAvg =
    sessions.length === 0
      ? 0
      : Math.round(sessions.reduce((s, sess) => s + sess.percentage, 0) / sessions.length);
  const streak = calcStreak(sessions);

  const categories = ["hvac", "financial", "hunton"];
  const catAvgs = categories.map((c) => ({ key: c, avg: calcCategoryAvg(sessions, c) }));
  const bestCat = sessions.length === 0 ? null : catAvgs.reduce((a, b) => (a.avg >= b.avg ? a : b));
  const worstCat = sessions.length === 0 ? null : catAvgs.reduce((a, b) => (a.avg <= b.avg ? a : b));

  const chartDays = getLast14Days(sessions);

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
        padding: "32px 32px",
        overflowY: "auto",
        color: "#e5e7eb",
        fontFamily: "inherit",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>🎓</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Coaching</h1>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Daily quiz performance — track progress, strengths, and areas to improve.</p>
      </div>

      {sessions.length === 0 ? (
        /* Empty State */
        <div
          style={{
            border: `1px solid ${GOLD_DIM}`,
            borderRadius: 12,
            background: "rgba(245,158,11,0.05)",
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: GOLD, marginBottom: 8 }}>
            No sessions yet
          </div>
          <div style={{ fontSize: 14, color: "#9ca3af" }}>
            Your first quiz arrives tomorrow at 8am. Results will appear here.
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            {[
              {
                label: "Overall Average",
                value: `${overallAvg}%`,
                sub: `across ${sessions.length} session${sessions.length !== 1 ? "s" : ""}`,
                color: barColor(overallAvg),
              },
              {
                label: "Current Streak",
                value: `${streak}d`,
                sub: streak === 1 ? "day in a row" : "days in a row",
                color: GOLD,
              },
              {
                label: "Best Category",
                value: bestCat ? `${bestCat.avg}%` : "—",
                sub: bestCat ? CATEGORY_LABELS[bestCat.key] : "no data",
                color: "#22c55e",
              },
              {
                label: "Needs Work",
                value: worstCat ? `${worstCat.avg}%` : "—",
                sub: worstCat ? CATEGORY_LABELS[worstCat.key] : "no data",
                color: "#ef4444",
              },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: "#161616",
                  border: "1px solid #1f1f1f",
                  borderRadius: 12,
                  padding: "20px 20px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  {card.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: card.color, marginBottom: 4 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Performance Chart */}
          <div
            style={{
              background: "#161616",
              border: "1px solid #1f1f1f",
              borderRadius: 12,
              padding: "20px 24px",
              marginBottom: 28,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb", marginBottom: 20 }}>
              Last 14 Days
            </div>
            <svg width="100%" viewBox="0 0 700 120" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
              {/* Gridlines */}
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line
                    x1={0}
                    y1={100 - v}
                    x2={700}
                    y2={100 - v}
                    stroke="#1f1f1f"
                    strokeWidth={1}
                  />
                  <text x={-6} y={100 - v + 4} textAnchor="end" fontSize={9} fill="#4b5563">
                    {v}%
                  </text>
                </g>
              ))}

              {/* Bars */}
              {chartDays.map((day, i) => {
                const barW = 36;
                const gap = 14;
                const x = i * (barW + gap) + 4;
                const barH = day.pct !== null ? day.pct : 0;
                const color = day.pct !== null ? barColor(day.pct) : "#1f1f1f";
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={100 - barH}
                      width={barW}
                      height={barH > 0 ? barH : 2}
                      rx={3}
                      fill={color}
                      opacity={day.pct !== null ? 0.85 : 0.3}
                    />
                    <text
                      x={x + barW / 2}
                      y={115}
                      textAnchor="middle"
                      fontSize={8.5}
                      fill="#6b7280"
                    >
                      {day.label}
                    </text>
                    {day.pct !== null && (
                      <text
                        x={x + barW / 2}
                        y={100 - barH - 5}
                        textAnchor="middle"
                        fontSize={9}
                        fill={color}
                      >
                        {day.pct}%
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
              {[
                { color: "#22c55e", label: "≥80%" },
                { color: "#eab308", label: "60–79%" },
                { color: "#ef4444", label: "<60%" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            {catAvgs.map(({ key, avg }) => (
              <div
                key={key}
                style={{
                  background: "#161616",
                  border: "1px solid #1f1f1f",
                  borderRadius: 12,
                  padding: "18px 20px",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: GOLD, marginBottom: 10 }}>
                  {CATEGORY_LABELS[key]}
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: barColor(avg), marginBottom: 10 }}>
                  {avg}%
                </div>
                {/* Progress bar */}
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: "#2a2a2a",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${avg}%`,
                      borderRadius: 3,
                      background: barColor(avg),
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Session History */}
          <div
            style={{
              background: "#161616",
              border: "1px solid #1f1f1f",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #1f1f1f",
                fontSize: 13,
                fontWeight: 600,
                color: "#e5e7eb",
              }}
            >
              Session History
            </div>

            <div style={{ maxHeight: 480, overflowY: "auto" }}>
              {sorted.map((session) => {
                const isExpanded = expandedId === session.id;
                const bc = badgeColor(session.percentage);
                return (
                  <div key={session.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                    {/* Row */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : session.id)}
                      style={{
                        padding: "14px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        cursor: "pointer",
                        transition: "background 0.1s",
                        background: isExpanded ? "#1a1a1a" : "transparent",
                      }}
                    >
                      <div style={{ flex: 1, fontSize: 13, color: "#e5e7eb", fontWeight: 500 }}>
                        {session.date}
                      </div>
                      <div style={{ fontSize: 13, color: "#9ca3af" }}>
                        {session.score}/{session.total}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: bc,
                          minWidth: 40,
                          textAlign: "right",
                        }}
                      >
                        {session.percentage}%
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#fff",
                          background: bc,
                          padding: "2px 8px",
                          borderRadius: 4,
                          minWidth: 52,
                          textAlign: "center",
                        }}
                      >
                        {session.percentage >= 80
                          ? "Strong"
                          : session.percentage >= 60
                          ? "OK"
                          : "Needs Work"}
                      </div>
                      <div style={{ color: "#4b5563", fontSize: 12 }}>{isExpanded ? "▲" : "▼"}</div>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div style={{ padding: "0 20px 20px", background: "#111" }}>
                        {/* Note */}
                        {session.note && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#9ca3af",
                              fontStyle: "italic",
                              marginBottom: 14,
                              padding: "10px 14px",
                              background: "#161616",
                              borderRadius: 8,
                              border: `1px solid ${GOLD_DIM}`,
                            }}
                          >
                            {session.note}
                          </div>
                        )}

                        {/* Strengths / Weaknesses */}
                        {(session.strengths?.length > 0 || session.weaknesses?.length > 0) && (
                          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                            {session.strengths?.length > 0 && (
                              <div style={{ flex: 1, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                                <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, marginBottom: 6 }}>STRENGTHS</div>
                                {session.strengths.map((s, i) => (
                                  <div key={i} style={{ fontSize: 12, color: "#d1fae5" }}>• {s}</div>
                                ))}
                              </div>
                            )}
                            {session.weaknesses?.length > 0 && (
                              <div style={{ flex: 1, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                                <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginBottom: 6 }}>NEEDS WORK</div>
                                {session.weaknesses.map((w, i) => (
                                  <div key={i} style={{ fontSize: 12, color: "#fecaca" }}>• {w}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Questions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {session.questions?.map((q) => (
                            <div
                              key={q.id}
                              style={{
                                background: "#161616",
                                borderRadius: 8,
                                border: `1px solid ${q.correct ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                                padding: "12px 14px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                                <span style={{ fontSize: 14, flexShrink: 0 }}>{q.correct ? "✅" : "❌"}</span>
                                <div style={{ fontSize: 12, color: "#e5e7eb", fontWeight: 500 }}>{q.question}</div>
                              </div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4, paddingLeft: 24 }}>
                                <span style={{ color: "#6b7280" }}>Your answer: </span>
                                {q.userAnswer}
                              </div>
                              <div style={{ fontSize: 11, color: q.correct ? "#86efac" : "#fca5a5", paddingLeft: 24 }}>
                                {q.feedback}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
