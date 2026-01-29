import React from "react";
import { Cpu, Thermometer, Database } from "lucide-react";
import type { GPUStats } from "../types";

interface GPUCardProps {
  gpu: GPUStats;
}

export const GPUCard: React.FC<GPUCardProps> = ({ gpu }) => {
  // Determine status color based on load/temp
  const isHighLoad = gpu.load_percent > 90;
  const isHighTemp = gpu.temp_celsius > 80;

  const statusColor = isHighTemp
    ? "var(--tertiary-1)"
    : isHighLoad
      ? "var(--secondary)"
      : "var(--primary)";

  return (
    <div className="glass-card p-5 relative overflow-hidden">
      {/* Side Color Strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300"
        style={{ background: statusColor }}
      />

      <div className="flex justify-between items-center mb-3 pl-2">
        <h3 className="font-bold text-lg truncate pr-2" title={gpu.name}>
          GPU {gpu.gpu_id}
          <span className="text-xs font-normal text-gray-400 ml-2 block truncate">
            {gpu.name}
          </span>
        </h3>
        <span
          className="text-2xl font-mono font-bold"
          style={{ color: statusColor }}
        >
          {Math.round(gpu.load_percent)}%
        </span>
      </div>

      {/* Grid for details */}
      <div className="grid grid-cols-2 gap-3 pl-2">
        {/* VRAM */}
        <div className="col-span-2 space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Database size={12} /> VRAM
            </span>
            <span>
              {gpu.memory_used_gb.toFixed(1)} / {gpu.memory_total_gb.toFixed(1)}{" "}
              GB
            </span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${gpu.memory_percent}%`,
                background:
                  gpu.memory_percent > 90
                    ? "var(--tertiary-1)"
                    : "var(--tertiary-2)",
              }}
            />
          </div>
        </div>

        {/* Temp */}
        <div className="flex items-center gap-2 mt-1">
          <Thermometer
            size={14}
            className={
              isHighTemp ? "text-[var(--tertiary-1)]" : "text-gray-400"
            }
          />
          <span
            className={`font-mono text-sm ${isHighTemp ? "text-[var(--tertiary-1)]" : "text-gray-300"}`}
          >
            {gpu.temp_celsius}°C
          </span>
        </div>

        {/* Load Icon visual */}
        <div className="flex items-center gap-2 mt-1 justify-end">
          <Cpu size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">Idx: {gpu.gpu_id}</span>
        </div>
      </div>
    </div>
  );
};
