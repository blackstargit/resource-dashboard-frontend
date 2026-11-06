import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useProcessList } from "../hooks/useProcessList";
import { useGetMeQuery } from "../store/api";
import { levelColor } from "../lib/colors";
import type { ProcessSortKey } from "../types";

const TABS: { key: ProcessSortKey; label: string }[] = [
  { key: "cpu", label: "CPU" },
  { key: "memory", label: "Memory" },
  { key: "gpu_memory", label: "GPU" },
];

const fmtMb = (mb: number) =>
  mb >= 1000 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(0)} MB`;

export const ProcessTable: React.FC = () => {
  const [sortBy, setSortBy] = useState<ProcessSortKey>("cpu");
  const [search, setSearch] = useState("");
  const [killingPid, setKillingPid] = useState<number | null>(null);
  const [killError, setKillError] = useState<string | null>(null);
  const { data, isLoading, error, killProcess } = useProcessList(sortBy, 25, 2000);
  // Server-side flag: terminating host processes is opt-in (ALLOW_PROCESS_KILL).
  const { data: me } = useGetMeQuery();
  const canKill = me?.allow_process_kill === true;
  const showGpu = data?.gpu_available === true;

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.processes;
    return data.processes.filter(
      (p) => p.name.toLowerCase().includes(q) || String(p.pid).includes(q),
    );
  }, [data, search]);

  const handleKill = async (pid: number, name: string) => {
    if (!window.confirm(`Terminate "${name}" (PID ${pid})?`)) return;
    setKillingPid(pid);
    setKillError(null);
    try {
      await killProcess(pid);
    } catch (e) {
      setKillError(e instanceof Error ? e.message : "Failed to terminate process");
    } finally {
      setKillingPid(null);
    }
  };

  const colCount = 5 + (showGpu ? 1 : 0) + (canKill ? 1 : 0);
  const th = "px-4 py-2.5 text-xs font-medium text-[var(--text-faint)] text-left";
  const thNum = "px-4 py-2.5 text-xs font-medium text-[var(--text-faint)] text-right";

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Processes</h3>
          {data && (
            <span className="mono text-xs text-[var(--text-faint)]">
              {filtered.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or PID…"
              className="text-sm pl-8 pr-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-strong)] w-52"
            />
          </div>

          <div className="flex gap-1 rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-1">
            {TABS.map((tab) => {
              const active = sortBy === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSortBy(tab.key)}
                  className="text-xs font-medium px-3 py-1 rounded-[6px] transition-colors"
                  style={{
                    color: active ? "var(--text)" : "var(--text-faint)",
                    background: active ? "var(--accent)" : "transparent",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {killError && (
        <div className="mx-5 mt-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--crit)] bg-[var(--crit)]/10 border border-[var(--crit)]/25">
          {killError}
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-[var(--surface)]">
              <tr className="border-b border-[var(--border)]">
                <th className={`${th} w-16`}>PID</th>
                <th className={th}>Name</th>
                <th className={thNum}>CPU%</th>
                <th className={thNum}>Memory</th>
                <th className={thNum}>Mem%</th>
                {showGpu && <th className={thNum}>GPU Mem</th>}
                {canKill && <th className={`${thNum} w-12`}></th>}
              </tr>
            </thead>
            <tbody>
              {isLoading && !data ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-[var(--border)]">
                    {Array.from({ length: colCount }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3.5 rounded bg-white/[0.05]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={colCount} className="px-5 py-10 text-center text-sm text-[var(--crit)]">
                    Failed to load processes: {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="px-5 py-10 text-center text-sm text-[var(--text-faint)]">
                    No processes found
                  </td>
                </tr>
              ) : (
                filtered.map((proc) => (
                  <tr
                    key={proc.pid}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <td className="px-4 py-2.5 mono text-[var(--text-faint)]">{proc.pid}</td>
                    <td className="px-4 py-2.5 max-w-[240px]">
                      <span className="block truncate text-[var(--text)]" title={proc.name}>
                        {proc.name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 mono text-right" style={{ color: levelColor(proc.cpu_percent) }}>
                      {proc.cpu_percent.toFixed(1)}
                    </td>
                    <td className="px-4 py-2.5 mono text-right text-[var(--text-muted)]">
                      {fmtMb(proc.memory_mb)}
                    </td>
                    <td className="px-4 py-2.5 mono text-right" style={{ color: levelColor(proc.memory_percent) }}>
                      {proc.memory_percent.toFixed(1)}%
                    </td>
                    {showGpu && (
                      <td className="px-4 py-2.5 mono text-right">
                        {proc.gpu_memory_mb != null ? (
                          <span className="text-[var(--text-muted)]">{fmtMb(proc.gpu_memory_mb)}</span>
                        ) : (
                          <span className="text-[var(--text-faint)]">—</span>
                        )}
                      </td>
                    )}
                    {canKill && (
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => handleKill(proc.pid, proc.name)}
                          disabled={killingPid === proc.pid}
                          title={`Terminate ${proc.name}`}
                          className="p-1.5 rounded hover:bg-[var(--crit)]/15 text-[var(--text-faint)] hover:text-[var(--crit)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <X size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data && (
        <div className="px-5 py-2.5 flex justify-between items-center border-t border-[var(--border)]">
          <span className="text-xs text-[var(--text-faint)]">
            Top {data.total_shown} · sorted by {data.sort_by}
          </span>
          <span className="mono text-xs text-[var(--text-faint)]">
            {new Date(data.timestamp * 1000).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
};
