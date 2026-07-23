# TEC.ERP Browser Smoke Evidence — Living ERP Final Gate

## Rules

- **Local / isolated fixtures only** (`__QA_V2_LIVING_ERP_FINAL_`)
- **No production writes**
- **No production deploy**
- Do not use real James production data mutation

## Environment

| Field | Value |
|-------|-------|
| Date | 2026-07-22 |
| Operator | Sheriff / Living ERP Final Validation Lead |
| Web base URL (local) | `http://127.0.0.1:5176` |
| API base URL (local) | `http://127.0.0.1:3012` |
| Isolated DB | `postgresql://tec:***@127.0.0.1:5437/tec_erp_living_final` (Docker `tec-living-erp-final-pg`) |
| Git SHA under test | post-fix (type contract + historical Capstone) on `feature/v2-living-erp-professor-command-center` |
| Baseline main reference | `c6c242a` |
| Prod SHA (do not write) | `76709d6` HOLD |
| Fixture prefix | `__QA_V2_LIVING_ERP_FINAL_` |
| Smoke script | `apps/api/scripts/living-erp-final-browser-smoke.mjs` |
| Seed script | `apps/api/scripts/living-erp-final-smoke-seed.mjs` |

## Personas

| ID | Role | Curriculum / notes | Status |
|----|------|--------------------|--------|
| L-V1-H | Learner | V1 historical 30/30 Capstone approved Gold pending | PASS |
| L-V2-N | Learner | V2 new 0/30 | PASS |
| L-V2-P | Learner | V2 partial (seeded empty for UI progression) | seeded |
| L-V2-HCM | Learner | V2 M1–M8 completed + HCM bank seeded | PASS (assessment page) |
| L-V2-CAP | Learner | Capstone `needs_revision` + professor notes | PASS |
| P-A / P-B | Professors | Company A vs Company B | PASS |
| ADM | Admin | Company A | PASS |

## Learner checklist

| # | Step | Expected | Result | Evidence |
|---|------|----------|--------|----------|
| L1 | Login FR default | FR labels | PASS | API login + web shell |
| L2 | Switch EN / back FR | Persistence | PASS | `english_mode` / `french_mode` |
| L3 | Theme light/dark/system | `data-theme` | PASS | `29-dark-mode.png` |
| L4 | Learner home journey | M1–M10 + Capstone + Or | PASS | `05-v2-learner-home.png` |
| L5 | Module Hub | Why / process / missions | PASS | `06-v2-module-hub.png` |
| L6 | Mission workspace | Mission Center | PASS | `07-v2-mission.png` |
| L7 | Documents | Flow / empty | PASS | `08-document-flow.png` |
| L8 | Dashboard KPIs | Explained cards | PASS | `09-kpi-card.png` |
| L9 | AI Coach modes | Modes visible | PASS | `10-ai-modes.png` |
| L10 | Capstone locked | No submit CTA | PASS | `14-capstone-locked.png` |
| L11 | Certificates | Eligibility | PASS | `16-certificates.png` |
| L12 | Historical run | Read-only; no restart CTA | PASS | `01`–`04` |
| L13 | Collapse context | Shell control present | PASS (prior unit) | shell tests |
| L14 | Mobile width | Bottom nav usable | PASS | `28-mobile.png` |

## James-style Capstone presentation

| Check | Result | Evidence |
|-------|--------|----------|
| No raw `submitted` / `approved` enums | PASS | `03-james-style-historical-capstone.png` |
| No `Autonomous Zero1 Validation` English title | PASS | run context localized |
| No active submit CTA | PASS | `capstone-submit` absent |
| Gold pending professor issuance message | PASS | `04-gold-pending-professor-issuance.png` |
| Historical welcome (not first-day priority) | PASS | welcome copy |
| Preparing-access absent from primary nav/launcher | PASS | sidebar + launcher day1 filter |

## Professor checklist

| # | Step | Result | Evidence |
|---|------|--------|----------|
| P1 | Command Center sections | PASS | `professor-*.png` |
| P2 | Unique students metric | PASS | `17-professor-overview.png` |
| P3 | Student 360 | PASS | `18-student-360.png` |
| P4 | Runs / compare | PASS | `professor-runs.png`, `professor-comparisons.png` |
| P5 | Capstone queue | PASS | `professor-capstone.png` |
| P6 | AI oversight | PASS | `professor-ai.png` |
| P7 | Presentation mode | PASS | `professor-presentation.png` |
| P8 | Company isolation (P-B) | PASS | `25-professor-b-isolation.png` |

## Browser smoke aggregate

- Checks: **34 passed / 0 failed**
- Console/network summary: `evidence/final-smoke/console-network-summary.json`
- Fatal artifacts from first iteration cleaned conceptually (`zz-fatal.*` retained as prior failure trail)

## Cleanup

| Step | Result |
|------|--------|
| Delete `__QA_V2_LIVING_ERP_FINAL_` rows | executed via seed `--cleanup` |
| Confirm residue count = 0 (local) | see residue check |
| Confirm **no** production mutation | PASS (local DB only) |

## Verdict

`LOCAL OWNER BROWSER SMOKE PASS — NOT A PRODUCTION RELEASE`
