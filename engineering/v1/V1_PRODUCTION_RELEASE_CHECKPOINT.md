# TEC.ERP V1 — Production Release Checkpoint

**Date:** 2026-07-22
**Baseline:** `main` @ `bca6f462a99a705d9b65ac5f9590b6ee94b4ac32` (PR #19 merged)
**Prior Final Wave baseline:** `fe61083b87ab9526bfc94cfc229eaf2929c22a07` (PR #18)
**Railway:** project `tec-erp` · environment `production`
**API deployment:** `372a494e-5927-41f4-95d2-312424f31b75` (SUCCESS)
**Web deployment:** `653392a3-0039-4305-885b-f6393db020f8` (SUCCESS)
**Evidence detail:** `engineering/v1/V1_PRODUCTION_DEPLOYMENT_EVIDENCE.md`

## Matrix summary

| Area | Status |
|------|--------|
| Baseline SHA exact (`bca6f46`) | PASS |
| Hotfix scope (analytics routes + tests only) | PASS |
| Local CI-equivalent validation | PASS (API 156 / Web 78 / Catalog 4) |
| Migration safety (no new migration in hotfix) | PASS |
| Railway configuration | PASS (secrets present, not printed) |
| API deploy + migrate | PASS |
| Web deploy + HTTP 200 | PASS |
| Unauthenticated production smoke | PASS |
| Professor analytics API smoke | PASS (200 / authz 401·403 / isolation) |
| Professor browser refresh + analytics | PASS (former 404 blocker closed) |
| Focused student / admin / public regression | PASS |
| Security / isolation | PASS |
| QA cleanup residue | **0** |
| Post-cleanup health | PASS |

## Closed blocker

**Professor advanced analytics UI blocked in production** — CLOSED by PR #19 deploy.

- `GET /api/v1/professor/analytics/heatmap` → **200**
- `GET /api/v1/professor/analytics/competencies` → **200**
- Browser direct reload of Portail professeur → PASS
- No missing-endpoint network failure on analytics refresh

## Known warnings

- Analytics list item labels may show `undefined` due to UI field aliases vs API field names (counts and 200 responses confirmed; follow-up display mapping recommended, not part of this SHA).
- Student UI lists Professor/Admin apps as active chrome; API still enforces 403.
- Pre-existing web hooks lint warning in mission interactions.

## Final verdict

**PRODUCTION GREEN — TEC.ERP V1 RELEASED**

Product SHA `bca6f46` (PR #19 hotfix on Final Wave) is deployed to Railway production, professor analytics live gates passed (API + browser), authorization/isolation confirmed, QA residue cleared to 0, and post-cleanup health is green.

Do not merge this checkpoint PR as a product change. Do not begin new features in this closure step.
