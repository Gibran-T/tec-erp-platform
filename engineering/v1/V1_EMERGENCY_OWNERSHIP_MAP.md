# V1 Emergency Sprint — Worktree Ownership Map

Baseline: `fb473d7fe46c7ca76e91650b74b21d6b6d0a6468`

| Branch / worktree | Path | Owns (exclusive write) |
|-------------------|------|------------------------|
| `integration/v1-emergency-completion` | `C:\Projetos\Analyste_ERP_Processus_Affaires` | Integration merges, `engineering/v1/*` checkpoints, conflict resolution |
| `feature/v1-core-engines` | `C:\Projetos\tec-erp-wt-v1-core` | `packages/database-erp/**`, `packages/contracts/src/{course,mission,assessment}*`, `packages/core/src/{scoring,mission}*`, `apps/api/src/modules/{course,mission,assessment}/**`, API wiring in `apps/api/src/app.ts` |
| `feature/v1-student-mission-runtime` | `C:\Projetos\tec-erp-wt-v1-runtime` | `apps/web/src/mission/**`, `apps/web/src/pages/workspace/Mission*.tsx`, `apps/web/src/api/{course,mission}.ts`, related web tests |
| `feature/v1-m1-content` | `C:\Projetos\tec-erp-wt-v1-m1` | `packages/mission-catalog/**` (new) or `apps/api/src/modules/mission/content/m1/**` — mission definition JSON/TS for M1-M01/02/03 only |
| `qa/v1-foundation` | `C:\Projetos\tec-erp-wt-v1-qa` | Integration/smoke tests under `apps/api/src/__tests__/v1/**`, `apps/web/src/__tests__/v1/**`, fixtures — no product ownership |

## Conflict rules
- Core owns unlock/scoring engines; content only registers definitions.
- Runtime consumes contracts; does not invent unlock/score logic.
- Sheriff merges feature branches into `integration/v1-emergency-completion` only.
