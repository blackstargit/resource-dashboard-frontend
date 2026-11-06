// Semantic load color: utilization 0-100 → a color that MEANS something.
// Below 70% reads as the neutral accent, 70-90% warns, 90%+ is critical.
export function levelColor(pct: number): string {
  if (pct >= 90) return "var(--crit)";
  if (pct >= 70) return "var(--warn)";
  return "var(--accent)";
}
