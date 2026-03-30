"use client";

import { useRef, useEffect, useState } from "react";

// ---- Waypoints ----
const WAYPOINTS = {
  center:      { x: 450, y: 300 },
  tableNorth:  { x: 450, y: 230 },
  tableSouth:  { x: 450, y: 370 },
  tableEast:   { x: 520, y: 300 },
  tableWest:   { x: 380, y: 300 },
  corridorNE:  { x: 660, y: 200 },
  corridorNW:  { x: 240, y: 200 },
  corridorSE:  { x: 660, y: 430 },
  corridorSW:  { x: 240, y: 430 },
  wizardTower: { x: 740, y: 500 },
  forge:       { x: 740, y: 120 },
  alchemyLab:  { x: 160, y: 120 },
  tavern:      { x: 160, y: 500 },
  scribe:      { x: 200, y: 300 },
} as const;

type WaypointKey = keyof typeof WAYPOINTS;

const EDGES: [WaypointKey, WaypointKey][] = [
  ["center", "tableNorth"], ["center", "tableSouth"],
  ["center", "tableEast"],  ["center", "tableWest"],
  ["tableNorth", "corridorNE"], ["tableNorth", "corridorNW"],
  ["tableSouth", "corridorSE"], ["tableSouth", "corridorSW"],
  ["corridorNE", "forge"],      ["corridorNW", "alchemyLab"],
  ["corridorSE", "wizardTower"],["corridorSW", "tavern"],
  ["tableWest", "scribe"],
];

const GRAPH: Map<WaypointKey, WaypointKey[]> = new Map();
for (const key of Object.keys(WAYPOINTS) as WaypointKey[]) GRAPH.set(key, []);
for (const [a, b] of EDGES) { GRAPH.get(a)!.push(b); GRAPH.get(b)!.push(a); }

function bfs(start: WaypointKey, end: WaypointKey): WaypointKey[] {
  if (start === end) return [start];
  const queue: WaypointKey[][] = [[start]];
  const visited = new Set<WaypointKey>([start]);
  while (queue.length) {
    const path = queue.shift()!;
    const node = path[path.length - 1];
    for (const nb of GRAPH.get(node) ?? []) {
      if (nb === end) return [...path, nb];
      if (!visited.has(nb)) { visited.add(nb); queue.push([...path, nb]); }
    }
  }
  return [start];
}

// ---- Types ----
type AgentStatus = "working" | "idle" | "meeting";

interface AgentState {
  name: string; color: string; emoji: string;
  x: number; y: number;
  path: WaypointKey[]; pathIndex: number;
  currentWaypoint: WaypointKey;
  status: AgentStatus; locationLabel: string;
  nextDecisionTime: number;
}

// ---- Constants ----
const CANVAS_W = 900;
const CANVAS_H = 600;
const WALL = 40;
const SPEED = 60;

const STATUS_COLORS: Record<AgentStatus, string> = {
  working: "#22c55e", idle: "#f59e0b", meeting: "#60a5fa",
};

const LOCATION_LABELS: Record<WaypointKey, string> = {
  center: "Round Table",   tableNorth: "Round Table", tableSouth: "Round Table",
  tableEast: "Round Table", tableWest: "Round Table",
  corridorNE: "Corridor",  corridorNW: "Corridor",
  corridorSE: "Corridor",  corridorSW: "Corridor",
  wizardTower: "Wizard's Tower", forge: "The Forge",
  alchemyLab: "Alchemy Lab", tavern: "The Tavern", scribe: "Scribe's Corner",
};

