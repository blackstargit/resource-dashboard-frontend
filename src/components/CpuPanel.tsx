import React from "react";
import type { CPUStats } from "../types";
import { levelColor } from "../lib/colors";

interface CpuPanelProps {
  cpu: CPUStats;
}

export const CpuPanel: React.FC<CpuPanelProps> = ({ cpu }) => {
  const meta: string[] = [`${cpu.count} cores`];
  if (cpu.freq_mhz) meta.push(`${(cpu.freq_mhz / 1000).toFixed(1)} GHz`);
  if (cpu.temp_celsius != null) meta.push(`${cpu.temp_celsius}°C`);

  return (
    <div className="card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">CPU</h3>
        <span className="mono text-xs text-[var(--text-faint)]">
          {meta.join(" · ")}
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span
          className="mono text-3xl font-semibold tracking-tight"
          style={{ color: levelColor(cpu.percent) }}
        >
          {cpu.percent}%
        </span>
        {cpu.load_avg && (
          <span className="text-sm text-[var(--text-faint)]">
            load {cpu.load_avg.map((n) => n.toFixed(2)).join(" / ")}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mt-auto">
        <span className="text-xs text-[var(--text-muted)]">
          Per-core · {cpu.per_core_percent.length}
        </span>
        <div
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(26px, 1fr))",
          }}
        >
          {cpu.per_core_percent.map((pct, i) => (
            <div
              key={i}
              title={`Core ${i}: ${pct.toFixed(0)}%`}
              className="h-8 rounded-[5px] bg-white/[0.04] flex items-end overflow-hidden"
            >
              <div
                className="w-full transition-all duration-300"
                style={{
                  height: `${Math.min(100, Math.max(4, pct))}%`,
                  background: levelColor(pct),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
