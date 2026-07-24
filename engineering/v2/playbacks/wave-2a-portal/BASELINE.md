# Wave 2A Portal Playback Zero — Baseline

> **PLAYBACK ZERO ONLY — NOT PRODUCTION — OWNER VISUAL APPROVAL REQUIRED**

## Verified before implementation

| Item | Result |
|------|--------|
| `origin/main` SHA | `e09b8b94ba93d39f21a9b41ec79b0add9a3117ab` |
| Expected baseline | `e09b8b94ba93d39f21a9b41ec79b0add9a3117ab` — **MATCH** |
| Branch | `feature/v2-portal-experience-playback-zero` |
| Worktree | `C:\Projetos\tec-erp-wt-portal-playback-zero` |
| Git state | Clean at branch creation |
| PR #33 | **MERGED** (`e09b8b9` merge commit) — Learning OS Master Contract |
| LOS contract pack | Present under `engineering/v2/learning-operating-system/` |
| Application start point | Approved `main` baseline |

## Production / pedagogical integrity (no DB mutation)

Baseline validation for Runs and Professors was **not** performed by mutating the database. Status recorded from governance constraints for this wave:

| Item | Recorded posture |
|------|------------------|
| James Run 1 | Must remain V1 COMPLETED 30/30 — **not modified by this wave** |
| James Run 2 count | **0** — not created |
| Professor count | Unchanged — Thiago Professor **not created** |
| QA residue | Expected **0** — no cleanup mutations in this wave |
| Production data | **No mutation** |
| Auth / schema | **No change** |

## Isolation posture

- Prototype routes under `/playback/v2/*` only
- Outside `ProtectedRoute` and `WorkspaceLayout`
- No production navigation link
- Marker: `PLAYBACK ZERO · NOT PRODUCTION`
- No migration, no AI network calls, no auth replacement

## Contracts read

Product Vision · README · Product Definition · Portal/Login · Visual Learning Language · Learner Journey · IA · Dual Journey · Digital Twin · ELE · BI Studio · Teaching Deck · Capstone · Content Quality · Acceptance Criteria · Curriculum Master Map
