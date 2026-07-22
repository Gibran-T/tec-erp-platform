# TEC.ERP — Versioned Pedagogical Runs · Production Deployment Plan

**Baseline `main`:** `e8761d8`  
**Product SHA (current production reference):** `2378b2b`  
**Foundation branch:** `feature/versioned-pedagogical-runs-foundation`  
**Design input:** PR #24 (design only — not a deploy artifact)

---

## HARD GATES (non-negotiable)

| Gate | Requirement |
|------|-------------|
| **No auto-deploy** | Do **not** rely on Railway auto-deploy from merge. Deploy only via explicit owner-authorized CLI/console action after checklist sign-off. |
| **Backup required** | Take a verified PostgreSQL backup (Railway volume snapshot / `pg_dump`) **before** `migrate deploy`. Confirm restore procedure is known. |
| **Owner gate** | Named owner (product/engineering owner) must approve in writing (chat/PR comment) before production migrate or service deploy. |
| **No James Run 2** | Production ops for this wave must **not** create James / pilot Run 2. Migration backfills Run 1 only. |
| **Approval Gate** | Keep deployment blocked while `VERSIONED_RUNS_TEST_EVIDENCE.md` overall gate is OPEN, unless owner explicitly accepts residual risk in writing. |

If any hard gate fails → **STOP**. Do not migrate. Do not deploy.

---

## 1. Pre-deploy checklist

- [ ] Owner approval recorded (name, UTC timestamp, artifact SHA)  
- [ ] Backup completed and restore smoke noted  
- [ ] Target deploy SHA identified (foundation merge commit — not assumed)  
- [ ] Diff reviewed: migrations `20260724120000_v1_pedagogical_course_runs` **and** `20260724131000_v1_run_reflections_enabled`  
- [ ] Staging or disposable migrate PASS (empty + populated validated in PR evidence)  
- [ ] Confirm no production script will `POST` a James Run 2  
- [ ] Confirm James integrity hash still `83dea106…571da4` (or owner-accepted delta) before migrate  
- [ ] On-call available for rollback window  

---

## 2. Deploy sequence (manual)

1. **Freeze** non-essential admin mutations if practical  
2. **Backup** production Postgres → store backup id/path in release note  
3. **Deploy API** artifact containing schema + migration (owner-triggered)  
4. Confirm startCommand / one-shot runs `pnpm migrate:deploy` successfully  
5. **Validate SQL** (see migration plan): James `TECERP-PILOT-001-RUN1`; zero unexpected `runSequence >= 2` from migrate; null FKs = 0 on required tables  
6. **Deploy Web** (banner) — owner-triggered  
7. **Smoke:** student list runs; login James relationally shows Run 1; no certificate auto-revoke; health endpoints green  
8. **Monitoring:** API error rate, migration logs, 409 spikes on writes  

---

## 3. Rollback

| Layer | Procedure |
|-------|-----------|
| Web / API | Redeploy previous known-good images/SHAs (`e8761d8` / `2378b2b` lineage as applicable) |
| Database | **Restore the pre-migration backup** |

**Do not** attempt a partial reverse of uniqueness DDL in production. Down migration is **not fully reversible** for uniqueness changes without backup restore.

---

## 4. Post-deploy evidence to record

- Backup identifier  
- Migration deploy log excerpt (success, migration name)  
- API + Web deployment IDs  
- James Run 1 relational query result (`TECERP-PILOT-001-RUN1`)  
- Confirmation: no James Run 2 created  
- Owner closure note  

Store under `engineering/v1/versioned-runs/` as a future evidence file (do not edit official `docs/` without approval).

---

## 5. Explicit non-actions

- No automatic merge→production pipeline for this foundation  
- No production seed of instructor-led Run 2  
- No certificate mass revoke/re-issue  
- No silent updates to `docs/` product specifications  

---

## 6. Decision log (fill at deploy time)

| Field | Value |
|-------|-------|
| Owner | _pending_ |
| Approval UTC | _pending_ |
| Backup id | _pending_ |
| Deployed SHA | _pending_ |
| Migrate result | _pending_ |
| Rollback unused? | _pending_ |
