# Versioned Runs — Production Backup Evidence

**UTC captured:** 2026-07-22T19:55:37Z  
**Environment:** Railway production Postgres (server 18.4)  
**Operator:** Gibran_QA / Cursor Sheriff  
**Gate SHA:** `76709d62368675d8d6517c592e66e41349569ff2`

## Method

1. Railway managed snapshot: not available as a CLI-invokable artifact in this project tooling window.  
2. **Executed:** `pg_dump --format=custom --no-owner --no-privileges` via Docker image `postgres:18-alpine` against `DATABASE_PUBLIC_URL` (host IP resolved on Windows for Docker DNS).

## Artifact

| Field | Value |
|-------|-------|
| File | `evidence/backup/tec-erp-prod-20260722T195537Z.dump` |
| Size | 148,775 bytes |
| SHA-256 | `BBC9D01F80CC3F5689E4AADC748778481EB6F682309268DC8B2DA6FA89183948` |
| Exit code | 0 |
| Meta | `evidence/backup/backup-meta.json` |

## Validation

- File exists and non-zero  
- `pg_restore --list` includes: `employee`, `cohort`, `cohort_membership`, `mission_attempt`, `assessment_attempt`, `capstone_submission`, `certificate`, `ai_interaction`, `_prisma_migrations`  
- Restore rehearsal into isolated Postgres 18 container `tec-vr-rehearsal-pg` (localhost:5436) — **SUCCESS** (exit 0)  
- Restored counts: employees=1, mission_attempts=30, migrations=7 (pre-foundation)

## Restore procedure

```bash
docker run --rm -v BACKUP_DIR:/backup postgres:18-alpine \
  pg_restore --no-owner --no-privileges \
  --dbname="$TARGET_DATABASE_URL" \
  /backup/tec-erp-prod-20260722T195537Z.dump
```

## Retention

Retain local dump until owner confirms production stability post-deploy. Do not commit binary dump to git if size/policy prohibits; keep offline + meta checksum in evidence.

## Secrets

No credentials, tokens, or full connection strings recorded in this document.
