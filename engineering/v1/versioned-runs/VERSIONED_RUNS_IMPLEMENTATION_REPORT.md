# TEC.ERP — Versioned Pedagogical Runs Foundation · Implementation Report

**Worktree:** `C:\Projetos\tec-erp-wt-versioned-runs`  
**Git branch:** `feature/versioned-pedagogical-runs-foundation`  
**Baseline `main`:** `e8761d8` (Merge PR #23 Zero1 remediation production checkpoint)  
**Authoritative product SHA (pre-foundation):** `2378b2b` (Merge PR #22 Zero1 pre-cohort)  
**Design input:** PR #24 (design only)  
**Official `docs/`:** not modified

---

## 1. Objective delivered

Establish an additive **PedagogicalCourseRun** foundation so TEC.ERP can version pedagogical attempts without destroying Zero1 / Run 1 history, with FR presentation labels, run-scoped learning FKs, ACTIVE-run write gating, unique-student analytics default, and certificate provenance.

---

## 2. Artifacts implemented (code)

| Area | Paths |
|------|-------|
| Schema + migration | `packages/database-erp/prisma/schema.prisma`, `.../migrations/20260724120000_v1_pedagogical_course_runs/migration.sql` |
| Contracts | `packages/contracts/src/pedagogical-run.ts` (+ export from `index.ts`) |
| API module | `apps/api/src/modules/pedagogical-run/*` (service, routes, resolution, ALS context, with-employee-run, unit test) |
| App mounts | `apps/api/src/app.ts` — me / professor / admin routers |
| Consumers | mission / course / assessment / capstone / unlock / certification / ai-coach / professor services & handlers |
| Web | `PedagogicalRunBanner`, `api/pedagogical-runs.ts`, workspace layout + banner test |

---

## 3. Behavioural summary

- Run types: `AUTONOMOUS` \| `INSTRUCTOR_LED` \| `REMEDIATION` \| `DEMONSTRATION`  
- Statuses: `PLANNED` \| `ACTIVE` \| `PAUSED` \| `COMPLETED` \| `CANCELLED` \| `ARCHIVED`  
- Legacy backfill → Run 1; James → `TECERP-PILOT-001-RUN1` via cohort+employeeNumber in SQL only  
- Learning data scoped by run; AI nullable; certificates `sourceRunId` + `achievementType`  
- Resolution precedence + writable ACTIVE only  
- FR labels in contracts / `mapRun` / banner  
- Unique-student institutional metric endpoint  
- Silver/Gold refuse second active issued cert; no auto-revoke of Run 1  

---

## 4. Explicit non-delivery

| Item | Status |
|------|--------|
| James Run 2 in production | **Not created** (forbidden this wave) |
| Auto Railway deploy | **Not performed** |
| Official product doc updates under `docs/` | **Deferred** (engineering pack only) |
| Closed Approval Gate | **Open** — see test evidence |
| Fully reversible down migration | **Not provided** — backup restore required |

---

## 5. Risk register (residual)

| Risk | Mitigation |
|------|------------|
| Production migrate without backup | Deployment plan hard-stops |
| App deploy before migrate | Ordered cutover |
| Analytics double-count if callers ignore mode | Policy + default metric algorithm |
| Incomplete test execution | Gate remains OPEN |
| Special-casing James in future TS | Code review: relational only |

---

## 6. Next recommended steps

1. Run targeted unit suites; attach evidence to `VERSIONED_RUNS_TEST_EVIDENCE.md`  
2. Migrate disposable / staging DB; execute VR-M0x manual cases  
3. Owner approval + backup → production migrate per deployment plan  
4. Separate owner-approved wave for any instructor-led Run 2 (not this foundation)  
5. Optional later: align official `docs/17` / `docs/18` with owner approval  

---

## 7. Engineering documentation pack

All files under `engineering/v1/versioned-runs/`:

1. Architecture  
2. Migration plan  
3. Data integrity  
4. API contract  
5. Analytics policy  
6. Certification policy  
7. Security model  
8. Test evidence  
9. Implementation report (this file)  
10. Production deployment plan  
