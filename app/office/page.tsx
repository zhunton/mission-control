"use client";

import { useState, useEffect } from "react";

type AgentStatus = "working" | "idle" | "meeting";

const SPOTS: Record<AgentStatus, { left: number; top: number }> = {
  working: { left: 35, top: 21 },
  idle: { left: 10, top: 76 },
  meeting: { left: 77, top: 30 },
};

const STATUS_COLORS: Record<AgentStatus, string> = {
  working: "#22c55e",
  idle: "#f59e0b",
  meeting: "#60a5fa",
};

const STATUS_LABELS: Record<AgentStatus, string> = {
  working: "Working",
  idle: "Idle",
  meeting: "In Meeting",
};

const WEIGHTS: AgentStatus[] = [
  ...Array(7).fill("working" as AgentStatus),
  ...Array(2).fill("idle" as AgentStatus),
  ...Array(1).fill("meeting" as AgentStatus),
];

function PixelCharacter({ name, color, status }: { name: string; color: string; status: AgentStatus }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }}>
      {/* Hair */}
      <div
        style={{
          width: 14,
          height: 5,
          background: color,
          border: "2px solid #111",
          borderBottom: "none",
          borderRadius: "3px 3px 0 0",
          position: "relative",
        }}
      >
        {/* Status dot */}
        <div
          style={{
            position: "absolute",
            top: -3,
            right: -5,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: STATUS_COLORS[status],
            border: "1.5px solid #000",
            boxShadow: `0 0 5px ${STATUS_COLORS[status]}`,
          }}
        />
      </div>
      {/* Face */}
      <div
        style={{
          position: "relative",
          width: 16,
          height: 14,
          background: "#e8c49a",
          border: "2px solid #111",
          borderTop: "1px solid #333",
        }}
      >
        {/* Eyes */}
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 2,
            width: 3,
            height: 3,
            background: "#111",
            boxShadow: "6px 0 0 #111",
          }}
        />
        {/* Mouth */}
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 7,
            height: 2,
            background: "#111",
          }}
        />
      </div>
      {/* Body */}
      <div
        style={{
          width: 16,
          height: 11,
          background: color,
          border: "2px solid #111",
          borderTop: "none",
          borderRadius: "0 0 2px 2px",
        }}
      />
      {/* Name tag */}
      <div
        style={{
          marginTop: 3,
          fontSize: 8,
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          color: "#e5e7eb",
          background: "#0d0d0d",
          border: `1px solid ${color}60`,
          padding: "1px 4px",
          whiteSpace: "nowrap",
          lineHeight: "11px",
          letterSpacing: "0.02em",
        }}
      >
        {name}
      </div>
    </div>
  );
}

// Reusable floor tile overlay
function FloorTiles({ color }: { color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: "14px 14px",
        pointerEvents: "none",
      }}
    />
  );
}

