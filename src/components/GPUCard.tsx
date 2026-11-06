import React from "react";
import type { GPUStats } from "../types";
import { levelColor } from "../lib/colors";
import { Bar } from "./Bar";

interface GPUCardProps {
  gpu: GPUStats;
}

const tempColor = (t: number) =>
  t >= 85 ? "var(--crit)" : t >= 72 ? "var(--warn)" : "var(--text)";

const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <span className="text-[10px] uppercase tracking-wide text-[var(--text-faint)]">
      {label}
    </span>
    <span className="mono text-xs font-semibold truncate">{children}</span>
  </div>
);

export const GPUCard: React.FC<GPUCardProps> = ({ gpu }) => {
  const dim = "text-[var(--text-faint)] font-normal";
  return (
    <div className="card card-hover p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate" title={gpu.name}>
            {gpu.name}
          </h3>
          <span className="text-[11px] text-[var(--text-faint)]">
            GPU {gpu.gpu_id}
          </span>
        </div>
        <span
          className="mono text-2xl font-semibold leading-none"
          style={{ color: levelColor(gpu.load_percent) }}
        >
          {Math.round(gpu.load_percent)}
          <span className="text-sm text-[var(--text-faint)]">%</span>
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-muted)]">VRAM</span>
          <span className="mono text-[var(--text-muted)]">
            {gpu.memory_used_gb.toFixed(1)} / {gpu.memory_total_gb.toFixed(1)} GB
            <span className="text-[var(--text-faint)]">
              {" "}
              ({Math.round(gpu.memory_percent)}%)
            </span>
          </span>
        </div>
        <Bar pct={gpu.memory_percent} />
      </div>

      {/* sub-card line: temp / power / clock / fan */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-dashed border-[var(--border)]">
        <Cell label="Temp">
          <span style={{ color: tempColor(gpu.temp_celsius) }}>
            {gpu.temp_celsius > 0 ? `${gpu.temp_celsius}°C` : "N/A"}
          </span>
        </Cell>
        <Cell label="Power">
          {gpu.power_w != null ? (
            <>
              {Math.round(gpu.power_w)}
              <span className={dim}>
                /{gpu.power_limit_w ?? "—"}W
              </span>
            </>
          ) : (
            "N/A"
          )}
        </Cell>
        <Cell label="SM clk">
          {gpu.clock_sm_mhz != null ? (
            <>
              {gpu.clock_sm_mhz}
              <span className={dim}> MHz</span>
            </>
          ) : (
            "N/A"
          )}
        </Cell>
        <Cell label="Fan">
          {gpu.fan_percent != null ? `${gpu.fan_percent}%` : "N/A"}
        </Cell>
      </div>
    </div>
  );
};
