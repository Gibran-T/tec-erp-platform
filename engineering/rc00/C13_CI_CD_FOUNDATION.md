# C13 — CI/CD Foundation

**Milestone:** RC00 · Milestone 4 — Production Readiness  
**Scope:** GitHub Actions quality pipeline and staging deploy scaffold  
**Status:** Implemented on branch `feature/rc00-production-readiness`

---

## Overview

CI/CD follows ADR-PLATFORM-001 §15 and `docs/19` §9 Approval Gate integration. Every pull request and push to `main` runs the quality pipeline. Staging deployment is manual via workflow dispatch.

---

## Workflows

### `ci.yml`

**Trigger:** `pull_request`, push to `main`

| Job | Steps |
|-----|-------|
| **quality** | install → lint → typecheck → test → build → env-check |
| **integration** | PostgreSQL 16 service → build → migrate deploy → integration tests |

Integration job validates RAIL-003 (migrations before API readiness) against an empty test database.

### `deploy-staging.yml`

**Trigger:** `workflow_dispatch` with confirmation token `deploy-staging`

| Step | Description |
|------|-------------|
| Pre-deploy gate | lint, typecheck, test, build, env-check |
| Railway deploy | erp-api and erp-web (requires secrets) |
| Smoke tests | `pnpm smoke:test` against staging URLs |

---

## Required GitHub Secrets (Staging)

| Secret | Purpose |
|--------|---------|
| `RAILWAY_TOKEN` | Railway CLI authentication |
| `RAILWAY_ERP_API_SERVICE_ID` | API service identifier |
| `RAILWAY_ERP_WEB_SERVICE_ID` | Web service identifier |
| `STAGING_API_BASE_URL` | Post-deploy smoke — API |
| `STAGING_WEB_BASE_URL` | Post-deploy smoke — Web |

When secrets are not configured, deploy and smoke steps exit 0 with scaffold skip message (RC00 local validation path).

---

## Quality Gates (V1)

| Gate | Threshold |
|------|-----------|
| Build | Must pass |
| Lint | Zero errors |
| Typecheck | Zero errors |
| Unit tests | 100% pass |
| Integration tests | 100% pass (when DATABASE_URL set) |
| Migration | Clean apply on empty DB |
| Env catalog | `pnpm env:check` pass |

---

## Turborepo Integration

CI uses root scripts (`pnpm lint`, `pnpm test`, etc.) which delegate to Turborepo task graph. Dependency order is enforced by `turbo.json`.

PR optimization (affected-only builds) is deferred to post-RC00 — full monorepo build runs on `main`.

---

## RC00 Deferrals

- `deploy-production.yml` — manual institutional approval (post-RC00)
- Affected-only PR builds (`turbo --filter=...[origin/main]`)
- Production promotion automation

---

## References

- ADR-PLATFORM-001 §15 CI/CD Foundation
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-staging.yml`
- `docs/24_RELEASE_MANAGEMENT.md` — release lifecycle (read-only)
