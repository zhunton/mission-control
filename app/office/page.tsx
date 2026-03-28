"use client";

import { useState, useEffect } from "react";

interface AgentState {
  id: string;
  name: string;
  emoji: string;
  color: string;
  status: "idle" | "working" | "meeting";
  room: "break-room" | "workstation-1" | "workstation-2" | "workstation-3" | "meeting-table";
}

const INITIAL_AGENTS: AgentState[] = [
  { id: "wally", name: "Wally", emoji: "🤖", color: "#3b82f6", status: "working", room: "workstation-1" },
  { id: "dev", name: "Dev Agent", emoji: "💻", color: "#06b6d4", status: "working", room: "workstation-2" },
  { id: "research", name: "Research", emoji: "🔍", color: "#8b5cf6", status: "idle", room: "break-room" },
  { id: "writing", name: "Writing", emoji: "✍️", color: "#ec4899", status: "idle", room: "break-room" },
];

const ROOM_POSITIONS: Record<string, { x: number; y: number; label: string; capacity: number }> = {
  "workstation-1": { x: 12, y: 18, label: "Workstation A", capacity: 1 },
  "workstation-2": { x: 12, y: 42, label: "Workstation B", capacity: 1 },
  "workstation-3": { x: 12, y: 66, label: "Workstation C", capacity: 1 },
  "break-room": { x: 68, y: 70, label: "Break Room", capacity: 4 },
  "meeting-table": { x: 62, y: 20, label: "Meeting Table", capacity: 4 },
};

