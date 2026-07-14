import React from "react";
import { cpuColor } from "../lib/colors";

interface CoreGridProps {
  cores: number[];
}

export const CoreGrid: React.FC<CoreGridProps> = ({ cores }) => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase text-gray-400 font-bold tracking-widest">
          Per-Core Load
        </span>
        <span className="text-[10px] font-mono text-gray-500">
          {cores.length} cores
        </span>
      </div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(28px, 1fr))" }}
      >
        {cores.map((pct, i) => (
          <div
            key={i}
            title={`Core ${i}: ${pct.toFixed(0)}%`}
            className="aspect-square rounded-sm transition-colors duration-300"
            style={{
              background: cpuColor(pct),
              opacity: 0.25 + (Math.min(100, Math.max(0, pct)) / 100) * 0.75,
            }}
          />
        ))}
      </div>
    </div>
  );
};
