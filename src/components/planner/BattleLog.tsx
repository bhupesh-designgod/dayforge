"use client";
import { usePlannerStore } from "@/stores/plannerStore";
import { SectionLabel } from "./SectionLabel";
import { TierIcon } from "./TierIcon";

export function BattleLog() {
  const { battleLog, focusItems, tasks } = usePlannerStore();

  const undoneQuests = focusItems.filter((f) => !f.completed);
  const undoneTasks  = tasks.filter((t) => !t.completed);

  return (
    <section>
      <SectionLabel text="Battle log" />
      <div style={{ background: "#141413", border: "1px solid #1E1E1C", borderRadius: 6, overflow: "hidden" }}>

        {/* Auto-log feed */}
        <div style={{
          maxHeight: 180,
          overflowY: "auto",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}>
          {battleLog.length === 0 ? (
            <p style={{ margin: 0, fontSize: 12, color: "#2A2A28", fontFamily: "'Poppins', sans-serif", textAlign: "center" }}>
              No events yet — complete a quest to start the log
            </p>
          ) : (
            battleLog.map((entry) => (
              <div key={entry.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, color: "#3A3A36", fontFamily: "'Poppins', sans-serif", flexShrink: 0, paddingTop: 1 }}>
                  {entry.timestamp}
                </span>
                <span style={{ fontSize: 12, color: "#6B6A65", lineHeight: 1.45 }}>
                  {entry.message}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Carry forward */}
        {(undoneQuests.length > 0 || undoneTasks.length > 0) && (
          <div style={{ borderTop: "1px solid #1E1E1C", padding: "12px 14px" }}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontFamily: "'Poppins', sans-serif", color: "#3A3A36", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Carry forward
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {undoneQuests.map((q) => (
                <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <TierIcon tier={q.tier} size={10} />
                  <span style={{ fontSize: 12, color: "#4A4A46" }}>{q.text}</span>
                </div>
              ))}
              {undoneTasks.map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <TierIcon tier="minion" size={10} />
                  <span style={{ fontSize: 12, color: "#3A3A36" }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
