import { useState, useEffect, useRef, useCallback } from "react";
import type { ProcessListResponse, ProcessSortKey } from "../types";

// Strip the SSE stream path to get the base API URL
const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8202/api/v1/resources/stats/stream"
).replace("/stats/stream", "");

export function useProcessList(
  sortBy: ProcessSortKey = "cpu",
  limit: number = 25,
  intervalMs: number = 2000
) {
  const [data, setData] = useState<ProcessListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchProcesses = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const url = `${BASE_URL}/processes?sort_by=${sortBy}&limit=${limit}`;
      const res = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ProcessListResponse = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Fetch failed");
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, limit]);

  useEffect(() => {
    fetchProcesses();
    const id = setInterval(fetchProcesses, intervalMs);
    return () => {
      clearInterval(id);
      abortRef.current?.abort();
    };
  }, [fetchProcesses, intervalMs]);

  const killProcess = useCallback(
    async (pid: number) => {
      const res = await fetch(`${BASE_URL}/processes/${pid}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || `HTTP ${res.status}`);
      }
      await fetchProcesses();
    },
    [fetchProcesses]
  );

  return { data, isLoading, error, killProcess };
}
