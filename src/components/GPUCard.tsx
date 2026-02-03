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
    <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between h-full">
      {/* Side Color Strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300"
        style={{ background: statusColor }}
      />

      <div className="flex justify-between items-start mb-5 pl-4">
        <div className="overflow-hidden pr-3">
          <h3 className="font-bold text-xl truncate" title={gpu.name}>
            GPU {gpu.gpu_id}
          </h3>
          <span className="text-xs font-medium text-gray-400 block truncate mt-1 tracking-wide uppercase opacity-70">
            {gpu.name}
          </span>
        </div>
        <span
          className="text-3xl font-mono font-bold tracking-tight"
          style={{
            color: statusColor,
            textShadow: `0 0 10px ${statusColor}40`,
          }}
        >
          {Math.round(gpu.load_percent)}%
        </span>
      </div>

      {/* Grid for details */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pl-4 text-sm mt-auto">
        {/* VRAM */}
        <div className="col-span-2 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Database size={14} /> VRAM
            </span>
            <span className="font-mono text-white/80">
              {gpu.memory_used_gb.toFixed(1)} / {gpu.memory_total_gb.toFixed(1)}{" "}
              GB
            </span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-300 relative"
              style={{
                width: `${gpu.memory_percent}%`,
                background:
                  gpu.memory_percent > 90
                    ? "var(--tertiary-1)"
                    : "var(--tertiary-2)",
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 blur-[1px]" />
            </div>
          </div>
        </div>

        {/* Temp */}
        <div className="flex items-center gap-3 mt-2 bg-white/5 p-2 rounded-lg border border-white/5">
          <Thermometer
            size={16}
            className={
              isHighTemp ? "text-[var(--tertiary-1)]" : "text-gray-400"
            }
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              Temp
            </span>
            <span
              className={`font-mono font-bold ${isHighTemp ? "text-[var(--tertiary-1)]" : "text-gray-200"}`}
            >
              {gpu.temp_celsius > 0 ? `${gpu.temp_celsius}°C` : "N/A"}
            </span>
          </div>
        </div>

        {/* Load Icon visual */}
        <div className="flex items-center gap-3 mt-2 justify-end bg-white/5 p-2 rounded-lg border border-white/5">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              Index
            </span>
            <span className="text-gray-300 font-mono font-bold">
              #{gpu.gpu_id}
            </span>
          </div>
          <Cpu size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};
