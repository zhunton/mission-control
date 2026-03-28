"use client";

import { useState } from "react";
import { Plus, X, Calendar, User, Tag } from "lucide-react";

type TaskStatus = "backlog" | "in-progress" | "needs-review" | "complete";

interface Task {
  id: string;
  title: string;
  description: string;
  agent: string;
  date: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
}

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Set up Claude API integration",
    description: "Connect Mission Control to Claude API for live agent responses",
    agent: "Wally",
    date: "Mar 28",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "2",
    title: "Design memory indexing system",
    description: "Create structured format for storing and retrieving conversation memories",
    agent: "Wally",
    date: "Mar 27",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "3",
    title: "Research competitor tools",
    description: "Analyze Notion AI, Linear, and similar PM tools for feature inspiration",
    agent: "Research Agent",
    date: "Mar 29",
    status: "backlog",
    priority: "medium",
  },
  {
    id: "4",
    title: "Build document ingestion pipeline",
    description: "Auto-extract and categorize uploaded PDFs and markdown files",
    agent: "Wally",
    date: "Mar 30",
    status: "backlog",
    priority: "medium",
  },
  {
    id: "5",
    title: "Calendar sync with Google Calendar",
    description: "OAuth flow and two-way event sync",
    agent: "Dev Agent",
    date: "Apr 1",
    status: "backlog",
    priority: "low",
  },
  {
    id: "6",
    title: "Review Mission Control MVP spec",
    description: "Check all features match original requirements, flag gaps",
    agent: "Wally",
    date: "Mar 26",
    status: "needs-review",
    priority: "high",
  },
  {
    id: "7",
    title: "Initial project scaffolding",
    description: "Next.js 15, TypeScript, Tailwind CSS, core layout",
    agent: "Dev Agent",
    date: "Mar 25",
    status: "complete",
    priority: "high",
  },
  {
    id: "8",
    title: "Define agent roles and hierarchy",
    description: "Document responsibilities: Wally as Director of Agents, sub-agent structure",
    agent: "Wally",
    date: "Mar 24",
    status: "complete",
    priority: "medium",
  },
];

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "#6b7280" },
  { id: "in-progress", label: "In Progress", color: "#3b82f6" },
  { id: "needs-review", label: "Needs Review", color: "#f59e0b" },
  { id: "complete", label: "Complete", color: "#22c55e" },
];

const PRIORITY_COLORS = {
  low: "#6b7280",
  medium: "#f59e0b",
  high: "#ef4444",
};

const AGENT_COLORS: Record<string, string> = {
  Wally: "#3b82f6",
  "Research Agent": "#8b5cf6",
  "Dev Agent": "#06b6d4",
};

function TaskCard({ task, onMove }: { task: Task; onMove: (id: string, status: TaskStatus) => void }) {
  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #222",
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 8,
        cursor: "grab",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#333";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#222";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb", lineHeight: "1.4", flex: 1 }}>
          {task.title}
        </div>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: PRIORITY_COLORS[task.priority],
            marginLeft: 8,
            marginTop: 4,
            flexShrink: 0,
          }}
        />
      </div>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10, lineHeight: "1.5" }}>
        {task.description}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: AGENT_COLORS[task.agent] || "#9ca3af",
              background: `${AGENT_COLORS[task.agent] || "#9ca3af"}18`,
              padding: "2px 7px",
              borderRadius: 4,
              border: `1px solid ${AGENT_COLORS[task.agent] || "#9ca3af"}30`,
            }}
          >
            {task.agent}
          </div>
        </div>
        <div style={{ fontSize: 10, color: "#4b5563", display: "flex", alignItems: "center", gap: 3 }}>
          <Calendar size={10} />
          {task.date}
        </div>
      </div>
    </div>
  );
}

function NewTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (task: Omit<Task, "id">) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [agent, setAgent] = useState("Wally");
  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title,
      description,
      agent,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status,
      priority,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          borderRadius: 14,
          padding: 28,
          width: 460,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>New Task</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              style={{
                width: "100%",
                background: "#0f0f0f",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 13,
                color: "#e5e7eb",
                outline: "none",
              }}
              autoFocus
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional context..."
              rows={3}
              style={{
                width: "100%",
                background: "#0f0f0f",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 13,
                color: "#e5e7eb",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                Agent
              </label>
              <select
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                style={{
                  width: "100%",
                  background: "#0f0f0f",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontSize: 13,
                  color: "#e5e7eb",
                  outline: "none",
                }}
              >
                <option>Wally</option>
                <option>Research Agent</option>
                <option>Dev Agent</option>
                <option>Zach</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                style={{
                  width: "100%",
                  background: "#0f0f0f",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontSize: 13,
                  color: "#e5e7eb",
                  outline: "none",
                }}
              >
                <option value="backlog">Backlog</option>
                <option value="in-progress">In Progress</option>
                <option value="needs-review">Needs Review</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                style={{
                  width: "100%",
                  background: "#0f0f0f",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontSize: 13,
                  color: "#e5e7eb",
                  outline: "none",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid #2a2a2a",
                background: "transparent",
                color: "#9ca3af",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                background: "#3b82f6",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showModal, setShowModal] = useState(false);

  const addTask = (task: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: Date.now().toString() }]);
  };

  const moveTask = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const counts = {
    total: tasks.length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    "needs-review": tasks.filter((t) => t.status === "needs-review").length,
    complete: tasks.filter((t) => t.status === "complete").length,
  };

  return (
    <div style={{ padding: "32px 32px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>Tasks</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Track work across all agents</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "#3b82f6",
            border: "none",
            borderRadius: 8,
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={15} />
          New Task
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total Tasks", value: counts.total, color: "#9ca3af", icon: "📋" },
          { label: "In Progress", value: counts["in-progress"], color: "#3b82f6", icon: "⚡" },
          { label: "Needs Review", value: counts["needs-review"], color: "#f59e0b", icon: "👀" },
          { label: "Complete", value: counts.complete, color: "#22c55e", icon: "✅" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "#161616",
              border: "1px solid #222",
              borderRadius: 12,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${card.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: card.color, lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "start" }}>
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {col.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: col.color,
                    background: `${col.color}18`,
                    borderRadius: 4,
                    padding: "1px 6px",
                  }}
                >
                  {colTasks.length}
                </span>
              </div>
              <div
                style={{
                  minHeight: 120,
                  background: "#0d0d0d",
                  borderRadius: 10,
                  padding: 10,
                  border: "1px solid #1a1a1a",
                }}
              >
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onMove={moveTask} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <NewTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />
      )}
    </div>
  );
}
