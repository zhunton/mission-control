"use client";

import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "online" | "working" | "idle" | "offline";
  emoji: string;
  avatar?: string;
  color: string;
  description: string;
  skills: string[];
  currentTask?: string;
  reportsTo?: string;
}

const AGENTS: Agent[] = [
  {
    id: "zach",
    name: "Zach Hunton",
    role: "Owner",
    status: "online",
    emoji: "👤",
    avatar: "/zach-king.jpg",
    color: "#f59e0b",
    description: "Founder and owner of Mission Control. Final decision-maker on all strategic direction. Collaborates directly with Wally on daily operations.",
    skills: ["Strategy", "Vision", "Leadership", "Product"],
  },
  {
    id: "wally",
    name: "Wally",
    role: "Director of Agents",
    status: "working",
    emoji: "🤖",
    avatar: "/wally-wizard.jpg",
    color: "#3b82f6",
    description: "Primary AI assistant and Director of Agents. Coordinates all sub-agents, manages task delegation, maintains memory, and serves as Zach's main interface.",
    skills: ["Coordination", "Memory", "Delegation", "Strategy", "Communication"],
    currentTask: "Building Mission Control MVP",
    reportsTo: "zach",
  },
  {
    id: "research",
    name: "Research Agent",
    role: "Research Specialist",
    status: "idle",
    emoji: "🔍",
    color: "#8b5cf6",
    description: "Specializes in information gathering, competitive analysis, and synthesizing research into actionable insights for Zach and Wally.",
    skills: ["Web Research", "Analysis", "Synthesis", "Reporting"],
    currentTask: undefined,
    reportsTo: "wally",
  },
  {
    id: "dev",
    name: "Dev Agent",
    role: "Software Developer",
    status: "working",
    emoji: "💻",
    color: "#06b6d4",
    description: "Full-stack development specialist. Handles code generation, debugging, architecture decisions, and technical implementation.",
    skills: ["TypeScript", "Next.js", "React", "Node.js", "Architecture"],
    currentTask: "Code review and optimization",
    reportsTo: "wally",
  },
  {
    id: "writing",
    name: "Writing Agent",
    role: "Content Specialist",
    status: "idle",
    emoji: "✍️",
    color: "#ec4899",
    description: "Handles all content creation, copywriting, documentation, and communication. Ensures clear and consistent voice across all outputs.",
    skills: ["Copywriting", "Documentation", "Editing", "Communication"],
    currentTask: undefined,
    reportsTo: "wally",
  },
];

const STATUS_CONFIG = {
  online: { color: "#22c55e", label: "Online" },
  working: { color: "#3b82f6", label: "Working" },
  idle: { color: "#f59e0b", label: "Idle" },
  offline: { color: "#4b5563", label: "Offline" },
};

function AgentNode({
  agent,
  selected,
  onClick,
  size = "normal",
}: {
  agent: Agent;
  selected: boolean;
  onClick: () => void;
  size?: "large" | "normal" | "small";
}) {
  const statusConfig = STATUS_CONFIG[agent.status];
  const isLarge = size === "large";
  const nodeSize = isLarge ? 130 : size === "small" ? 90 : 108;
  const emojiSize = isLarge ? 48 : size === "small" ? 32 : 38;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: nodeSize,
            height: nodeSize,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}15)`,
            border: `2px solid ${selected ? agent.color : agent.color + "40"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: emojiSize,
            transition: "all 0.2s ease",
            boxShadow: selected ? `0 0 0 3px ${agent.color}30, 0 8px 24px ${agent.color}20` : "none",
            overflow: "hidden",
          }}
        >
          {agent.avatar ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            agent.emoji
          )}
        </div>
        {/* Status dot */}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            width: isLarge ? 18 : 13,
            height: isLarge ? 18 : 13,
            borderRadius: "50%",
            background: statusConfig.color,
            border: `2px solid #0a0a0a`,
            animation: agent.status === "working" ? "pulse-dot 2s infinite" : "none",
          }}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: isLarge ? 17 : size === "small" ? 13 : 15, fontWeight: 700, color: selected ? "#fff" : "#e5e7eb" }}>
          {agent.name}
        </div>
        <div style={{ fontSize: isLarge ? 13 : size === "small" ? 11 : 12, color: agent.color, fontWeight: 600 }}>{agent.role}</div>
      </div>
    </div>
  );
}

