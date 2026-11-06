import { useEffect } from "react";
import { useResourceStats } from "./hooks/useResourceStats";
import { Login } from "./components/Login";
import { useGetMeQuery, useLogoutMutation } from "./store/api";
import { GPUCard } from "./components/GPUCard";
import { ProcessTable } from "./components/ProcessTable";
import { LoadChart } from "./components/LoadChart";
import { CpuPanel } from "./components/CpuPanel";
import { MemoryPanel } from "./components/MemoryPanel";
import { SysInfo, NetworkCard, DisksCard } from "./components/RailCards";
import {
  Activity,
  AlertCircle,
  BatteryCharging,
  BatteryFull,
  LogOut,
} from "lucide-react";

function Dashboard() {
  const { stats, history, isConnected, error } = useResourceStats();
  const { refetch } = useGetMeQuery();
  const [logout] = useLogoutMutation();

  // A dropped stream is also how an expired session shows up (EventSource
  // hides the 401), so re-check the session and fall back to the login form.
  useEffect(() => {
    if (!isConnected) refetch();
  }, [isConnected, refetch]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card p-8 text-center max-w-md w-full flex flex-col items-center gap-4">
          <AlertCircle size={40} className="text-[var(--crit)]" />
          <h1 className="text-xl font-semibold">Connection failure</h1>
          <p className="text-sm text-[var(--text-muted)]">{error}</p>
          <p className="mono text-xs text-[var(--text-faint)]">
            {window.location.host} · offline
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Activity className="text-[var(--accent)] animate-pulse" size={32} />
        <p className="text-sm text-[var(--text-muted)]">Connecting…</p>
      </div>
    );
  }

  const gpus = stats.gpus;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/favicon.png"
              alt=""
              className="w-7 h-7 rounded-[6px] object-cover"
            />
            <h1 className="text-base font-semibold tracking-tight">
              Resource Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-5 text-sm">
            {stats.system.battery_percent !== null && (
              <span className="hidden sm:flex items-center gap-1.5 text-[var(--text-muted)]">
                {stats.system.battery_plugged ? (
                  <BatteryCharging size={15} className="text-[var(--ok)]" />
                ) : (
                  <BatteryFull size={15} />
                )}
                <span className="mono">
                  {stats.system.battery_percent.toFixed(0)}%
                </span>
              </span>
            )}

            <span className="mono hidden sm:inline text-[var(--text-faint)] text-xs">
              {new Date(stats.timestamp * 1000).toLocaleTimeString()}
            </span>

            <span className="flex items-center gap-2 text-[var(--text-muted)]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-[var(--ok)] dot-live" : "bg-[var(--warn)]"
                }`}
              />
              {isConnected ? "Live" : "Reconnecting"}
            </span>

            <button
              onClick={() => logout()}
              title="Sign out"
              className="text-[var(--text-faint)] hover:text-[var(--text)] transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col gap-5">
        {/* Primary (main) + secondary (rail) */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-5 items-start">
          <div className="flex flex-col gap-5 min-w-0">
            <div className="grid sm:grid-cols-2 gap-5">
              <CpuPanel cpu={stats.cpu} />
              <MemoryPanel ram={stats.ram} />
            </div>

            {gpus.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-medium text-[var(--text-muted)]">
                  GPUs · {gpus.length}
                </h2>
                <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {gpus.map((gpu) => (
                    <GPUCard key={gpu.gpu_id} gpu={gpu} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-20 self-start">
            <SysInfo stats={stats} />
            <NetworkCard net={stats.network} />
            <DisksCard disks={stats.disks} />
          </aside>
        </div>

        {/* Full-width history + processes */}
        <LoadChart history={history} />
        <ProcessTable />
      </main>
    </div>
  );
}

function App() {
  const { isLoading, isError } = useGetMeQuery();

  if (isLoading) return <div className="min-h-screen" />;
  if (isError) return <Login />;
  return <Dashboard />;
}

export default App;
