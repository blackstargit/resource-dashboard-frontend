import { useEffect } from "react";
import { useResourceStats } from "./hooks/useResourceStats";
import { Login } from "./components/Login";
import { useGetMeQuery, useLogoutMutation } from "./store/api";
import { StatCard } from "./components/StatCard";
import { GPUCard } from "./components/GPUCard";
import { ProcessTable } from "./components/ProcessTable";
import { CoreGrid } from "./components/CoreGrid";
import { LoadChart } from "./components/LoadChart";
import {
  Cpu,
  MemoryStick as Memory,
  HardDrive,
  Activity,
  Gpu,
  AlertCircle,
  BatteryCharging,
  BatteryFull,
  LogOut,
} from "lucide-react";

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

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
  const avgGpuLoad = gpus.length
    ? gpus.reduce((a, g) => a + g.load_percent, 0) / gpus.length
    : 0;

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

            <span className="hidden sm:flex items-center gap-1.5 text-[var(--text-muted)]">
              <span className="text-[var(--text-faint)]">up</span>
              <span className="mono">
                {formatUptime(stats.system.uptime_seconds)}
              </span>
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

      <main className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="CPU"
            value={`${stats.cpu.percent}%`}
            subtitle={`${stats.cpu.count} cores`}
            icon={Cpu}
            percent={stats.cpu.percent}
          />
          <StatCard
            title="Memory"
            value={`${stats.ram.used_gb.toFixed(1)} GB`}
            subtitle={`of ${stats.ram.total_gb.toFixed(0)} GB`}
            icon={Memory}
            percent={stats.ram.percent}
          />
          <StatCard
            title="Disk"
            value={`${stats.disk.used_gb.toFixed(0)} GB`}
            subtitle={`${stats.disk.free_gb.toFixed(0)} GB free`}
            icon={HardDrive}
            percent={stats.disk.percent}
          />
          {gpus.length > 0 ? (
            <StatCard
              title="GPU"
              value={`${Math.round(avgGpuLoad)}%`}
              subtitle={gpus.length > 1 ? `${gpus.length} GPUs avg` : gpus[0].name}
              icon={Gpu}
              percent={avgGpuLoad}
            />
          ) : (
            <StatCard
              title="Swap"
              value={`${stats.ram.swap_used_gb.toFixed(1)} GB`}
              subtitle={`of ${stats.ram.swap_total_gb.toFixed(0)} GB`}
              icon={Memory}
              percent={stats.ram.swap_percent}
            />
          )}
        </div>

        {/* GPUs */}
        {gpus.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-[var(--text-muted)]">
              GPUs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {gpus.map((gpu) => (
                <GPUCard key={gpu.gpu_id} gpu={gpu} />
              ))}
            </div>
          </section>
        )}

        {/* History */}
        <LoadChart history={history} />

        {/* Per-core */}
        <CoreGrid cores={stats.cpu.per_core_percent} />

        {/* Processes */}
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
