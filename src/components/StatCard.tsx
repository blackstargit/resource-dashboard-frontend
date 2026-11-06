import React from "react";
import type { LucideIcon } from "lucide-react";
import { levelColor } from "../lib/colors";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  /** 0-100; drives the bar and its semantic color */
  percent?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  percent,
}) => {
  const color = percent !== undefined ? levelColor(percent) : "var(--accent)";

  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-muted)]">
          {title}
        </span>
        <Icon size={18} className="text-[var(--text-faint)]" />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="mono text-3xl font-semibold tracking-tight">
          {value}
        </span>
        {subtitle && (
          <span className="text-sm text-[var(--text-faint)]">{subtitle}</span>
        )}
      </div>

      {percent !== undefined && (
        <div className="flex items-center gap-3">
          <div className="bar-track h-1.5 flex-1">
            <div
              className="bar-fill"
              style={{
                width: `${Math.min(100, Math.max(0, percent))}%`,
                background: color,
              }}
            />
          </div>
          <span className="mono text-xs text-[var(--text-faint)] w-9 text-right">
            {Math.round(percent)}%
          </span>
        </div>
      )}
    </div>
  );
};
