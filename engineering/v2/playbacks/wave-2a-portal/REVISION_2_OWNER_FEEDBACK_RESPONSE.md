# Revision 2 — Owner Feedback Response Matrix

**Status:** implemented for Owner re-playback  
**Branch:** `feature/v2-portal-experience-playback-zero`  
**Owner canvas preserved:** `--pb-canvas: #eef4f8` / `OWNER_CANVAS_TOKEN`

| Issue | Design response | Files changed | Evidence | Status | Rationale |
|---|---|---|---|---|---|
| background | Preserved Owner light-blue neutral as Surface 1; three-surface hierarchy | `playback.css`, `branding.ts` | Portal Light | resolved | No uncommitted Owner diff found; `#eef4f8` retained |
| hero emptiness | Hero becomes live enterprise demonstration with compact preview | `PortalPage.tsx`, `content.ts`, `playback.css` | Hero + live preview | resolved | Demonstration over explanation |
| enterprise map | Floating labels → Enterprise Pulse Map with paths, flow, tension, detail panel | `PortalPage.tsx`, `modules.ts`, `playback.css` | Pulse Map | resolved | Circulation metaphor made visible |
| repeated cards | Distinct visual grammar per section; fewer white card grids | `playback.css`, `PortalPage.tsx` | Full portal | resolved | Section-specific surfaces |
| M1–M10 horizontal scroll | Four chapter groups; wrapping module grids; no rail scroller | `PortalPage.tsx`, `modules.ts` | Chapter journey | resolved | Desktop readable without h-scroll |
| dual journey | Enterprise ↔ professional strip + chapter axis labels | `PortalPage.tsx`, `modules.ts` | Dual journey | resolved | Required mappings visible |
| Executive Impact | Decision BI panel with separated dl labels, sparks, demo tag | `PortalPage.tsx`, `content.ts` | BI panel | resolved | Decision-oriented, French terms |
| AI terminology | IA visible / IA ambiante; communication timeline | `content.ts`, `PortalPage.tsx` | AI section | resolved | No Ambient/Coach Visible hybrids |
| Professor visualization | Classroom orchestration board + disabled preview controls | `PortalPage.tsx` | Professor | resolved | Teaching orchestration, not admin dump |
| login | Split product context + auth; role selector removed from form | `LoginPlaybackPage.tsx` | Login College / Independent | resolved | Continuity + account-determined role |
| orientation | Mission Cockpit with dominant CTA → safe mission preview | `OrientationPage.tsx` | Cockpit Light/Dark/Mobile | resolved | Post-login mandate first |
| French quality | Full FR pass; no Investigatez / PO qty / learner hybrids | `content.ts`, pages | FR portal | resolved | Professional learner-facing French |
| College branding | TEC.ERP primary; textual College endorsement | `branding.ts`, pages | Login College | resolved | No fabricated logo (asset missing → P2) |
| independent product mode | Playback control switches College ↔ TEC.ERP indépendant | `PlaybackControls.tsx`, `branding.ts` | Independent login/portal | resolved | Prototype only; not multi-tenant |
| internal wave terminology | Removed from learner UI; marker + APERÇU only | `content.ts`, pages, tests | Portal text audit | resolved | Professional product language |

## Future notes

- Route `/orientation` retained technically; UI concept = Mission Cockpit. Recommended future: `/playback/v2/mission-cockpit`.
- Branding config = design direction for white-label later; **not** delivered multi-tenant.
- College logo: **missing authorized asset** → text endorsement only (P2).
