"use client";
import { usePlannerStore } from "@/stores/plannerStore";
import { TierIcon } from "./TierIcon";
import { SectionLabel } from "./SectionLabel";
import { useState } from "react";
import type { Tier } from "@/types/planner";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 8);

function formatHour(h: number) {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

const TIER_STYLES = {
  boss:   { bg: "#1C0A0A", border: "#3D1515", accent: "#E8423F" },
  elite:  { bg: "#1A1208", border: "#3A2A10", accent: "#D4952B" },
  minion: { bg: "#141413", border: "#2A2A28", accent: "#6B6A65" },
};

interface AddBlockModal {
  hour: number;
}

export function BattleSchedule() {
  const { timeBlocks, addTimeBlock, removeTimeBlock } = usePlannerStore();
  const [adding, setAdding] = useState<AddBlockModal | null>(null);
  const [form, setForm] = useState({ title: "", tier: "elite" as Tier, duration: 60 });
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  const submitAdd = () => {
    if (!form.title.trim() || !adding) return;
    addTimeBlock({
      id: `b${Date.now()}`,
      start_hour: adding.hour,
      start_minute: 0,
      duration_minutes: form.duration,
      title: form.title.trim(),
      tier: form.tier,
      sort_order: timeBlocks.length,
    });
    setAdding(null);
    setForm({ title: "", tier: "elite", duration: 60 });
  };

  return (
    <section>
      <SectionLabel text="Battle schedule" />
      <div style={{ position: "relative" }}>
        {/* Timeline spine */}
        <div style={{ position: "absolute", left: 44, top: 0, bottom: 0, width: 1, background: "#1E1E1C" }} />

        {HOURS.map((h) => {
          const block = timeBlocks.find((b) => b.start_hour === h);
          const durHours = block ? block.duration_minutes / 60 : 0;
          const isOccupied = timeBlocks.some(
            (b) => h > b.start_hour && h < b.start_hour + b.duration_minutes / 60
          );

          if (isOccupied) return null;

          const s = block ? TIER_STYLES[block.tier] : null;

          return (
            <div
              key={h}
              style={{ display: "flex", gap: 16, minHeight: block ? Math.max(durHours * 52, 52) : 36, alignItems: "stretch" }}
            >
              <span style={{ fontSize: 11, fontFamily: "'Poppins', sans-serif", color: "#4A4A46", minWidth: 44, textAlign: "right", paddingTop: 8, flexShrink: 0 }}>
                {formatHour(h)}
              </span>

              {/* Timeline dot */}
              <div style={{ position: "relative", width: 0 }}>
                <div style={{
                  position: "absolute", left: -3, top: 12, width: 7, height: 7, borderRadius: "50%",
                  background: block ? s!.accent : "#2A2A28",
                  boxShadow: block ? `0 0 8px ${s!.accent}44` : "none",
                }} />
              </div>

              <div
                style={{ flex: 1, paddingLeft: 16 }}
                onMouseEnter={() => setHoveredHour(h)}
                onMouseLeave={() => setHoveredHour(null)}
              >
                {block ? (
                  <div style={{
                    padding: "10px 14px", background: s!.bg, border: `1px solid ${s!.border}`,
                    borderLeft: `3px solid ${s!.accent}`, borderRadius: "0 6px 6px 0",
                    height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <TierIcon tier={block.tier} size={12} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: block.tier === "minion" ? "#8A8983" : "#E8E6DF" }}>
                        {block.title}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: "#5A5955", marginTop: 3, fontFamily: "'Poppins', sans-serif" }}>
                      {block.duration_minutes >= 60 ? `${block.duration_minutes / 60}h` : `${block.duration_minutes}m`} block
                    </span>
                    {hoveredHour === h && (
                      <button
                        onClick={() => removeTimeBlock(block.id)}
                        style={{ position: "absolute", top: 8, right: 10, background: "transparent", border: "none", color: "#4A4A46", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => setAdding({ hour: h })}
                    style={{ height: "100%", display: "flex", alignItems: "center", paddingLeft: 4, cursor: "pointer" }}
                  >
                    <span style={{
                      fontSize: 11,
                      color: hoveredHour === h ? "#6B6A65" : "#2A2A28",
                      fontFamily: "'Poppins', sans-serif",
                      transition: "color 0.15s",
                      letterSpacing: "0.04em",
                    }}>
                      + add encounter
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add block modal */}
      {adding && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#141413", border: "1px solid #1E1E1C", borderRadius: 6, padding: 24, width: 320 }}>
            <p style={{ margin: "0 0 16px", fontSize: 11, fontFamily: "'Poppins', sans-serif", color: "#4A4A46", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Add encounter — {formatHour(adding.hour)}
            </p>
            <input
              autoFocus
              placeholder="Title…"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && submitAdd()}
              style={{ width: "100%", background: "#0C0C0B", border: "1px solid #1E1E1C", borderRadius: 4, padding: "8px 12px", color: "#E8E6DF", fontSize: 13, outline: "none", marginBottom: 10, boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {(["boss", "elite", "minion"] as Tier[]).map((t) => (
                <button key={t} onClick={() => setForm({ ...form, tier: t })} style={{ flex: 1, padding: "6px 0", fontSize: 10, fontFamily: "'Poppins', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", background: form.tier === t ? "#1E1E1C" : "transparent", border: `1px solid ${form.tier === t ? "#3A3A36" : "#1E1E1C"}`, borderRadius: 3, color: form.tier === t ? "#E8E6DF" : "#4A4A46", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
            <select
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              style={{ width: "100%", background: "#0C0C0B", border: "1px solid #1E1E1C", borderRadius: 4, padding: "8px 12px", color: "#B0AEA6", fontSize: 12, outline: "none", marginBottom: 16, boxSizing: "border-box" }}
            >
              {[30, 60, 90, 120, 150, 180].map((m) => (
                <option key={m} value={m}>{m >= 60 ? `${m / 60}h` : `${m}m`}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={submitAdd} style={{ flex: 1, padding: "8px 0", background: "#E8423F11", border: "1px solid #E8423F44", borderRadius: 4, color: "#E8423F", fontSize: 12, fontFamily: "'Poppins', sans-serif", cursor: "pointer" }}>
                Spawn
              </button>
              <button onClick={() => setAdding(null)} style={{ flex: 1, padding: "8px 0", background: "transparent", border: "1px solid #1E1E1C", borderRadius: 4, color: "#6B6A65", fontSize: 12, fontFamily: "'Poppins', sans-serif", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
