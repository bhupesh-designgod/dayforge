"use client";
import { useEffect, useRef } from "react";
import { usePlannerStore } from "@/stores/plannerStore";

export function useTimer() {
  const { timer, setTimer } = usePlannerStore();
  const { seconds, running, round, isBreak } = timer;
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      ref.current = setInterval(() => {
        setTimer({ seconds: usePlannerStore.getState().timer.seconds - 1 });
      }, 1000);
    } else if (seconds === 0) {
      if (!isBreak) {
        setTimer({ isBreak: true, seconds: round % 4 === 0 ? 15 * 60 : 5 * 60 });
      } else {
        setTimer({ isBreak: false, round: round + 1, seconds: 25 * 60, running: false });
      }
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, seconds, isBreak, round, setTimer]);

  const toggle = () => setTimer({ running: !running });
  const reset = () => setTimer({ running: false, seconds: 25 * 60, isBreak: false });

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const totalSeconds = isBreak ? (round % 4 === 0 ? 15 * 60 : 5 * 60) : 25 * 60;
  const progress = 1 - seconds / totalSeconds;

  return { mm, ss, running, round, isBreak, toggle, reset, progress };
}
