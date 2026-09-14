# SAP Suite End to End — production backup and restore rehearsal

**UTC dump:** 2026-09-14T19:23:19Z  
**UTC restore rehearsal:** 2026-09-14T19:24Z  
**Source:** Railway production Postgres 18.6 (`tec-erp` / `production` / `postgres-volume`)  
**Method:** `pg_dump --format=custom` via Docker image `postgres:18` against `DATABASE_PUBLIC_URL` proxy (credentials never printed, never committed)

This file does **not** replace `engineering/v2/deployment/TEC_ERP_V2_PRODUCTION_BACKUP_AND_RESTORE.md`.

---

## Backup artifact

| Field | Value |
|-------|-------|
| Filename | `tec-erp-prod-before-sap-20260914T192319Z.dump` |
| Storage | `.ops-evidence/sap-suite-e2e-prod-deploy/backups/` (local operational evidence; **not committed**) |
| Size | 184 381 bytes |
| SHA-256 | `53676818bc7b9b89dec2d86a80bb93687ae55ac097dab21101cc74f9c21558d4` |
| Client | `pg_dump (PostgreSQL) 18.6 (Debian 18.6-1.pgdg13+2)` via `postgres:18` |
| Server | PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) |
| Source fingerprint | `DATABASE_PUBLIC_URL` fp `a21c225c03aa8646` · proxy `reseau.proxy.rlwy.net:58681` |
| Object list | `pg_restore --list` → **379** lines |
| Dump exit | 0 |

---

## Restore command (credentials redacted)

```bash
docker run -d --name tec-erp-sap-restore \
  -e POSTGRES_PASSWORD=<LOCAL_ONLY> \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=tec_erp_restore \
  -p 55432:5432 postgres:18

docker run --rm --link tec-erp-sap-restore:db \
  -e PGPASSWORD=<LOCAL_ONLY> \
  -v <BACKUP_DIR>:/backup postgres:18 \
  pg_restore --no-owner --no-acl -h db -U postgres -d tec_erp_restore \
  /backup/tec-erp-prod-before-sap-20260914T192319Z.dump
```

Restore exit: **0**. No `DROP` / `TRUNCATE` / `migrate reset` / `db push`.

---

## Restore rehearsal validation

| Check | Result |
|-------|--------|
| File exists | PASS |
| Credible size | PASS (184 381 B; V2 dump was 175 958 B) |
| Checksum recorded | PASS |
| `pg_restore --list` | PASS (379 lines) |
| Restore into disposable DB | PASS |
| `_prisma_migrations` count | 11 (matches production pre-SAP migrate) |
| SAP migrations in dump | 0 — pending on production: `20260820160000_sap_iee2e_self_report`, `20260820170000_sap_iee2e_semaine_zero`, `20260914010000_sap_suite_e2e_institutional` |
| SAP tables | absent (`sap_iee2e_self_report`, `sap_iee2e_professor_note`, `external_program_assignment`) |
| James restored | PASS — TECERP-2026-PILOT-001 / JR_BUSINESS_ANALYST |
| Run 1 | PASS — `TECERP-PILOT-001-RUN1` · sequence 1 · COMPLETED · AUTONOMOUS |
| Run 2 | PASS — 0 |
| Professor employees | PASS — 0 |
| James certificates | 3 (silver issued, gold revoked, gold issued) — historical, unchanged |
| James assessment attempts | 3 |
| Live snapshot hash (owner-smoke core) | `63a0e586ca13839e33db6190388f65aa9ace408c4e9d2a3bcc8a57ca5f028e07` |
| July 2026 contractual hash `83dea106…571da4` | **does not match** this serializer/payload; pre/post deploy gate uses the **live** hash `63a0e586…` plus SQL Run 1 / no Run 2 / no professors / certificate numbers |

**Gate:** Production mutation requires validated restore rehearsal — **SATISFIED**.

## Rollback plan

1. Stop API deploys that apply SAP DDL.
2. Restore this custom dump onto a recovery Postgres (or Railway point-in-time if used later).
3. Redeploy previous API deployment `f68dc7b2-c01f-452b-8f91-a6757ac3d358` (product SHA `c625ed506640c8b8658a17f8994cd83f5c907331`) and the last successful Web deployment if the new Web SHA is withdrawn.
4. Do **not** reverse SAP DDL in place; restore from dump.
