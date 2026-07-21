# TEC.ERP V1 — Production Deployment Evidence

**Deployment timestamp (UTC):** 2026-07-21T20:49:09Z (API `server_started`)  
**Baseline / product commit:** `fe61083b87ab9526bfc94cfc229eaf2929c22a07`  
**Railway project:** `tec-erp` (`2b10414d-03ee-4375-af86-4cac4e363a1f`)  
**Environment:** `production` (`eea7ceeb-2fdc-437b-a675-e102da6aa9b8`)  
**PR #18:** merged 2026-07-21T20:36:13Z → merge SHA = baseline  

Secrets, tokens, passwords, and connection strings are intentionally omitted.

## Services

| Service | Public URL | Deployment ID | Status |
|---------|------------|---------------|--------|
| `tec-erp-api` | https://tec-erp-api-production.up.railway.app | `54dae063-f97b-4209-8084-80c22e671a20` | SUCCESS |
| `tec-erp-web` | https://tec-erp-web-production.up.railway.app | `bdf01d07-1275-448b-b62a-33922e586d3f` | SUCCESS |
| Postgres | Railway managed volume `postgres-volume` | — | Online |

## Deployed product SHA

CLI upload from local `main` @ `fe61083b87ab9526bfc94cfc229eaf2929c22a07` for both API and Web.

## Migration result (production)

API startCommand runs `pnpm migrate:deploy` (no seed).

- Prisma: **7 migrations found / migrate deploy completed successfully**
- Production probe after deploy: migrations=7, modules=10, missions=30, company=`NORDHABITAT`

## Configuration review (presence only)

| Item | Result |
|------|--------|
| Project / environment | `tec-erp` / `production` |
| API + Web + Postgres services | Present / Online |
| `NODE_ENV` | `production` (API + Web) |
| `DATABASE_URL` (API) | Present (internal Postgres) |
| `DATABASE_PUBLIC_URL` (Postgres) | Present (TCP proxy; used only for controlled QA probe/cleanup) |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Present / different |
| `CORS_ORIGIN` | Present → production Web origin |
| `VITE_API_BASE_URL` | Present → production API origin |
| AI provider credentials | Absent (fallback path required) |
| Seed in startCommand | Absent (`migrate:deploy` + `node …` only) |
| Volume / restore capability | Postgres volume present |

## Local validation (pre-deploy)

| Check | Result |
|-------|--------|
| `pnpm install --frozen-lockfile` | PASS |
| lint | PASS (0 errors; 1 known web hooks warning) |
| typecheck | PASS |
| `erp-api` tests | **148 passed** |
| `erp-web` tests | **78 passed** |
| mission-catalog tests | **4 passed** |
| build | PASS |
| env:check | PASS (7 required keys) |
| Empty DB migrate (RC01→Wave1→Wave2→Final) | PASS — 7 migrations |
| Local Final smoke `--cleanup` | **90/90 PASS**, residue 0 |

## Migration safety summary

Final Wave migration `20260723180000_v1_final_m7_m10_gold`:

- Additive CREATE TABLE / FK / indexes
- Catalog INSERTs for modules M7–M10, mission definitions, Gold assessment, dashboards, KPI formula versions, automation rules
- No `DROP TABLE` / `DROP COLUMN` / `TRUNCATE` / mass user updates
- No production user seed in deploy path

## Production unauthenticated smoke

| Check | Status | Timing |
|-------|--------|--------|
| API `/health` | 200 | 314 ms (post-deploy); 132 ms (post-cleanup) |
| Web `/` | 200 | 234–244 ms |
| Invalid login | 401 | controlled |
| Public verify invalid token | 404 | 101–186 ms |
| Stack/secret exposure | None observed in responses | — |

## Production authenticated API smoke

Script: `pnpm --filter erp-api smoke:final -- --cleanup`  
`API_BASE_URL=https://tec-erp-api-production.up.railway.app`  
Temporary QA prefix `#QA-` / `QA-*` / `EQUINOXE-QA`

**Result: 90/90 PASS** including:

- Admin: companies, AI toggle, scenario draft/publish, mock integration, automation
- Student A: First Day, M1–M10 (30 missions), Silver, dashboards, AI coach, Capstone, Gold assessment
- Student B: isolation (cross-company 403, professor/admin 403, locked mission 409)
- Professor: cohort, detail, AI interactions, predictions, Capstone approve, Gold issue/revoke/reissue, CSV, audit
- Public verify: valid / revoked / invalid

## Browser smoke (production Web)

| Actor | Evidence |
|-------|----------|
| Student A | Login → workspace; skip link present; Mission Center; Dashboards; AI Coach FR fallback response; logout → login |
| Professor | Login → Portail professeur loads; **blocker**: UI refresh hits missing analytics routes (see below) |
| Admin | Covered by API smoke (companies/AI/scenario/integration/automation); browser admin not re-run after QA cleanup |

Responsive: 320px viewport on dashboards — `overflowX=false`, `scrollWidth=320`.  
A11y: skip link “Passer au contenu principal”, `main`, `nav` present on student surfaces.

## Blocker observed in production

Professor portal `Promise.all` refresh calls:

- `GET /api/v1/professor/analytics/heatmap` → **404**
- `GET /api/v1/professor/analytics/competencies` → **404**

Core professor APIs used by smoke (`/cohorts`, `/students`, `/ai-interactions`, `/predictions/:id`, `/capstone/submissions`, Gold, audit, CSV) return **200**.

Hotfix branch (not deployed): `hotfix/v1-professor-analytics-routes` @ `e2f2ece`  
Compare: https://github.com/Gibran-T/tec-erp-platform/compare/main...hotfix/v1-professor-analytics-routes?expand=1

## QA identities

| Created | Count |
|---------|-------|
| QA employees (`#QA-*`) | 4 (admin, professor, student A, student B) |
| QA cohorts | 2 (`QA-FINAL`, `QA-EQUINOXE`) |
| Temporary company | 1 (`EQUINOXE-QA`) |

## QA cleanup / residue

After cleanup probe:

```json
{"qaEmployees":0,"qaCohorts":0,"equinoxe":0,"qaCerts":0,"qaCapstone":0,"qaAi":0,"qaAttempts":0,"companies":["NORDHABITAT"]}
```

QA login after cleanup: **401**.  
**QA RESIDUE = 0**

## Post-cleanup health

- API health 200
- Web 200
- Public verify invalid 404
- Deployed services remain SUCCESS
- No production seed executed
- Real-user records not targeted by QA scripts (prefix-scoped cleanup only)

## Warnings

1. Web app registry shows Professor/Admin apps as “Accès actif” for student role in UI chrome; API authorization still rejects student calls (403) — UX clarity warning, not auth bypass.
2. Known eslint `react-hooks/exhaustive-deps` warning in `MissionInteractions.tsx` (pre-existing).
3. Full browser completion of all 30 missions was not re-executed in UI (API smoke completed all 30 on production).

## Final verdict linkage

See `V1_PRODUCTION_RELEASE_CHECKPOINT.md`.
