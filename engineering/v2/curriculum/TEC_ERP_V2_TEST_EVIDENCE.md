# TEC.ERP V2 Test Evidence

## Catalog
- packages/mission-catalog vitest: 8/8 PASS (V1/V2 invariants, HCM, Capstone exclusion)

## API
- Full suite: 181/181 PASS (curriculum-invariants, gold V1/V2, migration mapper m10 to M10, analytics curriculumVersion)
- Typecheck / lint / build: PASS

## Web
- Full suite: 83/83 PASS
- Typecheck / lint / build: PASS

## Other gates
- pnpm env:check: PASS
- git diff --check: PASS
- Secret scan on changed files: PASS (false-positive Prisma field name secretRef only)

## Migration (local disposable)
- Applied 20260725120000_v2_curriculum_version on localhost:5435/tec_erp
- Empty migrated then seeded: OK
- Not applied to production

## Production read-only (unchanged)
- James integrity hash: 83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4
- Completed 30/30; professors 0; Run 2 absent

## Local UI smoke
- Structural coverage via Mission Center + Capstone UI tests
- Owner browser smoke (2026-07-22): **COMPLETE** — see `TEC_ERP_V2_OWNER_BROWSER_SMOKE.md`
  - Isolated DB `tec_erp_v2_owner_smoke` @ `:5435`
  - Disposable V1 30/30 + V2 greenfield/HCM wrong-action/recovery
  - Professor A visibility + Professor B isolation; Admin unique count = 2
  - Screenshots under `evidence/owner-browser-smoke/`
  - Local QA residue 0; production unchanged (James hash match)

## Regression gates (owner smoke re-run)
- mission-catalog 8/8 · API 181/181 · Web 83/83
- typecheck/lint/build API+Web · env:check · git diff --check · secret scan
