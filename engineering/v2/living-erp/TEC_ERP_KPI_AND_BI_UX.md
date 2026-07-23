# TEC.ERP KPI and BI UX

## Surface

`/workspace/apps/tableaux-bord` → `DashboardPage`.

## Explained KPI model

Every KPI tile is a `KpiExplainedCard` enriched by `explainKpi()` (`living-erp/kpiCatalog.ts`):

| Field | Intent |
|-------|--------|
| Definition | What the indicator means |
| Formula | How it is derived (generic pedagogical default if key-specific meta missing) |
| Unit / Period | Measurement context |
| Target / Actual | Pedagogical target hint + API value |
| Variance / Trend | Stale warning or trend chip |
| Source | Analytics engine / run-scoped data |
| Interpretation | Process reading, not learner ranking |
| Risk | Data quality caveats |
| Recommended action | Relink to document/mission/exception |

## Exceptions panel

Table of analytics exceptions with severity `StatusChip`, summary, source, detected time — feeds Learner Home attention (top items).

## Principles

1. A number without explanation is incomplete.
2. KPIs are run/curriculum scoped; do not compare V1 vs V2 as if identical.
3. Stale flags must surface.
4. Purple AI tone is not used for KPI status (trends use standard tones).

## Partial areas

- `KPI_META` currently provides a robust **default** template; per-key rich catalog entries are sparse.
- No full BI drill-through workspace beyond dashboard + exceptions list.
- Professor analytics heatmap is a separate Command Center section, not this learner page.
