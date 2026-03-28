"use client";
import { usePlannerStore } from "@/stores/plannerStore";
import { TierIcon } from "./TierIcon";
import { SectionLabel } from "./SectionLabel";
import { useState } from "react";

export function MinionSweep() {
  const { tasks, toggleTask, addTask } = usePlannerStore();
  const [newTask, setNewTask] = useState("");

  const submit = () => {
    if (!newTask.trim()) return;
    addTask({ id: `t${Date.now()}`, text: newTask.trim(), completed: false, sort_order: tasks.length });
    setNewTask("");
  };

  const uncompleted = tasks.filter((t) => !t.completed).sort((a, b) => a.sort_order - b.sort_order);
  const completed = tasks.filter((t) => t.completed).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section>
      <SectionLabel text="Minion sweep" />
      <div style={{ background: "#141413", border: "1px solid #1E1E1C", borderRadius: 6, padding: "14px 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {uncompleted.map((t) => (
            <label
              key={t.id}
              onClick={() => toggleTask(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer", fontSize: 13, color: "#B0AEA6", userSelect: "none" }}
            >
              <span style={{ width: 16, height: 16, borderRadius: 3, border: "1.5px solid #3A3A36", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} />
              <TierIcon tier="minion" size={10} />
              {t.text}
            </label>
          ))}
          {completed.map((t) => (
            <label
              key={t.id}
              onClick={() => toggleTask(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer", fontSize: 13, color: "#3A3A36", textDecoration: "line-through", userSelect: "none" }}
            >
              <span style={{ width: 16, height: 16, borderRadius: 3, border: "1.5px solid #2A2A28", background: "#1A1A18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#4A4A46", fontSize: 11 }}>
                ✓
              </span>
              <TierIcon tier="minion" size={10} />
              {t.text}
            </label>
          ))}
        </div>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="spawn minion…"
          style={{ marginTop: 12, width: "100%", background: "#0C0C0B", border: "1px solid #1E1E1C", borderRadius: 4, padding: "8px 12px", color: "#B0AEA6", fontSize: 12, outline: "none", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" }}
        />
      </div>
    </section>
  );
}
