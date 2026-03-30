"use client";

import { useState, useEffect } from "react";
import React from "react";

type AgentStatus = "working" | "idle" | "meeting";

// Character positions as % of castle container
// working → Wizard's Tower (bottom-right)
// idle    → The Tavern (bottom-left)
// meeting → The Round Table (center)
const SPOTS: Record<AgentStatus, { left: number; top: number }> = {
  working: { left: 81, top: 72 },
  idle: { left: 14, top: 84 },
  meeting: { left: 49, top: 43 },
};

const STATUS_COLORS: Record<AgentStatus, string> = {
  working: "#22c55e",
  idle: "#f59e0b",
  meeting: "#60a5fa",
};

const STATUS_LABELS: Record<AgentStatus, string> = {
  working: "Working",
  idle: "Idle",
  meeting: "In Council",
};

const STATUS_LOCATIONS: Record<AgentStatus, string> = {
  working: "Wizard's Tower",
  idle: "The Tavern",
  meeting: "The Round Table",
};

function Torch({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", zIndex: 10, ...style }}>
      {/* Warm glow pool */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 90,
          height: 90,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,140,0,0.18) 0%, rgba(255,100,0,0.07) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <span style={{ fontSize: 13, animation: "torchFlicker 1.8s ease-in-out infinite", lineHeight: 1, display: "block" }}>
        🕯️
      </span>
    </div>
  );
}

