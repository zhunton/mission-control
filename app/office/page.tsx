"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
      {/* Walking animation keyframes */}
      <style>{`
        @keyframes walking {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-4px) scale(1.05); }
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
            gap: 4,
            animation: isMoving ? "walking 0.4s ease-in-out infinite" : "none",
          }}
        >
          {/* Avatar + status dot */}
          <div style={{ position: "relative", width: 48, height: 48 }}>
            <Image
              src="/wally-wizard.jpg"
              alt="Wally"
              width={48}
              height={48}
              style={{
                borderRadius: "50%",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))",
                display: "block",
              }}
            />
            {/* Status dot */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: STATUS_COLORS[status],
                border: "2px solid #000",
              }}
            />
          </div>

          {/* Name label */}
          <span
            style={{
              fontSize: 12,
              color: "#fff",
              textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.8)",
              whiteSpace: "nowrap",
              fontWeight: 600,
            }}
          >
            Wally
          </span>
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
