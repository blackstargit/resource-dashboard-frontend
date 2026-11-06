import React from "react";
import type { RAMStats } from "../types";
import { Bar } from "./Bar";

interface MemoryPanelProps {
  ram: RAMStats;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ ram }) => (
  <div className="card p-5 flex flex-col gap-4 h-full">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">Memory</h3>
      <span className="mono text-xs text-[var(--text-faint)]">
        {Math.round(ram.percent)}%
      </span>
    </div>

    <div className="flex items-baseline gap-2">
      <span className="mono text-3xl font-semibold tracking-tight">
        {ram.used_gb.toFixed(1)}
      </span>
      <span className="text-sm text-[var(--text-faint)]">
        / {ram.total_gb.toFixed(0)} GB
      </span>
    </div>
    <Bar pct={ram.percent} height={8} />

    <div className="flex flex-col gap-1.5 mt-auto">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--text-muted)]">Swap</span>
        <span className="mono text-[var(--text-muted)]">
          {ram.swap_used_gb.toFixed(1)} / {ram.swap_total_gb.toFixed(0)} GB
        </span>
      </div>
      <Bar pct={ram.swap_percent} />
    </div>
  </div>
);
