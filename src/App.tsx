import { useResourceStats } from "./hooks/useResourceStats";
import { StatCard } from "./components/StatCard";
import { GPUCard } from "./components/GPUCard";
import {
  Cpu,
  MemoryStick as Memory,
  HardDrive,
  Activity,
  Server,
  Zap,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Cyberpunk Scanline Effect
const Scanlines = () => (
  <div
    className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
    style={{ backgroundSize: "100% 2px, 3px 100%" }}
  />
);

const BackgroundGrid = () => (
  <div
    className="fixed inset-0 pointer-events-none z-[-1]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      maskImage:
        "radial-gradient(circle at 50% 50%, black 40%, transparent 80%)",
    }}
  />
);

function App() {
  const { stats, history, isConnected, error } = useResourceStats();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)] text-[var(--tertiary-1)] relative overflow-hidden">
        <Scanlines />
        <BackgroundGrid />
        <div className="glass-card p-8 text-center space-y-6 max-w-md w-full border-red-500/30 shadow-[0_0_50px_rgba(255,0,85,0.2)]">
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--tertiary-1)] opacity-20 rounded-full animate-ping" />
            <AlertCircle size={48} className="relative z-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter uppercase">
              Connection Failure
            </h1>
            <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[var(--tertiary-1)] to-transparent opacity-50" />
            <p className="opacity-80 font-mono text-sm">{error}</p>
          </div>
          <div className="text-xs text-gray-400 bg-black/20 p-3 rounded border border-white/5 font-mono">
            &gt; CHECK_PORT: 8202
            <br />
            &gt; STATUS: OFFLINE
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-dark)] relative overflow-hidden">
        <Scanlines />
        <BackgroundGrid />

        <div className="flex flex-col items-center gap-8 z-10">
          <div className="relative w-24 h-24">
            <div
              className="absolute inset-0 border-t-4 border-[var(--primary)] rounded-full animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>
            <div
              className="absolute inset-2 border-r-4 border-[var(--secondary)] rounded-full animate-spin"
              style={{
                animationDuration: "1.5s",
                animationDirection: "reverse",
              }}
            ></div>
            <div
              className="absolute inset-4 border-b-4 border-[var(--tertiary-2)] rounded-full animate-spin"
              style={{ animationDuration: "2s" }}
            ></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <Activity
                className="text-white opacity-50 animate-pulse"
                size={32}
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
              Initializing
            </h2>
            <div className="flex items-center gap-1 text-[var(--primary)] font-mono text-sm">
              <span className="animate-pulse">
                &gt; ESTABLISHING NEURAL LINK...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10 text-white selection:bg-[var(--primary)] selection:text-black">
      <Scanlines />
      <BackgroundGrid />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-8 py-6 mb-8 backdrop-blur-xl bg-black/40">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-[var(--primary)] blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="p-2.5 bg-black/50 border border-white/10 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-transparent opacity-10" />
                <Activity className="text-[var(--primary)]" size={24} />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-4xl font-bold tracking-tight leading-none mb-2">
                <span className="text-gradient-primary drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] text-6xl">
                  NARRATIVE
                </span>
                <span className="text-gradient-secondary ml-2 text-6xl">
                  MONITOR
                </span>
              </h1>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-400 uppercase tracking-widest pl-1">
                <span className="text-[var(--primary)]">
                  &gt; Resource Orchestrator
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--tertiary-1)]"></span>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 mr-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">
                  System Uptime
                </span>
                <span className="font-mono text-sm">09:26:38</span>
              </div>
            </div>

            <div className="pl-6 border-l border-white/10 flex flex-col items-end min-w-[120px]">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-1 ${isConnected ? "text-[var(--tertiary-2)]" : "text-[var(--tertiary-1)]"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${isConnected ? "bg-[var(--tertiary-2)] animate-pulse" : "bg-[var(--tertiary-1)]"}`}
                ></span>
                {isConnected ? "SYSTEM ONLINE" : "DISCONNECTED"}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {new Date(stats.timestamp * 1000).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-grid">
        {/* Top Stats Row */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
          <StatCard
            title="CPU Load"
            value={`${stats.cpu.percent}%`}
            subtitle={`${stats.cpu.count} Cores`}
            icon={Cpu}
            percent={stats.cpu.percent}
            color="primary"
          />
          <StatCard
            title="System RAM"
            value={`${stats.ram.used_gb.toFixed(1)} GB`}
            subtitle={`of ${stats.ram.total_gb.toFixed(0)} GB`}
            icon={Memory}
            percent={stats.ram.percent}
            color="secondary"
          />
          <StatCard
            title="GPU Cluster"
            value={stats.gpus.length}
            subtitle="Active Units"
            icon={Server}
            color="tertiary-2"
            trend={`${stats.gpus.reduce((acc, g) => acc + g.load_percent, 0) / stats.gpus.length < 50 ? "Optimal" : "High Load"}`}
          />
          <StatCard
            title="Disk I/O"
            value={`${stats.disk.percent}%`}
            subtitle={`${stats.disk.free_gb.toFixed(0)} GB Free`}
            icon={HardDrive}
            percent={stats.disk.percent}
            color="tertiary-1"
          />
        </div>

        {/* GPU Grid Section */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between bg-black/20 border-white/5">
            <h2 className="text-lg font-bold flex items-center gap-3">
              <div className="p-1.5 rounded bg-[var(--primary)]/10">
                <Zap size={16} className="text-[var(--primary)]" />
              </div>
              <span className="text-gradient-primary">
                GPU Allocation Matrix
              </span>
            </h2>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded-full bg-white/5">
              {stats.gpus.length} Devices Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {stats.gpus.map((gpu) => (
              <GPUCard key={gpu.gpu_id} gpu={gpu} />
            ))}
          </div>
        </div>

        {/* Side Charts / Process Info */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 flex-1 min-h-[300px] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs uppercase text-gray-400 font-bold tracking-widest flex items-center gap-2">
                <Activity size={14} />
                Load History
              </h3>
              <span className="text-[10px] font-mono bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 px-2 py-0.5 rounded">
                60S INTERVAL
              </span>
            </div>

            <div className="h-[250px] w-full relative">
              {/* Chart Grid Lines Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent)",
                  backgroundSize: "50px 50px",
                }}
              />

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--primary)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--secondary)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--secondary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="2 4"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(5, 5, 10, 0.9)",
                      backdropFilter: "blur(10px)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "12px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                    }}
                    itemStyle={{ padding: "2px 0" }}
                    labelStyle={{ display: "none" }}
                    formatter={(
                      value: number | string | undefined,
                      name: string | undefined,
                    ) => [
                      `${Number(value ?? 0).toFixed(1)}%`,
                      <span
                        style={{
                          color:
                            name === "CPU"
                              ? "var(--primary)"
                              : "var(--secondary)",
                        }}
                      >
                        {name}
                      </span>,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="cpu.percent"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCpu)"
                    name="CPU"
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="ram.percent"
                    stroke="var(--secondary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRam)"
                    name="RAM"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-between px-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]"></span>
                <span className="text-gray-400">CPU Load</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[var(--secondary)] shadow-[0_0_8px_var(--secondary)]"></span>
                <span className="text-gray-400">RAM Usage</span>
              </div>
            </div>
          </div>

          {/* Process Stats Mini Card */}
          <div className="glass-card p-5 border-l-2 border-l-[var(--tertiary-2)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs uppercase text-gray-400 font-bold tracking-widest">
                Backend Process
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--tertiary-2)] animate-pulse"></span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
                <div className="text-gray-500 text-[10px] uppercase mb-1">
                  Threads
                </div>
                <div className="font-mono font-bold text-xl text-[var(--text-main)] group-hover:text-[var(--tertiary-2)] transition-colors">
                  {stats.process.num_threads}
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
                <div className="text-gray-500 text-[10px] uppercase mb-1">
                  Mem (RSS)
                </div>
                <div className="font-mono font-bold text-xl text-[var(--text-main)] group-hover:text-[var(--secondary)] transition-colors">
                  {stats.process.memory_mb.toFixed(0)} MB
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
