"use client";
import { useEffect, useRef, useState } from "react";
import { useTimer } from "@/hooks/useTimer";
import { SectionLabel } from "./SectionLabel";

const actionBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #2A2A28",
  borderRadius: 4,
  color: "#6B6A65",
  fontSize: 12,
  fontFamily: "'Poppins', sans-serif",
  letterSpacing: "0.05em",
  padding: "8px 20px",
  cursor: "pointer",
};

export function FocusTimer() {
  const { mm, ss, running, round, isBreak, toggle, reset, progress, completionCount } = useTimer();
  const [flashing, setFlashing] = useState(false);
  const prevCount = useRef(completionCount);

  // Flash the timer container whenever a round completes
  useEffect(() => {
    if (completionCount > prevCount.current) {
      setFlashing(true);
      const t = setTimeout(() => setFlashing(false), 850);
      prevCount.current = completionCount;
      return () => clearTimeout(t);
    }
  }, [completionCount]);

  return (
    <section>
      <SectionLabel text="Focus timer" />
      <div style={{ position: "relative", background: "#141413", border: "1px solid #1E1E1C", borderRadius: 6, padding: "20px 16px", textAlign: "center", overflow: "hidden" }}>

        {/* Flash overlay */}
        {flashing && (
          <div
            className="timer-flash"
            style={{
              position: "absolute", inset: 0,
              background: "#E8423F",
              pointerEvents: "none",
              borderRadius: 6,
            }}
          />
        )}

        {/* Progress bar */}
        <div style={{ height: 2, background: "#1E1E1C", borderRadius: 1, marginBottom: 16, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${Math.round(progress * 100)}%`,
            background: isBreak ? "#4A9E6B" : "#E8423F",
            transition: "width 1s linear",
            borderRadius: 1,
          }} />
        </div>

        <p style={{
          margin: 0, fontSize: 48, fontWeight: 300, fontFamily: "'Poppins', sans-serif",
          color: running ? (isBreak ? "#4A9E6B" : "#E8E6DF") : "#6B6A65",
          letterSpacing: "0.1em", lineHeight: 1,
        }}>
          {mm}:{ss}
        </p>
        <p style={{ margin: "8px 0 16px", fontSize: 11, color: "#4A4A46", fontFamily: "'Poppins', sans-serif", letterSpacing: "0.05em" }}>
          {isBreak ? `BREAK — Round ${round} done` : `ROUND ${round}`}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button
            onClick={toggle}
            style={{
              ...actionBtn,
              background: running ? "transparent" : "#E8423F11",
              borderColor: running ? "#3A3A36" : "#E8423F44",
              color: running ? "#6B6A65" : "#E8423F",
            }}
          >
            {running ? "Pause" : isBreak ? "Start Break" : "Fight"}
          </button>
          <button onClick={reset} style={actionBtn}>Retreat</button>
        </div>
      </div>
    </section>
  );
}
