# TEC.ERP V2 Curriculum Architecture

**Positioning:** « 10 modules de développement de compétences, 30 missions opérationnelles et analytiques, un projet intégrateur et une certification basée sur des preuves. »

## Canonical shape

| Layer | V2 |
|-------|----|
| Modules | M1–M10 |
| Regular missions | exactly 30 (3 per module) |
| Capstone | **separate domain** (MCapstone), not mission 30 |
| Gold | M1–M10 complete + assessments + professor-approved Capstone |

## Versioning

- `PedagogicalCourseRun.curriculumVersion`: `V1` (default/historical) | `V2` (new runs)
- Runtime authority: `@tec-platform/mission-catalog` placement overlays
- V1 catalog preserved for James Run 1 historical meaning
- V2 introduces HCM (M8), remaps Governance→M9, BI/KPI/AI→M10

## Source of truth

- Placement: `packages/mission-catalog/src/curriculum-placement.ts`
- HCM content: `packages/mission-catalog/src/m8-hcm/`
- API resolves catalog via run curriculum version (course/mission/unlock/certification)
