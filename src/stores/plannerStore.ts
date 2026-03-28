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
  focusItems: [],
  timeBlocks: [],
  tasks: [],

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
