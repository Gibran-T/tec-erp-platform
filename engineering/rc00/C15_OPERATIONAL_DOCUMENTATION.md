# C15 — Operational Documentation

**Milestone:** RC00 · Milestone 4 — Production Readiness  
**Scope:** Engineering operations index for RC00 platform foundation  
**Status:** Implemented on branch `feature/rc00-production-readiness`

---

## Purpose

This index consolidates RC00 operational knowledge outside protected `docs/` specifications. Official product and deployment methodology remains in `docs/21`, `docs/24`, and `docs/25`.

---

## RC00 Engineering Artifacts

| Document | Content |
|----------|---------|
| [C12 — Development & Environment](./C12_DEVELOPMENT_ENVIRONMENT.md) | Local setup, env catalog, dev scripts |
| [C13 — CI/CD Foundation](./C13_CI_CD_FOUNDATION.md) | GitHub Actions, quality gates |
| [C14 — Railway Production Readiness](./C14_RAILWAY_PRODUCTION_READINESS.md) | Railway topology, migrations, smoke tests |
| [C16 — Production Readiness Review](./C16_PRODUCTION_READINESS_REVIEW.md) | Approval Gate report |

---

## Secret Inventory (Names Only)

| Name | Classification | Service |
|------|----------------|---------|
| `DATABASE_URL` | server_secret | erp-api |
| `JWT_ACCESS_SECRET` | server_secret | erp-api (scaffold) |
| `RAILWAY_TOKEN` | server_secret | GitHub Actions |
| `RAILWAY_ERP_API_SERVICE_ID` | server_config | GitHub Actions |
| `RAILWAY_ERP_WEB_SERVICE_ID` | server_config | GitHub Actions |
| `STAGING_API_BASE_URL` | server_config | GitHub Actions |
| `STAGING_WEB_BASE_URL` | server_config | GitHub Actions |

No secret values are stored in the repository.

---

## Incident Response (RC00 Baseline)

1. Check Railway service status and deployment logs
2. Verify `/health` and `/ready` on erp-api
3. Confirm PostgreSQL plugin connectivity
4. Roll back to previous Railway deployment if needed
5. Escalate per institutional process (`docs/21` runbooks — read-only)

---

## Rollback Procedure (Staging)

1. Open Railway project `tec-erp`
2. Select failing service (erp-api or erp-web)
3. Deployments → select last known good deployment → Redeploy
4. Run smoke tests: `pnpm smoke:test`
5. Document incident in release notes

---

## Developer Onboarding Checklist

- [ ] Clone repository
- [ ] Install Node 22 + pnpm 9
- [ ] `pnpm install`
- [ ] Copy `.env.example` → `.env`
- [ ] Start PostgreSQL locally
- [ ] `pnpm migrate:deploy`
- [ ] `pnpm env:check`
- [ ] `pnpm dev`
- [ ] `pnpm dev:bootstrap --check-services`
- [ ] Verify home page shows API connectivity

---

## Monitoring (Deferred Post-RC00)

- Application metrics dashboards
- Error rate alerting
- Database connection pool monitoring
- Uptime checks beyond smoke tests

---

## References

- `docs/21_PLATFORM_OPERATIONS_PLAYBOOK.md`
- `docs/24_RELEASE_MANAGEMENT.md`
- `docs/25_DEPLOYMENT_GUIDE.md`
- ADR-PLATFORM-001 §14–15
