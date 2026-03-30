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

function pickWallyState(): { status: AgentStatus; location: LocationKey } {
  const roll = Math.random();
  if (roll < 0.6) return { status: "working", location: "wizardTower" };
  if (roll < 0.8) return { status: "idle",    location: "tavern" };
  return              { status: "meeting",  location: "roundTable" };
}

function pickPatchState(): { status: AgentStatus; location: LocationKey } {
  const roll = Math.random();
  if (roll < 0.65) return { status: "working", location: "forge" };
  if (roll < 0.85) return { status: "idle",    location: "tavern" };
  return               { status: "meeting",  location: "roundTable" };
}

function pickDaliState(): { status: AgentStatus; location: LocationKey } {
  const roll = Math.random();
  if (roll < 0.65) return { status: "working", location: "alchemyLab" };
  if (roll < 0.85) return { status: "idle",    location: "tavern" };
  return               { status: "meeting",  location: "roundTable" };
}

function DaliSprite({ isMoving }: { isMoving: boolean }) {
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
      <img
        src="/dali-painter.jpg"
        alt="Dali"
        className="rounded-full"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        style={{ width: 36, height: 36, objectFit: "cover" }}
      />
    </div>
  );
}

function PatchSprite({ isMoving }: { isMoving: boolean }) {
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
      {/* viewBox 44x56, rendered at 66x84 — slightly wider than Wally */}
      <svg
        width={66}
        height={84}
        viewBox="0 0 44 56"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body — white shirt base, wider/sturdier build */}
        <path d="M 15 26 L 6 52 Q 22 58 38 52 L 29 26 Z" fill="#f5f5f0" />

        {/* Leather apron — brown, covers front */}
        <path d="M 17 29 L 10 52 Q 22 57 34 52 L 27 29 Z" fill="#92400e" />

        {/* Apron bib — upper chest piece */}
        <rect x="17" y="26" width="10" height="7" rx="1" fill="#78350f" />

        {/* Left arm */}
        <rect x="0" y="28" width="13" height="6" rx="3" fill="#f5f5f0" />

        {/* Right arm */}
        <rect x="31" y="28" width="13" height="6" rx="3" fill="#f5f5f0" />

        {/* Hammer handle — in right hand */}
        <line x1="43" y1="34" x2="43" y2="14" stroke="#5c3317" strokeWidth="2.5" strokeLinecap="round" />
        {/* Hammer head */}
        <rect x="38" y="10" width="10" height="9" rx="2" fill="#6b7280" />
        {/* Hammer head highlight */}
        <rect x="38" y="10" width="10" height="3" rx="1.5" fill="#9ca3af" />

        {/* Head */}
        <circle cx="22" cy="20" r="7" fill="#f4c284" />

        {/* Dark brown hair — cap style */}
        <path d="M 15 19 Q 15 11 22 11 Q 29 11 29 19 Q 26 16 22 16 Q 18 16 15 19 Z" fill="#3d1a0a" />

        {/* Sideburns / short beard stubble */}
        <path d="M 15.5 22 Q 15 26.5 18 27.5 Q 20 28 22 28 Q 24 28 26 27.5 Q 29 26.5 28.5 22" fill="none" stroke="#3d1a0a" strokeWidth="1.2" strokeLinecap="round" />

        {/* Eyes */}
        <circle cx="19.5" cy="20" r="1" fill="#1a1a1a" />
        <circle cx="24.5" cy="20" r="1" fill="#1a1a1a" />

        {/* Nose bridge hint */}
        <line x1="22" y1="21" x2="22" y2="23" stroke="#d4a574" strokeWidth="0.8" />

        {/* Apron tie strings */}
        <line x1="17" y1="32" x2="12" y2="34" stroke="#92400e" strokeWidth="1" />
        <line x1="27" y1="32" x2="32" y2="34" stroke="#92400e" strokeWidth="1" />
      </svg>
    </div>
  );
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
  const [wallyStatus, setWallyStatus]     = useState<AgentStatus>("working");
  const [wallyLocation, setWallyLocation] = useState<LocationKey>("wizardTower");
  const [wallyMoving, setWallyMoving]     = useState(false);
  const wallyMoveRef                      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [patchStatus, setPatchStatus]     = useState<AgentStatus>("working");
  const [patchLocation, setPatchLocation] = useState<LocationKey>("forge");
  const [patchMoving, setPatchMoving]     = useState(false);
  const patchMoveRef                      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [daliStatus, setDaliStatus]       = useState<AgentStatus>("working");
  const [daliLocation, setDaliLocation]   = useState<LocationKey>("alchemyLab");
  const [daliMoving, setDaliMoving]       = useState(false);
  const daliMoveRef                       = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = pickWallyState();
      setWallyStatus(next.status);
      setWallyLocation(next.location);
      setWallyMoving(true);
      if (wallyMoveRef.current) clearTimeout(wallyMoveRef.current);
      wallyMoveRef.current = setTimeout(() => setWallyMoving(false), 7000);
    }, 10000);

    return () => {
      clearInterval(interval);
      if (wallyMoveRef.current) clearTimeout(wallyMoveRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = pickPatchState();
      setPatchStatus(next.status);
      setPatchLocation(next.location);
      setPatchMoving(true);
      if (patchMoveRef.current) clearTimeout(patchMoveRef.current);
      patchMoveRef.current = setTimeout(() => setPatchMoving(false), 7000);
    }, 10000);

    return () => {
      clearInterval(interval);
      if (patchMoveRef.current) clearTimeout(patchMoveRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = pickDaliState();
      setDaliStatus(next.status);
      setDaliLocation(next.location);
      setDaliMoving(true);
      if (daliMoveRef.current) clearTimeout(daliMoveRef.current);
      daliMoveRef.current = setTimeout(() => setDaliMoving(false), 7000);
    }, 10000);

    return () => {
      clearInterval(interval);
      if (daliMoveRef.current) clearTimeout(daliMoveRef.current);
    };
  }, []);

  const wallyPos = LOCATIONS[wallyLocation];
  const patchPos = LOCATIONS[patchLocation];
  const daliPos  = LOCATIONS[daliLocation];

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
            top: wallyPos.top,
            left: wallyPos.left,
            transform: "translate(-50%, -50%)",
            transition: "top 7s ease-in-out, left 7s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
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
                backgroundColor: STATUS_COLORS[wallyStatus],
                flexShrink: 0,
              }}
            />
          </div>
          <WallySprite isMoving={wallyMoving} />
        </div>

        {/* Patch sprite */}
        <div
          style={{
            position: "absolute",
            top: patchPos.top,
            left: patchPos.left,
            transform: "translate(-50%, -50%)",
            transition: "top 7s ease-in-out, left 7s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: "#fff",
                textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                whiteSpace: "nowrap",
              }}
            >
              Patch
            </span>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#f97316",
                flexShrink: 0,
              }}
            />
          </div>
          <PatchSprite isMoving={patchMoving} />
        </div>

        {/* Dali sprite */}
        <div
          style={{
            position: "absolute",
            top: daliPos.top,
            left: daliPos.left,
            transform: "translate(-50%, -50%)",
            transition: "top 7s ease-in-out, left 7s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: "#fff",
                textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                whiteSpace: "nowrap",
              }}
            >
              Dali
            </span>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#a855f7",
                flexShrink: 0,
              }}
            />
          </div>
          <DaliSprite isMoving={daliMoving} />
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
            backgroundColor: STATUS_COLORS[wallyStatus],
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span>🧙 Wally · {wallyStatus.charAt(0).toUpperCase() + wallyStatus.slice(1)}</span>
        <span style={{ color: "#4b5563", margin: "0 4px" }}>|</span>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#f97316",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span>🔨 Patch · {patchStatus.charAt(0).toUpperCase() + patchStatus.slice(1)}</span>
        <span style={{ color: "#4b5563", margin: "0 4px" }}>|</span>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#a855f7",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span>🎨 Dali · {daliStatus.charAt(0).toUpperCase() + daliStatus.slice(1)}</span>
      </div>
    </div>
  );
}
