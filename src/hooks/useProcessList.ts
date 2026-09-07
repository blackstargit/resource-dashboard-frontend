import { useCallback } from "react";
import type { ProcessSortKey } from "../types";
import { useGetProcessesQuery, useKillProcessMutation } from "../store/api";

/**
 * Thin wrapper over the RTK Query endpoints, kept so ProcessTable's call site
 * does not change. Polling and request signing are handled by the store.
 */
export function useProcessList(
  sortBy: ProcessSortKey = "cpu",
  limit: number = 25,
  intervalMs: number = 2000,
) {
  const { data, isLoading, error } = useGetProcessesQuery(
    { sortBy, limit },
    { pollingInterval: intervalMs },
  );
  const [kill] = useKillProcessMutation();

  const killProcess = useCallback(
    async (pid: number) => {
      await kill(pid).unwrap();
    },
    [kill],
  );

  return {
    data,
    isLoading,
    error: error ? "Fetch failed" : null,
    killProcess,
  };
}
