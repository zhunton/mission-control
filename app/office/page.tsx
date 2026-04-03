"use client";

import { useState, useRef } from "react";

interface ClickPoint {
  x: number;
  y: number;
}

export default function OfficePage() {
  const [clicks, setClicks] = useState<ClickPoint[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClicks((prev) => [...prev, { x, y }]);
  }

  const last = clicks[clicks.length - 1];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Instruction bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          fontSize: 13,
          padding: "6px 12px",
          textAlign: "center",
        }}
      >
        Click on each station to record its coordinates. Share the results with Wally.
      </div>

      {/* Coordinate panel */}
      <div
        style={{
          position: "absolute",
          top: 32,
          right: 12,
          zIndex: 20,
          background: "rgba(0,0,0,0.75)",
          color: "#fff",
          fontSize: 12,
          padding: "10px 14px",
          borderRadius: 8,
          minWidth: 220,
          maxHeight: "60vh",
          overflowY: "auto",
          fontFamily: "monospace",
        }}
      >
        <div style={{ marginBottom: 6, fontWeight: "bold", fontSize: 13 }}>
          Coordinate Tool
        </div>
        {last ? (
          <div style={{ marginBottom: 8, color: "#7ef" }}>
            Last click: top: {last.y.toFixed(1)}%, left: {last.x.toFixed(1)}%
          </div>
        ) : (
          <div style={{ marginBottom: 8, color: "#aaa" }}>No clicks yet</div>
        )}
        {clicks.length > 0 && (
          <>
            <div style={{ marginBottom: 4, color: "#ccc" }}>All clicks:</div>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {clicks.map((pt, i) => (
                <li key={i} style={{ marginBottom: 2 }}>
                  top: {pt.y.toFixed(1)}%, left: {pt.x.toFixed(1)}%
                </li>
              ))}
            </ol>
            <button
              onClick={() => setClicks([])}
              style={{
                marginTop: 10,
                padding: "4px 10px",
                background: "#c33",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Clear
            </button>
          </>
        )}
      </div>

      {/* Office container with click handler */}
      <div
        ref={containerRef}
        onClick={handleClick}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          cursor: "crosshair",
          position: "relative",
        }}
      >
        <img
          src="/office-background.svg"
          alt="Office"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />

        {/* Pin markers */}
        {clicks.map((pt, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              transform: "translate(-50%, -50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "red",
              border: "2px solid white",
              boxShadow: "0 0 4px rgba(0,0,0,0.6)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        ))}
      </div>
    </div>
  );
}
