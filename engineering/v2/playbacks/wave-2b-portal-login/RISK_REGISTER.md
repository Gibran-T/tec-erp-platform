# Wave 2B — Risk Register

> **Status:** Architecture gate risk register — IMPLEMENTATION NOT STARTED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch / worktree:** `feature/v2-portal-login-wave2b` @ `C:\Projetos\tec-erp-wt-wave2b-portal-login`  
> **Deploy / James Run 2 / Professor implementation:** NOT AUTHORIZED

| ID | Area | Level | Evidence | Mitigation | Blocks architecture approval? |
|----|------|-------|----------|------------|-------------------------------|
| R1 | Product scope creep into M3/ELE/Professor | MEDIUM | Roadmap places ELE at 5B, Professor at 7, M3 at 3B | Hard non-goals; checkpoint gate; file plan limited to `playback/v2` | No |
| R2 | Accidental production `/login` coupling | MEDIUM | Production `LoginPage` uses `useAuth` | Keep `LoginPlaybackPage`; isolation tests; no App.tsx topology change for auth | No |
| R3 | Temptation to rename `/orientation` | LOW | Wave 2A P2 residual | Explicit deferral; Cockpit stays on orientation path | No |
| R4 | Network AI introduction | MEDIUM | Vision implies living AI; contracts defer live engines | Authored AI only; QA no-fetch assertions | No |
| R5 | Persistence / schema drift | LOW | Future V2 persistence interest | Authored local state only; no Prisma in file plan | No |
| R6 | James Run mutation | LOW | Pilot scripts exist elsewhere | No James scripts; no seeds; Run 2 = 0 gate language | No |
| R7 | Detached main worktree confusion | LOW | Baseline worktree is detached | Dedicated Wave 2B worktree for all implementation | No |
| R8 | Docs vs Master Contract drift | LOW | Frozen Master Contract | Architecture pack cites contracts; no Master Contract rewrite | No |
| R9 | Delivery overreach (full Mission 1 runtime) | MEDIUM | Cockpit already previews Mission 1 | Preview-only completion criteria | No |
| R10 | Deploy without authorization | HIGH if attempted | Railway deployability culture | Explicit deploy prohibition until separate gate | Yes — if deploy claimed in this wave without gate |

## Residual P2 (tracked, out of Wave 2B)

- Authorized College logo asset still missing  
- Future route rename `/orientation` → `/mission-cockpit`  

## Residual P0 / P1 for this architecture gate

- P0: none  
- P1: none blocking architecture approval  

## Statement

No risk above blocks architecture pack approval when mitigations are followed. Implementation remains unauthorized until Implementation Checkpoint.
