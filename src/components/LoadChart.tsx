import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SystemStats } from "../types";

interface LoadChartProps {
  history: SystemStats[];
}

const fmtTime = (ts: number) =>
  new Date(ts * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const SERIES = [
  { key: "cpu.percent", name: "CPU", color: "var(--accent)" },
  { key: "ram.percent", name: "RAM", color: "var(--ok)" },
];

export const LoadChart: React.FC<LoadChartProps> = ({ history }) => {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--text-muted)]">
          Load history
        </h3>
        <div className="flex items-center gap-4">
          {SERIES.map((s) => (
            <span
              key={s.name}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: s.color }}
              />
              {s.name}
            </span>
          ))}
          <span className="mono text-xs text-[var(--text-faint)]">
            last {history.length}s
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={history}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              {SERIES.map((s, i) => (
                <linearGradient
                  key={s.name}
                  id={`grad-${i}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={fmtTime}
              tick={{ fill: "var(--text-faint)", fontSize: 11 }}
              stroke="rgba(255,255,255,0.08)"
              minTickGap={60}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "var(--text-faint)", fontSize: 11 }}
              stroke="rgba(255,255,255,0.08)"
              width={44}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-strong)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelFormatter={(ts) => fmtTime(Number(ts))}
              labelStyle={{ color: "var(--text-muted)" }}
              formatter={(value, name) => [`${Number(value ?? 0).toFixed(1)}%`, name]}
            />
            {SERIES.map((s, i) => (
              <Area
                key={s.name}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${i})`}
                isAnimationActive={false}
                dot={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
