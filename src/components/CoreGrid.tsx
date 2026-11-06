import React from "react";
import { levelColor } from "../lib/colors";

interface CoreGridProps {
  cores: number[];
}

export const CoreGrid: React.FC<CoreGridProps> = ({ cores }) => {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--text-muted)]">
          Per-core load
        </h3>
        <span className="mono text-xs text-[var(--text-faint)]">
          {cores.length} cores
        </span>
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(34px, 1fr))" }}
      >
        {cores.map((pct, i) => (
          <div
            key={i}
            title={`Core ${i}: ${pct.toFixed(0)}%`}
            className="rounded-[6px] flex items-end overflow-hidden bg-white/[0.04] h-11"
          >
            <div
              className="w-full transition-all duration-300"
              style={{
                height: `${Math.min(100, Math.max(3, pct))}%`,
                background: levelColor(pct),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
