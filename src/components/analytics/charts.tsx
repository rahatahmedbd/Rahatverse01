"use client";

// ── Analytics Charts ───────────────────────────────────
// Lightweight, dependency-free SVG/div visualisations used by the analytics
// dashboard. Pure presentational components — all data arrives via props.

export interface TrendPoint {
  date: string;
  pageViews: number;
  sessions: number;
}

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface BarListItem {
  label: string;
  value: number;
  hint?: string;
}

function formatDayLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

// ── Trend (area + line) chart ──────────────────────────
interface TrendChartProps {
  data: TrendPoint[];
  height?: number;
}

export function TrendChart({ data, height = 240 }: TrendChartProps) {
  const width = 800;
  const pad = { top: 16, right: 12, bottom: 28, left: 40 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;

  const maxViews = Math.max(1, ...data.map((point) => point.pageViews));
  const xFor = (index: number) =>
    data.length <= 1
      ? pad.left + innerWidth / 2
      : pad.left + (index / (data.length - 1)) * innerWidth;
  const yFor = (value: number) =>
    pad.top + innerHeight - (value / maxViews) * innerHeight;

  const viewPoints = data.map((point, index) => `${xFor(index)},${yFor(point.pageViews)}`);
  const sessionPoints = data.map((point, index) => `${xFor(index)},${yFor(point.sessions)}`);

  const areaPath =
    viewPoints.length > 0
      ? `M ${viewPoints[0]} L ${viewPoints.slice(1).join(" L ")} L ${xFor(data.length - 1)},${pad.top + innerHeight} L ${xFor(0)},${pad.top + innerHeight} Z`
      : "";
  const viewLinePath = viewPoints.length > 0 ? `M ${viewPoints.join(" L ")}` : "";
  const sessionLinePath = sessionPoints.length > 0 ? `M ${sessionPoints.join(" L ")}` : "";

  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const labelIndices =
    data.length <= 5
      ? data.map((_, index) => index)
      : [0, Math.floor((data.length - 1) / 2), data.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Daily page views and sessions trend"
    >
      <defs>
        <linearGradient id="trend-area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {gridLines.map((fraction) => {
        const y = pad.top + innerHeight - fraction * innerHeight;
        return (
          <g key={fraction}>
            <line
              x1={pad.left}
              y1={y}
              x2={width - pad.right}
              y2={y}
              className="stroke-muted-foreground/15"
              strokeDasharray={fraction === 0 ? undefined : "4 4"}
            />
            <text
              x={pad.left - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[11px]"
            >
              {Math.round(fraction * maxViews)}
            </text>
          </g>
        );
      })}

      {areaPath && <path d={areaPath} fill="url(#trend-area-fill)" />}
      {viewLinePath && (
        <path d={viewLinePath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinejoin="round" />
      )}
      {sessionLinePath && (
        <path
          d={sessionLinePath}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={2}
          strokeDasharray="6 4"
          strokeLinejoin="round"
        />
      )}

      {data.map((point, index) => (
        <circle
          key={point.date}
          cx={xFor(index)}
          cy={yFor(point.pageViews)}
          r={3.5}
          className="fill-primary"
        >
          <title>
            {`${formatDayLabel(point.date)} — ${point.pageViews} views, ${point.sessions} sessions`}
          </title>
        </circle>
      ))}

      {labelIndices.map((index) => (
        <text
          key={data[index].date}
          x={xFor(index)}
          y={height - 8}
          textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"}
          className="fill-muted-foreground text-[11px]"
        >
          {formatDayLabel(data[index].date)}
        </text>
      ))}
    </svg>
  );
}

// ── Donut chart ────────────────────────────────────────
interface DonutChartProps {
  segments: DonutSegment[];
  centerLabel: string;
}

export function DonutChart({ segments, centerLabel }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = 54;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0" role="img" aria-label="Device breakdown">
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          className="stroke-muted-foreground/10"
          strokeWidth={strokeWidth}
        />
        {total > 0 &&
          segments.map((segment) => {
            const fraction = segment.value / total;
            const dash = fraction * circumference;
            const offset = circumference - cumulative * circumference;
            cumulative += fraction;
            return (
              <circle
                key={segment.label}
                cx={70}
                cy={70}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={offset}
                transform="rotate(-90 70 70)"
              >
                <title>{`${segment.label}: ${segment.value}`}</title>
              </circle>
            );
          })}
        <text x={70} y={66} textAnchor="middle" className="fill-foreground text-xl font-bold">
          {total}
        </text>
        <text x={70} y={84} textAnchor="middle" className="fill-muted-foreground text-[10px]">
          {centerLabel}
        </text>
      </svg>

      <ul className="w-full max-w-55 space-y-2">
        {segments.map((segment) => {
          const share = total > 0 ? Math.round((segment.value / total) * 100) : 0;
          return (
            <li key={segment.label} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="flex-1 truncate text-muted-foreground">{segment.label}</span>
              <span className="font-semibold">{segment.value}</span>
              <span className="w-10 text-right text-xs text-muted-foreground">{share}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Horizontal bar list ────────────────────────────────
interface BarListProps {
  items: BarListItem[];
  emptyLabel: string;
  valueSuffix?: string;
}

export function BarList({ items, emptyLabel, valueSuffix = "" }: BarListProps) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground bn">{emptyLabel}</p>;
  }

  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} title={item.hint ?? item.label}>
          <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
            <span className="truncate text-muted-foreground bn">{item.label}</span>
            <span className="shrink-0 font-semibold">
              {item.value.toLocaleString()}
              {valueSuffix}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted-foreground/10">
            <div
              className="h-full rounded-full bg-primary/70 transition-all"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
