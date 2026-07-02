# C14 — Railway Production Readiness

**Milestone:** RC00 · Milestone 4 — Production Readiness  
**Scope:** Railway service configuration, migration discipline, health checks  
**Status:** Implemented on branch `feature/rc00-production-readiness`

---

## Overview

TEC.ERP deploys to Railway project **`tec-erp`** with isolated PostgreSQL (RAIL-006 — separate from TEC.WMS). RC00 validates staging readiness; production promotion requires institutional release process.

---

## Railway Topology

```text
Railway Project: tec-erp

├── Service: erp-api
│   ├── Config: apps/api/railway.toml
│   ├── Build: pnpm turbo build --filter=erp-api
│   ├── Start: pnpm migrate:deploy && node apps/api/dist/index.js
│   ├── Health: GET /health
│   └── Ready: GET /ready
│
├── Service: erp-web
│   ├── Config: apps/web/railway.toml
│   ├── Build: pnpm turbo build --filter=erp-web
│   ├── Start: pnpm --filter erp-web start (serve static dist)
│   └── Health: GET /
│
└── Plugin: PostgreSQL
    └── DATABASE_URL → erp-api (encrypted)
```

---

## Deployment Rules (RC00)

| Rule | Implementation |
|------|----------------|
| RAIL-001 | Every PR deployable — CI build + env-check |
| RAIL-002 | Health check on API — `/health` in railway.toml |
| RAIL-003 | `prisma migrate deploy` before API start |
| RAIL-004 | Deployment logs reviewed post-deploy (operational) |
| RAIL-005 | Rollback plan documented (C15 operations) |
| RAIL-006 | Separate Railway project from WMS |

---

## Environment Matrix

| Environment | Railway | Purpose |
|-------------|---------|---------|
| Development | Optional | Local / shared experiments |
| Staging | Required (RC00 exit) | Pre-production validation |
| Production | Required | Institutional use — Release Candidate only |

---

## Railway Variables (erp-api)

| Variable | Classification | Required |
|----------|----------------|----------|
| `DATABASE_URL` | server_secret (encrypted) | Yes |
| `NODE_ENV` | server_config | Yes (`production`) |
| `PORT` | server_config | Injected by Railway |
| `CORS_ORIGIN` | server_config | Yes (staging web URL) |
| `LOG_LEVEL` | server_config | Recommended |
| `JWT_ACCESS_SECRET` | server_secret | Scaffold — before auth sprint |

## Railway Variables (erp-web)

| Variable | Classification | Required |
|----------|----------------|----------|
| `PORT` | server_config | Injected by Railway |
| `VITE_API_BASE_URL` | client_public | Yes (build-time) |

**Note:** `VITE_*` variables must be set at build time for Vite. Configure in Railway web service build environment.

---

## Migration Workflow

1. Review migration in PR
2. CI integration job applies to empty PostgreSQL
3. Railway start command runs `pnpm migrate:deploy`
4. API `/ready` confirms database connectivity

Initial migration: `packages/database-erp/prisma/migrations/20250701000000_init_platform_schema/`

---

## Smoke Tests

Post-deploy validation via `scripts/smoke-test.ts`:

```bash
SMOKE_API_BASE_URL=https://<api-staging> \
SMOKE_WEB_BASE_URL=https://<web-staging> \
pnpm smoke:test
```

Checks: `/health`, `/ready`, `/version`, web load.

---

## RC00 Deferrals

- Production deploy workflow (`deploy-production.yml`)
- Monitoring dashboards and alerting
- Auto-scaling configuration
- Custom domain and TLS (Railway default during RC00)

---

## References

- ADR-PLATFORM-001 §14 Railway Strategy
- `apps/api/railway.toml`
- `apps/web/railway.toml`
- `scripts/migrate-deploy.ts`
- `docs/25_DEPLOYMENT_GUIDE.md` (read-only)
