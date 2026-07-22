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
- Full browser smoke with disposable V1/V2 learners: deferred (P1)
