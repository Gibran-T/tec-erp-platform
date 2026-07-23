# TEC.ERP — V2 Production Rollback Plan

**Previous production product SHA:** `76709d62368675d8d6517c592e66e41349569ff2`  
**Previous API deployment:** `de4e41c7-27c7-49d0-9853-10e1837b0d85`  
**Previous Web deployment:** `62f1ec2f-3f29-4124-9886-781072f2a226`  
**Pre-deploy dump:** `tec-erp-prod-before-v2-20260723T003541Z.dump`  
**Dump SHA-256:** `5e662d7f86a631180d99cc6ec781377a07c863185e530002dacfa4c4fdbc718e`

---

## Rollback triggers

Execute rollback assessment immediately on:

- Migration failure / partial apply  
- API or Web boot failure  
- Repeated 500 responses  
- James integrity hash mismatch  
- V1 mission-resolution failure  
- Assessment seed duplication  
- Certificate or Capstone mutation  
- Authorization / company-isolation failure  
- Unusable learner login  
- Broken Professor routes (structural)  
- Severe performance regression  

---

## A. Application-only rollback (preferred first)

Additive schema is forward-compatible with prior API/Web for read paths.

1. Redeploy previous API artifact / SHA `76709d6…` (or redeploy deployment `de4e41c7-…` if still available; otherwise `railway up` from that commit checkout).  
2. Redeploy previous Web similarly (`62f1ec2f-…` / same SHA).  
3. Verify `/health`, `/ready`, Web root 200.  
4. Recompute James integrity hash — must match `83dea106…571da4`.  
5. Confirm no new Run 2 / Professor / certificates.

**Note:** Migrated columns (`curriculumVersion`, Capstone lifecycle, `HCM_M8` rows) may remain; prior app ignores them. This is acceptable unless integrity was altered.

---

## B. Database rollback (only if A insufficient or data integrity altered)

1. Stop write traffic (scale API to 0 / block new deploys).  
2. Take forensic dump of failed state (`tec-erp-prod-failed-v2-<UTC>.dump`) + checksum.  
3. Restore validated pre-deploy dump into production Postgres (owner-supervised; credentials not logged).  
4. Redeploy previous API + Web (SHA `76709d6…`).  
5. Verify health + James hash + Run counts + Professor=0 + QA=0.  

**Do not** attempt hand-written DOWN SQL for uniqueness/seed rows in production.

---

## Communication

- Record exact final production SHA and deployment IDs after rollback.  
- Keep forensic dump offline under `.ops-evidence/` (never commit).  
- Evidence PR documents rollback decision if executed.
