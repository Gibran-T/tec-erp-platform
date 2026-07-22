# TEC.ERP Professor Analytics

## Surfaces inside Command Center

| Section | Source | UX |
|---------|--------|----|
| Overview metrics | cohorts/students/runs/unique-students/certs | Counts + attention |
| Analytics | `getProfessorAnalyticsHeatmap` | Module intensity rows |
| Competencies | `getProfessorCompetencySummary` | Score + evidence counts |
| Assessments | student list summaries | High-level only |
| Comparisons | `compareProfessorPedagogicalRuns` | JSON comparison with curriculum honesty warning |
| AI | `listProfessorAiInteractions` | Usage oversight |
| Activity/Documents/Exceptions | `listProfessorAudit` | Event explorer |

## Policies

1. **Official unique-student metric** uses institutional mode `OFFICIAL_COHORT_RESULT` — not AI volume proxies.
2. Heatmap/competency labels prefer API labels; avoid showing literal `unknown` when a module/competency label exists (P2-8 — partial closure).
3. Run comparison must warn when curricula differ — modules are not auto-equivalent.
4. No answer keys; no cross-company analytics.

## Partial areas

- Visual heatmap is list-based, not a dense matrix widget.
- Assessment analytics do not embed item-level stats.
- Comparison result is raw JSON pending a designed diff table.
