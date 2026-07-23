# TEC.ERP — PR #32 Release and Deployment Evidence

**PR:** #32 — Living ERP Visual Foundation Recovery  
**Expected pre-fix head:** `6c8f786904ea210fdc505ad39605acaa280375ee`  
**Base main:** `c625ed506640c8b8658a17f8994cd83f5c907331`  

## Pre-deploy production health

| Check | Result |
|-------|--------|
| API health | 200 |
| Web health / login | 200 |
| James login | 200 |
| James V1 · 30/30 · 100% | Confirmed (API + prior snapshot) |
| James Capstone approved | Confirmed (snapshot) |
| James Run 2 | 0 |
| Production Professor count | 0 (snapshot `professorEmployeeCount`) |
| QA residue | 0 |
| Expected James integrity hash | `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4` |

## Previous Web deployment

| Field | Value |
|-------|-------|
| Service | `tec-erp-web` |
| Deployment ID | `796bb2ff-be57-4990-a363-eefc3a9a1ef6` |
| Source SHA (production product) | `c625ed506640c8b8658a17f8994cd83f5c907331` |

## Merge / deploy (filled after gate)

| Field | Value |
|-------|-------|
| Final PR head | _(pending commit)_ |
| CI run | _(pending)_ |
| Merge commit | _(pending)_ |
| Main SHA | _(pending)_ |
| New Web deployment ID | _(pending)_ |
| Production Web source SHA | _(pending)_ |
| James post-deploy hash | _(pending)_ |
| Rollback required | NO (default) |
| Final verdict | _(pending)_ |

## Deployment policy

Web-only Railway deploy. No API redeploy. No DB backup required (no schema/migration/data mutation).
