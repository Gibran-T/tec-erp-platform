# C12 — Development & Environment

**Milestone:** RC00 · Milestone 4 — Production Readiness  
**Scope:** Local development workflow, environment catalog, bootstrap validation  
**Status:** Implemented on branch `feature/rc00-production-readiness`

---

## Overview

RC00 C12 establishes the institutional development environment contract for TEC.ERP. All variables are documented in `.env.example`, validated in CI via `scripts/validate-env.ts`, and classified per ADR-PLATFORM-001 §13.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22.x (see `.node-version`) |
| pnpm | ≥ 9.0.0 |
| PostgreSQL | 16+ (local or Docker) |

---

## Quick Start

```bash
pnpm install
cp .env.example .env
# Edit DATABASE_URL and other values as needed
pnpm env:check
pnpm dev
```

In separate terminals (or via turbo `pnpm dev`):

| Service | Default URL | Package |
|---------|-------------|---------|
| erp-api | http://localhost:3000 | `apps/api` |
| erp-web | http://localhost:5173 | `apps/web` |

---

## Environment Variables

| Variable | Class | Owner | Description |
|----------|-------|-------|-------------|
| `NODE_ENV` | server_config | API | Runtime environment |
| `PORT` | server_config | API | API listen port |
| `CORS_ORIGIN` | server_config | API | Must match web origin |
| `LOG_LEVEL` | server_config | API | Log verbosity |
| `DATABASE_URL` | server_secret | API/DB | PostgreSQL connection |
| `VITE_API_BASE_URL` | client_public | Web | API base URL |
| `FEATURE_AI_COACH_ENABLED` | feature_flag | Platform | Default `false` in RC00 |
| `JWT_ACCESS_SECRET` | server_secret | Auth (deferred) | Scaffold only — commented in example |

**Rule:** Secrets never use `VITE_*` prefix (ADR §13, docs/26).

---

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm env:check` | Validate `.env.example` against catalog |
| `pnpm dev:bootstrap` | Bootstrap validation (env catalog) |
| `pnpm dev:bootstrap --check-services` | Also probe running API/web |
| `pnpm dev` | Start all dev tasks via Turborepo |
| `pnpm migrate:deploy` | Apply Prisma migrations (requires `DATABASE_URL`) |

---

## API ↔ Web Coordination

| API | Web |
|-----|-----|
| `PORT=3000` | — |
| `CORS_ORIGIN=http://localhost:5173` | Web dev server origin |
| — | `VITE_API_BASE_URL=http://localhost:3000` |

The home page (`apps/web/src/pages/HomePage.tsx`) calls `GET /health` to prove API connectivity.

---

## RC00 Deferrals

- Authentication flows and JWT validation
- AI Coach runtime configuration
- Production secret rotation procedures
- Docker Compose local stack (optional future enhancement)

---

## References

- ADR-PLATFORM-001 §13 Configuration Strategy
- `scripts/env-catalog.ts` — canonical variable registry
- `docs/25_DEPLOYMENT_GUIDE.md` — deployment methodology (read-only)
