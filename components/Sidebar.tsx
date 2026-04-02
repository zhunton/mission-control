"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  Calendar,
  Brain,
  FileText,
  Users,
  Building2,
  Zap,
  GraduationCap,
  Newspaper,
} from "lucide-react";

const navItems = [
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/briefs", label: "Briefs", icon: Newspaper },
  { href: "/memory", label: "Memory", icon: Brain },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/people", label: "People", icon: Users },
  { href: "/coaching", label: "Coaching", icon: GraduationCap },
  { href: "/office", label: "Office", icon: Building2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: "#111111",
        borderRight: "1px solid #1f1f1f",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid #1f1f1f",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>
              MISSION
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6", letterSpacing: "0.02em" }}>
              CONTROL
            </div>
          </div>
        </div>
      </div>

      {/* User */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #1f1f1f",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "white",
            flexShrink: 0,
          }}
        >
          Z
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#e5e7eb" }}>Zach Hunton</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>Owner</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                textDecoration: "none",
                color: active ? "#fff" : "#9ca3af",
                background: active ? "#1d2433" : "transparent",
                borderLeft: active ? "2px solid #3b82f6" : "2px solid transparent",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={16} color={active ? "#3b82f6" : "#6b7280"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Wally Status */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #1f1f1f",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src="/wally-wizard.jpg"
            alt="Wally"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              border: "1.5px solid #111",
              animation: "pulse-dot 2s infinite",
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#e5e7eb" }}>Wally</div>
          <div style={{ fontSize: 11, color: "#22c55e" }}>Online</div>
        </div>
      </div>
    </aside>
  );
}
