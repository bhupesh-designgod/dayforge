"use client";
import { usePlannerStore } from "@/stores/plannerStore";
import { SectionLabel } from "./SectionLabel";

export function SideQuests() {
  const { day, updateDay } = usePlannerStore();
  if (!day) return null;

  return (
    <section>
      <SectionLabel text="Side quests" />
      <textarea
        value={day.daily_notes}
        onChange={(e) => updateDay({ daily_notes: e.target.value })}
        placeholder="random loot, ideas, links…"
        rows={4}
        style={{
          width: "100%",
          background: "#0C0C0B",
          border: "1px solid #1E1E1C",
          borderRadius: 6,
          padding: "10px 12px",
          color: "#B0AEA6",
          fontSize: 13,
          resize: "vertical",
          outline: "none",
          fontFamily: "inherit",
          lineHeight: 1.5,
          boxSizing: "border-box",
        }}
      />
    </section>
  );
}
