# V1 Final Wave — Worktree Ownership Map

Baseline: `654b5b9020f2634514bcd929505069816e2c83da` (PR #17 merged)

| Branch / worktree | Path | Owns (exclusive write) |
|-------------------|------|------------------------|
| `integration/v1-final-m7-m10-gold` | `C:\Projetos\Analyste_ERP_Processus_Affaires` | Sheriff merges; migrations; unlock/course wiring; `engineering/v1/V1_FINAL_*`; conflict resolution |
| `feature/v1-m7-m8-enterprise` | `C:\Projetos\tec-erp-wt-v1-m7m8` | `packages/mission-catalog/src/m7/**`, `m8/**`; enterprise planning/workflow helpers under `apps/api/src/modules/enterprise/**` |
| `feature/v1-m9-bi-ai` | `C:\Projetos\tec-erp-wt-v1-m9` | `packages/mission-catalog/src/m9/**`; `apps/api/src/modules/analytics/**`, `ai-coach/**`, `predictions/**`; BI contracts |
| `feature/v1-m10-capstone-gold` | `C:\Projetos\tec-erp-wt-v1-m10` | `packages/mission-catalog/src/m10/**`; `apps/api/src/modules/capstone/**`, `certification/**`; public verification |
| `feature/v1-admin-scenario-multicompany` | `C:\Projetos\tec-erp-wt-v1-admin` | `apps/api/src/modules/admin/**`, `scenario/**`, `integration/**`, `automation/**`; company configuration |
| `feature/v1-student-final-runtime` | `C:\Projetos\tec-erp-wt-v1-runtime-final` | Student M7–M10 UX, dashboards, AI Coach UI, Capstone/Gold/certificate UI under `apps/web` |
| `feature/v1-professor-final` | `C:\Projetos\tec-erp-wt-v1-prof-final` | Advanced professor analytics / Capstone / Gold views |
| `qa/v1-final` | `C:\Projetos\tec-erp-wt-v1-qa-final` | Final smoke/fixtures/security/performance scripts — no product ownership |

## Sheriff-owned shared files
- `packages/database-erp/prisma/schema.prisma` + Final Wave migration
- `packages/mission-catalog/src/{registry,wave3,index}.ts`
- `packages/contracts/src/{mission,auth,admin,analytics,ai,certification}.ts`
- `apps/api/src/modules/mission/mission.unlock-engine.ts`
- `apps/api/src/modules/mission/mission.migration-mapper.ts`
- `apps/api/src/app.ts` route mounts

## Delivery note
Authoritative product delivery consolidates on `integration/v1-final-m7-m10-gold`. Feature worktrees preserve lineage at baseline SHA; do not merge empty/stale branches.
