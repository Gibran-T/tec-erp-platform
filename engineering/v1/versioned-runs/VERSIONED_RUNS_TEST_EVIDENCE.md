# Versioned Runs — Test Evidence

**Date:** 2026-07-22  
**Branch:** `feature/versioned-pedagogical-runs-foundation`  
**Baseline main:** `e8761d852b7bfdfb9f9bf3696e9d493a409f9af6`

## Executed locally

| Gate | Result | Notes |
|------|--------|-------|
| Frozen install | PASS | `pnpm install --frozen-lockfile` |
| Prisma validate/generate | PASS | schema valid; client generated |
| Empty DB migrate | PASS | `tec_vr_empty` @ localhost:5435 |
| Populated DB upgrade | PASS | `tec_vr_populated`; James relational backfill → `TECERP-PILOT-001-RUN1` |
| SQL foundation smoke | PASS | Company A/B isolation, Run1/Run2 independence, dual-ACTIVE blocked, `qa_residue=0` |
| API unit (pedagogical-run) | PASS | 3 tests |
| Web unit (run banner) | PASS | 1 test |
| API typecheck | PASS | |
| Web typecheck | PASS | |
| API lint | PASS | |
| Web lint | PASS | 1 pre-existing hooks warning |
| API build | PASS | |
| Web build | PASS | |
| Production migrate | NOT RUN | Forbidden this wave |
| James production hash re-query | BLOCKED locally | Railway internal DB hostname; pre-snapshot hash `83dea106…571da4` unchanged; API/Web 200; no prod write |

## Pending for CI / owner gate

- Full API/Web/catalog/integration suites on PR CI
- Production migration only after owner authorization + backup
