"use client";

import { useState, useEffect, useRef } from "react";

type LocationKey = "wizardTower" | "tavern" | "roundTable" | "alchemyLab" | "forge" | "scribe";

const LOCATIONS: Record<LocationKey, { top: string; left: string; label: string }> = {
  wizardTower: { top: "62%", left: "72%", label: "Wizard's Tower" },
  tavern:      { top: "65%", left: "18%", label: "Tavern" },
  roundTable:  { top: "38%", left: "45%", label: "Round Table" },
  alchemyLab:  { top: "15%", left: "18%", label: "Alchemy Lab" },
  forge:       { top: "15%", left: "72%", label: "Forge" },
  scribe:      { top: "42%", left: "25%", label: "Scribe's Desk" },
};

type AgentStatus = "working" | "idle" | "meeting";

const STATUS_COLORS: Record<AgentStatus, string> = {
  working: "#22c55e",
  idle:    "#f59e0b",
  meeting: "#60a5fa",
};

function pickNextState(): { status: AgentStatus; location: LocationKey } {
  const roll = Math.random();
  if (roll < 0.6) return { status: "working", location: "wizardTower" };
  if (roll < 0.8) return { status: "idle",    location: "tavern" };
  return              { status: "meeting",  location: "roundTable" };
}

function WallySprite({ isMoving }: { isMoving: boolean }) {
  return (
    <div
      style={{
        animation: isMoving
          ? "walkCycle 0.5s ease-in-out infinite"
          : "idle 2s ease-in-out infinite",
        display: "inline-block",
        filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.8))",
      }}
    >
      {/* viewBox 40x56, rendered at 60x84 */}
      <svg
        width={60}
        height={84}
        viewBox="0 0 40 56"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cape — drawn first so it sits behind everything */}
        <polygon points="9,56 31,56 20,28" fill="#1e1b4b" />

        {/* Robe body — bell-shaped trapezoid with curved bottom */}
        <path d="M 14 28 L 7 52 Q 20 58 33 52 L 26 28 Z" fill="#4a0e8f" />

        {/* Left arm */}
        <rect x="4" y="31" width="10" height="5" rx="2.5" fill="#5a1eaf" />

        {/* Right arm */}
        <rect x="26" y="31" width="10" height="5" rx="2.5" fill="#5a1eaf" />

        {/* Staff — behind orb, in front of arm */}
        <line x1="35" y1="52" x2="35" y2="18" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
        {/* Staff glow */}
        <circle cx="35" cy="15" r="4.5" fill="rgba(255,215,0,0.25)" />
        {/* Staff orb */}
        <circle cx="35" cy="15" r="2.8" fill="#ffd700" />
        <circle cx="34" cy="14" r="1" fill="rgba(255,255,255,0.5)" />

        {/* Head */}
        <circle cx="20" cy="23" r="6.5" fill="#f4c284" />

        {/* Beard */}
        <path d="M 16.5 27.5 Q 20 34.5 23.5 27.5 Q 20 31.5 16.5 27.5 Z" fill="#f0f0f0" />

        {/* Eyes */}
        <circle cx="18" cy="22.5" r="0.9" fill="#1a1a1a" />
        <circle cx="22" cy="22.5" r="0.9" fill="#1a1a1a" />

        {/* Wizard hat cone */}
        <polygon points="11,17 20,1 29,17" fill="#4a0e8f" />

        {/* Hat band (gold stripe at base of cone) */}
        <ellipse cx="20" cy="16" rx="8" ry="1.8" fill="#ffd700" />

        {/* Hat brim */}
        <ellipse cx="20" cy="17" rx="10.5" ry="2.8" fill="#3a0870" />

        {/* Hat star dot near brim */}
        <circle cx="13" cy="13.5" r="1.6" fill="#ffd700" />
        <circle cx="13" cy="13.5" r="0.7" fill="#fff8" />
      </svg>
    </div>
  );
}

export default function OfficePage() {
  const [status, setStatus]       = useState<AgentStatus>("working");
  const [location, setLocation]   = useState<LocationKey>("wizardTower");
  const [isMoving, setIsMoving]   = useState(false);
  const moveTimerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = pickNextState();
      setStatus(next.status);
      setLocation(next.location);
      setIsMoving(true);

      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
      moveTimerRef.current = setTimeout(() => setIsMoving(false), 7000);
    }, 10000);

    return () => {
      clearInterval(interval);
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    };
  }, []);

  const pos = LOCATIONS[location];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <style>{`
        @keyframes walkCycle {
          0%   { transform: translateY(0px) rotate(-1deg); }
          25%  { transform: translateY(-3px) rotate(0deg); }
          50%  { transform: translateY(-1px) rotate(1deg); }
          75%  { transform: translateY(-3px) rotate(0deg); }
          100% { transform: translateY(0px) rotate(-1deg); }
        }
        @keyframes idle {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-1px); }
        }
      `}</style>

      {/* Room */}
      <div
        style={{
          flex: 1,
          position: "relative",
          backgroundImage: "url('/office-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        {/* Wally sprite */}
        <div
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -50%)",
            transition: "top 7s ease-in-out, left 7s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Name label with status dot — above the character */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: "#fff",
                textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                whiteSpace: "nowrap",
              }}
            >
              Wally
            </span>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: STATUS_COLORS[status],
                flexShrink: 0,
              }}
            />
          </div>

          {/* SVG sprite */}
          <WallySprite isMoving={isMoving} />
        </div>
      </div>

      {/* Status bar */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          padding: "6px 16px",
          fontSize: 13,
          color: "#e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: STATUS_COLORS[status],
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span>🧙 Wally · {status.charAt(0).toUpperCase() + status.slice(1)} · {LOCATIONS[location].label}</span>
      </div>
    </div>
  );
}
