# TEC.ERP Professor Analytics

## Surfaces inside Command Center

| Section | Source | UX |
|---------|--------|----|
| Overview metrics | cohorts/students/runs/unique-students/certs | Counts + attention |
| Analytics | `getProfessorAnalyticsHeatmap` | Per-student rows (`displayName`, `completedMissions`, `moduleCounts`, curriculum) — not a module-intensity matrix |
| Competencies | `getProfessorCompetencySummary` | Score + evidence counts |
| Assessments | student list summaries | High-level only |
| Comparisons | `compareProfessorPedagogicalRuns` | JSON comparison with curriculum honesty warning |
| AI | `listProfessorAiInteractions` | Usage oversight |
| Activity/Documents/Exceptions | `listProfessorAudit` | Event explorer |

## Policies

1. **Official unique-student metric** uses institutional mode `OFFICIAL_COHORT_RESULT` — not AI volume proxies.
2. Heatmap renders student completion rows + `moduleCounts`; competencies render `moduleCode` / `title` / `coveragePercent` (API DTO-aligned; P2-8 closed for CC lists).
3. Run comparison must warn when curricula differ — modules are not auto-equivalent.
4. No answer keys; no cross-company analytics.

## Partial areas

- Visual heatmap is list-based, not a dense matrix widget.
- Assessment analytics do not embed item-level stats.
- Comparison result is raw JSON pending a designed diff table.
