import React from "react";
import { levelColor } from "../lib/colors";

/** Usage bar whose fill color encodes the load level (accent/amber/red). */
export const Bar: React.FC<{ pct: number; height?: number }> = ({
  pct,
  height = 6,
}) => (
  <div className="bar-track" style={{ height }}>
    <div
      className="bar-fill"
      style={{
        width: `${Math.min(100, Math.max(0, pct))}%`,
        background: levelColor(pct),
      }}
    />
  </div>
);
