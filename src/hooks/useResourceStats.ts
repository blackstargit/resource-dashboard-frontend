import { useState, useEffect, useRef } from "react";
import type { SystemStats } from "../types";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8202/api/v1/resources/stats/stream";

export function useResourceStats(historyLength = 60) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [history, setHistory] = useState<SystemStats[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to keep track of history to avoid closure staleness issues in event listener
  // without re-attaching the listener on every update
  const historyRef = useRef<SystemStats[]>([]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: number | undefined;

    const connect = () => {
      try {
        eventSource = new EventSource(API_URL);

        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);

            // Check for error in data payload
            if (payload && typeof payload === "object" && "error" in payload) {
              setError(String((payload as { error: unknown }).error));
              return;
            }

            const data = payload as SystemStats;

            setStats(data);

            // Update history
            const newHistory = [...historyRef.current, data].slice(
              -historyLength,
            );
            historyRef.current = newHistory;
            setHistory(newHistory);
          } catch (e) {
            console.error("Failed to parse stats:", e);
          }
        };

        eventSource.onerror = (err) => {
          console.error("EventSource connection error:", err);
          setIsConnected(false);
          eventSource?.close();

          // Retry connection after 3 seconds
          retryTimeout = setTimeout(connect, 3000);
        };
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to connect");
        retryTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearTimeout(retryTimeout);
    };
  }, [historyLength]);

  return { stats, history, isConnected, error };
}
