export interface CPUStats {
  percent: number;
  count: number;
  freq_mhz: number;
  freq_max_mhz: number;
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
}

export interface ProcessStats {
  cpu_percent: number;
  memory_mb: number;
  memory_percent: number;
  num_threads: number;
  num_fds: number;
}

export interface SystemStats {
  cpu: CPUStats;
  ram: RAMStats;
  disk: DiskStats;
  gpus: GPUStats[];
  process: ProcessStats;
  timestamp: number;
}
