import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const GridIcon = (p: P) => (
  <svg {...line} {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);

export const BoxIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M20.5 7.8 12 3 3.5 7.8v8.4L12 21l8.5-4.8z" />
    <path d="M3.5 7.8 12 12.6l8.5-4.8M12 12.6V21" />
  </svg>
);

export const OrdersIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M6 3.5h9l4 4V20a.5.5 0 0 1-.5.5h-12A.5.5 0 0 1 6 20z" />
    <path d="M14.5 3.5V8h4.5M9 12h6M9 16h6" />
  </svg>
);

export const SettingsIcon = (p: P) => (
  <svg {...line} {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1z" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...line} strokeWidth={2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 12.2a1.5 1.5 0 0 0 1.5 1.3h6.4a1.5 1.5 0 0 0 1.5-1.3L17.5 7" />
    <path d="M10.5 11v5.5M13.5 11v5.5" />
  </svg>
);

export const EditIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" />
    <path d="M14.5 6.5 17.5 9.5" />
  </svg>
);

export const CopyIcon = (p: P) => (
  <svg {...line} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
  </svg>
);

export const Search = (p: P) => (
  <svg {...line} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const TrendUp = (p: P) => (
  <svg {...line} strokeWidth={2} {...p}>
    <path d="M3 17 9.5 10.5l4 4L21 7" />
    <path d="M15.5 7H21v5.5" />
  </svg>
);

export const TrendDown = (p: P) => (
  <svg {...line} strokeWidth={2} {...p}>
    <path d="M3 7 9.5 13.5l4-4L21 17" />
    <path d="M15.5 17H21v-5.5" />
  </svg>
);

export const DollarIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M12 3v18" />
    <path d="M16.5 7.2c-.7-1.4-2.3-2.2-4.3-2.2-2.4 0-4.2 1.2-4.2 3.1 0 4.3 8.9 2.2 8.9 6.8 0 2-2 3.4-4.6 3.4-2.2 0-4-1-4.7-2.7" />
  </svg>
);

export const MenuBars = (p: P) => (
  <svg {...line} strokeWidth={2} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const LogoutIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    <path d="M10 8l-4 4 4 4M6 12h9" />
  </svg>
);

export const UploadIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5" />
    <path d="M4 16.5V19a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-2.5" />
  </svg>
);

export const ImageIcon = (p: P) => (
  <svg {...line} {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4.5 17 4.8-4.8a1.5 1.5 0 0 1 2.1 0l3.4 3.4M14 14l1.8-1.8a1.5 1.5 0 0 1 2.1 0l1.6 1.6" />
  </svg>
);

export const StoreIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M4 9.5V20h16V9.5" />
    <path d="M3 9.5 5 4h14l2 5.5a3 3 0 0 1-5.5 1.6A3 3 0 0 1 12 12a3 3 0 0 1-3.5-.9A3 3 0 0 1 3 9.5z" />
    <path d="M9.5 20v-5.5h5V20" />
  </svg>
);

export const EyeOpen = (p: P) => (
  <svg {...line} {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOff = (p: P) => (
  <svg {...line} {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.7M6.6 7.3A17 17 0 0 0 2.5 12S6 18 12 18c1.6 0 3-.5 4.2-1.2" />
  </svg>
);

export const FilterIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M3.5 6h17M6.5 12h11M10 18h4" />
  </svg>
);

export const DownloadIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M12 4v12M7.5 11.5 12 16l4.5-4.5" />
    <path d="M4 19.5h16" />
  </svg>
);

export const LockIcon = (p: P) => (
  <svg {...line} {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

export const SparkIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18l-1.8-5.4L4.5 10.8 10.2 9z" />
  </svg>
);
