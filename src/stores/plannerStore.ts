import { create } from "zustand";
import type { FocusItem, TimeBlock, Task, Day, LogEntry } from "@/types/planner";

function getDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nowTs() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

interface TimerState {
  seconds: number;
  running: boolean;
  round: number;
  isBreak: boolean;
  completionCount: number; // increments each time a focus round finishes — triggers flash
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
  /** Toggles completed, syncs linked TimeBlock, logs event */
  toggleFocusItem: (id: string) => void;
  /** Adds a quest and optionally a linked schedule block */
  addFocusItem: (item: FocusItem) => void;

  // Time block actions
  addTimeBlock: (block: TimeBlock) => void;
  updateTimeBlock: (id: string, patch: Partial<TimeBlock>) => void;
  removeTimeBlock: (id: string) => void;
  /** Toggles block completed, syncs linked quest if any, logs event */
  completeTimeBlock: (id: string) => void;

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

  // Battle log
  battleLog: LogEntry[];
  addLog: (message: string) => void;
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

  addFocusItem: (item) =>
    set((state) => {
      const newItems = [...state.focusItems, item].sort((a, b) => a.rank - b.rank);
      // If it has a scheduled hour, auto-create a linked time block
      if (item.scheduledHour !== undefined) {
        const block: TimeBlock = {
          id: `b${Date.now()}`,
          start_hour: item.scheduledHour,
          start_minute: 0,
          duration_minutes: item.durationMinutes ?? 60,
          title: item.text,
          tier: item.tier,
          sort_order: state.timeBlocks.length,
          quest_id: item.id,
          completed: false,
        };
        return { focusItems: newItems, timeBlocks: [...state.timeBlocks, block] };
      }
      return { focusItems: newItems };
    }),

  toggleFocusItem: (id) =>
    set((state) => {
      const item = state.focusItems.find((f) => f.id === id);
      if (!item) return {};
      const nowDone = !item.completed;
      const ts = nowTs();
      const tierLabel = item.tier === "boss" ? "Boss" : "Elite";
      const logMsg = nowDone
        ? `✓ Slayed ${tierLabel}: ${item.text} — ${ts}`
        : `↩ Revived ${tierLabel}: ${item.text} — ${ts}`;

      return {
        focusItems: state.focusItems.map((f) =>
          f.id === id ? { ...f, completed: nowDone } : f
        ),
        timeBlocks: state.timeBlocks.map((b) =>
          b.quest_id === id ? { ...b, completed: nowDone } : b
        ),
        battleLog: [
          { id: `log${Date.now()}`, message: logMsg, timestamp: ts },
          ...state.battleLog,
        ],
      };
    }),

  addTimeBlock: (block) =>
    set((state) => ({ timeBlocks: [...state.timeBlocks, block] })),

  updateTimeBlock: (id, patch) =>
    set((state) => ({
      timeBlocks: state.timeBlocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    })),

  removeTimeBlock: (id) =>
    set((state) => ({ timeBlocks: state.timeBlocks.filter((b) => b.id !== id) })),

  completeTimeBlock: (id) =>
    set((state) => {
      const block = state.timeBlocks.find((b) => b.id === id);
      if (!block) return {};
      const nowDone = !block.completed;
      const ts = nowTs();
      const logMsg = nowDone
        ? `✓ Block cleared: ${block.title} — ${ts}`
        : `↩ Block reopened: ${block.title} — ${ts}`;

      return {
        timeBlocks: state.timeBlocks.map((b) =>
          b.id === id ? { ...b, completed: nowDone } : b
        ),
        focusItems: block.quest_id
          ? state.focusItems.map((f) =>
              f.id === block.quest_id ? { ...f, completed: nowDone } : f
            )
          : state.focusItems,
        battleLog: [
          { id: `log${Date.now()}`, message: logMsg, timestamp: ts },
          ...state.battleLog,
        ],
      };
    }),

  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  toggleTask: (id) =>
    set((state) => {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return {};
      const nowDone = !task.completed;
      const ts = nowTs();
      const logMsg = nowDone
        ? `✓ Minion swept: ${task.text} — ${ts}`
        : `↩ Unswept: ${task.text} — ${ts}`;
      return {
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: nowDone } : t)),
        battleLog: [
          { id: `log${Date.now()}`, message: logMsg, timestamp: ts },
          ...state.battleLog,
        ],
      };
    }),

  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  reorderTasks: (tasks) => set({ tasks }),

  updateDay: (patch) =>
    set((state) => ({ day: state.day ? { ...state.day, ...patch } : state.day })),

  timer: { seconds: 25 * 60, running: false, round: 1, isBreak: false, completionCount: 0 },
  setTimer: (patch) =>
    set((state) => ({ timer: { ...state.timer, ...patch } })),

  battleLog: [],
  addLog: (message) =>
    set((state) => ({
      battleLog: [
        { id: `log${Date.now()}`, message, timestamp: nowTs() },
        ...state.battleLog,
      ],
    })),
}));
