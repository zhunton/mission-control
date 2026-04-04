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

const IRIS_WAYPOINTS = [
  { top: "45%", left: "70.1%" },   // Tavern — 40% weight (home base)
  { top: "22.2%", left: "53%" },   // Wandering point 2 — 20%
  { top: "47.4%", left: "36.9%" }, // Wandering point 3 — 20%
  { top: "65.8%", left: "62.3%" }, // Wandering point 4 — 20%
];
const IRIS_WEIGHTS = [0.40, 0.20, 0.20, 0.20];

function pickIrisWaypoint(current: number): number {
  const remaining = IRIS_WAYPOINTS.map((_, i) => i).filter((i) => i !== current);
  const weights = remaining.map((i) => IRIS_WEIGHTS[i]);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < remaining.length; i++) {
    r -= weights[i];
    if (r <= 0) return remaining[i];
  }
  return remaining[remaining.length - 1];
}

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

// Weights: [working, idle] — meeting station kept in STATIONS for manual trigger only
const WEIGHTS: Record<AgentId, [number, number]> = {
  wally: [0.80, 0.20],
  patch: [0.75, 0.25],
  dali: [0.75, 0.25],
};

function pickStation(agentId: AgentId, hasInProgress: boolean): StationType {
  // Wally is always working — use weights regardless of task status
  if (agentId !== "wally" && !hasInProgress) {
    return "idle";
  }
  const [w] = WEIGHTS[agentId];
  return Math.random() < w ? "working" : "idle";
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
  const officeRef = useRef<HTMLDivElement>(null);

  const [irisState, setIrisState] = useState<{ waypointIndex: number; isMoving: boolean }>({
    waypointIndex: 0,
    isMoving: false,
  });
  const irisIndexRef = useRef(0);

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

  // Iris patrol — random 8–14s interval, weighted waypoint selection
  useEffect(() => {
    function scheduleNext() {
      const delay = 8000 + Math.random() * 6000;
      return setTimeout(() => {
        const next = pickIrisWaypoint(irisIndexRef.current);
        irisIndexRef.current = next;
        setIrisState({ waypointIndex: next, isMoving: true });
        setTimeout(() => {
          setIrisState((prev) => ({ ...prev, isMoving: false }));
        }, 7500);
        timerRef.current = scheduleNext();
      }, delay);
    }
    const timerRef = { current: scheduleNext() };
    return () => clearTimeout(timerRef.current);
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
      <div
        ref={officeRef}
        style={{ flex: 1, position: "relative", overflow: "hidden" }}
      >
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

        {/* Iris — castle maiden NPC */}
        {(() => {
          const wp = IRIS_WAYPOINTS[irisState.waypointIndex];
          return (
            <div
              style={{
                position: "absolute",
                top: wp.top,
                left: wp.left,
                transform: "translate(-50%, -50%)",
                transition: "top 7s ease-in-out, left 7s ease-in-out",
                zIndex: 10,
                textAlign: "center",
                animation: irisState.isMoving
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
                Iris
              </div>
              <img
                src="/character-iris.svg"
                style={{
                  width: 128,
                  height: "auto",
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.9))",
                  display: "block",
                }}
              />
            </div>
          );
        })()}

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
