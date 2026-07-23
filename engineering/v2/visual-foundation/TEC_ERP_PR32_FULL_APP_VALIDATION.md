# TEC.ERP — PR #32 Full-App Validation

**Date (UTC):** 2026-07-23  
**Branch:** `fix/v2-living-erp-visual-foundation`  
**Initial HEAD:** `6c8f786904ea210fdc505ad39605acaa280375ee`  
**Worktree:** `C:\Projetos\tec-erp-wt-visual-foundation`  
**PR:** https://github.com/Gibran-T/tec-erp-platform/pull/32  

## Local full-app environment

| Service | Value |
|---------|-------|
| PostgreSQL | Docker `tec-visual-foundation-pg` → `127.0.0.1:5438` / `tec_erp_visual` |
| API | `http://127.0.0.1:3013` |
| Web | `http://127.0.0.1:5177` |
| Seed | `apps/api/scripts/visual-foundation-james-local-seed.mjs` |
| Capture | `engineering/v2/visual-foundation/evidence/capture-full-app-release.mjs` |

## James local fixture

| Field | Value |
|-------|-------|
| Name | James Timothy |
| Employee # | TECERP-2026-PILOT-001 |
| Role | JR_BUSINESS_ANALYST |
| Company | NordHabitat |
| Curriculum | V1 |
| Run | Run 1 · AUTONOMOUS · COMPLETED · historical · read-only |
| Progress | 30/30 · 100% |
| Capstone | submitted · approved |
| Certificates | silver + integrated issued; gold revoked (representative) |
| Professor | 0 |
| Run 2 | 0 |

## Defect closure (real app)

| Area | Result |
|------|--------|
| Header compact (~36px desktop) | PASS |
| Unified context (no large learner / Run / Curriculum boxes) | PASS |
| No Accès actif spam | PASS |
| Summary before launcher | PASS |
| Light readable / card depth | PASS |
| Dark coherent (no hybrid white chrome) | PASS after ERP surface remap |
| System → Light / Dark only | PASS |
| Navigation grouped + Capstone label (not MCapstone) | PASS |
| Right panel open/closed | PASS |
| Localization (no Autonomous Zero1 / raw enums) | PASS |
| ERP page title readable Light + Dark | PASS |
| Historical module / mission / Capstone / Certificates | PASS |
| Profile menu readable | PASS |
| Tablet / mobile | PASS |

## Screenshot directory

`engineering/v2/visual-foundation/evidence/full-app-release/`

## Release fixes in this gate

1. Capstone localization (`MCapstone` → `Capstone`)  
2. Unified context line: remove sr-only duplication; de-dupe Historique when curriculum already marks historique  
3. Theme remap of legacy Tailwind white/gray utilities for ERP/organization pages  
4. Local James seed task key `decouvrir-nordhabitat` (fixture only)

## Scope confirmation

No Prisma schema, migration, API business-rule, scoring, assessment, Capstone policy, or certificate logic changes.
