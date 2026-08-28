# Wave 2B — File Change Plan (Revision 2)

> **Status:** PROPOSED FILE PLAN — IMPLEMENTATION NOT AUTHORIZED  
> **Revision:** 2 — Persistence/ledger freeze alignment  
> **Deploy / Push / James Run 2 / Professor:** NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch (current):** `feature/v2-portal-login-wave2b`  
> **Branch rename:** **RENAME REQUIRED BEFORE IMPLEMENTATION** → `feature/v2-so1048-mission-entry-wave2b` (**do not rename here**)  
> **Findings closed:** R1-01 … R1-05 = **CLOSED**

## Rules

- Revision 2 updates **documentation only**.  
- Application paths below remain **future** until Architecture Re-Approval + Implementation Checkpoint (+ branch rename).  
- Storage key (future): `tec.erp.playback.v2.so1048.m1.session.v1`  
- No `localStorage` · no API · no Prisma · no production auth.

---

## A. Documentation (this remediation)

| Path | Action |
|------|--------|
| `ARCHITECTURE_APPROVAL_PACK.md` | Update — envelope, corruption, ledger, 4 options, transitions |
| `IMPLEMENTATION_PLAN.md` | Update — engine/persistence sequencing |
| `RISK_REGISTER.md` | Update — full R2B-01…08 structure |
| `FILE_CHANGE_PLAN.md` | Update — this file |
| `QA_GATE_PLAN.md` | Update — persistence/ledger/consequence/completion suites |
| `OWNER_PLAYBACK_PLAN.md` | Update — recovery + four-option loop |

---

## B. Future application files (NOT authorized yet)

### Engine

| Path | Action | Responsibility |
|------|--------|----------------|
| `…/mission-entry/types.ts` | Create | Envelope v1 + ledger types |
| `…/mission-entry/stateMachine.ts` | Create | Transition table + rejects |
| `…/mission-entry/evidenceCatalog.ts` | Create | Authored evidence IDs |
| `…/mission-entry/decisionCatalog.ts` | Create | Four options |
| `…/mission-entry/consequenceMap.ts` | Create | Four deterministic consequences |
| `…/mission-entry/ledger.ts` | Create | Append-only ledger |
| `…/mission-entry/missionService.ts` | Create | In-memory SoT |
| `…/mission-entry/sessionStorageAdapter.ts` | Create | Resume + corruption recovery |
| `…/mission-entry/serialization.ts` | Create | JSON envelope serialize/validate |
| `…/mission-entry/index.ts` | Create | Public API |
| `…/mission-entry/__tests__/*.test.ts` | Create | Pure behavioral tests |

### UI / wiring

| Path | Action | Responsibility |
|------|--------|----------------|
| `…/mission-entry/MissionEntryPage.tsx` | Create | Thin UI + recovery notice |
| `PlaybackV2Root.tsx` | Update | Register route |
| `OrientationPage.tsx` | Update | CTA starts session |
| `content.ts` / `playback.css` | Update | Copy/styles |
| `__tests__/playback-v2.test.tsx` | Update | Regression |
| `__tests__/mission-entry.behavior.test.tsx` | Create | Integration behavioral |

### Optional shell hygiene only

`PortalPage` / `LoginPlaybackPage` / `PlaybackControls` / `PlaybackProvider` / `branding` / `modules` — only if continuity requires; **no** mission business rules.

---

## C. Out of plan

| Area | Reason |
|------|--------|
| `LoginPage.tsx`, `auth/*`, `useAuth` | Production auth |
| `App.tsx` production topology | Do not replace `/login` |
| `apps/api/**`, Prisma, migrations | No backend/schema |
| Professor runtime APIs | Preview-only |
| James mutation scripts | Run 1/2 protection |
| `localStorage` usage | Forbidden by persistence freeze |
| Official `docs/` Master Contract | Frozen |
| Wave 2A P2 logo/rename | Deferred |
| Branch rename in this commit | Documented only |

**IMPLEMENTATION NOT AUTHORIZED.**
