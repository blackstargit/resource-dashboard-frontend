# Resource Dashboard — Frontend

React + TypeScript + Vite dashboard for the [Resource Monitor](../README.md) backend. Renders live CPU, RAM, Disk, and GPU stats over Server-Sent Events, plus a sortable top-processes table.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Recharts (load history chart)
- lucide-react (icons)

## Development

```bash
pnpm install
pnpm dev
```

Runs on `http://localhost:8003` with `/api` requests proxied to the FastAPI backend at `http://127.0.0.1:8202` (see `vite.config.ts`). Start the backend separately (see the [root README](../README.md)) so the proxy has something to talk to.

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

- `VITE_API_URL`: SSE endpoint the dashboard connects to (default: `/api/v1/resources/stats/stream`). Only needed if the backend isn't reachable via the dev proxy (e.g. pointing at a remote host).

## Build

```bash
pnpm build
```

Outputs to `dist/`, which the backend serves directly as static files — no separate frontend server needed in production.

## Project Structure

```
src/
├── App.tsx                    # Main dashboard layout
├── components/
│   ├── StatCard.tsx            # CPU / RAM / Disk / GPU summary tiles
│   ├── GPUCard.tsx              # Per-GPU detail card
│   └── ProcessTable.tsx         # Sortable top-processes table
├── hooks/
│   ├── useResourceStats.ts      # SSE connection + rolling history
│   └── useProcessList.ts        # Polls /api/v1/resources/processes
└── types.ts                    # Shared API response types
```

## Linting

```bash
pnpm lint
```
