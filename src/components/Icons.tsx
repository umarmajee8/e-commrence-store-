import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const ChevronDown = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}>
    <path d="m5 12 4 4L19 6" />
  </svg>
);

export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} {...p}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);

export const BagIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 7h14l-1 13H6L5 7Z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);

export const MenuIcon = (p: P) => (
  <svg {...base} strokeWidth={1.8} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base} strokeWidth={1.8} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const EyeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const ArrowUp = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

/* Feature icons (line style, matching the design) */
export const TruckFreeIcon = (p: P) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" {...p}>
    <path d="M6 14h24v18H6z" />
    <path d="M30 20h7l5 6v6H30" />
    <circle cx="13" cy="35" r="3.2" fill="#fff" />
    <circle cx="35" cy="35" r="3.2" fill="#fff" />
    <path d="M14 8h10M16 11h6" strokeLinecap="round" />
    <text x="18" y="26.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor" stroke="none" fontFamily="Poppins, sans-serif">
      FREE
    </text>
  </svg>
);

export const Support24Icon = (p: P) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" {...p}>
    <path d="M40 24A16 16 0 1 1 30 9.2" />
    <path d="M30 4.5 31 9.5 26 10.5" />
    <circle cx="24" cy="24" r="10.5" />
    <text x="24" y="27.6" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor" stroke="none" fontFamily="Poppins, sans-serif">
      24
    </text>
  </svg>
);

export const MoneyReturnIcon = (p: P) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" {...p}>
    <path d="M8.5 30A16 16 0 0 1 36 11" />
    <path d="M39.5 18A16 16 0 0 1 12 37" />
    <path d="M37 5.5 36.4 11.2 30.8 10.6" />
    <path d="M11 42.5l.6-5.7 5.6.6" />
    <circle cx="24" cy="24" r="10" />
    <path d="M27.4 20.2c-.6-1.3-2-2-3.6-2-2 0-3.4 1-3.4 2.6 0 3.6 7.3 1.8 7.3 5.6 0 1.6-1.6 2.8-3.7 2.8-1.8 0-3.2-.8-3.8-2.2M24 16.5v2M24 29.2v2.3" />
  </svg>
);