export default function OfficePage() {
  const [status, setStatus] = useState<AgentStatus>("working");

  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      setStatus(rand < 0.6 ? "working" : rand < 0.8 ? "idle" : "meeting");
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const pos = SPOTS[status];
  const anim =
    status === "working" ? "wallyBob" : status === "idle" ? "wallySway" : "wallyBounce";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "12px 16px 10px",
        background: "#080604",
        fontFamily: "Georgia, 'Times New Roman', serif",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes torchFlicker {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          20%       { opacity: 0.8; transform: scale(0.93) rotate(-3deg); }
          40%       { opacity: 0.95; transform: scale(1.06) rotate(1deg); }
          60%       { opacity: 0.85; transform: scale(0.97) rotate(-2deg); }
          80%       { opacity: 1; transform: scale(1.04) rotate(2deg); }
        }
        @keyframes crystalPulse {
          0%, 100% {
            box-shadow: 0 0 10px 3px rgba(96,165,250,0.45),
                        0 0 28px rgba(96,165,250,0.18),
                        inset 0 0 6px rgba(200,230,255,0.3);
          }
          50% {
            box-shadow: 0 0 22px 8px rgba(96,165,250,0.65),
                        0 0 55px rgba(96,165,250,0.28),
                        inset 0 0 12px rgba(200,230,255,0.5);
          }
        }
        @keyframes fireGlow {
          0%, 100% { opacity: 0.85; text-shadow: 0 0 8px rgba(255,120,0,0.6); }
          50%       { opacity: 1;    text-shadow: 0 0 18px rgba(255,160,0,0.9); }
        }
        @keyframes wallyBob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes wallySway {
          0%, 100% { transform: translateX(0px); }
          25%       { transform: translateX(-3px); }
          75%       { transform: translateX(3px); }
        }
        @keyframes wallyBounce {
          0%, 100% { transform: translateY(0px); }
          35%       { transform: translateY(-5px); }
          65%       { transform: translateY(-2px); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @keyframes runeRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes runeRotateCCW {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          CASTLE HALL — the main floor
      ════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          overflow: "hidden",
          // Stone walls
          border: "7px solid #111",
          borderRadius: 3,
          boxShadow:
            "inset 0 0 40px rgba(0,0,0,0.85), inset 0 0 4px rgba(255,140,0,0.06), 0 0 20px rgba(0,0,0,0.6)",
          // Cobblestone floor
          background: "#2b2b2b",
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 29px,
              rgba(0,0,0,0.4) 29px,
              rgba(0,0,0,0.4) 30px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              rgba(0,0,0,0.4) 39px,
              rgba(0,0,0,0.4) 40px
            )
          `,
        }}
      >
        {/* Ambient warm center glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 48% 48%, rgba(255,140,0,0.045) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* ── Wall torches ── */}
        <Torch style={{ top: 4,    left: "15%", transform: "translateX(-50%)" }} />
        <Torch style={{ top: 4,    left: "49%", transform: "translateX(-50%)" }} />
        <Torch style={{ top: 4,    left: "83%", transform: "translateX(-50%)" }} />
        <Torch style={{ top: "33%", left: 4,   transform: "translateY(-50%)" }} />
        <Torch style={{ top: "67%", left: 4,   transform: "translateY(-50%)" }} />
        <Torch style={{ top: "28%", right: 4,  transform: "translateY(-50%)" }} />
        <Torch style={{ top: "65%", right: 4,  transform: "translateY(-50%)" }} />
        <Torch style={{ bottom: 6, left: "29%", transform: "translateX(-50%)" }} />

        {/* ── Room divider walls ── */}
        {/* Left col | Center col */}
        <div
          style={{
            position: "absolute",
            left: "28%",
            top: "1%",
            bottom: "1%",
            width: 3,
            background: "rgba(0,0,0,0.55)",
            boxShadow: "0 0 8px rgba(0,0,0,0.9)",
            zIndex: 2,
          }}
        />
        {/* Center col | Right col */}
        <div
          style={{
            position: "absolute",
            left: "68%",
            top: "1%",
            bottom: "1%",
            width: 3,
            background: "rgba(0,0,0,0.55)",
            boxShadow: "0 0 8px rgba(0,0,0,0.9)",
            zIndex: 2,
          }}
        />
        {/* Top zone | Middle-bottom zone (left col only) */}
        <div
          style={{
            position: "absolute",
            left: "1%",
            width: "27%",
            top: "44%",
            height: 3,
            background: "rgba(0,0,0,0.5)",
            zIndex: 2,
          }}
        />
        {/* Scribe | Tavern (left col) */}
        <div
          style={{
            position: "absolute",
            left: "1%",
            width: "27%",
            top: "72%",
            height: 3,
            background: "rgba(0,0,0,0.5)",
            zIndex: 2,
          }}
        />
        {/* Center top zone | Round Table */}
        <div
          style={{
            position: "absolute",
            left: "29%",
            width: "39%",
            top: "19%",
            height: 3,
            background: "rgba(0,0,0,0.45)",
            zIndex: 2,
          }}
        />
        {/* Round Table | Dungeon Door */}
        <div
          style={{
            position: "absolute",
            left: "29%",
            width: "39%",
            top: "72%",
            height: 3,
            background: "rgba(0,0,0,0.45)",
            zIndex: 2,
          }}
        />
        {/* Wizard Tower top */}
        <div
          style={{
            position: "absolute",
            left: "69%",
            right: "1%",
            top: "44%",
            height: 3,
            background: "rgba(0,0,0,0.5)",
            zIndex: 2,
          }}
        />

        {/* ══════════════════════════════════════
            TOP-LEFT — Alchemy Lab
        ════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: "1%",
            top: "1%",
            width: "26%",
            height: "42%",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 7,
              fontSize: 8,
              color: "rgba(255,190,80,0.65)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            ⚗️ Alchemy Lab
          </div>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 6,
              fontSize: 7,
              color: "rgba(180,140,60,0.4)",
              fontStyle: "italic",
            }}
          >
            strategy & research
          </div>

          {/* Wooden alchemy table */}
          <div
            style={{
              position: "absolute",
              left: "8%",
              top: "25%",
              width: "82%",
              height: "48%",
              background: "#3a2410",
              border: "2px solid #5c3a18",
              borderRadius: 2,
              boxShadow: "inset 0 0 8px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "6px 8px",
            }}
          >
            <div style={{ fontSize: 15, lineHeight: 1 }}>🧪 🫙 🍶</div>
            <div style={{ fontSize: 13, lineHeight: 1 }}>🕯️ 🧪 🫙</div>
          </div>

          {/* Chair at table */}
          <div
            style={{
              position: "absolute",
              left: "11%",
              bottom: "14%",
              width: 15,
              height: 15,
              background: "#1e1208",
              border: "2px solid #3a2210",
              borderRadius: 2,
            }}
          />

          {/* Candle glow */}
          <div
            style={{
              position: "absolute",
              left: "35%",
              top: "42%",
              width: 70,
              height: 55,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,160,0,0.13) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ══════════════════════════════════════
            TOP-CENTER — Chandelier zone
        ════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: "29%",
            top: "1%",
            width: "39%",
            height: "17%",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Chandelier */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            {/* Mounting chain */}
            <div style={{ width: 2, height: 12, background: "#4a3a20" }} />
            {/* Arms */}
            <div style={{ position: "relative", width: 80, height: 18 }}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "#5a4222",
                  transform: "translateY(-50%)",
                  borderRadius: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 2,
                  height: 18,
                  background: "#5a4222",
                }}
              />
              <span style={{ position: "absolute", left: -4, bottom: 0, fontSize: 13 }}>🕯️</span>
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 0,
                  fontSize: 13,
                  transform: "translateX(-50%)",
                }}
              >
                🕯️
              </span>
              <span style={{ position: "absolute", right: -4, bottom: 0, fontSize: 13 }}>🕯️</span>
            </div>
          </div>

          {/* Chandelier warm glow pool on floor below */}
          <div
            style={{
              position: "absolute",
              top: "80%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 140,
              height: 60,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(255,160,0,0.13) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ══════════════════════════════════════
            TOP-RIGHT — The Forge
        ════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: "69%",
            top: "1%",
            width: "30%",
            height: "42%",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 7,
              fontSize: 8,
              color: "rgba(255,150,60,0.75)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            ⚒️ The Forge
          </div>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 6,
              fontSize: 7,
              color: "rgba(200,110,40,0.4)",
              fontStyle: "italic",
            }}
          >
            engineering & builds
          </div>

          {/* Fireplace / Forge — right wall */}
          <div
            style={{
              position: "absolute",
              right: "5%",
              top: "18%",
              width: "32%",
              height: "48%",
              background: "#150600",
              border: "3px solid #2e1000",
              borderRadius: "2px 2px 0 0",
              boxShadow:
                "0 0 25px rgba(255,110,0,0.35), inset 0 0 12px rgba(255,100,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              animation: "fireGlow 2s ease-in-out infinite",
            }}
          >
            🔥
          </div>

          {/* Forge floor glow */}
          <div
            style={{
              position: "absolute",
              right: "3%",
              top: "15%",
              width: 90,
              height: 90,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,120,0,0.22) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Workbench */}
          <div
            style={{
              position: "absolute",
              left: "6%",
              top: "22%",
              width: "50%",
              height: "38%",
              background: "#2c1808",
              border: "2px solid #4e2e10",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "4px 0",
              fontSize: 14,
            }}
          >
            <span>🔨</span>
            <span style={{ fontSize: 12 }}>⚒️</span>
          </div>

          {/* Anvil */}
          <div
            style={{
              position: "absolute",
              left: "12%",
              bottom: "18%",
              fontSize: 16,
            }}
          >
            ⚙️
          </div>
        </div>

        {/* ══════════════════════════════════════
            CENTER — The Round Table
        ════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: "29%",
            top: "20%",
            width: "39%",
            height: "51%",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 7,
              fontSize: 8,
              color: "rgba(220,190,100,0.55)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            ⚔️ The Round Table
          </div>

          {/* Dark circular rug */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 155,
              height: 155,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #3e2312 0%, #2a1608 55%, #1a0e05 100%)",
              border: "2px solid #4e2e10",
            }}
          />

          {/* The Round Table itself */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 110,
              height: 110,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 38% 38%, #7a5530 0%, #5c3d1e 45%, #472e14 100%)",
              border: "3px solid #7a5428",
              boxShadow:
                "0 4px 14px rgba(0,0,0,0.7), inset 0 0 12px rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              zIndex: 4,
            }}
          >
            📜
          </div>

          {/* 8 chairs around the table */}
          {([0, 45, 90, 135, 180, 225, 270, 315] as number[]).map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const r = 68;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  width: 14,
                  height: 14,
                  background: "#2a1a08",
                  border: "2px solid #4e3018",
                  borderRadius: 2,
                  zIndex: 5,
                }}
              />
            );
          })}
        </div>

        {/* ══════════════════════════════════════
            MIDDLE-LEFT — Scribe's Corner
        ════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: "1%",
            top: "45%",
            width: "26%",
            height: "26%",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 7,
              fontSize: 8,
              color: "rgba(220,200,120,0.6)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            📜 Scribe's Corner
          </div>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 6,
              fontSize: 7,
              color: "rgba(180,160,80,0.35)",
              fontStyle: "italic",
            }}
          >
            memory & documents
          </div>

          {/* Wooden desk */}
          <div
            style={{
              position: "absolute",
              left: "8%",
              top: "28%",
              width: "80%",
              height: "52%",
              background: "#352212",
              border: "2px solid #5a3818",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "4px 8px",
              fontSize: 15,
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.5)",
            }}
          >
            <span>📖</span>
            <span>🪶</span>
            <span>📜</span>
          </div>

          {/* Chair */}
          <div
            style={{
              position: "absolute",
              left: "11%",
              bottom: "6%",
              width: 14,
              height: 14,
              background: "#1e1208",
              border: "2px solid #3a2210",
              borderRadius: 2,
            }}
          />

          {/* Candle light */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "55%",
              width: 55,
              height: 40,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(255,150,0,0.11) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ══════════════════════════════════════
            BOTTOM-LEFT — The Tavern
        ════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: "1%",
            top: "73%",
            width: "26%",
            height: "25%",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 7,
              fontSize: 8,
              color: "rgba(210,160,60,0.7)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            🍺 The Tavern
          </div>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 6,
              fontSize: 7,
              color: "rgba(180,130,50,0.35)",
              fontStyle: "italic",
            }}
          >
            idle & break area
          </div>

          {/* Table 1 */}
          <div
            style={{
              position: "absolute",
              left: "7%",
              top: "32%",
              width: "36%",
              height: "48%",
              background: "#2e1a08",
              border: "2px solid #503018",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
            }}
          >
            🍺
          </div>
          {/* Chairs around table 1 */}
          <div style={{ position: "absolute", left: "5%",  top: "22%", width: 11, height: 11, background: "#1c1008", border: "1.5px solid #362010", borderRadius: 1 }} />
          <div style={{ position: "absolute", left: "37%", top: "22%", width: 11, height: 11, background: "#1c1008", border: "1.5px solid #362010", borderRadius: 1 }} />
          <div style={{ position: "absolute", left: "5%",  bottom: "10%", width: 11, height: 11, background: "#1c1008", border: "1.5px solid #362010", borderRadius: 1 }} />

          {/* Table 2 */}
          <div
            style={{
              position: "absolute",
              right: "8%",
              top: "28%",
              width: "32%",
              height: "44%",
              background: "#2e1a08",
              border: "2px solid #503018",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            🍻
          </div>

          {/* Barrel */}
          <div style={{ position: "absolute", right: "3%", bottom: "8%", fontSize: 15 }}>
            🪣
          </div>

          {/* Warm tavern glow */}
          <div
            style={{
              position: "absolute",
              left: "40%",
              top: "55%",
              width: 65,
              height: 45,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(255,140,0,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ══════════════════════════════════════
            BOTTOM-CENTER — Dungeon Door
        ════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: "29%",
            top: "73%",
            width: "39%",
            height: "25%",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Stone arch */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Arch cap */}
            <div
              style={{
                width: 58,
                height: 36,
                borderRadius: "29px 29px 0 0",
                background: "#0d0d0d",
                border: "3px solid #1e1e1e",
                borderBottom: "none",
                boxShadow: "inset 0 0 12px rgba(0,0,0,0.9)",
                position: "relative",
              }}
            >
              {/* Keystone */}
              <div
                style={{
                  position: "absolute",
                  top: -5,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 13,
                  height: 11,
                  background: "#1a1a1a",
                  border: "2px solid #2a2a2a",
                }}
              />
            </div>
            {/* Arch body */}
            <div
              style={{
                width: 52,
                height: 38,
                background: "#0d0d0d",
                border: "3px solid #1e1e1e",
                borderTop: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🚪
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 5,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 7,
              color: "rgba(140,100,50,0.45)",
              whiteSpace: "nowrap",
              letterSpacing: "0.12em",
              fontStyle: "italic",
            }}
          >
            — exit —
          </div>
        </div>

        {/* ══════════════════════════════════════
            BOTTOM-RIGHT — Wizard's Tower
        ════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: "69%",
            top: "45%",
            width: "30%",
            height: "53%",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 7,
              fontSize: 8,
              color: "rgba(150,210,255,0.7)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            🧙 Wizard's Tower
          </div>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 6,
              fontSize: 7,
              color: "rgba(100,160,220,0.35)",
              fontStyle: "italic",
            }}
          >
            wally's workstation
          </div>

          {/* Rune circle — outer */}
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "62%",
              width: 78,
              height: 78,
              borderRadius: "50%",
              border: "1.5px solid rgba(96,165,250,0.28)",
              boxShadow: "0 0 12px rgba(96,165,250,0.1)",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Rune circle — inner spinning */}
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "62%",
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "1px dashed rgba(96,165,250,0.2)",
              animation: "runeRotate 10s linear infinite",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Rune innermost CCW */}
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "62%",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(96,165,250,0.15)",
              animation: "runeRotateCCW 6s linear infinite",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Crystal ball */}
          <div
            style={{
              position: "absolute",
              top: "57%",
              left: "62%",
              transform: "translate(-50%, -50%)",
              width: 42,
              height: 42,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 32%, rgba(220,240,255,0.9) 0%, rgba(120,180,250,0.7) 35%, rgba(59,130,246,0.85) 100%)",
              animation: "crystalPulse 3s ease-in-out infinite",
              zIndex: 6,
            }}
          />

          {/* Crystal stand */}
          <div
            style={{
              position: "absolute",
              top: "72%",
              left: "62%",
              transform: "translateX(-50%)",
              width: 32,
              height: 9,
              background: "#2a1808",
              border: "2px solid #4a2e10",
              borderRadius: "0 0 4px 4px",
              zIndex: 5,
            }}
          />

          {/* Blue floor glow from crystal */}
          <div
            style={{
              position: "absolute",
              top: "65%",
              left: "62%",
              transform: "translate(-50%, -50%)",
              width: 110,
              height: 90,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(96,165,250,0.16) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Bookshelf */}
          <div
            style={{
              position: "absolute",
              left: "5%",
              top: "12%",
              width: "33%",
              height: "52%",
              background: "#271508",
              border: "2px solid #4a2e10",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "5px 0",
              fontSize: 14,
            }}
          >
            <span>📚</span>
            <span style={{ fontSize: 12 }}>📖</span>
          </div>

          {/* Star accents */}
          <div style={{ position: "absolute", right: "8%",  top: "12%", fontSize: 12, color: "rgba(200,225,255,0.45)" }}>✨</div>
          <div style={{ position: "absolute", right: "22%", top: "7%",  fontSize: 10, color: "rgba(200,225,255,0.35)" }}>⭐</div>
          <div style={{ position: "absolute", right: "5%",  top: "35%", fontSize: 10, color: "rgba(150,200,255,0.3)" }}>✨</div>
        </div>

        {/* ══════════════════════════════════════
            WALLY — moving character
        ════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 1.2s ease, top 1.2s ease",
            zIndex: 25,
          }}
        >
          <div style={{ animation: `${anim} 2.2s ease-in-out infinite` }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                userSelect: "none",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src="/wally-wizard.jpg"
                  alt="Wally"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    border: "2px solid rgba(255,190,60,0.5)",
                    boxShadow: "0 0 8px rgba(255,160,0,0.25)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 1,
                    right: 1,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: STATUS_COLORS[status],
                    border: "1.5px solid #000",
                    boxShadow: `0 0 6px ${STATUS_COLORS[status]}`,
                    animation: "statusPulse 2s ease-in-out infinite",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#f0d878",
                  background: "rgba(8,4,0,0.88)",
                  border: "1px solid rgba(255,170,30,0.4)",
                  padding: "1px 6px",
                  whiteSpace: "nowrap",
                  lineHeight: "12px",
                  letterSpacing: "0.06em",
                }}
              >
                Wally
              </div>
            </div>
          </div>
        </div>

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.72) 100%)",
            zIndex: 18,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ══════════════════════════════════════
          STATUS BAR — parchment style
      ════════════════════════════════════ */}
      <div
        style={{
          flexShrink: 0,
          marginTop: 8,
          background: "linear-gradient(to bottom, #1e1508, #130e05)",
          border: "1px solid #3e2c10",
          borderRadius: 3,
          padding: "7px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#c89830",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          ⚔️ War Room Status
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: STATUS_COLORS[status],
              boxShadow: `0 0 8px ${STATUS_COLORS[status]}`,
              animation: "statusPulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#e0c870",
              letterSpacing: "0.05em",
            }}
          >
            Wally — {STATUS_LOCATIONS[status]} — {STATUS_LABELS[status]}
          </span>
        </div>

        <div
          style={{
            fontSize: 10,
            color: "#5a3c14",
            fontStyle: "italic",
          }}
        >
          Est. Anno Domini 2026
        </div>
      </div>
    </div>
  );
}