function PixelAgent({ agent, posX, posY, index }: { agent: AgentState; posX: number; posY: number; index: number }) {
  const animMap = {
    working: "agent-work 1.5s ease-in-out infinite",
    idle: "agent-idle 2s ease-in-out infinite",
    meeting: "agent-idle 3s ease-in-out infinite",
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${posX + index * 4}%`,
        top: `${posY + index * 3}%`,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        zIndex: 10,
        animation: animMap[agent.status],
      }}
    >
      {/* Agent bubble */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `${agent.color}20`,
          border: `2px solid ${agent.color}60`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          boxShadow: `0 0 12px ${agent.color}30`,
          backdropFilter: "blur(4px)",
        }}
      >
        {agent.emoji}
      </div>
      {/* Name tag */}
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: "#fff",
          background: `${agent.color}cc`,
          padding: "1px 5px",
          borderRadius: 4,
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}
      >
        {agent.name}
      </div>
    </div>
  );
}

function Room({
  id,
  label,
  x,
  y,
  width,
  height,
  agents,
  icon,
  onAgentPlace,
  dragOverRoom,
  setDragOverRoom,
}: {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  agents: AgentState[];
  icon: string;
  onAgentPlace?: (agentId: string, room: string) => void;
  dragOverRoom: string | null;
  setDragOverRoom: (id: string | null) => void;
}) {
  const isOver = dragOverRoom === id;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        background: isOver ? "#1d2d1d" : "#0f1419",
        border: `1px solid ${isOver ? "#22c55e60" : "#1e2a35"}`,
        borderRadius: 8,
        transition: "all 0.15s ease",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOverRoom(id);
      }}
      onDragLeave={() => setDragOverRoom(null)}
      onDrop={(e) => {
        e.preventDefault();
        const agentId = e.dataTransfer.getData("agentId");
        if (agentId && onAgentPlace) onAgentPlace(agentId, id);
        setDragOverRoom(null);
      }}
    >
      {/* Room label */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 8,
          fontSize: 9,
          fontWeight: 700,
          color: "#334155",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <span>{icon}</span>
        {label}
      </div>

      {/* Furniture */}
      {id.startsWith("workstation") && (
        <>
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "15%",
              right: "15%",
              height: "35%",
              background: "#0d1a2e",
              border: "1px solid #1e3a5f",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "60%",
                height: "60%",
                background: "#0a2040",
                border: "1px solid #1e4080",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
              }}
            >
              🖥️
            </div>
          </div>
        </>
      )}
      {id === "break-room" && (
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 18,
            opacity: 0.5,
          }}
        >
          ☕
        </div>
      )}
      {id === "meeting-table" && (
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50%",
            height: "30%",
            background: "#1a1a0a",
            border: "1px solid #3a3a1a",
            borderRadius: 8,
          }}
        />
      )}

      {/* Agents in this room */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 4, padding: "20px 8px 8px" }}>
        {agents.map((agent, i) => (
          <div
            key={agent.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("agentId", agent.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              cursor: "grab",
              animation:
                agent.status === "working"
                  ? "agent-work 1.5s ease-in-out infinite"
                  : "agent-idle 2s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: `${agent.color}20`,
                border: `2px solid ${agent.color}70`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: `0 0 10px ${agent.color}25`,
              }}
            >
              {agent.emoji}
            </div>
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: "#fff",
                background: `${agent.color}cc`,
                padding: "1px 4px",
                borderRadius: 3,
                whiteSpace: "nowrap",
              }}
            >
              {agent.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_LABELS = {
  working: { label: "Working", color: "#3b82f6" },
  idle: { label: "Idle", color: "#f59e0b" },
  meeting: { label: "In Meeting", color: "#22c55e" },
};

const ROOM_TO_STATUS: Record<string, AgentState["status"]> = {
  "workstation-1": "working",
  "workstation-2": "working",
  "workstation-3": "working",
  "break-room": "idle",
  "meeting-table": "meeting",
};

export default function OfficePage() {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [dragOverRoom, setDragOverRoom] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Simulate agent movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setAgents((prev) =>
        prev.map((agent) => {
          if (Math.random() > 0.92) {
            const rooms = Object.keys(ROOM_POSITIONS);
            const newRoom = rooms[Math.floor(Math.random() * rooms.length)] as AgentState["room"];
            return { ...agent, room: newRoom, status: ROOM_TO_STATUS[newRoom] };
          }
          return agent;
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAgentPlace = (agentId: string, roomId: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, room: roomId as AgentState["room"], status: ROOM_TO_STATUS[roomId] }
          : a
      )
    );
  };

  const agentsByRoom = (roomId: string) => agents.filter((a) => a.room === roomId);

  const rooms = [
    { id: "workstation-1", label: "Workstation A", x: 2, y: 4, width: 30, height: 24, icon: "💼" },
    { id: "workstation-2", label: "Workstation B", x: 2, y: 32, width: 30, height: 24, icon: "💼" },
    { id: "workstation-3", label: "Workstation C", x: 2, y: 60, width: 30, height: 24, icon: "💼" },
    { id: "meeting-table", label: "Meeting Room", x: 36, y: 4, width: 60, height: 36, icon: "📋" },
    { id: "break-room", label: "Break Room", x: 36, y: 46, width: 60, height: 38, icon: "☕" },
  ];

  return (
    <div style={{ padding: "32px 32px", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>Office</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Live agent presence — drag agents between rooms</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {Object.entries(STATUS_LABELS).map(([status, config]) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: config.color }} />
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", gap: 20, minHeight: 0 }}>
        {/* Office floor */}
        <div
          style={{
            flex: 1,
            background: "#0c1117",
            border: "1px solid #1a2535",
            borderRadius: 14,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid overlay for pixel effect */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              zIndex: 0,
            }}
          />

          {/* Floor label */}
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 14,
              fontSize: 9,
              fontWeight: 700,
              color: "#1e3a5f",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              zIndex: 1,
            }}
          >
            Mission Control HQ — Floor 1
          </div>

          {/* Scan line animation */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(to right, transparent, #3b82f615, transparent)",
              animation: "scan-line 8s linear infinite",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* Rooms */}
          {rooms.map((room) => (
            <Room
              key={room.id}
              id={room.id}
              label={room.label}
              x={room.x}
              y={room.y}
              width={room.width}
              height={room.height}
              icon={room.icon}
              agents={agentsByRoom(room.id)}
              onAgentPlace={handleAgentPlace}
              dragOverRoom={dragOverRoom}
              setDragOverRoom={setDragOverRoom}
            />
          ))}
        </div>

        {/* Agent Status Panel */}
        <div
          style={{
            width: 200,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            Agent Status
          </div>
          {agents.map((agent) => {
            const statusConfig = STATUS_LABELS[agent.status];
            const roomLabel = rooms.find((r) => r.id === agent.room)?.label || agent.room;
            return (
              <div
                key={agent.id}
                style={{
                  background: "#111",
                  border: "1px solid #1e1e1e",
                  borderRadius: 10,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `${agent.color}15`,
                    border: `1.5px solid ${agent.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {agent.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#e5e7eb", marginBottom: 2 }}>{agent.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: statusConfig.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 10, color: statusConfig.color, fontWeight: 600 }}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 9, color: "#4b5563", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {roomLabel}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div
            style={{
              marginTop: "auto",
              padding: "12px",
              background: "#0d0d0d",
              border: "1px solid #1a1a1a",
              borderRadius: 10,
              fontSize: 10,
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            <div style={{ fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>How it works</div>
            Agents move automatically every few seconds. Drag any agent to a different room to move them manually.
          </div>
        </div>
      </div>
    </div>
  );
}
