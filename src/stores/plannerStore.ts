import { create } from "zustand";
import type { FocusItem, TimeBlock, Task, Day } from "@/types/planner";

function getDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface TimerState {
  seconds: number;
  running: boolean;
  round: number;
  isBreak: boolean;
}

interface PlannerState {
  // Navigation
  currentDate: string;
  setCurrentDate: (date: string) => void;
  navDay: (dir: number) => void;

  // Day data
  day: Day | null;
  focusItems: FocusItem[];
  timeBlocks: TimeBlock[];
  tasks: Task[];

  setDay: (day: Day) => void;
  setFocusItems: (items: FocusItem[]) => void;
  setTimeBlocks: (blocks: TimeBlock[]) => void;
  setTasks: (tasks: Task[]) => void;

  // Focus actions
  updateFocusItem: (id: string, patch: Partial<FocusItem>) => void;
  reorderFocusItems: (items: FocusItem[]) => void;

  // Time block actions
  addTimeBlock: (block: TimeBlock) => void;
  updateTimeBlock: (id: string, patch: Partial<TimeBlock>) => void;
  removeTimeBlock: (id: string) => void;

  // Task actions
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;

  // Day fields
  updateDay: (patch: Partial<Day>) => void;

  // Timer (persists across day nav)
  timer: TimerState;
  setTimer: (patch: Partial<TimerState>) => void;
}

const SAMPLE_DATE = getDateKey(new Date());

export const usePlannerStore = create<PlannerState>((set) => ({
  currentDate: SAMPLE_DATE,
  setCurrentDate: (date) => set({ currentDate: date }),
  navDay: (dir) =>
    set((state) => {
      const d = new Date(state.currentDate + "T00:00:00");
      d.setDate(d.getDate() + dir);
      return { currentDate: getDateKey(d) };
    }),

  day: {
    id: "local",
    date: SAMPLE_DATE,
    energy_level: null,
    review_wins: "",
    review_carry: "",
    daily_notes: "",
  },
  focusItems: [
    { id: "q1", rank: 1, text: "Build auth flow with Supabase", tier: "boss", completed: false },
    { id: "q2", rank: 2, text: "Complete array puzzle arena", tier: "elite", completed: false },
    { id: "q3", rank: 3, text: "Git branching practice", tier: "elite", completed: false },
  ],
  timeBlocks: [
    { id: "b1", start_hour: 9, start_minute: 0, duration_minutes: 120, title: "Boss fight — auth flow", tier: "boss", sort_order: 0 },
    { id: "b2", start_hour: 13, start_minute: 0, duration_minutes: 120, title: "Elite — array puzzles", tier: "elite", sort_order: 1 },
    { id: "b3", start_hour: 15, start_minute: 0, duration_minutes: 60, title: "Elite — Git practice", tier: "elite", sort_order: 2 },
    { id: "b4", start_hour: 12, start_minute: 0, duration_minutes: 60, title: "Rest at save point", tier: "minion", sort_order: 3 },
  ],
  tasks: [
    { id: "t1", text: "Push progress to GitHub", completed: false, sort_order: 0 },
    { id: "t2", text: "Read Claude Code setup docs", completed: false, sort_order: 1 },
    { id: "t3", text: "Install Node.js & npm", completed: true, sort_order: 2 },
  ],

  setDay: (day) => set({ day }),
  setFocusItems: (focusItems) => set({ focusItems }),
  setTimeBlocks: (timeBlocks) => set({ timeBlocks }),
  setTasks: (tasks) => set({ tasks }),

  updateFocusItem: (id, patch) =>
    set((state) => ({
      focusItems: state.focusItems.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })),
  reorderFocusItems: (focusItems) => set({ focusItems }),

  addTimeBlock: (block) =>
    set((state) => ({ timeBlocks: [...state.timeBlocks, block] })),
  updateTimeBlock: (id, patch) =>
    set((state) => ({
      timeBlocks: state.timeBlocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    })),
  removeTimeBlock: (id) =>
    set((state) => ({ timeBlocks: state.timeBlocks.filter((b) => b.id !== id) })),

  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  reorderTasks: (tasks) => set({ tasks }),

  updateDay: (patch) =>
    set((state) => ({ day: state.day ? { ...state.day, ...patch } : state.day })),

  timer: { seconds: 25 * 60, running: false, round: 1, isBreak: false },
  setTimer: (patch) =>
    set((state) => ({ timer: { ...state.timer, ...patch } })),
}));
