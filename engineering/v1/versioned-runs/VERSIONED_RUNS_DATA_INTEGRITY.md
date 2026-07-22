# TEC.ERP — Versioned Pedagogical Runs · Data Integrity

**Baseline `main`:** `e8761d8` · Product SHA: `2378b2b`  
**Migration:** `20260724120000_v1_pedagogical_course_runs`

---

## 1. Invariants

| ID | Invariant |
|----|-----------|
| DI-01 | Learning history is never deleted by this foundation |
| DI-02 | At most one `ACTIVE` pedagogical run per `(employeeId, courseId)` (partial unique index) |
| DI-03 | `(employeeId, courseId, runSequence)` is unique |
| DI-04 | `runCode` is globally unique |
| DI-05 | Progress / attempts / unlock / assessment / capstone rows always reference a run (NOT NULL) |
| DI-06 | AI interactions may omit run (`NULL` allowed) |
| DI-07 | Certificates keep issued rows; provenance via `sourceRunId` + `achievementType` |
| DI-08 | Writes (mission submit, assessment, unlock, capstone mutate) require an ACTIVE run context |
| DI-09 | Completing a run requires ≥ 30 `mission_attempt` with `status = completed` on **that** run |
| DI-10 | Creating a new run does not clone prior attempts — empty slate at `PLANNED` |

---

## 2. Backfill integrity

For each learner with activity:

1. Exactly one Run 1 (`runSequence = 1`) is inserted if missing  
2. All pre-existing learning rows for that employee attach to that Run 1  
3. Certificates without `sourceRunId` receive Run 1 id; `achievementType` defaults from `certificateType` when null  
4. Audit `legacy_backfill` records the operation  

Empty tables: `SET NOT NULL` succeeds (zero null rows). Fresh enrollments after migrate must create/activate a run before writes.

---

## 3. Isolation between runs

Two runs for the same student may coexist with independent:

- Course / module progress  
- Mission attempt numbering (unique includes run id)  
- Unlock state  
- Assessment attempts  
- Capstone submission  

Comparison API (`compare`) reads both scopes without merging scores into a single progressive record.

---

## 4. Lineage

`sourceRunId` optionally links a new run to a prior pedagogical run of the **same student** (validated in `createRun`). Lineage is informational — it does not copy data or revoke certificates.

---

## 5. Failure modes & protections

| Risk | Protection |
|------|------------|
| Two ACTIVE runs | Partial unique index + service conflict on start/resume |
| Cross-tenant run create | Company check on student / cohort / professor |
| Write against historical run | Resolution throws `CONFLICT` when `forWrite` and status ≠ ACTIVE |
| Orphan learning row after run delete | `ON DELETE RESTRICT` on learning FKs |
| Accidental James special-case drift | James code only in migration SQL CASE; no app hardcode |
| Double-count in institutional metrics | Unique-student aggregation (see analytics policy) |

---

## 6. Rollback integrity note

Restoring uniqueness to the pre-migration shape without restoring the full backup risks collisions once a second run exists. **Integrity recovery = restore backup**, not reverse DDL alone.
