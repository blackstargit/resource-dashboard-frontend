export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/** GiB in → human string, switching to TB past 1024 GiB. */
export function fmtSize(gb: number): string {
  if (gb >= 1024) return `${(gb / 1024).toFixed(1)} TB`;
  if (gb < 10) return `${gb.toFixed(1)} GB`;
  return `${Math.round(gb)} GB`;
}
