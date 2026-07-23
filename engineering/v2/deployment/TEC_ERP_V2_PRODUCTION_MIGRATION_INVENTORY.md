# TEC.ERP — V2 Production Migration Inventory

**Target main:** `c625ed506640c8b8658a17f8994cd83f5c907331`  
**Production schema before deploy:** 9 finished migrations (through `20260724131000_v1_run_reflections_enabled`)  
**Pending for this release:** 2 additive migrations

---

## Already applied in production (PR #25 wave)

| Migration | Purpose |
|-----------|---------|
| `20260724120000_v1_pedagogical_course_runs` | Pedagogical run tables, Run 1 backfill, uniqueness for one ACTIVE run |
| `20260724131000_v1_run_reflections_enabled` | Reflections-enabled additive column/support |

---

## Pending migration 1 — `20260725120000_v2_curriculum_version`

| Aspect | Detail |
|--------|--------|
| Purpose | Mark runs with curriculum version; Capstone lifecycle columns; insert V2 HCM mission identity rows |
| Tables affected | `pedagogical_course_run`, `capstone_submission`, `mission_definition` |
| Columns added | `pedagogical_course_run.curriculumVersion` (DEFAULT `'V1'`); `capstone_submission.lifecycleStatus`; `capstone_submission.currentStage` |
| Indexes / constraints | None destructive; mission inserts use `ON CONFLICT ("missionKey") DO NOTHING` |
| Data backfill | Existing runs forced/`DEFAULT` to **V1** (James Run 1 stays V1) |
| Seed/upsert | Inserts 3 HCM mission_definition rows (`M8-HCM-M01..03`) if missing |
| Lock risk | Low (ADD COLUMN IF NOT EXISTS + small INSERTs) |
| Estimated runtime | Seconds on current prod size |
| Rollback implication | Additive; full rollback requires restore from pre-deploy dump |
| Historical-data risk | **Low** — no V1 mission-key rewrite; no attempt reassignment |
| Idempotency | Column IF NOT EXISTS + ON CONFLICT DO NOTHING |
| App compatibility | Compatible with current prod app until Web/API cutover; new columns unused by old binary |

---

## Pending migration 2 — `20260726120000_v2_hcm_m8_assessment_bank`

| Aspect | Detail |
|--------|--------|
| Purpose | Official `HCM_M8` assessment definition + 20 questions (100 points) |
| Tables affected | `assessment_definition`, `assessment_question` |
| Columns added | None (row inserts) |
| Indexes / constraints | Uses existing unique keys (`code`, `assessmentId+questionKey`) |
| Data backfill | None on attempts |
| Seed/upsert | `ON CONFLICT DO UPDATE` for definition + questions (idempotent) |
| Lock risk | Low |
| Estimated runtime | Seconds |
| Rollback implication | Additive; restore dump if bank must be removed |
| Historical-data risk | **None** — no attempt creation; V1 learners unchanged |
| Idempotency | Yes |
| App compatibility | Safe before Web deploy; endpoints become meaningful after API deploy |

---

## Confirmations

| Check | Result |
|-------|--------|
| Additive only | YES |
| No destructive DROP | YES |
| No TRUNCATE | YES |
| No historical attempt reassignment | YES |
| No V1 mission-key rewrite | YES |
| No fabricated HCM attempts for V1 learners | YES |
| No automatic James Run 2 | YES |
| No automatic Professor creation | YES |
| No automatic certificate issuance | YES |
| No Capstone history coercion | YES (nullable lifecycle columns only) |

---

## Production-shape rehearsal result

Applied both pending migrations on restored dump `tec-erp-prod-before-v2-20260723T003541Z.dump`:

- James integrity hash unchanged: `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4`
- Run 1 → `curriculumVersion=V1`, status COMPLETED, Run 2 absent
- `HCM_M8` once, 20 questions, 100 points, 70%, 2400s, maxAttempts=2, A/B/C/D = 5/5/5/5
- HCM attempts = 0; Professor count = 0
- Re-run `migrate deploy` → no pending
- API tests against restored shape: **196 / 196 PASS**
- API boot `/health` + `/ready` against restored shape: **200**
