"use client";
import { usePlannerStore } from "@/stores/plannerStore";
import { TierIcon } from "./TierIcon";
import { TierBadge } from "./TierBadge";
import { SectionLabel } from "./SectionLabel";
import { useState } from "react";
import type { FocusItem } from "@/types/planner";

const TIER_STYLES = {
  boss:  { bg: "#1C0A0A", border: "#3D1515", accent: "#E8423F", textColor: "#E8E6DF" },
  elite: { bg: "#1A1208", border: "#3A2A10", accent: "#D4952B", textColor: "#B0AEA6" },
};

export function QuestLine() {
  const { focusItems, updateFocusItem } = usePlannerStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const sorted = [...focusItems].sort((a, b) => a.rank - b.rank);

  const startEdit = (item: FocusItem) => {
    setEditing(item.id);
    setDraft(item.text);
  };

  const commitEdit = (id: string) => {
    if (draft.trim()) updateFocusItem(id, { text: draft.trim() });
    setEditing(null);
  };

  return (
    <section>
      <SectionLabel text="Quest line" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sorted.map((q) => {
          const s = TIER_STYLES[q.tier];
          return (
            <div
              key={q.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderLeft: `3px solid ${s.accent}`,
                borderRadius: "0 6px 6px 0",
                cursor: "text",
              }}
              onClick={() => startEdit(q)}
            >
              <TierIcon tier={q.tier} size={16} />
              {editing === q.id ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => commitEdit(q.id)}
                  onKeyDown={(e) => { if (e.key === "Enter") commitEdit(q.id); if (e.key === "Escape") setEditing(null); }}
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: s.textColor, fontSize: 14, fontFamily: "inherit",
                  }}
                />
              ) : (
                <span style={{ flex: 1, fontSize: 14, fontWeight: q.tier === "boss" ? 500 : 400, color: s.textColor, opacity: q.completed ? 0.4 : 1, textDecoration: q.completed ? "line-through" : "none" }}>
                  {q.text || <span style={{ color: "#3A3A36" }}>+ Set focus…</span>}
                </span>
              )}
              <TierBadge tier={q.tier} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
