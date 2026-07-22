# TEC.ERP — Versioned Pedagogical Runs · Migration Plan

**Migration:** `packages/database-erp/prisma/migrations/20260724120000_v1_pedagogical_course_runs`  
**Nature:** Additive, non-destructive (no learning-history `DELETE`)  
**Baseline `main`:** `e8761d8` · Product SHA: `2378b2b`  
**Deploy rule:** Owner-gated only — see `VERSIONED_RUNS_PRODUCTION_DEPLOYMENT_PLAN.md`

---

## 1. Preconditions

| Check | Required |
|-------|----------|
| PostgreSQL backup taken and verified restorable | **Mandatory** before production migrate |
| API/Web deploy paused or coordinated (no auto-deploy) | Yes |
| Prisma schema in deploy artifact matches migration | Yes |
| Empty DB and populated pilot DB both supported | Yes (migration designed for both) |

---

## 2. Step sequence (as implemented in `migration.sql`)

1. **Create tables**  
   `pedagogical_course_run`, `pedagogical_course_run_audit`, `professor_intervention`, `student_mission_reflection`  
   Indexes: unique `runCode`; unique `(employeeId, courseId, runSequence)`; partial unique one ACTIVE per employee+course.

2. **Add nullable FK columns** on learning tables + `certificate.sourceRunId` / `certificate.achievementType`.

3. **Ensure default course** `TEC-ERP-V1` (`course_tec_erp_v1`) if missing.

4. **Backfill Run 1** for every employee with any of: course/module progress, mission/assessment attempts, unlock, capstone, certificate, AI interaction.  
   Status heuristic: `COMPLETED` if course 100%/completed; else `ACTIVE` if progress or attempts exist; else `PLANNED`.  
   Metadata: `{ legacyBackfill: true, baselineRun: "RUN1_AUTONOMOUS" }`.

5. **Attach existing rows** to that employee’s `runSequence = 1`.

6. **SET NOT NULL** on required learning FKs (AI remains nullable).

7. **Replace uniqueness indexes** (drop old employee-scoped uniques; create run-scoped uniques + indexes).

8. **Add FKs** — learning tables `ON DELETE RESTRICT`; AI / certificate source `ON DELETE SET NULL`.

9. **Audit rows** `action = legacy_backfill` for each Run 1.

---

## 3. James Run 1 code assignment

Inside the backfill `INSERT` only (SQL `CASE`):

```
WHEN cohort_code = 'TECERP-PILOT-001'
 AND employeeNumber = 'TECERP-2026-PILOT-001'
THEN 'TECERP-PILOT-001-RUN1'
```

Application services never special-case James. Do **not** create Run 2 in production as part of this migration.

---

## 4. Application cutover order

1. Backup production DB  
2. Deploy API that includes schema + migration + run-aware repositories  
3. Run `pnpm migrate:deploy` (Railway startCommand or controlled one-shot)  
4. Deploy Web (banner + run selector)  
5. Smoke: list Run 1 for James relationally; write blocked without ACTIVE; unique-student metric = 1 for multi-run student (when multi-run exists in non-prod)  
6. Owner sign-off

Recommended: migrate + API first so Web never talks to a pre-run API after schema change.

---

## 5. Rollback

| Layer | Action |
|-------|--------|
| Application | Redeploy previous API/Web artifact (`main` @ `e8761d8` / product `2378b2b` as appropriate) |
| Database | **Restore from pre-migration backup** |

There is **no complete down migration**. Restoring uniqueness to pre-run columns after data has been written under new uniques is unsafe without backup. Do not attempt hand-rolled reverse SQL in production.

---

## 6. Validation queries (post-migrate)

```sql
-- Every progress/attempt row has a run
SELECT COUNT(*) FROM mission_attempt WHERE "pedagogicalCourseRunId" IS NULL; -- expect 0

-- James Run 1 (relational)
SELECT r."runCode", r."runSequence", r."status"
FROM pedagogical_course_run r
JOIN employee e ON e.id = r."employeeId"
JOIN cohort c ON c.id = r."cohortId"
WHERE c.code = 'TECERP-PILOT-001'
  AND e."employeeNumber" = 'TECERP-2026-PILOT-001'
  AND r."runSequence" = 1;
-- expect runCode TECERP-PILOT-001-RUN1

-- No Run 2 created by migration
SELECT COUNT(*) FROM pedagogical_course_run WHERE "runSequence" >= 2; -- expect 0 immediately after migrate
```

---

## 7. Out of scope

- Seeding instructor-led Run 2 for James  
- Automatic certificate re-issue / revoke on migrate  
- Official `docs/` schema updates (flag for later owner-approved doc wave)
