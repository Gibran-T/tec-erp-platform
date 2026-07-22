# TEC.ERP V2 — HCM Assessment Test Evidence

Date: 2026-07-22  
Branch: `feature/v2-hcm-assessment-bank`  
Base: `ffe9cfcfa3111dbab3fa5bd6767ede3ab16dbddd`

## Focused HCM tests
- `apps/api` vitest HCM bank + policy + gold eligibility + scoring: **20/20 PASS**

## API full
- `pnpm --filter erp-api test`: **188 passed / 6 skipped** (43 files passed)

## Web full
- `pnpm --filter erp-web test`: **83/83 PASS**

## Catalog
- `pnpm --filter @tec-platform/mission-catalog test`: **8/8 PASS**

## Typecheck / lint / build
- API typecheck / lint / build: **PASS**
- Web typecheck / lint / build: **PASS**
- `pnpm env:check`: **PASS**
- `git diff --check`: **PASS**

## Migration / seed (local disposable)
- DB: `tec_erp_hcm_assessment_smoke` @ localhost:5435
- Applied through `20260726120000_v2_hcm_m8_assessment_bank`
- Idempotent seed via `seedHcmM8AssessmentBank`
- **Not applied to production**

## Local API smoke
- Script: `apps/api/scripts/hcm-assessment-smoke.mjs --collect`
- Evidence: `engineering/v2/hcm-assessment/evidence/hcm-assessment-smoke.json`
- Result: **failed = 0** (locked / eligible / submit / V1 exclusion / professor / admin / no answer-key leak)

## Local browser smoke
- Script: `apps/api/scripts/hcm-assessment-browser-smoke.mjs`
- Evidence: `engineering/v2/hcm-assessment/evidence/hcm-assessment-browser-smoke.json`
- Screenshots: `01-locked-learner.png`, `02-eligible-questions.png`, `03-professor.png`, `04-admin-assessments.png`
- Result: **failed = 0**

## QA cleanup
- `--cleanup` → `qaResidue = 0`

## Production read-only
- API 200 / Web 200
- James login OK; V1; 30/30 completed; HCM_M8 **not** visible
- HCM bank **not** seeded in production (expected — deploy hold)
- Expected legacy integrity hash reference:
  `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4`
- No production write performed
