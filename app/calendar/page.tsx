"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  day: number; // 0 = Mon
  startHour: number;
  duration: number; // in hours
  color: string;
  agent?: string;
  description?: string;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i); // 12am - 11pm (full day)

function makeEvents(
  id: string,
  title: string,
  startHour: number,
  color: string,
  agent: string,
  description: string
): CalendarEvent[] {
  return Array.from({ length: 7 }, (_, day) => ({
    id: `${id}-${day}`,
    title,
    day,
    startHour,
    duration: 0.5,
    color,
    agent,
    description,
  }));
}

const EVENTS: CalendarEvent[] = [
  ...makeEvents(
    "quiz",
    "Daily Morning Quiz",
    8,
    "#f59e0b",
    "Wally",
    "6-question daily quiz covering HVAC, financials, and Hunton operations. Reply with answers for grading and feedback."
  ),
  ...makeEvents(
    "brief",
    "Daily AI Brief",
    12,
    "#3b82f6",
    "Wally",
    "Top AI news: model releases, funding, major announcements. Delivered via Telegram."
  ),
  ...makeEvents(
    "memory",
    "Daily Memory Sync",
    0,
    "#8b5cf6",
    "Wally",
    "Reviews the day conversations, updates MEMORY.md, syncs Mission Control tasks and memory page, pushes to GitHub."
  ),
];

const WEEK_START = new Date(2026, 2, 23); // March 23, 2026 (Mon)

function formatWeekLabel(startDate: Date) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export default function CalendarPage() {
  const [weekOffset, setWeekOffset] = useState(1); // Start at current week
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const currentWeekStart = new Date(WEEK_START);
  currentWeekStart.setDate(currentWeekStart.getDate() + weekOffset * 7);

  const hourHeight = 60;

  const getEventStyle = (event: CalendarEvent) => {
    const topOffset = event.startHour * hourHeight;
    const height = event.duration * hourHeight - 4;
    return { top: topOffset, height: Math.max(height, 20) };
  };

  const daysToShow = viewMode === "week" ? WEEK_DAYS : [WEEK_DAYS[selectedDay]];
  const eventsToShow = viewMode === "day" ? EVENTS.filter((e) => e.day === selectedDay) : EVENTS;

  return (
    <div style={{ padding: "32px 32px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>Calendar</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{formatWeekLabel(currentWeekStart)}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* View Toggle */}
          <div
            style={{
              display: "flex",
              background: "#161616",
              border: "1px solid #222",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {(["week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: viewMode === mode ? "#3b82f6" : "transparent",
                  color: viewMode === mode ? "white" : "#9ca3af",
                  textTransform: "capitalize",
                }}
              >
                {mode}
              </button>
            ))}
          </div>
          {/* Nav */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#161616",
                border: "1px solid #222",
                color: "#9ca3af",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setWeekOffset(1)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: "#161616",
                border: "1px solid #222",
                color: "#9ca3af",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Today
            </button>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#161616",
                border: "1px solid #222",
                color: "#9ca3af",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Day Selector (for day view) */}
      {viewMode === "day" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {WEEK_DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid #222",
                background: selectedDay === i ? "#3b82f6" : "#161616",
                color: selectedDay === i ? "white" : "#9ca3af",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Calendar Grid */}
      <div
        style={{
          flex: 1,
          background: "#161616",
          border: "1px solid #222",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Column Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `60px repeat(${daysToShow.length}, 1fr)`,
            borderBottom: "1px solid #1f1f1f",
          }}
        >
          <div style={{ borderRight: "1px solid #1f1f1f" }} />
          {daysToShow.map((day, i) => {
            const dayDate = new Date(currentWeekStart);
            const dayIndex = viewMode === "day" ? selectedDay : i;
            dayDate.setDate(dayDate.getDate() + dayIndex);
            const isToday =
              dayDate.toDateString() === new Date().toDateString();
            return (
              <div
                key={day}
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  borderRight: "1px solid #1f1f1f",
                  background: isToday ? "#1a2436" : "transparent",
                }}
              >
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>{day}</div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: isToday ? "#3b82f6" : "#e5e7eb",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: isToday ? "#3b82f620" : "transparent",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {dayDate.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `60px repeat(${daysToShow.length}, 1fr)`,
              position: "relative",
            }}
          >
            {/* Time Labels */}
            <div>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  style={{
                    height: hourHeight,
                    borderRight: "1px solid #1f1f1f",
                    borderBottom: "1px solid #1a1a1a",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                  }}
                >
                  <span style={{ fontSize: 10, color: "#4b5563" }}>
                    {hour === 0 ? "12am" : hour < 12 ? `${hour}am` : hour === 12 ? "12pm" : `${hour - 12}pm`}
                  </span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {daysToShow.map((day, colIndex) => {
              const dayIndex = viewMode === "day" ? selectedDay : colIndex;
              const dayEvents = eventsToShow.filter((e) => e.day === dayIndex);
              return (
                <div
                  key={day}
                  style={{
                    borderRight: "1px solid #1f1f1f",
                    position: "relative",
                  }}
                >
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      style={{
                        height: hourHeight,
                        borderBottom: "1px solid #1a1a1a",
                      }}
                    />
                  ))}
                  {/* Events */}
                  {dayEvents.map((event) => {
                    const style = getEventStyle(event);
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        style={{
                          position: "absolute",
                          left: 4,
                          right: 4,
                          top: style.top + 2,
                          height: style.height,
                          background: `${event.color}20`,
                          border: `1px solid ${event.color}50`,
                          borderLeft: `3px solid ${event.color}`,
                          borderRadius: 6,
                          padding: "4px 8px",
                          cursor: "pointer",
                          overflow: "hidden",
                          transition: "background 0.15s ease",
                          zIndex: 1,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = `${event.color}35`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = `${event.color}20`;
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 700, color: event.color, lineHeight: 1.3 }}>
                          {event.title}
                        </div>
                        {event.duration >= 0.75 && (
                          <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
                            <Clock size={9} />
                            {event.startHour === 0 ? "12:00am" : event.startHour < 12 ? `${event.startHour}:00am` : event.startHour === 12 ? "12:00pm" : `${event.startHour - 12}:00pm`}
                          </div>
                        )}
                        {event.agent && (
                          <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>
                            🤖 {event.agent}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => e.target === e.currentTarget && setSelectedEvent(null)}
        >
          <div
            style={{
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderLeft: `4px solid ${selectedEvent.color}`,
              borderRadius: 12,
              padding: 24,
              width: 380,
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#9ca3af" }}>
                <Clock size={13} />
                {WEEK_DAYS[selectedEvent.day]},{" "}
                {selectedEvent.startHour === 0
                  ? "12:00 AM"
                  : selectedEvent.startHour < 12
                  ? `${selectedEvent.startHour}:00 AM`
                  : selectedEvent.startHour === 12
                  ? "12:00 PM"
                  : `${selectedEvent.startHour - 12}:00 PM`}
                {" "}({selectedEvent.duration}h)
              </div>
              {selectedEvent.agent && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#9ca3af" }}>
                  <span>🤖</span>
                  <span>
                    Agent: <span style={{ color: selectedEvent.color, fontWeight: 600 }}>{selectedEvent.agent}</span>
                  </span>
                </div>
              )}
              {selectedEvent.description && (
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, lineHeight: 1.6 }}>
                  {selectedEvent.description}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
