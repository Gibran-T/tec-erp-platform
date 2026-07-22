# TEC.ERP — Versioned Pedagogical Runs · Analytics Policy

**Baseline `main`:** `e8761d8` · Product SHA: `2378b2b`  
**Implemented institutional endpoint:** `GET /api/v1/admin/pedagogical-course-runs/metrics/unique-students`

---

## 1. Principle

Multiple pedagogical runs must **not** inflate headcount or “completion” denominators by default. Institutional reporting counts **unique students**, then optionally drills into run-scoped evidence.

---

## 2. Aggregation modes

| Mode | Intent | Count / scope rule |
|------|--------|--------------------|
| **unique-student** (default institutional) | Headcount without double count | One slot per `employeeId`; prefer `ACTIVE`, else highest `runSequence` among non-`CANCELLED` |
| **unique-student-latest** | Same as default when no ACTIVE | Highest `runSequence` per student (exclude `CANCELLED`) |
| **learner-current-run** | Operational learner view | Metrics for the resolved ACTIVE (or writable) run only |
| **learner-selected-run** | Historical review | Metrics for explicit `runId` / banner selection (`X-Tec-Run-Id`) |
| **all-runs** | Research / remediation analysis | Sum or list across all runs; **never** use as institutional headcount |
| **official-cohort** | Cohort governance | Restrict to students with cohort membership; still apply unique-student inside the cohort |

Default for admin metric API today: `unique-student-latest-or-active` (ACTIVE wins, else latest sequence).

---

## 3. Implemented algorithm

`PedagogicalRunService.countDistinctStudentsForInstitutionalMetric(companyId)`:

1. Load company runs with `status ≠ CANCELLED`  
2. For each `employeeId`, keep ACTIVE if present; else keep max `runSequence`  
3. Return `chosen.size`

Unit test (service test file) asserts two students with one holding two runs → count `2`.

---

## 4. UI / product mapping

| Surface | Mode |
|---------|------|
| Student workspace progress / mission center | `learner-current-run` (writes) or `learner-selected-run` (reads with selection) |
| Pedagogical run banner selector | Selection feed for `learner-selected-run` |
| Admin unique-students metric | `unique-student` default |
| Run compare | Pairwise `all-runs` evidence for one student — not a headcount |
| Professor cohort dashboards (existing heatmap/competencies) | Prefer unique-student / official-cohort; run-scoped drill-down is follow-on |

---

## 5. Forbidden practices

- Summing `COMPLETED` runs across sequences to report “students completed”  
- Counting cancelled runs in institutional headcount  
- Treating AI interaction volume as a unique-student proxy  
- Hardcoding James into analytics filters — use cohort + employee identity relationally

---

## 6. Future work (not blocking foundation)

- Explicit `mode` query param on analytics routers  
- Wire professor heatmap to official-cohort + unique-student  
- Intervention rate / confidence gain fields already reserved as `null` on compare payload
