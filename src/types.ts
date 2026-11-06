export interface CPUStats {
  percent: number;
  per_core_percent: number[];
  count: number;
  freq_mhz: number | null;
  freq_max_mhz: number | null;
  load_avg: number[] | null;
  temp_celsius: number | null;
}

export interface RAMStats {
  total_gb: number;
  available_gb: number;
  used_gb: number;
  percent: number;
  swap_total_gb: number;
  swap_used_gb: number;
  swap_percent: number;
}

export interface DiskStats {
  total_gb: number;
  used_gb: number;
  free_gb: number;
  percent: number;
  read_mb: number;
  write_mb: number;
}

export interface GPUStats {
  gpu_id: number;
  name: string;
  load_percent: number;
  memory_used_gb: number;
  memory_total_gb: number;
  memory_percent: number;
  temp_celsius: number;
  power_w?: number | null;
  power_limit_w?: number | null;
  clock_sm_mhz?: number | null;
  clock_mem_mhz?: number | null;
  fan_percent?: number | null;
}

export interface DiskInfo {
  mount: string;
  device: string;
  fstype: string;
  total_gb: number;
  used_gb: number;
  free_gb: number;
  percent: number;
}

export interface NetworkStats {
  rx_mb_s?: number;
  tx_mb_s?: number;
  rx_total_gb?: number;
  tx_total_gb?: number;
  error?: string;
}

export interface ProcessStats {
  cpu_percent: number;
  memory_mb: number;
  memory_percent: number;
  num_threads: number;
  num_fds: number;
}

export interface SystemInfoStats {
  hostname: string;
  os: string;
  kernel: string;
  cpu_model: string | null;
  boot_time: number;
  uptime_seconds: number;
  battery_percent: number | null;
  battery_plugged: boolean | null;
}

export interface SystemStats {
  cpu: CPUStats;
  ram: RAMStats;
  disk: DiskStats;
  disks: DiskInfo[];
  gpus: GPUStats[];
  network: NetworkStats;
  process: ProcessStats;
  system: SystemInfoStats;
  timestamp: number;
}

export interface TopProcess {
  pid: number;
  name: string;
  cpu_percent: number;
  memory_mb: number;
  memory_percent: number;
  gpu_memory_mb: number | null;
  gpu_id: number | null;
}

export interface ProcessListResponse {
  processes: TopProcess[];
  total_shown: number;
  sort_by: string;
  gpu_available: boolean;
  timestamp: number;
}

export type ProcessSortKey = "cpu" | "memory" | "gpu_memory";
