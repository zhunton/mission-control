"use client";

import { useState, useEffect } from "react";

type PositionKey = "working" | "idle" | "meeting";

interface AgentPosition {
  top: string;
  left: string;
}

interface AgentDef {
  name: string;
  emoji: string;
  color: string;
  avatar: string;
  positions: Record<PositionKey, AgentPosition>;
  intervalMs: number;
  weights: Record<PositionKey, number>;
  location: Record<PositionKey, string>;
}

const AGENTS: AgentDef[] = [
  {
    name: "Wally",
    emoji: "🧙",
    color: "#3b82f6",
    avatar: "/wally-wizard.jpg",
    positions: {
      working: { top: "62%", left: "72%" },
      idle:    { top: "72%", left: "22%" },
      meeting: { top: "42%", left: "48%" },
    },
    intervalMs: 10000,
    weights: { working: 0.60, idle: 0.20, meeting: 0.20 },
    location: { working: "Wizard's Tower", idle: "The Tavern", meeting: "Round Table" },
  },
  {
    name: "Patch",
    emoji: "🔨",
    color: "#f97316",
    avatar: "/patch-blacksmith.jpg",
    positions: {
      working: { top: "22%", left: "75%" },
      idle:    { top: "72%", left: "30%" },
      meeting: { top: "42%", left: "52%" },
    },
    intervalMs: 10000,
    weights: { working: 0.65, idle: 0.20, meeting: 0.15 },
    location: { working: "The Forge", idle: "The Tavern", meeting: "Round Table" },
  },
  {
    name: "Dali",
    emoji: "🎨",
    color: "#a855f7",
    avatar: "/dali-painter.jpg",
    positions: {
      working: { top: "20%", left: "22%" },
      idle:    { top: "72%", left: "38%" },
      meeting: { top: "42%", left: "44%" },
    },
    intervalMs: 10000,
    weights: { working: 0.65, idle: 0.20, meeting: 0.15 },
    location: { working: "Alchemy Lab", idle: "The Tavern", meeting: "Round Table" },
  },
];

function pickPosition(weights: Record<PositionKey, number>): PositionKey {
  const r = Math.random();
  if (r < weights.working) return "working";
  if (r < weights.working + weights.idle) return "idle";
  return "meeting";
}

interface AgentState {
  posKey: PositionKey;
  isMoving: boolean;
}

const walkKeyframes = `
@keyframes agentWalk {
  0%   { transform: translate(-50%, -50%) translateY(0)   scale(1); }
  50%  { transform: translate(-50%, -50%) translateY(-4px) scale(1.05); }
  100% { transform: translate(-50%, -50%) translateY(0)   scale(1); }
}
`;

export default function OfficePage() {
  const [states, setStates] = useState<AgentState[]>(
    AGENTS.map(() => ({ posKey: "working", isMoving: false }))
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    AGENTS.forEach((agent, i) => {
      const interval = setInterval(() => {
        const newKey = pickPosition(agent.weights);
        setStates(prev => {
          const next = [...prev];
          next[i] = { posKey: newKey, isMoving: true };
          return next;
        });
        const stop = setTimeout(() => {
          setStates(prev => {
            const next = [...prev];
            next[i] = { ...next[i], isMoving: false };
            return next;
          });
        }, 6500);
        timers.push(stop);
      }, agent.intervalMs + i * 1700);

      timers.push(interval as unknown as ReturnType<typeof setTimeout>);
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <>
      <style>{walkKeyframes}</style>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Office area */}
        <div style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          minHeight: 0,
        }}>
          {/* SVG background */}
          <img
            src="/office-background.svg"
            alt="Office"
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "100%",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />

          {/* Agent layer — sized/positioned to match the SVG's rendered rect */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}>
            {/* Inner container that matches the SVG aspect ratio (1350:900 = 3:2) */}
            <div style={{
              position: "relative",
              width: "min(100%, calc(100vh * 1.5))",
              aspectRatio: "1350 / 900",
              maxHeight: "100%",
            }}>
              {AGENTS.map((agent, i) => {
                const state = states[i];
                const pos = agent.positions[state.posKey];
                return (
                  <div
                    key={agent.name}
                    style={{
                      position: "absolute",
                      top: pos.top,
                      left: pos.left,
                      transform: "translate(-50%, -50%)",
                      transition: "top 6s ease-in-out, left 6s ease-in-out",
                      animation: state.isMoving ? "agentWalk 0.4s ease-in-out infinite" : undefined,
                    }}
                  >
                    <div style={{ position: "relative", textAlign: "center" }}>
                      {/* Name label */}
                      <div style={{
                        color: "white",
                        fontSize: 11,
                        fontWeight: "bold",
                        marginBottom: 4,
                        textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                        whiteSpace: "nowrap",
                      }}>
                        {agent.name}
                      </div>
                      {/* Avatar + status dot */}
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))",
                            border: `2px solid ${agent.color}`,
                            display: "block",
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "#22c55e",
                          border: "2px solid #0a0a0a",
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          backgroundColor: "rgba(0,0,0,0.92)",
          padding: "6px 16px",
          fontSize: 13,
          color: "#e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
          borderTop: "1px solid #374151",
        }}>
          {AGENTS.map((agent, i) => {
            const state = states[i];
            return (
              <span key={agent.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span style={{ color: "#4b5563", margin: "0 4px" }}>|</span>}
                <span>{agent.emoji} {agent.name} · {agent.location[state.posKey]}</span>
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
