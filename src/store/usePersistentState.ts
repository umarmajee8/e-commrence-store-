import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

/** useState that mirrors its value into localStorage and rehydrates on load. */
export function usePersistentState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      /* storage disabled or corrupted — fall back to the initial value */
    }
    return initial;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded or storage disabled — keep working in memory */
    }
  }, [key, value]);

  return [value, setValue];
}
