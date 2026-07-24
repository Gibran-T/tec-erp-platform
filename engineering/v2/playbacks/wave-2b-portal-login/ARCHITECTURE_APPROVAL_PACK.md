# Wave 2B — Architecture Approval Pack

> **Document type:** Governance / architecture approval pack  
> **Wave:** 2B — Portal / Login implementation (Academic Identity & Mission Entry)  
> **Status:** ARCHITECTURE PACK READY FOR OWNER/GOVERNANCE APPROVAL  
> **Implementation:** NOT STARTED  
> **Deploy:** NOT AUTHORIZED  
> **James Run 2:** NOT AUTHORIZED (must remain 0)  
> **Professor implementation:** NOT AUTHORIZED (preview-only)  

| Field | Value |
|-------|-------|
| Repository | `Gibran-T/tec-erp-platform` |
| Baseline SHA | `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9` |
| Branch | `feature/v2-portal-login-wave2b` |
| Worktree | `C:\Projetos\tec-erp-wt-wave2b-portal-login` |
| Scope source | Wave 2B Scope Authorization Gate (2026-07-24) — AUTHORIZE WAVE 2B SCOPE |
| Wave 2A | MERGED AND POST-MERGE GREEN (PR #34 @ `3e23022`) |

---

## 1. Objective

Convert Wave 2A Owner-Green Playback Zero into a **governed, isolated V2 Portal → Login → Mission Cockpit → Mandat actif → Mission 1 entry** implementation-quality slice that establishes TEC.ERP academic identity and living-enterprise orientation, without replacing production auth/routes, without creating James Run 2, and without implementing Professor, ELE runtime, or BI Studio.

## 2. Scope

- Isolated learner journey under `/playback/v2/*`
- Portal academic identity (TEC.ERP primary; Collège de la Concorde endorsement)
- Playback-only login (no real auth)
- Mission Cockpit landing on M1 Mandat SO-1048
- CTA **Commencer l’enquête** → Mission 1 secure preview
- Authored Digital Twin / pulse / inbox / evidence / Visible AI / Ambient AI previews
- FR/EN, Light/Dark/Projector, responsive, a11y, reduced-motion
- QA evidence pack and Owner playback continuity from Wave 2A

## 3. Non-goals

Full M1–M10 runtime · full Mission 1/2/3 execution · Professor workspace · live BI Studio · white-label system · College logo asset invention · `/orientation` rename · Capstone · production deploy · James Run 2 · production `/login`/auth replacement · backend rewrite · Prisma/schema/data changes · full AI autonomy / network AI · multi-tenant · certification automation · full assessment engine · Wave 2A P2/P3 cleanup · ELE Wave 5B · Teaching Deck full · Thiago Professor · Master Contract rewrite · production data mutation · James Run 1 modification

## 4. Route architecture

| Decision | Rationale |
|----------|-----------|
| Preserve `/playback/v2/*` | Wave 2A isolation proven; production untouched |
| Keep mount in `App.tsx` outside `ProtectedRoute` / `WorkspaceLayout` | Auth and shell isolation |
| Keep Cockpit at `/playback/v2/orientation` | No `/orientation` rename in this wave (P2 residual deferred) |
| Do not replace `/login` | Production `LoginPage` + `AuthContext` remain authoritative |
| Marker required on every surface | `PLAYBACK ZERO · NOT PRODUCTION` (or Wave 2B successor marker if Owner-approved without implying production) |

**Routes (unchanged topology):**

- `/playback/v2` → redirect `portal`
- `/playback/v2/portal`
- `/playback/v2/login`
- `/playback/v2/orientation` (Mission Cockpit)
- `*` → portal

## 5. Component architecture

| Decision | Choice |
|----------|--------|
| Evolve existing playback components | **Yes** — refine Wave 2A modules in place under `apps/web/src/playback/v2/` |
| Split `PortalPage` | **Not required for Wave 2B** — only extract if a single file exceeds maintainability during implementation checkpoint; prefer section components only when duplication or testability demands it |
| Dedicated `wave2b` subtree | **No** — avoid premature abstraction; stay in `playback/v2/` |
| Premature abstraction | Forbidden — no shared “V2 platform shell” rewrite; no Living ERP shell coupling |

**Primary components (existing, to evolve):**

- `PlaybackV2Root.tsx` — route shell + marker
- `PlaybackProvider.tsx` — authored local state
- `PortalPage.tsx` — academic portal
- `LoginPlaybackPage.tsx` — fake login
- `OrientationPage.tsx` — Mission Cockpit
- `PlaybackControls.tsx` — QA controls
- `content.ts` / `modules.ts` / `branding.ts` / `playback.css`

## 6. State architecture

- **Authored local React state only** via `PlaybackProvider`
- Locale, theme, viewport, level, selected module, ambient event, branding mode, simulation role, mission preview open, controls open
- No URL persistence requirements beyond existing routes
- No localStorage/sessionStorage auth tokens
- No backend sync

## 7. Data boundaries

- Authored Equinoxe SO-1048 demo Twin snapshot in content modules
- Demonstration data labeled
- No Prisma · no migrations · no seeds mutating runs · no production entity writes
- Future isolated V2 persistence is **out of this wave** and requires a separate gate

## 8. Service boundaries

- No new API modules
- No AI network services
- No professor / analytics / admin calls from the slice
- No coupling to `useAuth` / production login

## 9. Auth isolation

- Playback-only form submit navigates to Cockpit
- No credentials validated against API
- No JWT/cookies/session for playback
- Production `LoginPage` and `AuthProvider` untouched
- Tests must assert production `/login` is not rendered by playback routes

## 10. Digital Twin representation

- Authored Equinoxe enterprise as the body of the enterprise (pulse map, signals, demo KPIs)
- Read-only demo Twin — narrative must not contradict authored facts
- No authoritative Twin mutation

## 11. Enterprise Life Engine boundary

- Authored circulation/reaction previews only
- No ELE event engine
- No generative stakeholder runtime (Wave 5B deferred)
- Post-action reactions remain scripted for demo continuity

## 12. Visible AI boundary

**May:** clarify objective, surface gaps, ask questions, structure reasoning, reference authored evidence, label uncertainty.

**Must not:** submit missions, unlock progression, change score, give answer keys, approve Capstone/certify, replace learner judgment, mutate Twin, impersonate Professor unlabeled, call external AI.

Wave 2B delivers **authored coach preview only** — not AI Decision Workspace (Wave 5A).

## 13. Ambient AI boundary

**May:** authored stakeholder messages/reactions grounded in demo Twin + mandate.

**Must not:** fabricate official transactions, untraceable evidence, unlock progression, mutate historical runs, uncontrolled story drift, network generation.

## 14. Stakeholder model

Authored SO-1048 cast (preview): warehouse · supplier · ops/supervisor · finance signal · customer promise context. Profiles remain content-authored; no profile engine.

## 15. Document model

Authored mandate dossier previews (OTC process map, stock tension note, supplier delay note). Evidence counters remain demo (e.g., 0/3). No DB documents.

## 16. KPI / BI preview model

Executive-impact / KPI preview demo-labeled. Not BI Studio. Charts/signals are pedagogical illustration, not live analytics.

## 17. Mission Cockpit flow

1. Learner arrives from playback login  
2. Sees greeting, role, M1 module, class context, Professor availability (preview)  
3. Primary: Mandat actif SO-1048 situation + decision framing  
4. Pulse / inbox / evidence / learning context panels  
5. Mode explicit: Guided Practice  
6. CTA **Commencer l’enquête**  
7. Optional return to portal  

## 18. Mission 1 preview flow

1. CTA opens secure Mission 1 preview (modal/panel)  
2. Copy states full mission runtime is a later delivery  
3. No ERP transaction execution  
4. Close returns to Cockpit  
5. No progression write  

## 19. Accessibility

- Landmarks, labeled controls, keyboard focus on pulse nodes/nav/CTA  
- Contrast for Light/Dark/Projector  
- Reduced-motion disables non-essential path animation  
- Marker exposed as `role="status"`  

## 20. Responsive strategy

Viewport control (desktop/laptop/tablet/mobile) via playback controls + CSS; Owner playback must cover tablet + mobile.

## 21. Theme strategy

Playback-local themes: Light · Dark · Projector. Owner canvas token `#eef4f8` preserved. No production theme rewrite.

## 22. Localization strategy

FR/EN authored copy in `content.ts`. Institutional FR quality required. No hybrid residual terms introduced. EN parity for new strings.

## 23. Test architecture

See `QA_GATE_PLAN.md`. Extend Wave 2A vitest suite; assert isolation, marker, CTA, no-fetch/no-mutation, FR identity, M1–M10/Capstone rules.

## 24. Evidence architecture

Screenshots · Owner playback script · QA report · architecture pack · automated test log · git SHA evidence. Stored under this directory / screenshots when implementation evidence is produced (later gate).

## 25. Rollback design

- Revert Wave 2B PR/commit  
- Unmount `/playback/v2/*` only if emergency (prefer revert)  
- Production `/login` and workspace unaffected  
- No data rollback required (no persistence)

## 26. Security / privacy

- No real credentials  
- Demo email/password hardcoded for playback only  
- No PII collection  
- No secrets in repo  
- Do not log passwords  

## 27. Performance

Static authored content; no network AI; keep pulse map interactions within existing Wave 2A performance envelope; avoid large new assets without Owner approval.

## 28. Migration / data impact

**None.** No schema, seed, or run mutations. James Run 1 immutable. James Run 2 count remains 0.

## 29. Professor boundary

Preview-only controls with `APERÇU — NON IMPLÉMENTÉ` / `PREVIEW — NOT IMPLEMENTED`. No Professor dependency for slice completion. Waves 6–8 remain future.

## 30. James Run boundary

- James Run 1: untouched  
- James Run 2: not created (Wave 9)  
- Wave 2B only prepares UX readiness for future V2 runs  

## 31. Production isolation

| Rule | Enforcement |
|------|-------------|
| Outside ProtectedRoute | `App.tsx` topology |
| Outside WorkspaceLayout | `App.tsx` topology |
| No production nav link | Do not add |
| Marker always visible | UI + tests |
| No auth coupling | LoginPlaybackPage only |
| No deploy | Gate prohibition |

## 32. Risks

See `RISK_REGISTER.md`.

## 33. Approval gates

1. Scope approval — **DONE**  
2. Architecture approval — **THIS PACK**  
3. Implementation checkpoint — **NOT YET AUTHORIZED**  
4. Automated validation  
5. Manual QA  
6. Owner playback  
7. Governance review  
8. Code review  
9. Merge authorization  
10. Post-merge verification  
11. James Run 2 authorization — later  
12. Deploy authorization — separate  

## 34. Implementation sequencing

See `IMPLEMENTATION_PLAN.md`. Implementation remains blocked until Architecture Approval + Implementation Checkpoint.

## 35. File-level change plan

See `FILE_CHANGE_PLAN.md`.

---

## Explicit architecture decisions (A–H)

### A. Route strategy
Preserve `/playback/v2/*`. No production route replacement. No `/orientation` rename in this wave.

### B. Component strategy
Evolve existing `playback/v2` components. Do not introduce a dedicated wave2b subtree. Split `PortalPage` only if forced by size/testability at implementation checkpoint. Avoid premature abstraction.

### C. State strategy
Authored local state only. No backend. No Prisma. No production persistence.

### D. Auth strategy
Playback-only local flow. No real authentication. No tokens. No production auth coupling.

### E. Mission Cockpit strategy
Landing state shows SO-1048 mandate, pulse, inbox, evidence expectations, CTA, and Mission 1 preview modal. Mode = Guided Practice.

### F. AI strategy
Authored Visible AI + authored Ambient AI with classification labels and auditability. No network AI.

### G. QA strategy
Exact tests, isolation assertions, responsive/theme/a11y, no-fetch/no-mutation — see `QA_GATE_PLAN.md`.

### H. File plan
See `FILE_CHANGE_PLAN.md`.

---

## Implementation checkpoint criteria (future)

Implementation may begin only after Owner/governance approve this pack and authorize an Implementation Checkpoint that confirms:

- branch/worktree still at authorized baseline lineage  
- this pack unchanged in intent (or formally revised)  
- no production route/auth/schema work in the plan  
- first PR limited to documentation-approved file plan  

**This document does not authorize implementation.**
