# Wave 2B — File Change Plan

> **Status:** PROPOSED FILE PLAN — NO APPLICATION SOURCE CHANGED BY THIS ARCHITECTURE GATE  
> **Implementation:** NOT STARTED  
> **Deploy / James Run 2 / Professor implementation:** NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch:** `feature/v2-portal-login-wave2b`  
> **Worktree:** `C:\Projetos\tec-erp-wt-wave2b-portal-login`

## Rules

- Only documentation files are created in this architecture gate.  
- Application source changes are listed as **future** work after Implementation Checkpoint.  
- Production impact for every app file: **none while isolated under `/playback/v2/*`**.  
- Rollback: revert PR / restore file from `origin/main`.

---

## A. Architecture gate files (this commit — documentation only)

| Path | Action | Responsibility | Reason | Production impact | Rollback |
|------|--------|----------------|--------|-------------------|----------|
| `engineering/v2/playbacks/wave-2b-portal-login/ARCHITECTURE_APPROVAL_PACK.md` | Create | Architecture decisions | Owner/governance approval | None | Delete/revert |
| `engineering/v2/playbacks/wave-2b-portal-login/IMPLEMENTATION_PLAN.md` | Create | Sequencing | Controlled execution later | None | Delete/revert |
| `engineering/v2/playbacks/wave-2b-portal-login/RISK_REGISTER.md` | Create | Risk tracking | Gate transparency | None | Delete/revert |
| `engineering/v2/playbacks/wave-2b-portal-login/FILE_CHANGE_PLAN.md` | Create | File inventory | Bound implementation | None | Delete/revert |
| `engineering/v2/playbacks/wave-2b-portal-login/QA_GATE_PLAN.md` | Create | Test plan | Isolation & quality | None | Delete/revert |
| `engineering/v2/playbacks/wave-2b-portal-login/OWNER_PLAYBACK_PLAN.md` | Create | Owner validation script | Continuity from Wave 2A | None | Delete/revert |

---

## B. Future application files (NOT authorized to modify yet)

| Path | Action | Responsibility | Reason | Production impact | Rollback |
|------|--------|----------------|--------|-------------------|----------|
| `apps/web/src/playback/v2/PortalPage.tsx` | Update (future) | Portal academic identity + living enterprise sections | Wave 2B objective | None (isolated) | Revert file |
| `apps/web/src/playback/v2/LoginPlaybackPage.tsx` | Update (future) | Playback login continuity | Fake auth journey | None | Revert file |
| `apps/web/src/playback/v2/OrientationPage.tsx` | Update (future) | Mission Cockpit / SO-1048 / CTA / preview | Mandat entry | None | Revert file |
| `apps/web/src/playback/v2/PlaybackProvider.tsx` | Update (future) | Authored local state only if needed | State hygiene | None | Revert file |
| `apps/web/src/playback/v2/PlaybackControls.tsx` | Update (future) | QA controls polish | Owner/QA | None | Revert file |
| `apps/web/src/playback/v2/PlaybackV2Root.tsx` | Update (future) | Marker/shell only if needed | Isolation marker | None | Revert file |
| `apps/web/src/playback/v2/content.ts` | Update (future) | FR/EN authored copy | Localization & mandate | None | Revert file |
| `apps/web/src/playback/v2/modules.ts` | Update (future) | M1–M10 chapter data if needed | Journey rail | None | Revert file |
| `apps/web/src/playback/v2/branding.ts` | Update (future) | Branding presets (no invented College logo) | Identity | None | Revert file |
| `apps/web/src/playback/v2/playback.css` | Update (future) | Visual implementation quality | Themes/responsive | None | Revert file |
| `apps/web/src/playback/v2/__tests__/playback-v2.test.tsx` | Update (future) | Automated isolation & journey tests | QA gate | None | Revert file |

## C. Explicitly out-of-plan (must not change in Wave 2B)

| Path / area | Reason |
|-------------|--------|
| `apps/web/src/App.tsx` route topology for `/login` / `ProtectedRoute` | Production isolation — mount of `/playback/v2/*` may stay as-is; **do not** replace production routes |
| `apps/web/src/pages/LoginPage.tsx` | Production auth |
| `apps/web/src/auth/*` | Production auth |
| `apps/web/src/layouts/WorkspaceLayout.tsx` | Production shell |
| `apps/api/**` | No backend |
| `**/schema.prisma` / migrations | No schema |
| Professor pages/APIs | Preview-only; no implementation |
| James pilot scripts that mutate runs | Run 1/2 protection |
| Official `docs/` Master Contract | Frozen unless separately approved |
| Wave 2A P2 College logo / route rename | Deferred |

## D. Optional future evidence files (after implementation QA)

| Path | Action | Notes |
|------|--------|-------|
| `engineering/v2/playbacks/wave-2b-portal-login/QA_REPORT.md` | Create later | After automated + manual QA |
| `engineering/v2/playbacks/wave-2b-portal-login/OWNER_PLAYBACK_SCRIPT.md` | Create/update later | After Owner Green path |
| `engineering/v2/playbacks/wave-2b-portal-login/screenshots/*` | Create later | Evidence only |

## E. Production impact summary

- Architecture gate: **documentation only**  
- Future implementation: **isolated playback routes only**  
- Production login, workspace, API, schema, James runs: **zero intentional impact**
