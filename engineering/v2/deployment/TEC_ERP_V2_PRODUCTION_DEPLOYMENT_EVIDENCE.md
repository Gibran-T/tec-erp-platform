# TEC.ERP — V2 Controlled Production Deployment Evidence

**Role:** Sheriff / V2 Controlled Production Deployment Lead  
**UTC window:** 2026-07-23T00:32Z → post-deploy validation  
**Target SHA:** `c625ed506640c8b8658a17f8994cd83f5c907331`  
**Previous product SHA:** `76709d62368675d8d6517c592e66e41349569ff2`

---

## 1. Baseline

| Item | Result |
|------|--------|
| Local `main` = `origin/main` | YES @ `c625ed5…` |
| Working tree product noise | Approved local only: `.manus-logs/`, helper scripts, `official_documents/site/` |
| PR #25 / #27 / #28 / #29 / #30 | All merged |
| Latest CI on target SHA | SUCCESS ([run 29969129270](https://github.com/Gibran-T/tec-erp-platform/actions/runs/29969129270)) |
| Open release-blocking P0/P1 | None matched |
| Production API/Web health pre | 200 / 200 |
| Railway project | `tec-erp` / environment `production` |
| Pre API deployment | `de4e41c7-27c7-49d0-9853-10e1837b0d85` |
| Pre Web deployment | `62f1ec2f-3f29-4124-9886-781072f2a226` |
| Env fingerprints | `DATABASE_URL` fp `660cca987b38ec48` (internal) · public fp `a21c225c03aa8646` · `NODE_ENV=production` · Web `VITE_API_BASE_URL` → production API |

---

## 2. Precheck (James + global)

| Field | Value |
|-------|-------|
| James | TECERP-2026-PILOT-001 / JR_BUSINESS_ANALYST / TECERP-PILOT / TECERP-PILOT-001 |
| Run 1 | `TECERP-PILOT-001-RUN1` · AUTONOMOUS · COMPLETED · historical |
| Run 2 | 0 |
| Missions | 30/30 · 100% |
| Professor employees | 0 |
| QA residue | 0 |
| HCM_M8 | absent before deploy |
| curriculumVersion column | absent before deploy |
| Integrity hash | `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4` **MATCH** |

---

## 3. Backup / restore / rehearsal

| Item | Result |
|------|--------|
| Dump | `tec-erp-prod-before-v2-20260723T003541Z.dump` |
| Size | 175 958 bytes |
| SHA-256 | `5e662d7f86a631180d99cc6ec781377a07c863185e530002dacfa4c4fdbc718e` |
| Restore rehearsal | PASS (James hash match) |
| Pending migrations applied on restore | `v2_curriculum_version` + `v2_hcm_m8_assessment_bank` |
| API tests on restored shape | **196 / 196** |
| API boot on restored shape | `/health`+`/ready` 200 |
| Catalog tests | **8 / 8** |
| Web unit tests local | 90/91 (1 shell collapse flake; CI green on target SHA) |

---

## 4. Production deployment

| Service | Deployment ID | Status | Notes |
|---------|---------------|--------|-------|
| tec-erp-api | `f68dc7b2-c01f-452b-8f91-a6757ac3d358` | SUCCESS | `railway up` from exact local SHA |
| tec-erp-web | `796bb2ff-be57-4990-a363-eefc3a9a1ef6` | SUCCESS | same SHA |

### Migration logs (API startup)

```
Applying migration `20260725120000_v2_curriculum_version`
Applying migration `20260726120000_v2_hcm_m8_assessment_bank`
All migrations have been successfully applied.
Prisma migrate deploy completed successfully.
server_started port=8080 nodeEnv=production
```

---

## 5. Post-deploy integrity

| Check | Result |
|-------|--------|
| James integrity hash | **MATCH** `83dea106…571da4` |
| James Run 1 | COMPLETED · V1 · no Run 2 |
| HCM_M8 | 1 def · 20 Q · 100 pts · 70% · 2400s · maxAttempts 2 · A/B/C/D 5/5/5/5 |
| HCM attempts | 0 |
| Professor count | 0 |
| QA residue | 0 |
| Migrations | 11 finished · 0 failed |
| James login | 200 |
| Learner HCM exclusion | HCM_M8 not in learner assessment list |
| Answer-key leak | none in learner payloads |
| Professor/Admin denial | 403 for learner token |
| Unauthenticated | 401 |
| API/Web health | 200 |

---

## 6. Security / isolation

| Check | Result |
|-------|--------|
| Learner → Professor endpoints | 403 |
| Learner → Admin endpoints | 403 |
| Unauth → protected | 401 |
| Admin HCM answer-key route | 403 for learner |
| No secrets in evidence artifacts | PASS |

---

## 7. Explicit non-actions honored

- No Thiago Professor created  
- No James Run 2 created  
- No certificate issue/revoke/reissue  
- No permanent QA fixtures  
- No PR merges  

---

## 8. Artifacts (local ops; backups not committed)

- `.ops-evidence/v2-prod-deploy/` snapshots, logs, dump meta  
- This `engineering/v2/deployment/` documentation set  
