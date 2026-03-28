"use client";

import { useState } from "react";
import { Plus, X, Calendar, Info } from "lucide-react";

type TaskStatus = "backlog" | "in-progress" | "needs-review" | "complete";

interface Task {
  id: string;
  title: string;
  description: string;
  why: string;
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
    why: "Real-time Claude API access is the foundation of all live agent functionality — without it, Mission Control is just a static UI. This unblocks every feature that depends on AI responses.",
    agent: "Wally",
    date: "Mar 28",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "2",
    title: "Design memory indexing system",
    description: "Create structured format for storing and retrieving conversation memories",
    why: "Persistent memory is what separates Mission Control from a generic chatbot. Indexing conversations allows Wally to maintain context across sessions and surface relevant past decisions automatically.",
    agent: "Wally",
    date: "Mar 27",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "3",
    title: "Research competitor tools",
    description: "Analyze Notion AI, Linear, and similar PM tools for feature inspiration",
    why: "Understanding what already exists helps avoid reinventing the wheel and identify gaps in the market. Key differentiators should be informed by what competitors are missing, not just what they have.",
    agent: "Research Agent",
    date: "Mar 29",
    status: "backlog",
    priority: "medium",
  },
  {
    id: "4",
    title: "Build document ingestion pipeline",
    description: "Auto-extract and categorize uploaded PDFs and markdown files",
    why: "Documents are a critical knowledge source — PDFs, specs, and notes shouldn't live in silos. Ingesting them into Mission Control means Wally can reference their content during tasks and planning.",
    agent: "Wally",
    date: "Mar 30",
    status: "backlog",
    priority: "medium",
  },
  {
    id: "5",
    title: "Calendar sync with Google Calendar",
    description: "OAuth flow and two-way event sync",
    why: "Zach's real schedule lives in Google Calendar. Syncing it gives Wally accurate context about availability, deadlines, and commitments when planning tasks and scheduling agent work.",
    agent: "Dev Agent",
    date: "Apr 1",
    status: "backlog",
    priority: "low",
  },
  {
    id: "6",
    title: "Review Mission Control MVP spec",
    description: "Check all features match original requirements, flag gaps",
    why: "Before building further, validating alignment with the original vision is critical. Catching misalignments early prevents expensive rework and keeps scope from quietly drifting.",
    agent: "Wally",
    date: "Mar 26",
    status: "needs-review",
    priority: "high",
  },
  {
    id: "7",
    title: "Initial project scaffolding",
    description: "Next.js 15, TypeScript, Tailwind CSS, core layout",
    why: "A clean, opinionated foundation saves time on every subsequent feature. Choosing the right stack up front ensures the project can scale without major rewrites.",
    agent: "Dev Agent",
    date: "Mar 25",
    status: "complete",
    priority: "high",
  },
  {
    id: "8",
    title: "Define agent roles and hierarchy",
    description: "Document responsibilities: Wally as Director of Agents, sub-agent structure",
    why: "Clear role definitions prevent confusion when multiple agents are active. Knowing who owns what makes delegation unambiguous and reduces coordination overhead.",
    agent: "Wally",
    date: "Mar 24",
    status: "complete",
    priority: "medium",
  },
];

const COLUMNS: { id: TaskStatus; label: string; color: string; accentBorder?: string }[] = [
  { id: "backlog", label: "Backlog", color: "#6b7280" },
  { id: "in-progress", label: "In Progress", color: "#3b82f6", accentBorder: "#3b82f6" },
  { id: "needs-review", label: "Needs Review", color: "#f59e0b", accentBorder: "#f59e0b" },
  { id: "complete", label: "Complete", color: "#22c55e", accentBorder: "#22c55e" },
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

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#161616",
        border: "1px solid #222",
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 8,
        cursor: "pointer",
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

function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const statusColors: Record<TaskStatus, string> = {
    backlog: "#6b7280",
    "in-progress": "#3b82f6",
    "needs-review": "#f59e0b",
    complete: "#22c55e",
  };
  const statusLabels: Record<TaskStatus, string> = {
    backlog: "Backlog",
    "in-progress": "In Progress",
    "needs-review": "Needs Review",
    complete: "Complete",
  };
  const statusColor = statusColors[task.status];

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
          borderTop: `3px solid ${statusColor}`,
          borderRadius: 14,
          padding: 28,
          width: 520,
          maxWidth: "90vw",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ flex: 1, marginRight: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 10, lineHeight: 1.4 }}>
              {task.title}
            </h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: statusColor,
                  background: `${statusColor}18`,
                  border: `1px solid ${statusColor}40`,
                  padding: "3px 8px",
                  borderRadius: 5,
                }}
              >
                {statusLabels[task.status]}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: PRIORITY_COLORS[task.priority],
                  background: `${PRIORITY_COLORS[task.priority]}18`,
                  border: `1px solid ${PRIORITY_COLORS[task.priority]}40`,
                  padding: "3px 8px",
                  borderRadius: 5,
                }}
              >
                {task.priority} priority
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: AGENT_COLORS[task.agent] || "#9ca3af",
                  background: `${AGENT_COLORS[task.agent] || "#9ca3af"}18`,
                  border: `1px solid ${AGENT_COLORS[task.agent] || "#9ca3af"}30`,
                  padding: "3px 8px",
                  borderRadius: 5,
                }}
              >
                {task.agent}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#4b5563",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Calendar size={11} />
                {task.date}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: 4, flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            Description
          </div>
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid #1e1e1e",
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 13,
              color: "#d1d5db",
              lineHeight: 1.6,
            }}
          >
            {task.description}
          </div>
        </div>

        {/* Why */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Info size={13} color="#f59e0b" />
            <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Why this matters
            </div>
          </div>
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid #2a1f00",
              borderLeft: "3px solid #f59e0b50",
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 13,
              color: "#d1d5db",
              lineHeight: 1.7,
            }}
          >
            {task.why}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (task: Omit<Task, "id">) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [why, setWhy] = useState("");
  const [agent, setAgent] = useState("Wally");
  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title,
      description,
      why,
      agent,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status,
      priority,
    });
    onClose();
  };

  const inputStyle = {
    width: "100%",
    background: "#0f0f0f",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13,
    color: "#e5e7eb",
    outline: "none",
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: 6,
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
          width: 480,
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
            <label style={labelStyle}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              style={inputStyle}
              autoFocus
            />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional context..."
              rows={2}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>
          <div>
            <label style={labelStyle}>Why this matters</label>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Why is this task important?"
              rows={2}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Agent</label>
              <select value={agent} onChange={(e) => setAgent(e.target.value)} style={inputStyle}>
                <option>Wally</option>
                <option>Research Agent</option>
                <option>Dev Agent</option>
                <option>Zach</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} style={inputStyle}>
                <option value="backlog">Backlog</option>
                <option value="in-progress">In Progress</option>
                <option value="needs-review">Needs Review</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")} style={inputStyle}>
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
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
          onClick={() => setShowNewModal(true)}
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
                  borderTop: col.accentBorder ? `2px solid ${col.accentBorder}50` : "1px solid #1a1a1a",
                }}
              >
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showNewModal && (
        <NewTaskModal onClose={() => setShowNewModal(false)} onAdd={addTask} />
      )}

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
