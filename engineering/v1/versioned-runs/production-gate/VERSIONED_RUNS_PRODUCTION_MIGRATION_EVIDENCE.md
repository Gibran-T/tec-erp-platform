# Versioned Runs — Production Migration Evidence

**Target SHA:** `76709d62368675d8d6517c592e66e41349569ff2`  
**Operator:** Gibran_QA / Cursor Sheriff

## Migrations applied

| Migration | Finished (UTC) |
|-----------|----------------|
| `20260724120000_v1_pedagogical_course_runs` | 2026-07-22 20:01:21.119819+00 |
| `20260724131000_v1_run_reflections_enabled` | 2026-07-22 20:01:21.146002+00 |

Applied via API `startCommand`: `pnpm migrate:deploy && node apps/api/dist/index.js` on deploy `de4e41c7-27c7-49d0-9853-10e1837b0d85`.

## Impact forecast vs actual

| Item | Forecast | Actual |
|------|----------|--------|
| `pedagogical_course_run` rows | 1 | 1 |
| mission_attempt linked | 30 | 30 (null FK=0) |
| employee_course_progress | 1 | null FK=0 |
| assessment_attempt | 3 | null FK=0 |
| capstone_submission | 1 | null FK=0 |
| certificate provenance | 3 | 3 linked to Run 1 |
| ai_interaction linked | 1 | 1 |
| runSequence ≥ 2 | 0 | 0 |
| professors created | 0 | 0 |
| QA residue | 0 | 0 (post-cleanup) |

## James Run 1

- Code: `TECERP-PILOT-001-RUN1`
- Sequence: 1 · Type: AUTONOMOUS · Status: COMPLETED · 100% · reflectionsEnabled=false · professorId=null

## Review notes

- Additive migrations; no DROP TABLE / DELETE of learning history  
- Partial unique ACTIVE index present  
- Seed not run  
- No manual row edits

See `evidence/migration/post-migration-integrity.txt`.
