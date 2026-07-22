# TEC.ERP V1 — Production Deployment Evidence

**Initial Final Wave deploy (UTC):** 2026-07-21T20:49:09Z
**Hotfix deploy (UTC):** 2026-07-22T04:24:06Z (API `server_started`)
**Authoritative product SHA:** `bca6f462a99a705d9b65ac5f9590b6ee94b4ac32`
**Railway project:** `tec-erp` (`2b10414d-03ee-4375-af86-4cac4e363a1f`)
**Environment:** `production` (`eea7ceeb-2fdc-437b-a675-e102da6aa9b8`)
**PR #18:** Final Wave merge → `fe61083b87ab9526bfc94cfc229eaf2929c22a07`
**PR #19:** Hotfix — Restore Professor Analytics Routes → merge SHA = authoritative product SHA

Secrets, tokens, passwords, and connection strings are intentionally omitted.

## Services (current production)

| Service | Public URL | Deployment ID | Status | Message |
|---------|------------|---------------|--------|---------|
| `tec-erp-api` | https://tec-erp-api-production.up.railway.app | `372a494e-5927-41f4-95d2-312424f31b75` | SUCCESS | V1 hotfix professor analytics bca6f46 |
| `tec-erp-web` | https://tec-erp-web-production.up.railway.app | `653392a3-0039-4305-885b-f6393db020f8` | SUCCESS | V1 hotfix professor analytics bca6f46 |
| Postgres | Railway managed volume `postgres-volume` | — | Online | — |

Prior Final Wave deployments (superseded): API `54dae063-…`, Web `bdf01d07-…` (REMOVED after hotfix).

## Deployed product SHA

CLI upload from local `main` @ `bca6f462a99a705d9b65ac5f9590b6ee94b4ac32` for both API and Web.

## Hotfix scope (PR #19)

| Included | Not included |
|----------|--------------|
| Mount `createAnalyticsProfessorRouter` in `app.ts` | Migrations / schema |
| `GET /analytics/heatmap` + `GET /analytics/competencies` | Seed / secret / config changes |
| Service: cohort-scoped heatmap + deterministic competencies | Unrelated product features |
| API unit/route tests + mission-center test hardening | Real-user data changes |

## Migration result (hotfix redeploy)

API startCommand runs `pnpm migrate:deploy` (no seed).

- Prisma: **7 migrations found / migrate deploy completed successfully** (no new migration in hotfix)
- No pending migration; no schema drift from hotfix

## Local validation (pre-hotfix-deploy @ `bca6f46`)

| Check | Result |
|-------|--------|
| `pnpm install --frozen-lockfile` | PASS |
| lint | PASS (0 errors; known web hooks warning) |
| typecheck | PASS |
| `erp-api` tests | **156 passed** |
| `erp-web` tests | **78 passed** |
| mission-catalog tests | **4 passed** |
| Focused professor analytics tests | **8 passed** |
| Integration tests | **6 passed** |
| build | PASS |
| env:check | PASS |
| `git diff --check` | PASS |

## Pre-deploy production health (before hotfix)

| Check | Result |
|-------|--------|
| API `/health` | 200 |
| Web `/` | 200 |
| Invalid public verify | 404 |
| QA login (no active QA) | 401 |
| Active failed deployment | None |
| Pending migration | None |

## Professor analytics API smoke (production, temporary QA)

Temporary QA via `final-smoke-seed.mjs` + 3 completed mission attempts for `#QA-STU-A`. Credentials never printed.

| Check | Status | Timing (approx.) |
|-------|--------|------------------|
| Professor login | 200 | ~792 ms |
| `GET /api/v1/professor/analytics/heatmap` | 200 | ~181 ms — 2 rows (`#QA-STU-A` completedMissions=3, `#QA-STU-B`) |
| `GET /api/v1/professor/analytics/competencies` | 200 | ~161 ms — 10 modules ordered M1…M10 |
| `GET /api/v1/professor/predictions/:studentId` | 200 | ~183 ms |
| Student detail (assessments embedded) | 200 | ~160 ms |
| Cohorts / students / audit / AI interactions / export.csv | 200 | 132–202 ms |
| Student → heatmap / competencies | **403** | ~104–142 ms |
| Unauthenticated → heatmap / competencies | **401** | ~95–134 ms |
| Professor KPI with EQUINOXE-QA `companyId` | **403** | ~147 ms |
| Heatmap non-QA rows | **0** | — |
| Stack / secret leakage | None | — |
| Admin `/admin/system-status` | 200 | ~219 ms |

## Professor browser smoke (production Web)

| Step | Result |
|------|--------|
| Professor login | PASS |
| Open Portail professeur | PASS — cohort `QA Final Wave Cohort — 2 etudiants` |
| Direct route reload `/workspace/apps/portail-professeur` | PASS — no 404, no blank page |
| Student roster | PASS — Etudiant QA A missions 3 / QA B missions 0 |
| Student detail + assessment analytics | PASS — progression 90% rows; assessments empty controlled |
| Analytics tab — heatmap / competencies sections | PASS — sections visible; network **200** (2 heatmap rows, 10 competencies); no missing-endpoint failure |
| Predictions / Audit / Exporter CSV control | PASS |
| Former blocker (analytics 404) | **CLOSED** |

## Focused regression smoke

| Actor | Result |
|-------|--------|
| Student login + workspace | PASS |
| Student `/api/v1/me/course`, inbox, dashboards | 200 |
| AI Coach fallback `POST /api/v1/me/ai-coach/ask` | 200 |
| Student Portail professeur UI | “Acces reserve aux comptes professeur.” |
| Student professor API | 403 |
| Public health / Web / invalid verify | 200 / 200 / 404 |

## QA identities (hotfix validation)

| Created | Count |
|---------|-------|
| QA employees (`#QA-*`) | 4 (admin, professor, student A, student B) |
| QA cohorts | 2 (`QA-FINAL`, `QA-EQUINOXE`) |
| Temporary company | 1 (`EQUINOXE-QA`) |
| Temporary mission attempts | 3 (student A) |

## QA cleanup / residue

After `final-smoke-seed.mjs --cleanup`:

```json
{"qaEmployees":0,"qaCohorts":0,"equinoxe":0,"qaAttempts":0,"qaAssessment":0}
```

QA login after cleanup: **401**.
**QA RESIDUE = 0**

## Post-cleanup health

| Check | Result |
|-------|--------|
| API `/health` | 200 (~360 ms) |
| Web `/` | 200 (~252 ms) |
| Public verify invalid | 404 |
| QA login | 401 |
| API / Web deployments | SUCCESS (IDs unchanged) |
| Production seed | Not run |
| Real-user records | Not modified (prefix-scoped QA only) |

## Warnings (non-blocking)

1. Professor Analytics UI list labels still prefer legacy fields (`label` / `intensity` / `competencyKey`); API returns `displayName` / `completedMissions` / `moduleCode` / `title` / `coveragePercent`. Rows load with correct counts (2 / 10) and endpoints return 200; label text may show `undefined` until a follow-up display mapping fix (out of hotfix SHA scope).
2. Student UI chrome still lists Professor/Admin apps as “Accès actif”; API authorization still rejects (403).
3. Pre-existing eslint `react-hooks/exhaustive-deps` warning in `MissionInteractions.tsx`.

## Final verdict linkage

See `V1_PRODUCTION_RELEASE_CHECKPOINT.md`.
