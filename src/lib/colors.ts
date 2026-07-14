export function cpuColor(pct: number): string {
  if (pct > 85) return "var(--tertiary-1)";
  if (pct > 60) return "var(--secondary)";
  if (pct > 20) return "var(--primary)";
  return "rgba(255,255,255,0.35)";
}
