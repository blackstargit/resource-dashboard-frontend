import { useState, type FormEvent } from "react";
import {
  Activity,
  AlertCircle,
  ShieldAlert,
  Cpu,
  HardDrive,
  Lock,
  User,
} from "lucide-react";
import { useLoginMutation } from "../store/api";

const MESSAGES: Record<number, string> = {
  401: "Invalid username or password",
  429: "Too many failed attempts. Wait a few minutes.",
  503: "No user has been seeded on the server yet.",
};

const FEATURES = [
  { icon: Activity, text: "Live CPU, memory, disk & GPU metrics" },
  { icon: Cpu, text: "Per-core load and top processes" },
  { icon: Lock, text: "Password never leaves your browser" },
];

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

  const field =
    "w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] pl-10 pr-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors";

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand / hero panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 border-r border-[var(--border)]">
        {/* subtle accent glow + faint grid, nothing loud */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 15%, rgba(99,102,241,0.14), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(circle at 30% 30%, black, transparent 75%)",
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <img
            src="/favicon.png"
            alt=""
            className="w-7 h-7 rounded-[6px] object-cover"
          />
          <span className="font-semibold tracking-tight">Resource Dashboard</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight leading-tight">
            Real-time visibility into your server.
          </h2>
          <p className="mt-3 text-[var(--text-muted)] leading-relaxed">
            Monitor compute, memory, storage and GPU load as it happens — from
            anywhere, over an individually-signed connection.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span className="p-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)]">
                  <Icon size={15} className="text-[var(--accent)]" />
                </span>
                <span className="text-[var(--text-muted)]">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-[var(--text-faint)]">
          <HardDrive size={13} />
          <span>{window.location.host}</span>
        </div>
      </div>

      {/* Sign-in panel */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-6">
          {/* compact brand for mobile */}
          <div className="flex lg:hidden items-center gap-2.5">
            <img
              src="/favicon.png"
              alt=""
              className="w-7 h-7 rounded-[6px] object-cover"
            />
            <span className="font-semibold tracking-tight">
              Resource Dashboard
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Sign in to access the dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Username
              </span>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] pointer-events-none"
                />
                <input
                  className={field}
                  placeholder="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Password
              </span>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] pointer-events-none"
                />
                <input
                  className={field}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>
          </div>

          {message && (
            <p className="flex items-center gap-2 text-sm text-[var(--crit)] -mt-1">
              <AlertCircle size={15} />
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--accent)] text-white rounded-[var(--radius-sm)] py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {/* The pause is PBKDF2 running in the browser; say so rather than
                letting a one-second freeze look like a hang. */}
            {isLoading ? "Deriving key…" : "Sign in"}
          </button>

          {!window.isSecureContext && (
            <p className="flex items-start gap-2 text-xs text-[var(--text-faint)] leading-relaxed border-t border-[var(--border)] pt-4">
              <ShieldAlert size={18} className="shrink-0" />
              <span>
                Served over plain HTTP. Your password is never transmitted and
                requests are individually signed, but anyone able to modify
                traffic on this network can still tamper with the page itself.
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
