import { compactMoney } from "../../utils/helpers";

type Point = { label: string; value: number };

export function AreaChart({ data, height = 190 }: { data: Point[]; height?: number }) {
  const width = 640;
  const pad = { top: 18, right: 12, bottom: 26, left: 38 };
  const max = Math.max(...data.map((d) => d.value), 1);
  const niceMax = Math.ceil(max / 500) * 500 || max;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const points = data.map((d, i) => ({
    ...d,
    x: pad.left + i * stepX,
    y: pad.top + innerH - (d.value / niceMax) * innerH,
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pad.left + innerW},${pad.top + innerH} L${pad.left},${pad.top + innerH} Z`;
  const ticks = [0, 0.5, 1].map((f) => ({ y: pad.top + innerH - f * innerH, value: Math.round(niceMax * f) }));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Weekly revenue chart">
      <defs>
        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f1f1f" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#1f1f1f" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t.value}>
          <line x1={pad.left} x2={width - pad.right} y1={t.y} y2={t.y} stroke="#ececec" strokeDasharray="4 4" />
          <text x={pad.left - 8} y={t.y + 3.5} textAnchor="end" fontSize="10" fill="#a3a3a3">
            {compactMoney(t.value)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#revenueFill)" />
      <path d={line} fill="none" stroke="#1f1f1f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#1f1f1f" strokeWidth="2" />
          <text x={p.x} y={height - 7} textAnchor="middle" fontSize="10" fill="#a3a3a3">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function CategoryBars({ data }: { data: Array<{ name: string; count: number; color: string }> }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <ul className="space-y-4">
      {data.map((row) => (
        <li key={row.name}>
          <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
            <span className="text-body">{row.name}</span>
            <span className="tabular-nums text-muted">{row.count} products</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-tile">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{ width: `${Math.max(4, (row.count / max) * 100)}%`, backgroundColor: row.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Donut({ segments, total, caption }: { segments: Array<{ label: string; value: number; color: string }>; total: number; caption: string }) {
  const size = 168;
  const stroke = 20;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const sum = segments.reduce((acc, s) => acc + s.value, 0) || 1;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label="Order status breakdown">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f1f1" strokeWidth={stroke} />
          {segments.map((s) => {
            const length = (s.value / sum) * circumference;
            const dash = `${length} ${circumference - length}`;
            const el = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += length;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[24px] font-semibold leading-none text-ink">{total}</span>
          <span className="mt-1 text-[11px] text-muted">{caption}</span>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex items-center gap-2 text-body">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="tabular-nums font-medium text-ink">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
