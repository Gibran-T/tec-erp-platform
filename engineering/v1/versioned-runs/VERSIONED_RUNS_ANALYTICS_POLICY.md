# TEC.ERP — Versioned Pedagogical Runs · Analytics Policy

**Baseline `main`:** `e8761d8` · Product SHA: `2378b2b`  
**Implementation:** `apps/api/src/modules/analytics/official-run-policy.ts`  
**Default institutional mode:** `OFFICIAL_COHORT_RESULT`

---

## 1. Principle

Multiple pedagogical runs must **not** inflate headcount, completion denominators, averages, or rankings by default. Institutional reporting counts **each learner once** via a deterministic official-run selection, then optionally drills into exploratory run-scoped evidence.

---

## 2. Aggregation modes (`AnalyticsMode`)

| Mode | Intent | Count / scope rule |
|------|--------|--------------------|
| **OFFICIAL_COHORT_RESULT** (default) | Institutional dashboards | One official run per learner; exclude `DEMONSTRATION` + `CANCELLED` |
| **LEARNER_CURRENT_RUN** | Operational learner view | Resolved ACTIVE / writable run only |
| **LEARNER_SELECTED_RUN** | Historical / banner selection | Explicit `runId` / `X-Tec-Run-Id` |
| **UNIQUE_STUDENT_LATEST** | Latest eligible sequence | Highest `runSequence` among eligible runs |
| **ALL_RUNS** | Exploratory / research | List or aggregate across runs; **never** use as institutional headcount |

Professor exploratory endpoints may request `ALL_RUNS` or selected-run mode via query params. Product UIs that lack a selector keep `OFFICIAL_COHORT_RESULT`.

---

## 3. Official result precedence

No separate “official” boolean flag is required. Deterministic precedence on eligible runs (`runType ≠ DEMONSTRATION`, `status ≠ CANCELLED`):

1. Latest `COMPLETED` or `ARCHIVED` by `runSequence` (desc)
2. `ACTIVE` eligible run
3. Latest `PAUSED`
4. Latest `PLANNED`
5. Legacy `runSequence = 1` when still present among remaining eligible

`sourceRunId` lineage does **not** create duplicate headcount rows.

---

## 4. Wired surfaces

| Surface | Mode |
|---------|------|
| Admin `GET .../metrics/unique-students` | `OFFICIAL_COHORT_RESULT` |
| Professor heatmap / competencies | Default official; optional exploratory modes |
| Professor student list | Deduped; progress scoped to official run |
| Student workspace / mission center | Learner current / selected run |
| Run compare | Pairwise evidence — not a headcount |

---

## 5. Required invariants (tested)

- 1 student + Run 1 + Run 2 ⇒ enrolled count `1`
- Averages not double-weighted across runs in official mode
- Rankings / heatmap rows: one row per student in official mode
- Demonstration and cancelled runs excluded from official metrics
- Selected-run / all-runs exploratory modes work without mutating official default
- Company and cohort isolation preserved

---

## 6. Forbidden practices

- Summing completed runs across sequences to report “students completed”
- Counting cancelled or demonstration runs in institutional headcount
- Silently replacing official cohort results with the newest ACTIVE run when a completed official run exists
- Treating AI interaction volume as a unique-student proxy
- Hardcoding James into analytics filters

---

## 7. Deferred (P2)

- Broader public mode selector on every analytics surface
- Intervention rate / confidence gain fields reserved as `null` on compare payload
