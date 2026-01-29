import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  percent?: number; // 0-100
  color?: "primary" | "secondary" | "tertiary-1" | "tertiary-2";
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  percent,
  color = "primary",
  trend,
}) => {
  const getColorVar = () => `var(--${color})`;

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full relative group">
      {/* Background Glow Effect */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl transition-opacity group-hover:opacity-20 pointer-events-none"
        style={{ background: getColorVar() }}
      />

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight">
              {value}
            </span>
            {subtitle && (
              <span className="text-sm text-gray-500">{subtitle}</span>
            )}
          </div>
        </div>
        <div
          className="p-3 rounded-xl bg-opacity-10 backdrop-blur-md border border-white/5"
          style={{ backgroundColor: `${getColorVar()}15` }} // 15 = hex opacity ~8%
        >
          <Icon size={24} style={{ color: getColorVar() }} />
        </div>
      </div>

      <div className="space-y-2">
        {percent !== undefined && (
          <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${Math.min(100, Math.max(0, percent))}%`,
                background: getColorVar(),
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
            </div>
          </div>
        )}

        {trend && (
          <p className="text-xs text-right mt-1 font-mono opacity-70">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};
