import type { Tier } from "@/types/planner";

const COLORS: Record<Tier, string> = {
  boss: "#E8423F",
  elite: "#D4952B",
  minion: "#6B6A65",
};

interface TierIconProps {
  tier: Tier;
  size?: number;
}

export function TierIcon({ tier, size = 14 }: TierIconProps) {
  const color = COLORS[tier];
  if (tier === "boss")
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path d="M4 16V7L2 4L6 7L10 2L14 7L18 4L16 7V16H4Z" fill={color} opacity="0.9" />
        <rect x="4" y="16" width="12" height="2" rx="1" fill={color} />
      </svg>
    );
  if (tier === "elite")
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z"
          fill={color}
          opacity="0.85"
        />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="6" fill={color} opacity="0.5" />
      <circle cx="10" cy="10" r="3" fill={color} opacity="0.3" />
    </svg>
  );
}
