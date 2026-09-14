# TEC.ERP — V2 Controlled Production Deployment Plan

**Role:** Sheriff / V2 Controlled Production Deployment Lead  
**UTC baseline:** 2026-07-23T00:32:01Z (health probe) / 2026-07-23T00:34:43Z (DB precheck)  
**Repository:** Gibran-T/tec-erp-platform  
**Authoritative main:** `c625ed506640c8b8658a17f8994cd83f5c907331`  
**Previous production product SHA:** `76709d62368675d8d6517c592e66e41349569ff2` (PR #25 Versioned Pedagogical Runs)

---

## Hard gates (non-negotiable)

- Preserve James Timothy Run 1 historical integrity hash `83dea106…571da4`
- Do **not** create James Run 2
- Do **not** create Thiago Professor
- Do **not** issue/revoke/reissue certificates
- Do **not** merge PRs in this gate
- No permanent QA residue in production
- Backup + restore rehearsal required before any production mutation

---

## Environment identity

| Item | Value |
|------|-------|
| Railway project | `tec-erp` (`2b10414d-03ee-4375-af86-4cac4e363a1f`) |
| Environment | `production` (`eea7ceeb-2fdc-437b-a675-e102da6aa9b8`) |
| API service | `tec-erp-api` → https://tec-erp-api-production.up.railway.app |
| Web service | `tec-erp-web` → https://tec-erp-web-production.up.railway.app |
| Database | Railway Postgres `postgres-volume` (server 18.4) |
| Pre-deploy API deployment | `de4e41c7-27c7-49d0-9853-10e1837b0d85` |
| Pre-deploy Web deployment | `62f1ec2f-3f29-4124-9886-781072f2a226` |
| API replicas | 1 (single migration runner) |
| API startCommand (repo) | `pnpm migrate:deploy && node apps/api/dist/index.js` |

---

## Included merged foundations

| PR | Title | Merge SHA |
|----|-------|-----------|
| #25 | Versioned Pedagogical Runs | `76709d6…` (already in production) |
| #27 | Mission Center CI stabilization | `008de15…` |
| #28 | V2 Curriculum M1–M10, HCM, Separate Capstone | `ffe9cfc…` |
| #29 | V2 HCM Assessment Bank | `c6c242a…` |
| #30 | Living ERP + Professor Command Center | `c625ed5…` (target main) |

---

## Controlled deployment order

1. Baseline verification (git/CI/Railway/health) — **PASS**
2. Production read-only precheck + James hash — **PASS**
3. Validated `pg_dump` backup + restore rehearsal — **PASS**
4. Migration inventory + production-shape migrate/seed/API boot — **PASS**
5. Document rollback plan — required before mutate
6. Deploy **API** from exact local SHA `c625ed5` (`railway up`)
7. Confirm migrations applied once; API health + source SHA
8. Deploy **Web** from same SHA
9. Post-deploy integrity, smoke, security, stabilization
10. QA cleanup if any temporary fixtures
11. Evidence branch + Draft PR (no auto-merge)
12. Final GREEN/HOLD verdict

---

## Explicit non-actions

- No Thiago Professor creation  
- No James Run 2  
- No certificate mutations  
- No `docs/` official edits  
- No feature development  
- No evidence commit to `main` without review  

---

## Decision log

| Field | Value |
|-------|-------|
| Owner authorization | This controlled deployment prompt |
| Backup id | `tec-erp-prod-before-v2-20260723T003541Z.dump` |
| Deployed SHA | `c625ed506640c8b8658a17f8994cd83f5c907331` |
| API deployment | `f68dc7b2-c01f-452b-8f91-a6757ac3d358` SUCCESS |
| Web deployment | `796bb2ff-be57-4990-a363-eefc3a9a1ef6` SUCCESS |
| Migrate result | Applied `v2_curriculum_version` + `v2_hcm_m8_assessment_bank` |
| Final verdict | V2 CONTROLLED PRODUCTION DEPLOYMENT GREEN — READY FOR THIAGO PROFESSOR SETUP |
