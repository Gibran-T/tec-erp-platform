# Versioned Runs — Test Evidence (P1 Closure)

**Date:** 2026-07-22  
**Branch:** `feature/versioned-pedagogical-runs-foundation`  
**Baseline main:** `e8761d852b7bfdfb9f9bf3696e9d493a409f9af6`  
**Worktree:** `C:\Projetos\tec-erp-wt-versioned-runs`  
**PR:** #25 (Draft → Ready only when CI green)

---

## Executed locally (P1 closure)

| Gate | Result | Notes |
|------|--------|-------|
| Frozen install | PASS | `pnpm install --frozen-lockfile` (prior + this wave) |
| Prisma format / validate | PASS | schema valid |
| Empty DB migrate | PASS | `tec_vr_empty` @ localhost:5435 — all 9 migrations including `20260724131000_v1_run_reflections_enabled` |
| Populated DB upgrade | PASS | `tec_vr_populated`; no pending migrations |
| Partial unique ACTIVE index | PASS | `pedagogical_course_run_one_active_per_employee_course` |
| `reflectionsEnabled` column | PASS | boolean NOT NULL DEFAULT false |
| API unit + integration (via `pnpm --filter erp-api test`) | PASS | **174** tests |
| CI integration trio | PASS | database / first-day / mission-discovery (seeded DB) |
| Focused reflection contracts | PASS | `student-reflection.contract.test.ts` |
| Official analytics policy | PASS | `official-run-policy.test.ts` |
| Web full suite | PASS | **83** tests (15 files) |
| Mission catalog | PASS | **4** tests |
| Typecheck API / Web | PASS | |
| Lint (turbo) | PASS | |
| Build (turbo) | PASS | |
| `pnpm env:check` | PASS | 7 required keys / 11 catalog entries |
| `git diff --check` | PASS | CRLF warning only on prisma schema |
| Secret scan (changed files) | PASS | no credentials |
| Reflection smoke (service) | PASS | Run1 reject / Run2 persist / prof+admin read / B denied / official count 1 / **qa_residue=0** |
| Production migrate | **NOT RUN** | Forbidden this wave |
| James integrity hash (read-only) | **MATCH** | `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4` via Railway `DATABASE_PUBLIC_URL` + `james-zero1-snapshot.mjs` |
| Production pedagogical migration | **ABSENT** | `_prisma_migrations` has no pedagogical/reflection entries; James Run 2 absent |

---

## James production integrity (read-only)

| Check | Result |
|-------|--------|
| Employee | `TECERP-2026-PILOT-001` |
| Role | `JR_BUSINESS_ANALYST` |
| Company | `TECERP-PILOT` |
| Completed missions | 30 |
| Course % | 100 |
| Certs | silver:issued, gold:revoked, gold:issued |
| Capstone | submitted |
| Professors | 0 |
| AI interactions | 1 |
| Integrity hash | **exact match** `83dea106…571da4` |
| PedagogicalCourseRun table | not present in production |
| James Run 2 | not present |
| Prod write | none |

---

## Smoke script

`apps/api/scripts/versioned-runs-reflection-smoke.mjs` (local DB only)  
`apps/api/scripts/james-prod-readonly-check.mjs` (production read-only)

---

## Remaining deferred (P2 only)

- Browser-driven visual excellence / curriculum restructuring waves (explicitly out of scope)
- Broader analytics mode selector UX on every dashboard
- Production migration (owner-gated deploy plan)
