export type Tier = "boss" | "elite" | "minion";

export interface FocusItem {
  id: string;
  day_id?: string;
  rank: 1 | 2 | 3;
  text: string;
  tier: "boss" | "elite";
  completed: boolean;
  created_at?: string;
}

export interface TimeBlock {
  id: string;
  day_id?: string;
  start_hour: number;
  start_minute: number;
  duration_minutes: number;
  title: string;
  tier: Tier;
  sort_order: number;
  created_at?: string;
}

export interface Task {
  id: string;
  day_id?: string;
  text: string;
  completed: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Day {
  id: string;
  user_id?: string;
  date: string; // "YYYY-MM-DD"
  energy_level: number | null;
  review_wins: string;
  review_carry: string;
  daily_notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface DayData {
  day: Day;
  focusItems: FocusItem[];
  timeBlocks: TimeBlock[];
  tasks: Task[];
}
