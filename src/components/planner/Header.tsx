"use client";
import { usePlannerStore } from "@/stores/plannerStore";
import { useEffect, useState } from "react";

const GREETINGS = [
  "Slay the boss first.",
  "No retreat today.",
  "The boss won't defeat itself.",
  "Load your best build.",
  "Main quest awaits.",
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const navBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #1E1E1C",
  borderRadius: 4,
  color: "#6B6A65",
  fontSize: 14,
  padding: "6px 10px",
  cursor: "pointer",
};

export function Header() {
  const { currentDate, navDay, setCurrentDate } = usePlannerStore();
  const [greeting, setGreeting] = useState(GREETINGS[0]);
  useEffect(() => {
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);
  const isToday = currentDate === todayKey();

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "ArrowLeft") { e.preventDefault(); navDay(-1); }
      if ((e.metaKey || e.ctrlKey) && e.key === "ArrowRight") { e.preventDefault(); navDay(1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navDay]);

  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
      <div>
        <p style={{ margin: 0, fontSize: 12, fontFamily: "'Poppins', sans-serif", color: "#6B6A65", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {formatDateLabel(currentDate)}
        </p>
        <h1 suppressHydrationWarning style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", color: "#E8E6DF", lineHeight: 1.2 }}>
          {greeting}
        </h1>
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <button onClick={() => navDay(-1)} style={navBtn}>←</button>
        <button
          onClick={() => setCurrentDate(todayKey())}
          style={{ ...navBtn, fontSize: 11, fontFamily: "'Poppins', sans-serif", padding: "6px 14px", opacity: isToday ? 0.3 : 1 }}
        >
          TODAY
        </button>
        <button onClick={() => navDay(1)} style={navBtn}>→</button>
      </div>
    </header>
  );
}
