import { useState, type FormEvent } from "react";
import { Activity, AlertCircle, LogIn, ShieldAlert } from "lucide-react";
import { useLoginMutation } from "../store/api";

const MESSAGES: Record<number, string> = {
  401: "Invalid username or password",
  429: "Too many failed attempts. Wait a few minutes.",
  503: "No user has been seeded on the server yet.",
};

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();

  const message = !error
    ? null
    : "status" in error && typeof error.status === "number"
      ? (MESSAGES[error.status] ?? `Server error (${error.status})`)
      : "Could not reach the server";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)] p-6">
      <form
        onSubmit={onSubmit}
        className="glass-card p-8 w-full max-w-sm space-y-6"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-2.5 bg-black/50 border border-white/10 rounded-lg">
            <Activity className="text-[var(--primary)]" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gradient-primary uppercase">
            Resource Monitor
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
            Authentication required
          </p>
        </div>

        <div className="space-y-3">
          <input
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 font-mono text-sm text-white outline-none focus:border-[var(--primary)]"
            placeholder="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 font-mono text-sm text-white outline-none focus:border-[var(--primary)]"
            type="password"
            placeholder="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {message && (
          <p className="flex items-center gap-2 text-xs font-mono text-[var(--tertiary-1)]">
            <AlertCircle size={14} />
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] rounded py-2 text-xs font-bold uppercase tracking-widest hover:bg-[var(--primary)]/20 disabled:opacity-40"
        >
          <LogIn size={14} />
          {/* The pause is PBKDF2 running in the browser; say so rather than
              letting a one-second freeze look like a hang. */}
          {isLoading ? "Deriving key…" : "Sign in"}
        </button>

        {!window.isSecureContext && (
          <p className="flex items-start gap-2 text-[10px] font-mono text-gray-500 leading-relaxed border-t border-white/5 pt-4">
            <ShieldAlert size={20} className="shrink-0 -mt-0.5" />
            <span>
              Served over plain HTTP. Your password is never transmitted and
              requests are individually signed, but anyone able to modify
              traffic on this network can still tamper with the page itself.
            </span>
          </p>
        )}
      </form>
    </div>
  );
}