export default function PeoplePage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0]);

  const zach = AGENTS.find((a) => a.id === "zach")!;
  const wally = AGENTS.find((a) => a.id === "wally")!;
  const subAgents = AGENTS.filter((a) => a.reportsTo === "wally");

  return (
    <div style={{ padding: "32px 32px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>People</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Agent hierarchy and team structure</p>
      </div>

      <div style={{ display: "flex", gap: 32, flex: 1 }}>
        {/* Org Chart */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Zach */}
          <AgentNode
            agent={zach}
            selected={selectedAgent.id === zach.id}
            onClick={() => setSelectedAgent(zach)}
            size="large"
          />

          {/* Connector to Wally */}
          <div
            style={{
              width: 2,
              height: 56,
              background: "linear-gradient(to bottom, #f59e0b40, #3b82f640)",
              margin: "8px 0",
            }}
          />

          {/* Wally */}
          <AgentNode
            agent={wally}
            selected={selectedAgent.id === wally.id}
            onClick={() => setSelectedAgent(wally)}
            size="normal"
          />

          {/* Connectors to sub-agents */}
          <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", marginTop: 8 }}>
            <div
              style={{
                width: 2,
                height: 32,
                background: "#3b82f440",
              }}
            />
          </div>
          <div
            style={{
              width: `${subAgents.length * 190}px`,
              height: 2,
              background: "linear-gradient(to right, transparent, #3b82f440, transparent)",
              marginBottom: 0,
            }}
          />
          {/* Vertical drops */}
          <div style={{ display: "flex", gap: 0, width: `${subAgents.length * 190}px`, justifyContent: "space-around" }}>
            {subAgents.map(() => (
              <div
                key={Math.random()}
                style={{
                  width: 2,
                  height: 32,
                  background: "#3b82f440",
                }}
              />
            ))}
          </div>

          {/* Sub-agents row */}
          <div style={{ display: "flex", gap: 40 }}>
            {subAgents.map((agent) => (
              <AgentNode
                key={agent.id}
                agent={agent}
                selected={selectedAgent.id === agent.id}
                onClick={() => setSelectedAgent(agent)}
                size="small"
              />
            ))}
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 40,
              padding: "14px 20px",
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: 12,
            }}
          >
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = AGENTS.filter((a) => a.status === status).length;
              if (count === 0) return null;
              return (
                <div key={status} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: config.color }} />
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>
                    {count} {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div
          style={{
            width: 320,
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: 14,
            padding: 24,
            height: "fit-content",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `${selectedAgent.color}20`,
                border: `2px solid ${selectedAgent.color}50`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                overflow: "hidden",
              }}
            >
              {selectedAgent.avatar ? (
                <img
                  src={selectedAgent.avatar}
                  alt={selectedAgent.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                selectedAgent.emoji
              )}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{selectedAgent.name}</div>
              <div style={{ fontSize: 12, color: selectedAgent.color, fontWeight: 600 }}>{selectedAgent.role}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: STATUS_CONFIG[selectedAgent.status].color,
                  }}
                />
                <span style={{ fontSize: 11, color: STATUS_CONFIG[selectedAgent.status].color }}>
                  {STATUS_CONFIG[selectedAgent.status].label}
                </span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, marginBottom: 20 }}>
            {selectedAgent.description}
          </div>

          {selectedAgent.currentTask && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                Current Task
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#3b82f6",
                  background: "#3b82f615",
                  border: "1px solid #3b82f630",
                  borderRadius: 8,
                  padding: "6px 10px",
                }}
              >
                ⚡ {selectedAgent.currentTask}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              Skills
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {selectedAgent.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: selectedAgent.color,
                    background: `${selectedAgent.color}15`,
                    border: `1px solid ${selectedAgent.color}30`,
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {selectedAgent.reportsTo && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e1e1e" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                Reports To
              </div>
              {(() => {
                const manager = AGENTS.find((a) => a.id === selectedAgent.reportsTo);
                if (!manager) return null;
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedAgent(manager)}
                  >
                    {manager.avatar ? (
                      <img
                        src={manager.avatar}
                        alt={manager.name}
                        style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: 18 }}>{manager.emoji}</span>
                    )}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e5e7eb" }}>{manager.name}</div>
                      <div style={{ fontSize: 10, color: manager.color }}>{manager.role}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
