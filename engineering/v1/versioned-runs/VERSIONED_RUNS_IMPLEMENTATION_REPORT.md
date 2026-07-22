# TEC.ERP — Versioned Pedagogical Runs Foundation · Implementation Report

**Worktree:** `C:\Projetos\tec-erp-wt-versioned-runs`  
**Git branch:** `feature/versioned-pedagogical-runs-foundation`  
**Baseline `main`:** `e8761d8` (Merge PR #23 Zero1 remediation production checkpoint)  
**Authoritative product SHA (pre-foundation):** `2378b2b` (Merge PR #22 Zero1 pre-cohort)  
**Design input:** PR #24 (design only)  
**PR:** #25  
**Official `docs/`:** not modified

---

## 1. Objective delivered

Establish an additive **PedagogicalCourseRun** foundation so TEC.ERP can version pedagogical attempts without destroying Zero1 / Run 1 history, with FR presentation labels, run-scoped learning FKs, ACTIVE-run write gating, official cohort analytics (no double count), typed reflection enablement, complete run-scoped student reflection workflow, and certificate provenance.

---

## 2. Artifacts implemented (code)

| Area | Paths |
|------|-------|
| Schema + migrations | `packages/database-erp/prisma/schema.prisma`, `.../20260724120000_v1_pedagogical_course_runs`, `.../20260724131000_v1_run_reflections_enabled` |
| Contracts | `packages/contracts/src/pedagogical-run.ts` (+ `AnalyticsMode`, reflection schemas) |
| API module | `apps/api/src/modules/pedagogical-run/*` |
| Official analytics | `apps/api/src/modules/analytics/official-run-policy.ts` + heatmap/competencies/professor list wiring |
| App mounts | `apps/api/src/app.ts` — me / professor / admin routers |
| Consumers | mission / course / assessment / capstone / unlock / certification / ai-coach / professor |
| Web | run banner, `MissionReflectionForm`, Admin/Professor reflection panels |
| Smoke / integrity scripts | `apps/api/scripts/versioned-runs-reflection-smoke.mjs`, `james-prod-readonly-check.mjs` |

---

## 3. Behavioural summary

- Run types / statuses as previously documented  
- Legacy backfill → Run 1; James → `TECERP-PILOT-001-RUN1` via cohort+employeeNumber in SQL only  
- Learning data scoped by run; AI nullable; certificates `sourceRunId` + `achievementType`  
- Resolution precedence + writable ACTIVE only  
- FR labels in contracts / `mapRun` / banner / reflection form  
- Institutional default `OFFICIAL_COHORT_RESULT` with deterministic precedence  
- Reflections: create/read/list/update; ACTIVE + `reflectionsEnabled`; isolation matrix enforced  
- Silver/Gold refuse second active issued cert; no auto-revoke of Run 1  

---

## 4. Explicit non-delivery / deferred P2

| Item | Status |
|------|--------|
| James Run 2 in production | **Not created** |
| Auto Railway deploy / prod migrate | **Not performed** |
| Official product doc updates under `docs/` | **Deferred** |
| Visual excellence / curriculum restructuring waves | **Out of scope** |
| Universal analytics mode selector UX | **P2** |
| Fully reversible down migration | **Not provided** — backup restore required |

---

## 5. P1 closure status

See `VERSIONED_RUNS_TEST_EVIDENCE.md`. Local gates green; James integrity hash exact match; production pedagogical migration absent. PR #25 remains non-merged / non-deployed.
