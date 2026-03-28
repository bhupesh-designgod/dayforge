"use client";
import { usePlannerStore } from "@/stores/plannerStore";
import { SectionLabel } from "./SectionLabel";

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#4A4A46",
  display: "block",
  marginBottom: 6,
  fontFamily: "'Poppins', sans-serif",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  background: "#0C0C0B",
  border: "none",
  borderRadius: 4,
  padding: "10px 12px",
  color: "#B0AEA6",
  fontSize: 13,
  resize: "vertical",
  outline: "none",
  fontFamily: "inherit",
  lineHeight: 1.5,
  boxSizing: "border-box",
};

export function BattleLog() {
  const { day, updateDay } = usePlannerStore();
  if (!day) return null;

  return (
    <section>
      <SectionLabel text="Battle log" />
      <div style={{ background: "#141413", border: "1px solid #1E1E1C", borderRadius: 6, padding: "14px 16px" }}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Victories</label>
          <textarea
            value={day.review_wins}
            onChange={(e) => updateDay({ review_wins: e.target.value })}
            placeholder="what bosses fell today…"
            rows={2}
            style={textareaStyle}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Carry forward</label>
          <textarea
            value={day.review_carry}
            onChange={(e) => updateDay({ review_carry: e.target.value })}
            placeholder="unfinished quests…"
            rows={2}
            style={textareaStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>HP remaining</label>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const hp = day.energy_level ?? 0;
              return (
                <button
                  key={n}
                  onClick={() => updateDay({ energy_level: n === hp ? null : n })}
                  style={{
                    width: 36, height: 28,
                    border: `1px solid ${hp >= n ? "#E8423F44" : "#1E1E1C"}`,
                    borderRadius: 4,
                    background: hp >= n ? "#E8423F18" : "transparent",
                    color: hp >= n ? "#E8423F" : "#3A3A36",
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
