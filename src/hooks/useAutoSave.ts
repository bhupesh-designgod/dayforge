"use client";
import { useRef, useCallback } from "react";

export function useAutoSave<T>(saveFn: (value: T) => void, delay = 500) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(
    (value: T) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => saveFn(value), delay);
    },
    [saveFn, delay]
  );

  return trigger;
}
