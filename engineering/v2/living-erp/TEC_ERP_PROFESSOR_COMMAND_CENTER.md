# TEC.ERP Professor Command Center

## Surface

`/workspace/apps/portail-professeur` → `ProfessorCommandCenterPage`  
Roles: **PROFESSOR**, **ADMIN**. Others see unauthorized alert.

## Fourteen command sections

| # | Section id | Purpose |
|---|------------|---------|
| 1 | `overview` | Cohorts, students, unique-students metric, runs, Capstone/certs counts, attention queue, recent audit |
| 2 | `students` | Student 360 picker + detail |
| 3 | `runs` | Pedagogical runs table (curriculum, status chips, historical, progress) |
| 4 | `activity` | ERP activity explorer via audit events |
| 5 | `documents` | Document-oriented audit/evidence list |
| 6 | `exceptions` | Exception/recovery oriented audit list |
| 7 | `assessments` | Attempt distribution summary (no answer keys) |
| 8 | `competencies` | Module coverage rows (`moduleCode`, `title`, `coveragePercent`) |
| 9 | `analytics` | Cohort heatmap as student rows + per-module counts |
| 10 | `ai` | AI interaction oversight |
| 11 | `capstone` | Queue — approve / issue Or actions |
| 12 | `interventions` | Send pedagogical intervention to active runs |
| 13 | `comparisons` | Honest run compare (curriculum mismatch warned) |
| 14 | `cohorts` | Assigned cohorts list |

## Additional affordances (not counted in the 14)

- **Presentation Mode** (`presentation` nav) — classroom overlay; see dedicated doc
- **Portail classique** (`legacy`) — embeds prior `ProfessorPortalPage`

## Unique-students metric (P2-2)

Overview reads `getProfessorUniqueStudentMetric()` →  
`GET /api/v1/professor/pedagogical-course-runs/metrics/unique-students`  
Returns `{ mode: "OFFICIAL_COHORT_RESULT", studentCount }`. Alias tested in API route tests.

## Data loading

Parallel fetch of cohorts, students, runs, heatmap, competencies, AI interactions, Capstone queue, certificates, audit, unique-students (with `.catch` fallbacks where non-critical).

## Honesty / partial

- Activity / documents / exceptions currently share an audit-list pattern — useful explorer, not three fully specialized engines.
- Student 360 detail still includes a structured JSON dump for progress/assessments/competencies/capstone.
- Capstone “Approuver” / “Émettre Or” are operational CTAs; follow existing API authorization rules.
- Presentation mode is a focused overlay, not a separate routed app.
