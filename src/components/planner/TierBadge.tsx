import type { Tier } from "@/types/planner";

const TIER_STYLES: Record<Tier, { color: string; bg: string; border: string; label: string }> = {
  boss:   { color: "#E8423F", bg: "#1C0A0A", border: "#3D1515", label: "Boss" },
  elite:  { color: "#D4952B", bg: "#1A1208", border: "#3A2A10", label: "Elite" },
  minion: { color: "#6B6A65", bg: "#141413", border: "#2A2A28", label: "Minion" },
};

export function TierBadge({ tier }: { tier: Tier }) {
  const s = TIER_STYLES[tier];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        padding: "2px 8px",
        borderRadius: 3,
        fontFamily: "'Poppins', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}
