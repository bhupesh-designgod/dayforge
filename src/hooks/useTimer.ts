"use client";
import { useEffect, useRef } from "react";
import { usePlannerStore } from "@/stores/plannerStore";

export function useTimer() {
  const { timer, setTimer } = usePlannerStore();
  const { seconds, running, round, isBreak, completionCount } = timer;
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      ref.current = setInterval(() => {
        setTimer({ seconds: usePlannerStore.getState().timer.seconds - 1 });
      }, 1000);
    } else if (seconds === 0) {
      const state = usePlannerStore.getState();
      if (ref.current) clearInterval(ref.current);

      if (!isBreak) {
        // Focus round complete — log it and trigger flash
        const ts = (() => {
          const n = new Date();
          return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
        })();
        const breakLen = round % 4 === 0 ? 15 : 5;
        state.addLog(`⏱ Round ${round} complete — ${ts}`);
        setTimer({
          running: false,
          isBreak: true,
          seconds: breakLen * 60,
          completionCount: state.timer.completionCount + 1,
        });
      } else {
        // Break over — start next round (paused, let user hit Fight)
        setTimer({ isBreak: false, round: round + 1, seconds: 25 * 60, running: false });
      }
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, seconds, isBreak, round, setTimer]);

  const toggle = () => setTimer({ running: !running });
  const reset  = () => setTimer({ running: false, seconds: 25 * 60, isBreak: false });

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const totalSeconds = isBreak ? (round % 4 === 0 ? 15 * 60 : 5 * 60) : 25 * 60;
  const progress = 1 - seconds / totalSeconds;

  return { mm, ss, running, round, isBreak, toggle, reset, progress, completionCount };
}
