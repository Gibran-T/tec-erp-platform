# V1 Wave 2 — Worktree Ownership Map

Baseline: `fc704833e80c278b9c1624a0a9d0d1c3112cf55a`

| Branch / worktree | Path | Owns (exclusive write) |
|-------------------|------|------------------------|
| `integration/v1-wave2-m2-m6-silver` | `C:\Projetos\Analyste_ERP_Processus_Affaires` | Sheriff merges; `engineering/v1/V1_WAVE2_*`; shared unlock/course wiring; final migrations review; conflict resolution |
| `feature/v1-m2-master-data` | `C:\Projetos\tec-erp-wt-v1-m2` | `packages/mission-catalog/src/m2/**`; master-data domain helpers under `apps/api/src/modules/master-data/**` |
| `feature/v1-m3-m4-transactions` | `C:\Projetos\tec-erp-wt-v1-m3m4` | `packages/mission-catalog/src/m3/**`, `m4/**`; `apps/api/src/modules/simulation/p2p/**`, `o2c/**` |
| `feature/v1-m5-m6-inventory-finance` | `C:\Projetos\tec-erp-wt-v1-m5m6` | `packages/mission-catalog/src/m5/**`, `m6/**`; `apps/api/src/modules/simulation/inventory/**`, `finance/**` |
| `feature/v1-professor-assessment-silver` | `C:\Projetos\tec-erp-wt-v1-professor` | `apps/api/src/modules/professor/**`, `assessment/**`, `certification/**`; professor web routes under `apps/web/src/pages/professor/**`; assessment contracts |
| `feature/v1-student-wave2-runtime` | `C:\Projetos\tec-erp-wt-v1-runtime2` | `apps/web/src/mission/**` extensions; transaction views; module progression UI; no domain rules |
| `qa/v1-wave2` | `C:\Projetos\tec-erp-wt-v1-qa2` | `apps/api/src/__tests__/wave2/**`, `apps/web/src/__tests__/wave2/**`, smoke scripts — no product ownership |

## Sheriff-owned shared files (integration only)
- `packages/database-erp/prisma/schema.prisma` + Wave 2 migration
- `packages/mission-catalog/src/{schema,registry,index}.ts`
- `packages/contracts/src/{mission,auth,assessment,professor,certification}.ts`
- `apps/api/src/modules/mission/mission.unlock-engine.ts`
- `apps/api/src/modules/mission/mission.migration-mapper.ts`
- `apps/api/src/app.ts` route mounts
- `apps/api/src/modules/simulation/engine/**` (shared posting kernel)

## Conflict rules
- Content registers missions; engine must not hardcode M2–M6 IDs beyond unlock sequence tables.
- Runtime consumes contracts; scoring/unlock/posting remain server-authoritative.
- Professor routes never mounted under student `/me` without role gate.

## Delivery note (Sheriff)
Parallel Task agents hit API limits; product implementation was consolidated on
`integration/v1-wave2-m2-m6-silver` under Sheriff ownership. Feature worktrees remain
at baseline SHA for lineage; exclusive ownership boundaries above still apply for
follow-on deltas.

## Feature worktree governance (PR #17 blocker closure)

| Branch | Status | Action |
|--------|--------|--------|
| `feature/v1-m2-master-data` | Superseded — baseline only | Do not merge; preserve history |
| `feature/v1-m3-m4-transactions` | Superseded — baseline only | Do not merge; preserve history |
| `feature/v1-m5-m6-inventory-finance` | Superseded — baseline only | Do not merge; preserve history |
| `feature/v1-professor-assessment-silver` | Superseded — baseline only | Do not merge; preserve history |
| `feature/v1-student-wave2-runtime` | Superseded — baseline only | Do not merge; preserve history |
| `qa/v1-wave2` | Superseded — baseline only | Do not merge; preserve history |
| `integration/v1-wave2-m2-m6-silver` | **Authoritative product line** | All Wave 2 code lives here |

No force-deletion of superseded branches in this task.
