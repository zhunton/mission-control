"use client";

import { useState, useEffect, useRef } from "react";

const STATIONS = {
  wally: {
    working: { top: "20.9%", left: "43.2%" },
    idle: { top: "31.8%", left: "66.9%" },
    meeting: { top: "38.7%", left: "56.8%" },
  },
  patch: {
    working: { top: "26.6%", left: "20.9%" },
    idle: { top: "31.9%", left: "74.4%" },
    meeting: { top: "36.9%", left: "40.1%" },
  },
  dali: {
    working: { top: "45.8%", left: "22.3%" },
    idle: { top: "31.9%", left: "81.3%" },
    meeting: { top: "44.4%", left: "42.1%" },
  },
};

const AGENTS = [
  { id: "wally", name: "Wally", sprite: "/character-wally.svg", emoji: "🧙" },
  { id: "patch", name: "Patch", sprite: "/character-patch.svg", emoji: "🔨" },
  { id: "dali", name: "Dali", sprite: "/character-dali.svg", emoji: "🎨" },
] as const;

type AgentId = "wally" | "patch" | "dali";
type StationType = "working" | "idle" | "meeting";

const STATUS_COLORS: Record<StationType, string> = {
  working: "#22c55e",
  idle: "#eab308",
  meeting: "#3b82f6",
};

const LOCATION_NAMES: Record<AgentId, Record<StationType, string>> = {
  wally: { working: "Wizard's Orb", idle: "The Tavern", meeting: "Round Table" },
  patch: { working: "The Forge", idle: "The Tavern", meeting: "Round Table" },
  dali: { working: "Painting Room", idle: "The Tavern", meeting: "Round Table" },
};

const WEIGHTS: Record<AgentId, [number, number, number]> = {
  wally: [0.75, 0.10, 0.15],
  patch: [0.65, 0.2, 0.15],
  dali: [0.65, 0.2, 0.15],
};

function pickStation(agentId: AgentId, hasInProgress: boolean): StationType {
  // Wally is always working — use weights regardless of task status
  if (agentId !== "wally" && !hasInProgress) {
    // No active task: only idle or meeting (10% meeting)
    return Math.random() < 0.1 ? "meeting" : "idle";
  }
  const [w, i] = WEIGHTS[agentId];
  const r = Math.random();
  if (r < w) return "working";
  if (r < w + i) return "idle";
  return "meeting";
}

interface AgentState {
  station: StationType;
  isMoving: boolean;
}

async function fetchInProgressAgents(): Promise<Set<AgentId>> {
  const res = await fetch("/api/tasks");
  const tasks: { agent: string; status: string }[] = await res.json();
  const active = new Set<AgentId>();
  for (const task of tasks) {
    if (task.status === "in-progress") {
      const id = task.agent.toLowerCase() as AgentId;
      if (id === "wally" || id === "patch" || id === "dali") active.add(id);
    }
  }
  return active;
}

export default function OfficePage() {
  const [agentStates, setAgentStates] = useState<Record<AgentId, AgentState>>({
    wally: { station: "idle", isMoving: false },
    patch: { station: "idle", isMoving: false },
    dali: { station: "idle", isMoving: false },
  });
  const activeAgents = useRef<Set<AgentId>>(new Set());

  // On load: fetch tasks and set initial stations
  useEffect(() => {
    fetchInProgressAgents().then((active) => {
      activeAgents.current = active;
      setAgentStates({
        wally: { station: "working", isMoving: false },
        patch: { station: active.has("patch") ? "working" : "idle", isMoving: false },
        dali: { station: active.has("dali") ? "working" : "idle", isMoving: false },
      });
    });
  }, []);

  // Re-check task status every 60 seconds
  useEffect(() => {
    const taskInterval = setInterval(() => {
      fetchInProgressAgents().then((active) => {
        activeAgents.current = active;
      });
    }, 60000);
    return () => clearInterval(taskInterval);
  }, []);

  useEffect(() => {
    const intervals = AGENTS.map((agent) => {
      return setInterval(() => {
        const newStation = pickStation(agent.id, activeAgents.current.has(agent.id));
        setAgentStates((prev) => ({
          ...prev,
          [agent.id]: { station: newStation, isMoving: true },
        }));
        setTimeout(() => {
          setAgentStates((prev) => ({
            ...prev,
            [agent.id]: { ...prev[agent.id], isMoving: false },
          }));
        }, 6500);
      }, 12000);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes agentWalk {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-5px); }
        }
        @keyframes agentIdle {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-2px); }
        }
      `}</style>

      {/* Office container */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <img
          src="/office-background.svg"
          alt="Office"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />

        {AGENTS.map((agent) => {
          const state = agentStates[agent.id];
          const station = STATIONS[agent.id][state.station];
          const statusColor = STATUS_COLORS[state.station];
          return (
            <div
              key={agent.id}
              style={{
                position: "absolute",
                top: station.top,
                left: station.left,
                transform: "translate(-50%, -50%)",
                transition: "top 6s ease-in-out, left 6s ease-in-out",
                zIndex: 10,
                textAlign: "center",
                animation: state.isMoving
                  ? "agentWalk 0.4s ease-in-out infinite"
                  : "agentIdle 2s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 3,
                  textShadow: "0 1px 4px rgba(0,0,0,1)",
                  whiteSpace: "nowrap",
                }}
              >
                {agent.name}
              </div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={agent.sprite}
                  style={{
                    width: 128,
                    height: "auto",
                    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.9))",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: statusColor,
                    border: "1.5px solid #0a0a0a",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div
        style={{
          background: "#111",
          color: "#ccc",
          fontSize: 12,
          padding: "5px 14px",
          display: "flex",
          gap: 16,
          alignItems: "center",
          borderTop: "1px solid #222",
          flexShrink: 0,
        }}
      >
        {AGENTS.map((agent, i) => (
          <span key={agent.id}>
            {i > 0 && <span style={{ marginRight: 16, color: "#444" }}>|</span>}
            {agent.emoji} {agent.name} · {LOCATION_NAMES[agent.id][agentStates[agent.id].station]}
          </span>
        ))}
      </div>
    </div>
  );
}
