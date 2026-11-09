import { useEffect, useState } from "react";
import { CheckIcon, CloseIcon } from "./Icons";

export type ToastTone = "success" | "error" | "info";

type ToastItem = { id: number; message: string; tone: ToastTone };

let items: ToastItem[] = [];
let listeners: Array<(list: ToastItem[]) => void> = [];
let seq = 1;

function emit() {
  for (const listener of listeners) listener(items);
}

export function toast(message: string, tone: ToastTone = "success") {
  const item: ToastItem = { id: seq++, message, tone };
  items = [...items, item];
  emit();
  window.setTimeout(() => {
    items = items.filter((t) => t.id !== item.id);
    emit();
  }, 4000);
}

function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

export default function Toaster() {
  const [list, setList] = useState<ToastItem[]>(items);

  useEffect(() => {
    listeners.push(setList);
    setList(items);
    return () => {
      listeners = listeners.filter((l) => l !== setList);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-5 left-1/2 z-[200] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-6 sm:translate-x-0"
    >
      {list.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-[13px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] ${
            item.tone === "error"
              ? "border-alert/30 bg-white text-alert"
              : item.tone === "info"
                ? "border-line bg-white text-ink"
                : "border-ink/10 bg-ink text-white"
          }`}
        >
          {item.tone === "success" && (
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-white/20">
              <CheckIcon className="h-3 w-3" />
            </span>
          )}
          <p className="flex-1 leading-5">{item.message}</p>
          <button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss" className="mt-0.5 opacity-60 transition-opacity hover:opacity-100">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
