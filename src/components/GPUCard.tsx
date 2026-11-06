import React from "react";
import { Thermometer } from "lucide-react";
import type { GPUStats } from "../types";
import { levelColor } from "../lib/colors";

interface GPUCardProps {
  gpu: GPUStats;
}

export const GPUCard: React.FC<GPUCardProps> = ({ gpu }) => {
  const loadColor = levelColor(gpu.load_percent);
  const vramColor = levelColor(gpu.memory_percent);
  const hotTemp = gpu.temp_celsius >= 80;

  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold truncate" title={gpu.name}>
            {gpu.name}
          </h3>
          <span className="text-xs text-[var(--text-faint)]">
            GPU {gpu.gpu_id}
          </span>
        </div>
        <span
          className="mono text-2xl font-semibold leading-none"
          style={{ color: loadColor }}
        >
          {Math.round(gpu.load_percent)}
          <span className="text-sm text-[var(--text-faint)]">%</span>
        </span>
      </div>

      {/* VRAM */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-muted)]">VRAM</span>
          <span className="mono text-[var(--text-muted)]">
            {gpu.memory_used_gb.toFixed(1)} / {gpu.memory_total_gb.toFixed(1)} GB
          </span>
        </div>
        <div className="bar-track h-1.5">
          <div
            className="bar-fill"
            style={{ width: `${gpu.memory_percent}%`, background: vramColor }}
          />
        </div>
      </div>

      {/* Temp */}
      <div className="flex items-center gap-2 text-sm">
        <Thermometer
          size={15}
          style={{ color: hotTemp ? "var(--crit)" : "var(--text-faint)" }}
        />
        <span className="text-[var(--text-muted)]">Temp</span>
        <span
          className="mono ml-auto"
          style={{ color: hotTemp ? "var(--crit)" : "var(--text)" }}
        >
          {gpu.temp_celsius > 0 ? `${gpu.temp_celsius}°C` : "N/A"}
        </span>
      </div>
    </div>
  );
};
