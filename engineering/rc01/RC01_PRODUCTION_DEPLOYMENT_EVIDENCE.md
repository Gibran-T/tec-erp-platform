# RC01 — Production Deployment Evidence

> Engineering evidence note. No secrets. Not an official `docs/` specification.

## 1. Verdict (this evidence file)

**RC01 DEPLOYED — POST-DEPLOY DEBT REMAINS**

Infrastructure deploy of main SHA `1de000746e3bd98f0b57987c42899acb7a555488` to Railway production succeeded (build, migrate deploy, API/Web health). Authenticated Slice D/E production smoke is **blocked** because no approved production QA/demo identity exists in the production database (seed was intentionally not executed).

## 2. Pre-deploy baseline

| Item | Result |
|------|--------|
| Approved main SHA | `1de000746e3bd98f0b57987c42899acb7a555488` |
| Local main / origin/main | Match |
| PR #14 | Merged — [RC01 — Promote release/rc01 to main](https://github.com/Gibran-T/tec-erp-platform/pull/14) |
| CI on PR head `17397f31` | Success — [run 29839878014](https://github.com/Gibran-T/tec-erp-platform/actions/runs/29839878014) |
| JWT config (pre-fix) | `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` were **MISSING** on `tec-erp-api` |

## 3. JWT configuration (no values)

| Check | Result |
|-------|--------|
| Railway auth | PASS (`railway whoami`) |
| Target | Project `tec-erp` · Environment `production` · Service `tec-erp-api` |
| Generation | Cryptographically secure random · ≥48 bytes each · base64url encoded |
| Set method | `railway variable set … --stdin --skip-deploys` (values never printed) |
| `JWT_ACCESS_SECRET` | PRESENT / VALID |
| `JWT_REFRESH_SECRET` | PRESENT / VALID |
| Secrets different | YES |
| Variable-set triggered deploy? | **No** (`--skip-deploys`) |

Unrelated variables (`DATABASE_URL`, `CORS_ORIGIN`, `NODE_ENV`, `VITE_API_BASE_URL`) were not modified.

## 4. Railway production target

| Item | Value |
|------|-------|
| Project | `tec-erp` (`2b10414d-03ee-4375-af86-4cac4e363a1f`) |
| Environment | `production` (`eea7ceeb-2fdc-437b-a675-e102da6aa9b8`) |
| API service | `tec-erp-api` |
| Web service | `tec-erp-web` |
| Database | `Postgres` (Online) |
| API URL | `https://tec-erp-api-production.up.railway.app` |
| Web URL | `https://tec-erp-web-production.up.railway.app` |
| Deploy mechanism | `railway up` from local tree at exact main SHA (services had no GitHub source connected) |

## 5. Deployment IDs

| Service | Deployment ID | Result | Timestamp (local) |
|---------|---------------|--------|-------------------|
| `tec-erp-api` | `5dcd7902-8a11-4759-a1d7-e792abd2ca76` | SUCCESS | 2026-07-21 11:04:08 -04:00 |
| `tec-erp-web` | `be8460cc-855d-4471-98c9-9c817d0f2026` | SUCCESS | 2026-07-21 11:06:24 -04:00 |

**Deployed content SHA (source tree):** `1de000746e3bd98f0b57987c42899acb7a555488`

## 6. Build / migration / startup

| Check | Result |
|-------|--------|
| Dependency install | PASS (frozen lockfile) |
| Prisma generate (build) | PASS |
| Application build (API/Web) | PASS |
| Migration strategy | `pnpm migrate:deploy` in API start command only |
| Seed in deploy | **Not executed** (not in start command) |
| Migrations applied | PASS — 4 found; applied `rc01_auth_identity`, `rc01_first_day_foundation`, `rc01_mission_discovery` (additive CREATE only) |
| API startup | PASS — `server_started` with `nodeEnv=production` |
| Weak-secret bypass | None observed (production boot succeeded only after JWT secrets set) |
| Secret leakage in reviewed logs | None observed |

## 7. Non-destructive production smoke

| Check | Result |
|-------|--------|
| Web URL loads | PASS (200) |
| Login page French UI | PASS |
| API `/health` | PASS (`status=ok`) |
| Unauthenticated `/api/v1/me/organization` | PASS (401) |
| Unauthenticated `/api/v1/me/missions` | PASS (401) |
| Invalid bearer token | PASS (401) |
| CORS `Access-Control-Allow-Origin` | PASS (official Web origin) |
| Login page 320px overflow | PASS (`overflowX=false`) |
| Login `h1` / `main` | PASS (1 h1, main present) |

## 8. Slice D / E / F authenticated smoke

| Area | Result |
|------|--------|
| Slice D (auth journey / First Day / Mission Center) | **NOT EXECUTED** — blocked |
| Slice E (org ERP authenticated) | **NOT EXECUTED** — blocked |
| Slice F workspace a11y (skip-link/landmarks post-login) | **PARTIAL** — public login a11y/320px only |

### Blocker

**USER ACTION REQUIRED — APPROVED PRODUCTION QA IDENTITY NEEDED**

Canonical demo login (`demo.analyste@nordhabitat.ca`) returns controlled `401 Invalid email or password`. Production DB has RC01 schema but no approved employee identity. Seed was correctly **not** run as part of deploy. Creating an undocumented production account is prohibited.

## 9. Data integrity

| Check | Result |
|-------|--------|
| Seed rerun | No |
| Destructive SQL / reset / truncate | No |
| Real-user mutation | None observed (no authenticated session) |
| Temporary QA residue | N/A — none created |

## 10. Post-deploy observation (short window)

| Check | Result |
|-------|--------|
| API/Web deployments remain SUCCESS | Yes |
| Health remains ok | Yes |
| Crash loop | Not observed |
| Repeated migration execution | Not observed after initial apply |
| 5xx pattern | Not observed in reviewed window |
| Auth failures | Expected 401s only (missing identity / invalid token) |

Long-term stability is **not** claimed from this short window.

## 11. Rollback

| Item | Status |
|------|--------|
| Rollback performed? | **No** |
| Reason | Deploy healthy; remaining debt is identity provisioning, not a crash/health defect |

## 12. Remaining debt

1. **BLOCKER for GREEN:** Provision an owner-approved production QA/demo identity (without undocumented ad-hoc accounts), then complete Slice D/E authenticated smoke.
2. Slice F deferred MINORs (carry-forward): automated 320px pixel suite; prod fail-closed for `DATABASE_URL`/`CORS_ORIGIN`; unreachable English strings; bilingual session-restore copy hygiene.

## 13. Security boundaries honored

- No secret values printed or committed
- No seed / migrate reset / db push / truncate / drop / recreate
- No product source changes on this documentation branch
- `official_documents/site/` untouched

---

*Engineering evidence · RC01 production deployment · 2026-07-21*
