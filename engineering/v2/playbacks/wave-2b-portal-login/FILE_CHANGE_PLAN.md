# Wave 2B — File Change Plan (Revision 1)

> **Status:** PROPOSED FILE PLAN — IMPLEMENTATION NOT AUTHORIZED  
> **Revision:** 1 — Functional SO-1048 Mission 1 entry + Option C engine boundary  
> **Deploy / Push / James Run 2 / Professor implementation:** NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch (current):** `feature/v2-portal-login-wave2b`  
> **Rename recommendation (document only):** `feature/v2-so1048-mission-entry-wave2b`  
> **Worktree:** `C:\Projetos\tec-erp-wt-wave2b-portal-login`

## Rules

- This architecture revision updates **documentation only**.  
- Application source changes below are **future** work after Architecture Re-Approval + Implementation Checkpoint.  
- Production impact remains **none** while isolated under `/playback/v2/*`.  
- Rollback: revert PR · clear sessionStorage · restore from `origin/main`.

---

## A. Documentation files (Revision 1 — this remediation)

| Path | Action | Responsibility |
|------|--------|----------------|
| `engineering/v2/playbacks/wave-2b-portal-login/ARCHITECTURE_APPROVAL_PACK.md` | Update | Functional delta + state machine + ledger + Option C |
| `…/IMPLEMENTATION_PLAN.md` | Update | Engine-first sequencing |
| `…/RISK_REGISTER.md` | Update | R2B-01 … R2B-08 |
| `…/FILE_CHANGE_PLAN.md` | Update | Engine + UI + tests inventory |
| `…/QA_GATE_PLAN.md` | Update | Behavioral acceptance tests |
| `…/OWNER_PLAYBACK_PLAN.md` | Update | Functional Owner loop |

---

## B. Future application files (NOT authorized yet)

### B1. Mission-entry engine (required — Option C)

| Path | Action | Responsibility | Production impact | Rollback |
|------|--------|----------------|-------------------|----------|
| `apps/web/src/playback/v2/mission-entry/types.ts` | Create | Session, evidence, decision, ledger types | None | Delete |
| `apps/web/src/playback/v2/mission-entry/stateMachine.ts` | Create | Legal transitions | None | Delete |
| `apps/web/src/playback/v2/mission-entry/evidenceCatalog.ts` | Create | Authored SO-1048 evidence | None | Delete |
| `apps/web/src/playback/v2/mission-entry/decisionCatalog.ts` | Create | Constrained decision options | None | Delete |
| `apps/web/src/playback/v2/mission-entry/consequenceMap.ts` | Create | Deterministic consequence rules | None | Delete |
| `apps/web/src/playback/v2/mission-entry/ledger.ts` | Create | Append-only event ledger | None | Delete |
| `apps/web/src/playback/v2/mission-entry/missionService.ts` | Create | In-memory session service | None | Delete |
| `apps/web/src/playback/v2/mission-entry/sessionStorageAdapter.ts` | Create | Optional resume adapter | None | Delete |
| `apps/web/src/playback/v2/mission-entry/index.ts` | Create | Public engine API | None | Delete |
| `apps/web/src/playback/v2/mission-entry/__tests__/*.test.ts` | Create | Pure behavioral unit tests | None | Delete |

Alternate root `apps/web/src/v2/mission-entry/` is acceptable if Implementation Checkpoint prefers; keep isolation identical.

### B2. Mission-entry UI + wiring (thin)

| Path | Action | Responsibility | Production impact | Rollback |
|------|--------|----------------|-------------------|----------|
| `apps/web/src/playback/v2/mission-entry/MissionEntryPage.tsx` | Create | Thin UI bound to engine | None | Delete |
| `apps/web/src/playback/v2/PlaybackV2Root.tsx` | Update | Register mission-entry route under `/playback/v2/*` | None | Revert |
| `apps/web/src/playback/v2/OrientationPage.tsx` | Update | CTA starts session (not preview-only done-state) | None | Revert |
| `apps/web/src/playback/v2/content.ts` | Update | FR/EN strings for evidence/decision/consequence/resume | None | Revert |
| `apps/web/src/playback/v2/playback.css` | Update | Mission-entry layout styles | None | Revert |
| `apps/web/src/playback/v2/__tests__/playback-v2.test.tsx` | Update | Journey + isolation regression | None | Revert |
| `apps/web/src/playback/v2/__tests__/mission-entry.behavior.test.tsx` | Create | Integration behavioral tests | None | Delete |

### B3. Presentation shell (optional hygiene only)

| Path | Action | Notes |
|------|--------|-------|
| `PortalPage.tsx` / `LoginPlaybackPage.tsx` / `PlaybackControls.tsx` / `PlaybackProvider.tsx` / `branding.ts` / `modules.ts` | Update only if required for continuity | Must not become the product; no business rules for mission completion |

---

## C. Explicitly out-of-plan

| Path / area | Reason |
|-------------|--------|
| `apps/web/src/pages/LoginPage.tsx`, `auth/*` | Production auth |
| `apps/web/src/App.tsx` production route topology | Do not replace `/login` or wrap playback in ProtectedRoute |
| `apps/api/**`, Prisma, migrations, seeds mutating runs | No backend/schema/data |
| Professor pages/APIs | Preview-only |
| James mutation scripts | Run 1/2 protection |
| Official `docs/` Master Contract | Frozen |
| Wave 2A P2 College logo / `/orientation` rename | Deferred |
| Branch rename | Document recommendation only |

---

## D. Production impact summary

- Revision 1 docs: documentation only  
- Future implementation: isolated playback + mission-entry engine only  
- Production login, workspace, API, schema, James runs: **zero intentional impact**

**IMPLEMENTATION NOT AUTHORIZED.**
