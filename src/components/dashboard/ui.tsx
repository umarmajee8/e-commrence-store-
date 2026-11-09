import type { ReactNode } from "react";

export function Field({ label, hint, error, children, className = "" }: { label: string; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-ink">{label}</span>
        {hint && <span className="text-[11px] font-normal normal-case tracking-normal text-muted">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-alert">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink focus:ring-2 focus:ring-ink/5";

export const selectClass = `${inputClass} cursor-pointer pr-8`;

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-black",
  secondary: "border border-line bg-white text-ink hover:border-ink",
  ghost: "text-muted hover:bg-tile hover:text-ink",
  danger: "bg-alert text-white hover:bg-[#e13c3c]",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-ink" : "bg-line"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export function Badge({ tone = "muted", children }: { tone?: "muted" | "success" | "warn" | "danger" | "info" | "dark"; children: ReactNode }) {
  const tones = {
    muted: "bg-tile text-muted",
    success: "bg-[#e7f8f0] text-[#0b7a51]",
    warn: "bg-[#fff4e0] text-[#a35f00]",
    danger: "bg-[#ffeaea] text-[#c92a2a]",
    info: "bg-[#e9f0ff] text-[#2f5fd0]",
    dark: "bg-ink text-white",
  } as const;
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none ${tones[tone]}`}>{children}</span>;
}