export default function OfficePage() {
  const [status, setStatus] = useState<AgentStatus>("working");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setStatus(WEIGHTS[Math.floor(Math.random() * WEIGHTS.length)]);
        schedule();
      }, 4000 + Math.random() * 2000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const pos = SPOTS[status];
  const animName =
    status === "working" ? "pixelBob" : status === "idle" ? "pixelSway" : "pixelBounce";

  return (
    <div
      style={{
        padding: "24px 32px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
      }}
    >
      <style>{`
        @keyframes pixelBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pixelSway {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        @keyframes pixelBounce {
          0%, 100% { transform: translateY(0px); }
          35% { transform: translateY(-4px); }
          65% { transform: translateY(-2px); }
        }
        @keyframes screenGlow {
          0%, 100% { box-shadow: 0 0 4px #3b82f630; }
          50% { box-shadow: 0 0 10px #3b82f660; }
        }
        @keyframes steamRise {
          0%, 100% { transform: translateY(0) scaleX(1); opacity: 0.35; }
          50% { transform: translateY(-6px) scaleX(0.6); opacity: 0.1; }
        }
        @keyframes scanline {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#e5e7eb",
              margin: 0,
              fontFamily: "monospace",
              letterSpacing: "0.03em",
            }}
          >
            Office
          </h1>
          <p
            style={{
              fontSize: 10,
              color: "#374151",
              margin: "2px 0 0",
              fontFamily: "monospace",
              letterSpacing: "0.06em",
            }}
          >
            MISSION CONTROL HQ — FLOOR 1
          </p>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            padding: "7px 14px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: STATUS_COLORS[status],
              boxShadow: `0 0 8px ${STATUS_COLORS[status]}90`,
              animation: "statusPulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#e5e7eb",
              fontWeight: 700,
              letterSpacing: "0.05em",
              fontFamily: "monospace",
            }}
          >
            WALLY — {STATUS_LABELS[status].toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── Office floor plan ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          background: "#0a0a0a",
          border: "3px solid #1a2535",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Global grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* ── MAIN OFFICE (top-left) ── */}
        <div
          style={{
            position: "absolute",
            left: "2%",
            top: "3%",
            width: "23%",
            height: "55%",
            background: "#0f1319",
            border: "3px solid #1e3040",
            zIndex: 1,
          }}
        >
          <FloorTiles color="rgba(30,48,64,0.22)" />
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 6,
              fontSize: 7,
              color: "#1e3a52",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              zIndex: 2,
            }}
          >
            MAIN OFFICE
          </div>

          {/* Chalkboard */}
          <div
            style={{
              position: "absolute",
              left: "12%",
              top: "8%",
              width: "76%",
              height: "24%",
              background: "#0a2015",
              border: "3px solid #5a3a10",
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 2,
                background: "#0c2518",
                border: "1px solid #1a3822",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <div
                style={{
                  fontSize: 6,
                  color: "#b8d8b0",
                  letterSpacing: "0.04em",
                  fontWeight: 700,
                  textShadow: "0 0 6px #7ab87080",
                }}
              >
                MISSION
              </div>
              <div
                style={{
                  fontSize: 6,
                  color: "#b8d8b0",
                  letterSpacing: "0.04em",
                  fontWeight: 700,
                  textShadow: "0 0 6px #7ab87080",
                }}
              >
                CONTROL HQ
              </div>
              <div
                style={{
                  width: "55%",
                  height: 1,
                  background: "#a0c09840",
                  marginTop: 2,
                }}
              />
            </div>
            {/* Chalk tray */}
            <div
              style={{
                position: "absolute",
                bottom: -4,
                left: "5%",
                width: "90%",
                height: 4,
                background: "#6a4810",
              }}
            />
          </div>

          {/* Desk */}
          <div
            style={{
              position: "absolute",
              left: "12%",
              bottom: "20%",
              width: "68%",
              height: "26%",
              background: "#0e1e2e",
              border: "2px solid #1e3a54",
              zIndex: 2,
            }}
          >
            {/* Monitor */}
            <div
              style={{
                position: "absolute",
                top: "8%",
                left: "46%",
                transform: "translateX(-50%)",
                width: "38%",
                height: "75%",
                background: "#060d14",
                border: "2px solid #1a3a5a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "screenGlow 4s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  width: "80%",
                  height: "80%",
                  background: "#0a2035",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                }}
              >
                🖥️
              </div>
            </div>
            {/* Keyboard */}
            <div
              style={{
                position: "absolute",
                bottom: "8%",
                left: "8%",
                width: "30%",
                height: "28%",
                background: "#0a1520",
                border: "1px solid #162840",
              }}
            />
          </div>

          {/* Chair */}
          <div
            style={{
              position: "absolute",
              left: "14%",
              bottom: "6%",
              width: 18,
              height: 18,
              background: "#141c28",
              border: "2px solid #202e42",
              borderRadius: 1,
              zIndex: 2,
            }}
          />

          {/* Plant */}
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              right: "8%",
              fontSize: 14,
              zIndex: 2,
            }}
          >
            🪴
          </div>
        </div>

        {/* ── AGENT WORKSTATIONS (center-top) ── */}
        <div
          style={{
            position: "absolute",
            left: "27%",
            top: "3%",
            width: "35%",
            height: "55%",
            background: "#0b0f15",
            border: "3px solid #1a2a3a",
            zIndex: 1,
          }}
        >
          <FloorTiles color="rgba(26,42,58,0.18)" />
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 6,
              fontSize: 7,
              color: "#1a3050",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              zIndex: 2,
            }}
          >
            AGENT WORKSTATIONS
          </div>

          {/* 2×2 desk grid */}
          {(
            [
              { l: "7%", t: "18%", id: "W-01", active: true },
              { l: "53%", t: "18%", id: "——", active: false },
              { l: "7%", t: "58%", id: "——", active: false },
              { l: "53%", t: "58%", id: "——", active: false },
            ] as { l: string; t: string; id: string; active: boolean }[]
          ).map((desk, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: desk.l,
                top: desk.t,
                width: "38%",
                height: "28%",
                background: desk.active ? "#0d1a2e" : "#0a0e14",
                border: `2px solid ${desk.active ? "#1e3a5a" : "#141c28"}`,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "8%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "42%",
                  height: "68%",
                  background: desk.active ? "#060d14" : "#080c10",
                  border: `1.5px solid ${desk.active ? "#1a3a5a" : "#111820"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  animation: desk.active
                    ? "screenGlow 5s ease-in-out infinite"
                    : undefined,
                }}
              >
                {desk.active ? "🖥️" : ""}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 5,
                  color: desk.active ? "#1e3a5a" : "#0e1a28",
                  whiteSpace: "nowrap",
                  fontWeight: 700,
                }}
              >
                {desk.id}
              </div>
            </div>
          ))}
        </div>

        {/* ── MEETING ROOM (top-right) ── */}
        <div
          style={{
            position: "absolute",
            left: "64%",
            top: "3%",
            width: "34%",
            height: "55%",
            background: "#0f1118",
            border: "3px solid #1e2a3a",
            zIndex: 1,
          }}
        >
          <FloorTiles color="rgba(30,42,58,0.18)" />
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 6,
              fontSize: 7,
              color: "#1a2a40",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              zIndex: 2,
            }}
          >
            MEETING ROOM
          </div>

          {/* Conference table */}
          <div
            style={{
              position: "absolute",
              left: "12%",
              top: "25%",
              width: "76%",
              height: "42%",
              background: "#1a1208",
              border: "3px solid #3a2810",
              borderRadius: 2,
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "33%",
                left: "5%",
                right: "5%",
                height: 1,
                background: "#2a1e0a30",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "66%",
                left: "5%",
                right: "5%",
                height: 1,
                background: "#2a1e0a30",
              }}
            />
          </div>

          {/* Chairs — top */}
          {[18, 43, 68].map((l) => (
            <div
              key={`ct${l}`}
              style={{
                position: "absolute",
                left: `${l}%`,
                top: "14%",
                width: 14,
                height: 9,
                background: "#161820",
                border: "1.5px solid #222840",
                borderRadius: "2px 2px 0 0",
                zIndex: 2,
              }}
            />
          ))}
          {/* Chairs — bottom */}
          {[18, 43, 68].map((l) => (
            <div
              key={`cb${l}`}
              style={{
                position: "absolute",
                left: `${l}%`,
                top: "70%",
                width: 14,
                height: 9,
                background: "#161820",
                border: "1.5px solid #222840",
                borderRadius: "0 0 2px 2px",
                zIndex: 2,
              }}
            />
          ))}
          {/* Chairs — left */}
          {[34, 53].map((t) => (
            <div
              key={`cl${t}`}
              style={{
                position: "absolute",
                left: "4%",
                top: `${t}%`,
                width: 9,
                height: 13,
                background: "#161820",
                border: "1.5px solid #222840",
                borderRadius: "2px 0 0 2px",
                zIndex: 2,
              }}
            />
          ))}
          {/* Chairs — right */}
          {[34, 53].map((t) => (
            <div
              key={`cr${t}`}
              style={{
                position: "absolute",
                right: "4%",
                top: `${t}%`,
                width: 9,
                height: 13,
                background: "#161820",
                border: "1.5px solid #222840",
                borderRadius: "0 2px 2px 0",
                zIndex: 2,
              }}
            />
          ))}
        </div>

        {/* ── BREAK ROOM (bottom) ── */}
        <div
          style={{
            position: "absolute",
            left: "2%",
            top: "61%",
            width: "96%",
            height: "36%",
            background: "#0d0b12",
            border: "3px solid #241a38",
            zIndex: 1,
          }}
        >
          <FloorTiles color="rgba(36,26,56,0.18)" />
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 6,
              fontSize: 7,
              color: "#342048",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              zIndex: 2,
            }}
          >
            BREAK ROOM
          </div>

          {/* Couch */}
          <div
            style={{
              position: "absolute",
              left: "3%",
              top: "18%",
              width: "18%",
              height: "65%",
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "38%",
                background: "#2a180c",
                border: "2px solid #4a2e18",
                borderRadius: "2px 2px 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "70%",
                background: "#22140a",
                border: "2px solid #4a2e18",
                borderTop: "none",
                borderRadius: "0 0 2px 2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                padding: "0 3px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "28%",
                    height: "55%",
                    background: "#301c0e",
                    border: "1px solid #503a22",
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Coffee machine */}
          <div
            style={{ position: "absolute", left: "28%", top: "12%", zIndex: 2 }}
          >
            <div
              style={{
                fontSize: 6,
                color: "#3a2818",
                marginBottom: 2,
                textAlign: "center",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              COFFEE
            </div>
            <div
              style={{
                position: "relative",
                width: 26,
                height: 34,
                background: "#18100a",
                border: "2px solid #3a2010",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                padding: "3px 0",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 9,
                  background: "#0a0808",
                  border: "1px solid #2a1010",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 7,
                }}
              >
                ☕
              </div>
              <div
                style={{
                  width: 8,
                  height: 5,
                  background: "#2a1010",
                  border: "1px solid #4a2010",
                  borderRadius: 1,
                }}
              />
              {/* Steam */}
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 2,
                  height: 8,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: 1,
                  animation: "steamRise 2.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          {/* Water cooler */}
          <div
            style={{ position: "absolute", left: "40%", top: "8%", zIndex: 2 }}
          >
            <div
              style={{
                fontSize: 6,
                color: "#1a2a3a",
                marginBottom: 2,
                textAlign: "center",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              H₂O
            </div>
            <div
              style={{
                position: "relative",
                width: 20,
                height: 36,
                background: "#0a1520",
                border: "2px solid #162a40",
                borderRadius: "4px 4px 2px 2px",
              }}
            >
              {/* Water jug */}
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 14,
                  height: 11,
                  background: "#102040",
                  border: "1.5px solid #1a4060",
                  borderRadius: "2px 2px 0 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 7,
                }}
              >
                💧
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 8,
                  height: 5,
                  background: "#162a40",
                  borderRadius: 1,
                }}
              />
            </div>
          </div>

          {/* Plants */}
          <div
            style={{
              position: "absolute",
              right: "4%",
              top: "10%",
              fontSize: 18,
              zIndex: 2,
            }}
          >
            🪴
          </div>
          <div
            style={{
              position: "absolute",
              right: "20%",
              bottom: "12%",
              fontSize: 13,
              opacity: 0.65,
              zIndex: 2,
            }}
          >
            🌿
          </div>
        </div>

        {/* ── WALLY CHARACTER ── */}
        <div
          style={{
            position: "absolute",
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            transform: "translate(-50%, -50%)",
            transition:
              "left 0.9s cubic-bezier(0.4, 0, 0.2, 1), top 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 20,
          }}
        >
          <div style={{ animation: `${animName} 2s ease-in-out infinite` }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/wally-wizard.jpg"
                  alt="Wally"
                  style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: STATUS_COLORS[status],
                    border: "1.5px solid #000",
                    boxShadow: `0 0 5px ${STATUS_COLORS[status]}`,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontSize: 8,
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 700,
                  color: "#e5e7eb",
                  background: "#0d0d0d",
                  border: "1px solid #3b82f660",
                  padding: "1px 4px",
                  whiteSpace: "nowrap",
                  lineHeight: "11px",
                  letterSpacing: "0.02em",
                }}
              >
                Wally
              </div>
            </div>
          </div>
        </div>

        {/* Scanline sweep */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(to right, transparent, rgba(59,130,246,0.06), transparent)",
            animation: "scanline 10s linear infinite",
            zIndex: 22,
            pointerEvents: "none",
          }}
        />

        {/* CRT scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
            zIndex: 21,
            pointerEvents: "none",
          }}
        />

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
            zIndex: 21,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
