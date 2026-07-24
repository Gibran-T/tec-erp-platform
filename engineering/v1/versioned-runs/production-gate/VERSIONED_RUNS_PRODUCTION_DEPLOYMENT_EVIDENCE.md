# Versioned Runs — Production Deployment Evidence

**Authorized product SHA:** `76709d62368675d8d6517c592e66e41349569ff2`  
**Pre-deploy product SHA:** `2378b2b04cd1241855c1ed7a8de823ff6c2cd2fd`  
**Deploy method:** `railway up` from clean detached worktree at exact SHA  
**Order:** API (migrate-on-start) → verify → Web

## API — tec-erp-api

| Field | Value |
|-------|-------|
| Deployment ID | `de4e41c7-27c7-49d0-9853-10e1837b0d85` |
| Status | SUCCESS |
| Source | clean worktree @ `76709d6` |
| Start (local log) | 2026-07-22T19:58:48Z |
| Health | `GET /health` → 200 |
| Rollback target | prior SUCCESS `9b67ce14-4b05-4a05-974a-3190095cf2a0` / product `2378b2b` |

## Web — tec-erp-web

| Field | Value |
|-------|-------|
| Deployment ID | `62f1ec2f-3f29-4124-9886-781072f2a226` |
| Status | SUCCESS |
| Source | clean worktree @ `76709d6` |
| Health | `GET /` → 200 |
| Rollback target | prior SUCCESS `33a7bab8-1236-439d-8246-b149db0f9398` |

## Mapping note

Railway deployment IDs are platform bundle identities. Source content was uploaded from Git SHA `76709d62368675d8d6517c592e66e41349569ff2` verified via `git rev-parse HEAD` in the deploy worktree immediately before `railway up`.
