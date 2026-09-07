import React, { useState, useMemo } from "react";
import { List, Search, X } from "lucide-react";
import { useProcessList } from "../hooks/useProcessList";
import { useGetMeQuery } from "../store/api";
import { cpuColor } from "../lib/colors";
import type { ProcessSortKey } from "../types";

interface TabDef {
  key: ProcessSortKey;
  label: string;
  color: string;
}

const TABS: TabDef[] = [
  { key: "cpu",        label: "CPU",    color: "var(--primary)"    },
  { key: "memory",     label: "MEM",    color: "var(--secondary)"  },
  { key: "gpu_memory", label: "GPU",    color: "var(--tertiary-2)" },
];

function memColor(pct: number): string {
  if (pct > 85) return "var(--tertiary-1)";
  if (pct > 60) return "var(--secondary)";
  if (pct > 20) return "rgba(140,80,255,0.9)";
  return "rgba(255,255,255,0.35)";
}

interface ProcessTableProps {
  className?: string;
}

export const ProcessTable: React.FC<ProcessTableProps> = ({ className }) => {
  const [sortBy, setSortBy] = useState<ProcessSortKey>("cpu");
  const [search, setSearch] = useState("");
  const [killingPid, setKillingPid] = useState<number | null>(null);
  const [killError, setKillError] = useState<string | null>(null);
  const { data, isLoading, error, killProcess } = useProcessList(sortBy, 25, 2000);
  // Server-side flag: terminating host processes is opt-in (ALLOW_PROCESS_KILL).
  const { data: me } = useGetMeQuery();
  const canKill = me?.allow_process_kill === true;

  const showGpu = data?.gpu_available === true;

  const filteredProcesses = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.processes;
    return data.processes.filter(
      (p) => p.name.toLowerCase().includes(q) || String(p.pid).includes(q)
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

  return (
    <div className={`glass-card overflow-hidden ${className ?? ""}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <List size={16} style={{ color: "var(--primary)" }} />
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--primary)" }}>
            Top Processes
          </span>
          {data && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-white/10 text-white/40 ml-1">
              {filteredProcesses.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or PID..."
              className="text-xs font-mono pl-8 pr-3 py-1.5 rounded bg-white/5 border border-white/10 text-white/80 placeholder:text-white/25 focus:outline-none focus:border-white/25 w-48"
            />
          </div>

          {/* Sort tabs */}
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const active = sortBy === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSortBy(tab.key)}
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all duration-200"
                  style={{
                    color: active ? tab.color : "rgba(255,255,255,0.3)",
                    background: active ? `${tab.color}15` : "transparent",
                    borderBottom: active ? `2px solid ${tab.color}` : "2px solid transparent",
                    boxShadow: active ? `0 0 8px ${tab.color}30` : "none",
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
        <div className="mx-5 mb-3 px-3 py-2 rounded text-xs font-mono" style={{ color: "var(--tertiary-1)", background: "rgba(255,0,85,0.08)", border: "1px solid rgba(255,0,85,0.2)" }}>
          {killError}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-sm font-mono">
            <thead className="sticky top-0 z-10" style={{ background: "rgba(5,5,10,0.85)", backdropFilter: "blur(8px)" }}>
              <tr className="text-left">
                <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/25 w-16">PID</th>
                <th className="px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-white/25">Name</th>
                <th className="px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-right w-20"
                    style={{ color: sortBy === "cpu" ? "var(--primary)" : "rgba(255,255,255,0.25)" }}>
                  CPU%
                </th>
                <th className="px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-right w-24"
                    style={{ color: sortBy === "memory" ? "var(--secondary)" : "rgba(255,255,255,0.25)" }}>
                  Mem MB
                </th>
                <th className="px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-right w-20 text-white/25">
                  Mem%
                </th>
                {showGpu && (
                  <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-right w-28"
                      style={{ color: sortBy === "gpu_memory" ? "var(--tertiary-2)" : "rgba(255,255,255,0.25)" }}>
                    GPU Mem
                  </th>
                )}
                {canKill && (
                  <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-right w-16 text-white/25">
                    Kill
                  </th>
                )}
              </tr>
              <tr>
                <td colSpan={5 + (showGpu ? 1 : 0) + (canKill ? 1 : 0)} className="p-0">
                  <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                </td>
              </tr>
            </thead>
            <tbody>
              {isLoading && !data ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-3">
                      <div className="h-3.5 w-10 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-3.5 w-36 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-3.5 w-10 rounded ml-auto" style={{ background: "rgba(255,255,255,0.05)" }} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-3.5 w-14 rounded ml-auto" style={{ background: "rgba(255,255,255,0.05)" }} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-3.5 w-10 rounded ml-auto" style={{ background: "rgba(255,255,255,0.05)" }} />
                    </td>
                    {showGpu && (
                      <td className="px-5 py-3">
                        <div className="h-3.5 w-14 rounded ml-auto" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </td>
                    )}
                    <td className="px-5 py-3">
                      <div className="h-3.5 w-6 rounded ml-auto" style={{ background: "rgba(255,255,255,0.05)" }} />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5 + (showGpu ? 1 : 0) + (canKill ? 1 : 0)} className="px-5 py-8 text-center text-xs" style={{ color: "var(--tertiary-1)" }}>
                    Failed to load processes: {error}
                  </td>
                </tr>
              ) : filteredProcesses.length === 0 ? (
                <tr>
                  <td colSpan={5 + (showGpu ? 1 : 0) + (canKill ? 1 : 0)} className="px-5 py-8 text-center text-xs text-white/25">
                    No processes found
                  </td>
                </tr>
              ) : (
                filteredProcesses.map((proc) => (
                  <tr
                    key={proc.pid}
                    className="border-b transition-colors duration-100"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-2.5 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {proc.pid}
                    </td>
                    <td className="px-3 py-2.5 max-w-[200px]">
                      <span
                        className="block truncate text-white/80"
                        title={proc.name}
                      >
                        {proc.name}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums" style={{ color: cpuColor(proc.cpu_percent) }}>
                      {proc.cpu_percent.toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums" style={{ color: memColor(proc.memory_percent) }}>
                      {proc.memory_mb >= 1000
                        ? `${(proc.memory_mb / 1024).toFixed(2)} GB`
                        : `${proc.memory_mb.toFixed(0)} MB`}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-xs" style={{ color: memColor(proc.memory_percent) }}>
                      {proc.memory_percent.toFixed(1)}%
                    </td>
                    {showGpu && (
                      <td className="px-5 py-2.5 text-right tabular-nums">
                        {proc.gpu_memory_mb != null ? (
                          <span style={{ color: "var(--tertiary-2)" }}>
                            {proc.gpu_memory_mb >= 1000
                              ? `${(proc.gpu_memory_mb / 1024).toFixed(2)} GB`
                              : `${proc.gpu_memory_mb.toFixed(0)} MB`}
                          </span>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.12)" }}>—</span>
                        )}
                      </td>
                    )}
                    {canKill && (
                      <td className="px-5 py-2.5 text-right">
                        <button
                          onClick={() => handleKill(proc.pid, proc.name)}
                          disabled={killingPid === proc.pid}
                          title={`Terminate ${proc.name}`}
                          className="p-1.5 rounded hover:bg-[var(--tertiary-1)]/15 text-white/20 hover:text-[var(--tertiary-1)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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

      {/* Footer */}
      {data && (
        <div className="px-5 py-2.5 flex justify-between items-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Showing top {data.total_shown} · sorted by {data.sort_by}
          </span>
          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>
            {new Date(data.timestamp * 1000).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
};
