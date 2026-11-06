import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { SystemStats } from "../types";
import { Bar } from "./Bar";
import { formatUptime, fmtSize, fmtRate } from "../lib/format";

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="card p-4 flex flex-col gap-3">
    <h3 className="text-sm font-medium text-[var(--text-muted)]">{title}</h3>
    {children}
  </div>
);

const Row: React.FC<{ label: string; value: React.ReactNode; title?: string }> = ({
  label,
  value,
  title,
}) => (
  <div className="flex justify-between gap-3 text-xs">
    <span className="text-[var(--text-faint)] shrink-0">{label}</span>
    <span className="mono text-[var(--text)] text-right truncate" title={title}>
      {value}
    </span>
  </div>
);

export const SysInfo: React.FC<{ stats: SystemStats }> = ({ stats }) => {
  const s = stats.system;
  return (
    <Card title="System">
      <div className="flex flex-col gap-2">
        <Row label="Host" value={s.hostname} title={s.hostname} />
        <Row label="OS" value={s.os} title={s.os} />
        <Row label="Kernel" value={s.kernel} title={s.kernel} />
        {s.cpu_model && (
          <Row label="CPU" value={s.cpu_model} title={s.cpu_model} />
        )}
        <Row label="Uptime" value={formatUptime(s.uptime_seconds)} />
        {stats.cpu.load_avg && (
          <Row
            label="Load"
            value={stats.cpu.load_avg.map((n) => n.toFixed(2)).join(" / ")}
          />
        )}
      </div>
    </Card>
  );
};

export const NetworkCard: React.FC<{ net: SystemStats["network"] }> = ({
  net,
}) => (
  <Card title="Network">
    {net.error ? (
      <span className="text-xs text-[var(--text-faint)]">Unavailable</span>
    ) : (
      <>
        <div className="flex gap-4">
          {([
            { dir: "Down", icon: ArrowDown, color: "var(--ok)", r: fmtRate(net.rx_bytes_s ?? 0) },
            { dir: "Up", icon: ArrowUp, color: "var(--accent)", r: fmtRate(net.tx_bytes_s ?? 0) },
          ] as const).map(({ dir, icon: Icon, color, r }) => (
            <div key={dir} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-[var(--text-faint)]">
                <Icon size={11} style={{ color }} /> {dir}
              </span>
              <span className="mono text-lg font-semibold">
                {r.value}
                <span className="text-xs text-[var(--text-faint)]"> {r.unit}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-[var(--text-faint)] pt-2 border-t border-[var(--border)]">
          <span className="mono">↓ {(net.rx_total_gb ?? 0).toFixed(1)} GB total</span>
          <span className="mono">↑ {(net.tx_total_gb ?? 0).toFixed(1)} GB</span>
        </div>
      </>
    )}
  </Card>
);

export const DisksCard: React.FC<{ disks: SystemStats["disks"] }> = ({
  disks,
}) => (
  <Card title="Disks">
    {!disks || disks.length === 0 ? (
      <span className="text-xs text-[var(--text-faint)]">No disks reported</span>
    ) : (
      <div className="flex flex-col gap-3.5">
        {disks.map((d) => (
          <div key={d.mount} className="flex flex-col gap-1.5">
            <div className="flex justify-between gap-2 text-xs">
              <span className="mono text-[var(--text)] truncate" title={`${d.mount} · ${d.fstype}`}>
                {d.mount}
                <span className="text-[var(--text-faint)]"> {d.fstype}</span>
              </span>
              <span className="mono text-[var(--text-muted)] shrink-0">
                {fmtSize(d.used_gb)} / {fmtSize(d.total_gb)}
                <span className="text-[var(--text-faint)]">
                  {" "}
                  ({Math.round(d.percent)}%)
                </span>
              </span>
            </div>
            <Bar pct={d.percent} height={5} />
          </div>
        ))}
      </div>
    )}
  </Card>
);