function pickDest(name: string): { dest: WaypointKey; status: AgentStatus } {
  const r = Math.random();
  if (name === "Wally") {
    if (r < 0.60) return { dest: "wizardTower", status: "working" };
    if (r < 0.80) return { dest: "tavern",      status: "idle" };
    return { dest: "center", status: "meeting" };
  } else if (name === "Patch") {
    if (r < 0.65) return { dest: "forge",  status: "working" };
    if (r < 0.85) return { dest: "tavern", status: "idle" };
    return { dest: "center", status: "meeting" };
  } else {
    if (r < 0.65) return { dest: "alchemyLab", status: "working" };
    if (r < 0.85) return { dest: "tavern",     status: "idle" };
    return { dest: "center", status: "meeting" };
  }
}

// ---- Component ----
export default function OfficePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const agentsRef = useRef<AgentState[]>([]);
  const imgsRef   = useRef<Record<string, HTMLImageElement>>({});

  const [statusDisplay, setStatusDisplay] = useState([
    { name: "Wally", emoji: "🧙", color: "#3b82f6", status: "working" as AgentStatus, location: "Wizard's Tower" },
    { name: "Patch", emoji: "🔨", color: "#f97316", status: "working" as AgentStatus, location: "The Forge" },
    { name: "Dali",  emoji: "🎨", color: "#a855f7", status: "working" as AgentStatus, location: "Alchemy Lab" },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let mounted = true;

    agentsRef.current = [
      { name: "Wally", color: "#3b82f6", emoji: "🧙", ...WAYPOINTS.wizardTower, path: [], pathIndex: 0, currentWaypoint: "wizardTower", status: "working", locationLabel: "Wizard's Tower", nextDecisionTime: 12 },
      { name: "Patch", color: "#f97316", emoji: "🔨", ...WAYPOINTS.forge,        path: [], pathIndex: 0, currentWaypoint: "forge",        status: "working", locationLabel: "The Forge",       nextDecisionTime: 14 },
      { name: "Dali",  color: "#a855f7", emoji: "🎨", ...WAYPOINTS.alchemyLab,   path: [], pathIndex: 0, currentWaypoint: "alchemyLab",   status: "working", locationLabel: "Alchemy Lab",      nextDecisionTime: 16 },
    ];

    let pending = 3;
    for (const name of ["wally", "patch", "dali"]) {
      const img = new Image();
      img.onload = img.onerror = () => {
        imgsRef.current[name] = img;
        if (--pending === 0 && mounted) startLoop();
      };
      img.src = `/sprite-${name}.png`;
    }

    let prevTime = 0;
    let animTime = 0;

    function startLoop() {
      prevTime = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }

    function tick(now: number) {
      if (!mounted) return;
      const dt = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;
      animTime += dt;
      update(dt);
      render(animTime);
      rafRef.current = requestAnimationFrame(tick);
    }

    function update(dt: number) {
      let changed = false;
      for (const a of agentsRef.current) {
        if (a.pathIndex < a.path.length) {
          const wpKey = a.path[a.pathIndex]!;
          const wp = WAYPOINTS[wpKey];
          const dx = wp.x - a.x, dy = wp.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const step = SPEED * dt;
          if (dist <= step) {
            a.x = wp.x; a.y = wp.y;
            a.currentWaypoint = wpKey;
            a.pathIndex++;
          } else {
            a.x += (dx / dist) * step;
            a.y += (dy / dist) * step;
          }
        }
        a.nextDecisionTime -= dt;
        if (a.nextDecisionTime <= 0) {
          const { dest, status } = pickDest(a.name);
          const path = bfs(a.currentWaypoint, dest);
          a.path = path; a.pathIndex = 1;
          a.status = status;
          a.locationLabel = LOCATION_LABELS[dest];
          a.nextDecisionTime = 11 + Math.random() * 2;
          changed = true;
        }
      }
      if (changed) {
        setStatusDisplay(agentsRef.current.map(a => ({
          name: a.name, emoji: a.emoji, color: a.color,
          status: a.status, location: a.locationLabel,
        })));
      }
    }

    function render(t: number) {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawFloor();
      drawWalls();
      drawTavern(t);
      drawAlchemyLab(t);
      drawForge(t);
      drawRoundTable();
      drawScribe(t);
      drawWizardTower(t);
      drawTorches(t);
      drawAgents(t);
    }

    // ------------------------------------------------------------------ floor

    function drawFloor() {
      const tile = 40;
      for (let row = 0; row * tile < CANVAS_H; row++) {
        for (let col = 0; col * tile < CANVAS_W; col++) {
          const v = ((row * 7 + col * 13) % 5) * 5;
          const s = 44 + v;
          ctx.fillStyle = `rgb(${s},${s},${s + 3})`;
          ctx.fillRect(col * tile, row * tile, tile - 1, tile - 1);
        }
      }
    }

    // ------------------------------------------------------------------ walls

    function drawWalls() {
      ctx.fillStyle = "#1e1a14";
      ctx.fillRect(0, 0, CANVAS_W, WALL);
      ctx.fillRect(0, CANVAS_H - WALL, CANVAS_W, WALL);
      ctx.fillRect(0, 0, WALL, CANVAS_H);
      ctx.fillRect(CANVAS_W - WALL, 0, WALL, CANVAS_H);

      ctx.fillStyle = "#2a2318";
      for (let i = 0; i < 12; i++) {
        ctx.fillRect(i * 78,      4,               73, 14);
        ctx.fillRect(i * 78 + 38, 20,              73, 14);
        ctx.fillRect(i * 78,      CANVAS_H - 36,   73, 14);
        ctx.fillRect(i * 78 + 38, CANVAS_H - 20,   73, 14);
      }
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(4,               i * 78,      14, 73);
        ctx.fillRect(21,              i * 78 + 38, 14, 73);
        ctx.fillRect(CANVAS_W - 18,   i * 78,      14, 73);
        ctx.fillRect(CANVAS_W - 35,   i * 78 + 38, 14, 73);
      }
      ctx.strokeStyle = "#0f0d09";
      ctx.lineWidth = 3;
      ctx.strokeRect(WALL, WALL, CANVAS_W - WALL * 2, CANVAS_H - WALL * 2);
    }

    // ----------------------------------------------------------------- torches

    function drawTorches(t: number) {
      const pts = [
        { x: 220, y: WALL,          dir: "top"   },
        { x: 680, y: WALL,          dir: "top"   },
        { x: WALL, y: 180,          dir: "left"  },
        { x: WALL, y: 420,          dir: "left"  },
        { x: CANVAS_W - WALL, y: 180, dir: "right" },
        { x: CANVAS_W - WALL, y: 420, dir: "right" },
      ];

      for (const p of pts) {
        const flicker = Math.sin(t * (8 + Math.sin(t * 0.7 + p.x) * 2)) * 0.25 + 0.75;
        const glowX = p.x + (p.dir === "left" ? 40 : p.dir === "right" ? -40 : 0);
        const glowY = p.y + (p.dir === "top"  ? 40 : 0);

        const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 75);
        glow.addColorStop(0, `rgba(255,150,30,${0.18 * flicker})`);
        glow.addColorStop(1, "rgba(255,100,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(glowX, glowY, 75, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#4a3520";
        ctx.fillRect(p.x - 4, p.y + 2, 8, 10);

        const fg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12 * flicker);
        fg.addColorStop(0,   `rgba(255,230,100,${flicker})`);
        fg.addColorStop(0.5, `rgba(255,100,0,${0.7 * flicker})`);
        fg.addColorStop(1,   "rgba(200,20,0,0)");
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y - 2, 5 * flicker, 9 * flicker, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ------------------------------------------------------------------ rooms

    function drawWizardTower(t: number) {
      const cx = 760, cy = 490;

      // Purple rug
      ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fillStyle = "#3b0764"; ctx.fill();
      ctx.strokeStyle = "#7e22ce"; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.strokeStyle = "#6b21a8"; ctx.lineWidth = 1; ctx.stroke();

      // Rotating rune marks
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + t * 0.15;
        const rx = cx + Math.cos(ang) * 52, ry = cy + Math.sin(ang) * 52;
        ctx.save(); ctx.translate(rx, ry); ctx.rotate(ang);
        ctx.strokeStyle = "#9333ea"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-5, -5); ctx.lineTo(5, 0); ctx.lineTo(-5, 5); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "#a855f7";
        ctx.beginPath(); ctx.arc(rx, ry, 2, 0, Math.PI * 2); ctx.fill();
      }

      // Pulsing orb glow
      const pulse = Math.sin(t * 1.8) * 0.25 + 0.75;
      const og = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40 * pulse);
      og.addColorStop(0,   `rgba(147,197,253,${0.85 * pulse})`);
      og.addColorStop(0.5, `rgba(59,130,246,${0.4 * pulse})`);
      og.addColorStop(1,   "rgba(29,78,216,0)");
      ctx.fillStyle = og;
      ctx.beginPath(); ctx.arc(cx, cy, 40 * pulse, 0, Math.PI * 2); ctx.fill();

      // Orb core
      ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.fillStyle = "#bfdbfe"; ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.beginPath(); ctx.arc(cx - 4, cy - 4, 5, 0, Math.PI * 2); ctx.fill();

      // Bookshelf (bottom-right wall)
      ctx.fillStyle = "#78350f";
      ctx.fillRect(CANVAS_W - WALL - 5, CANVAS_H - WALL - 8,  -65, -16);
      ctx.fillRect(CANVAS_W - WALL - 5, CANVAS_H - WALL - 28, -65, -16);
      const bkc = ["#dc2626","#2563eb","#16a34a","#ca8a04","#9333ea","#0891b2","#db2777"];
      for (let shelf = 0; shelf < 2; shelf++) {
        const sy2 = CANVAS_H - WALL - 10 - shelf * 20;
        for (let b = 0; b < 6; b++) {
          ctx.fillStyle = bkc[(b + shelf * 3) % bkc.length];
          ctx.fillRect(CANVAS_W - WALL - 10 - b * 9, sy2 - 11, 7, 10);
        }
      }

      label(ctx, "Wizard's Tower", cx, CANVAS_H - WALL - 5);
    }

    function drawForge(t: number) {
      const cx = 760, cy = 100;
      const flick = Math.sin(t * 11) * 0.2 + 0.8;

      // Stone forge box against right wall
      ctx.fillStyle = "#374151";
      ctx.fillRect(CANVAS_W - WALL - 82, WALL + 4, 77, 78);
      ctx.fillStyle = "#111827";
      ctx.fillRect(CANVAS_W - WALL - 74, WALL + 10, 62, 60);

      // Tri-flame fire
      for (let i = 0; i < 3; i++) {
        const ff = Math.sin(t * (10 + i * 3) + i) * 0.2 + 0.8;
        const fx = cx - 12 + i * 12;
        const fg = ctx.createRadialGradient(fx, WALL + 42, 0, fx, WALL + 42, 20 * ff);
        fg.addColorStop(0,   `rgba(255,240,50,${ff})`);
        fg.addColorStop(0.4, `rgba(255,90,0,${0.8 * ff})`);
        fg.addColorStop(1,   "rgba(100,0,0,0)");
        ctx.fillStyle = fg;
        ctx.beginPath(); ctx.ellipse(fx, WALL + 42, 12, 20, 0, 0, Math.PI * 2); ctx.fill();
      }

      // Forge floor glow
      const fg2 = ctx.createRadialGradient(cx, cy + 30, 0, cx, cy + 30, 110);
      fg2.addColorStop(0, `rgba(255,90,0,${0.15 * flick})`);
      fg2.addColorStop(1, "rgba(255,60,0,0)");
      ctx.fillStyle = fg2;
      ctx.beginPath(); ctx.arc(cx, cy + 30, 110, 0, Math.PI * 2); ctx.fill();

      // Anvil
      ctx.fillStyle = "#374151";
      ctx.fillRect(cx - 25, cy + 55, 50, 14);
      ctx.fillStyle = "#4b5563";
      ctx.fillRect(cx - 20, cy + 43, 40, 14);
      ctx.fillRect(cx - 10, cy + 69, 32, 8);
      ctx.fillStyle = "#6b7280";
      ctx.fillRect(cx - 20, cy + 43, 40, 3);

      // Tool rack
      ctx.fillStyle = "#78350f";
      ctx.fillRect(cx - 82, cy + 30, 10, 58);
      ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 82, cy + 38 + i * 13);
        ctx.lineTo(cx - 62, cy + 48 + i * 13);
        ctx.stroke();
      }

      label(ctx, "The Forge", cx, WALL + 92);
    }

    function drawAlchemyLab(t: number) {
      const cx = 140, cy = 110;
      const pc = ["#22c55e","#ef4444","#3b82f6","#a855f7","#f59e0b"];

      // Wall shelves
      ctx.fillStyle = "#92400e";
      ctx.fillRect(WALL + 5, WALL + 8,  88, 8);
      ctx.fillRect(WALL + 5, WALL + 24, 72, 8);
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = pc[i];
        ctx.beginPath(); ctx.ellipse(WALL + 14 + i * 15, WALL + 14, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = pc[(i + 2) % 5];
        ctx.beginPath(); ctx.ellipse(WALL + 14 + i * 16, WALL + 30, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
      }

      // Table
      ctx.fillStyle = "#92400e";
      ctx.fillRect(cx - 56, cy + 28, 112, 58);
      ctx.fillStyle = "#78350f";
      ctx.fillRect(cx - 56, cy + 28, 112, 5);
      ctx.fillStyle = "#6b3a1f";
      ctx.fillRect(cx - 53, cy + 86, 8, 16);
      ctx.fillRect(cx + 45, cy + 86, 8, 16);

      // Potion bottles on table
      const potions = [
        { x: cx - 38 }, { x: cx - 19 }, { x: cx + 1 }, { x: cx + 20 }, { x: cx + 40 },
      ];
      potions.forEach(({ x: px }, i) => {
        ctx.fillStyle = pc[i];
        ctx.beginPath(); ctx.ellipse(px, cy + 55, 6, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#d1d5db"; ctx.fillRect(px - 2, cy + 44, 4, 5);
        ctx.fillStyle = "#c4a87a"; ctx.fillRect(px - 1, cy + 42, 2, 3);
        const bub = (Math.sin(t * 2.5 + px) + 1) / 2;
        ctx.fillStyle = `rgba(255,255,255,${bub * 0.5})`;
        ctx.beginPath(); ctx.arc(px + 2, cy + 51, 2, 0, Math.PI * 2); ctx.fill();
      });

      // Candles
      for (const cx2 of [cx - 52, cx + 48]) {
        ctx.fillStyle = "#f5f0e8"; ctx.fillRect(cx2 - 3, cy + 32, 6, 20);
        ctx.fillStyle = "#6b7280"; ctx.fillRect(cx2 - 3, cy + 32, 6, 2);
        const cf = Math.sin(t * 6 + cx2) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(255,200,0,${cf})`;
        ctx.beginPath(); ctx.ellipse(cx2, cy + 29, 3, 5, 0, 0, Math.PI * 2); ctx.fill();
      }

      label(ctx, "Alchemy Lab", cx, WALL + 92);
    }

    function drawRoundTable() {
      const cx = 450, cy = 300;

      // Red rug
      ctx.beginPath(); ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.fillStyle = "#7f1d1d"; ctx.fill();
      ctx.strokeStyle = "#991b1b"; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2);
      ctx.strokeStyle = "#b91c1c"; ctx.lineWidth = 1; ctx.stroke();

      // 6 chairs
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const cx2 = cx + Math.cos(ang) * 95, cy2 = cy + Math.sin(ang) * 95;
        ctx.save(); ctx.translate(cx2, cy2); ctx.rotate(ang + Math.PI / 2);
        ctx.fillStyle = "#92400e"; ctx.fillRect(-10, -8, 20, 16);
        ctx.fillStyle = "#78350f"; ctx.fillRect(-10, -8, 20, 4);
        ctx.restore();
      }

      // Table top
      ctx.beginPath(); ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fillStyle = "#2d1810"; ctx.fill();
      ctx.strokeStyle = "#78350f"; ctx.lineWidth = 4; ctx.stroke();

      // Scroll
      ctx.fillStyle = "#c9b47a"; ctx.fillRect(cx - 30, cy - 20, 60, 40);
      ctx.strokeStyle = "#8b6914"; ctx.lineWidth = 0.8;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 24, cy - 13 + i * 7); ctx.lineTo(cx + 24, cy - 13 + i * 7);
        ctx.stroke();
      }
      ctx.fillStyle = "#b8954a";
      ctx.fillRect(cx - 34, cy - 20, 6, 40);
      ctx.fillRect(cx + 28, cy - 20, 6, 40);

      label(ctx, "The Round Table", cx, cy + 148);
    }

    function drawScribe(t: number) {
      const cx = 175, cy = 300;

      // Desk
      ctx.fillStyle = "#92400e"; ctx.fillRect(cx - 48, cy - 25, 96, 62);
      ctx.fillStyle = "#78350f"; ctx.fillRect(cx - 48, cy - 25, 96, 5);
      ctx.fillStyle = "#6b3a1f";
      ctx.fillRect(cx - 45, cy + 37, 8, 18); ctx.fillRect(cx + 37, cy + 37, 8, 18);

      // Open book
      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(cx - 34, cy - 14, 30, 44); ctx.fillRect(cx + 4, cy - 14, 30, 44);
      ctx.strokeStyle = "#b4a070"; ctx.lineWidth = 0.8;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 28, cy - 6 + i * 8); ctx.lineTo(cx - 6, cy - 6 + i * 8);
        ctx.moveTo(cx + 8,  cy - 6 + i * 8); ctx.lineTo(cx + 30, cy - 6 + i * 8);
        ctx.stroke();
      }
      ctx.strokeStyle = "#78350f"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy - 14); ctx.lineTo(cx, cy + 30); ctx.stroke();

      // Quill
      ctx.strokeStyle = "#f8f0c0"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx + 28, cy - 22); ctx.lineTo(cx - 4, cy + 22); ctx.stroke();
      ctx.fillStyle = "#e0d090";
      ctx.beginPath();
      ctx.moveTo(cx + 28, cy - 22); ctx.lineTo(cx + 36, cy - 30); ctx.lineTo(cx + 32, cy - 16);
      ctx.fill();

      // Candle
      ctx.fillStyle = "#f5f0e8"; ctx.fillRect(cx + 34, cy - 10, 7, 26);
      const cf = Math.sin(t * 5.5) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(255,200,50,${cf})`;
      ctx.beginPath(); ctx.ellipse(cx + 37, cy - 13, 3, 5, 0, 0, Math.PI * 2); ctx.fill();

      label(ctx, "Scribe's Corner", cx, cy + 62);
    }

    function drawTavern(t: number) {
      const cx = 150, cy = 490;

      // Warm amber glow
      const ag = ctx.createRadialGradient(cx, cy, 0, cx, cy, 130);
      ag.addColorStop(0, "rgba(251,191,36,0.08)"); ag.addColorStop(1, "rgba(251,191,36,0)");
      ctx.fillStyle = ag;
      ctx.beginPath(); ctx.arc(cx, cy, 130, 0, Math.PI * 2); ctx.fill();

      // Two round tables
      const tables: [number, number][] = [[cx - 38, cy - 10], [cx + 35, cy + 12]];
      for (const [tx, ty] of tables) {
        ctx.beginPath(); ctx.arc(tx, ty, 22, 0, Math.PI * 2);
        ctx.fillStyle = "#6b3a1f"; ctx.fill();
        ctx.strokeStyle = "#92400e"; ctx.lineWidth = 2; ctx.stroke();
        // mugs
        for (const [mx, my] of [[tx - 8, ty - 4], [tx + 6, ty + 4]] as [number, number][]) {
          ctx.fillStyle = "#8b4513"; ctx.fillRect(mx - 4, my - 5, 8, 10);
          ctx.fillStyle = "#a0522d"; ctx.fillRect(mx - 4, my - 5, 8, 2);
        }
      }
      // Candle flicker on first table
      const cf = Math.sin(t * 4.5 + 2) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(255,200,50,${cf * 0.6})`;
      ctx.beginPath(); ctx.arc(tables[0][0] + 5, tables[0][1] - 11, 4, 0, Math.PI * 2); ctx.fill();

      // Barrels
      for (const [bx, by, sz] of [[cx + 65, cy - 22, 16], [cx + 80, cy - 2, 14]] as [number, number, number][]) {
        ctx.beginPath(); ctx.ellipse(bx, by, sz, sz * 1.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#92400e"; ctx.fill();
        ctx.strokeStyle = "#4b5563"; ctx.lineWidth = 2;
        for (const ry of [-sz * 0.4, 0, sz * 0.4]) {
          ctx.beginPath(); ctx.ellipse(bx, by + ry, sz, sz * 0.35, 0, 0, Math.PI * 2); ctx.stroke();
        }
      }

      label(ctx, "The Tavern", cx, CANVAS_H - WALL - 5);
    }

    // ----------------------------------------------------------------- agents

    function drawAgents(t: number) {
      for (const a of agentsRef.current) {
        const moving = a.pathIndex < a.path.length;
        const bounce = moving ? Math.sin(t * 8) * 2 : 0;
        const sx = a.x - 32, sy = a.y - 32 + bounce;

        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.beginPath(); ctx.ellipse(a.x, a.y + 26, 22, 6, 0, 0, Math.PI * 2); ctx.fill();

        const img = imgsRef.current[a.name.toLowerCase()];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, sx, sy, 64, 64);
        } else {
          ctx.fillStyle = a.color;
          ctx.beginPath(); ctx.arc(a.x, a.y, 22, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center";
          ctx.fillText(a.name[0], a.x, a.y + 4);
        }

        // name label
        ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
        ctx.lineWidth = 3; ctx.strokeStyle = "rgba(0,0,0,0.9)";
        ctx.strokeText(a.name, a.x, sy - 4);
        ctx.fillStyle = "#ffffff"; ctx.fillText(a.name, a.x, sy - 4);

        // status dot
        ctx.beginPath(); ctx.arc(a.x + 26, sy + 6, 5, 0, Math.PI * 2);
        ctx.fillStyle = STATUS_COLORS[a.status]; ctx.fill();
        ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    // ----------------------------------------------------------------- util

    function label(c: CanvasRenderingContext2D, text: string, x: number, y: number) {
      c.fillStyle = "#fbbf24";
      c.font = "bold 11px monospace";
      c.textAlign = "center";
      c.fillText(text, x, y);
    }

    return () => { mounted = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#0a0907" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 8 }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: "block", maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>

      <div style={{
        backgroundColor: "rgba(0,0,0,0.92)",
        padding: "6px 16px",
        fontSize: 13,
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
        borderTop: "1px solid #374151",
      }}>
        {statusDisplay.map((a, i) => (
          <span key={a.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <span style={{ color: "#4b5563", margin: "0 4px" }}>|</span>}
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              backgroundColor: STATUS_COLORS[a.status],
              display: "inline-block", flexShrink: 0,
            }} />
            <span>{a.emoji} {a.name} · {a.location}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
