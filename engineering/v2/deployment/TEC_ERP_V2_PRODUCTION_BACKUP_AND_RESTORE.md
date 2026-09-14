# TEC.ERP — V2 Production Backup and Restore

**UTC:** 2026-07-23T00:35:41Z → 00:36:26Z  
**Source:** Railway production Postgres 18.4 (`tec-erp` / `production`)  
**Method:** `pg_dump --format=custom` via Docker image `postgres:18` against `DATABASE_PUBLIC_URL` proxy (credentials never printed)

---

## Backup artifact

| Field | Value |
|-------|-------|
| Filename | `tec-erp-prod-before-v2-20260723T003541Z.dump` |
| Storage | `.ops-evidence/v2-prod-deploy/backups/` (local operational evidence; **not committed**) |
| Size | 175 958 bytes |
| SHA-256 | `5e662d7f86a631180d99cc6ec781377a07c863185e530002dacfa4c4fdbc718e` |
| Client | `pg_dump (PostgreSQL) 18.4 (Debian 18.4-1.pgdg13+1)` via `postgres:18` |
| Source fingerprint | `DATABASE_PUBLIC_URL` fp `a21c225c03aa8646` · proxy `reseau.proxy.rlwy.net:58681` |
| Object list | `pg_restore --list` → **379** lines (`*.list.txt`) |

---

## Restore command (credentials redacted)

```bash
# Disposable local Postgres 18
docker run -d --name tec-erp-v2-restore \
  -e POSTGRES_PASSWORD=<LOCAL_ONLY> \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=tec_erp_restore \
  -p 55432:5432 postgres:18

docker run --rm --link tec-erp-v2-restore:db \
  -e PGPASSWORD=<LOCAL_ONLY> \
  -v <BACKUP_DIR>:/backup postgres:18 \
  pg_restore --no-owner --no-acl -h db -U postgres -d tec_erp_restore \
  /backup/tec-erp-prod-before-v2-20260723T003541Z.dump
```

---

## Restore rehearsal validation

| Check | Result |
|-------|--------|
| File exists | PASS |
| Credible size | PASS (175 958 B) |
| Checksum recorded | PASS |
| `pg_restore --list` | PASS (379 lines) |
| Restore into disposable DB | PASS |
| `_prisma_migrations` count | 9 (matches production pre-deploy) |
| James restored | PASS — TECERP-2026-PILOT-001 present |
| James integrity hash | `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4` **MATCH** |
| Run 1 / no Run 2 | PASS |
| Professor / QA counts | 0 / 0 |

**Gate:** No production deploy without this validated restore rehearsal — **SATISFIED**.
