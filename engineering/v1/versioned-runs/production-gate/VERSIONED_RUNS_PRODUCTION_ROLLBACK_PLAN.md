# Versioned Runs — Production Rollback Plan

## Code rollback

Redeploy previous known-good images:

- API prior SUCCESS: `9b67ce14-4b05-4a05-974a-3190095cf2a0` (product lineage `2378b2b`)
- Web prior SUCCESS: `33a7bab8-1236-439d-8246-b149db0f9398`

Prefer `railway up` from a clean worktree checked out at `2378b2b04cd1241855c1ed7a8de823ff6c2cd2fd` if image reuse is unavailable.

## Database rollback

Migration is additive with relationship backfill. Do **not** casually reverse schema while new code has written run-scoped rows.

| Severity | Action |
|----------|--------|
| Non-destructive app defect | Forward-fix hotfix PR |
| Severe integrity failure | Owner-authorized restore of `tec-erp-prod-20260722T195537Z.dump` (SHA-256 in backup evidence) onto Postgres 18 |

## Decision boundary

Rollback executed only on owner authorization. This gate did **not** execute rollback.
