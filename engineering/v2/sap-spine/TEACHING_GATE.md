# Teaching Gate — classroom open checklist

**Branch:** `feature/los-sap-spine-classroom-finish`  
**Rule:** No first class until this gate is **PRODUCTION GREEN**. This file records engineering readiness on the branch, not authorization to teach.

## Product lock (must remain true)

- [x] SAP = official course reference  
- [x] TEC.ERP = sofa (order, cohort, autodéclaration, optional cushions)  
- [x] 10 × 180 min calendar (not 1-year teaching spine)  
- [x] No SAP screen clone / no scrape / self-declared SAP progress  
- [x] James Run 1 not mutated on this branch  
- [ ] Official `docs/` patches applied (owner yes still required — see PROPOSED_DOCS_PATCHES.md)

## Surfaces on this branch

| Surface | Path / entry | Wave |
|---------|--------------|------|
| Academic portal | `/` | 2 |
| Login (academic dual reminder) | `/login` | 2 |
| Parcours SAP (self-report) | `/workspace/apps/parcours-sap-iee2e` | 1 |
| Course Edition M1–M10 | `/workspace/modules/{code}/course-edition/` | 1+3 |
| Mission entry playback SO-1048 | `/playback/v2/mission-entry` | 1 |
| BI Studio | `/workspace/apps/tableaux-bord` | 4 |
| AI Decision Workspace | `/workspace/apps/coach-ia` | 5 |
| ELE M3 authored pilot | BI Studio + Module Hub M3 | 5B |
| Teaching Deck | `/workspace/teaching-deck/{S1–S10}?professor=1` | 6 |
| Professor freeze/compare | Command Center pedagogical control | 7 |
| Session packs | `teaching-deck/packs/` + Session 1 CE pack | 0+6 |

## LOS 40 criteria — engineering stance

Implemented as **product foundations** on this branch (portal 5-second dual message, process maps on hubs, decks 17 slides/module, 3-mission roles, BI interpretation path, Visible AI synthesis gate, historical-run copy, V2 M8/M9/M10 keys, Capstone separate, FR/EN chrome, theme modes, no secrets).

Still **owner / production** before claiming full LOS GREEN:

- Server-authoritative freeze and ELE event engine (Wave 7 UI is local until API is promoted)
- Full visual BI contract vs CSS/KPI cards
- Ambient AI distinct runtime (authored M3 notes only)
- Production V2 migrate + professor + cohort
- Z1-006 full 30-mission browser revalidation on production SHA

## Production (Wave 8) — blocked until owner

| Step | Status |
|------|--------|
| Merge this branch | Not done — SHA `c78b69c` blocked on CE/James isolation; correction slice awaiting re-review |
| Backup Postgres | Not done |
| `migrate deploy` including `20260725120000_v2_curriculum_version` + SAP self-report + `20260828200000_course_edition_progress` | Not done |
| Railway API + Web deploy of Teaching Gate SHA | Not done |
| Thiago professor + cohort (real emails) | Not done — runbook only |
| James Run 2 | Forbidden until Wave 9 owner auth |

## PR review pendencies (not in the James isolation slice)

Recorded from SHA `c78b69c` review. Left unfixed until the owner accepts impact. They do not change the SAP S1–S10 calendar.

| Severity | Item | Impact if unfixed before first class |
|----------|------|--------------------------------------|
| Medium | Public portal footer links to `/playback/v2/portal` | Students can enter the isolated playback prototype from the academic front door. Label says prototype; still mixed navigation. |
| Medium | `/poc/sap-iee2e` and `/playback/v2/*` are unauthenticated | Demo/PoC surfaces reachable without Collège login. |
| Low | Teaching Deck `?professor=1` | Speaker notes visible to any authenticated user who has the URL (notes do not contain SAP quiz answers). |
| Low | SAP séance 1 calendar keyed by `professorId` only | One professor with two cohorts would publish a single Semaine Zéro date. |
| Low | Professor freeze/compare is `localStorage` | Honest UI (“état local”); not server-authoritative cohort control. |

**James isolation slice:** Course Edition uses table `course_edition_progress` (`employeeId` + `moduleCode`). GET is read-only. PUT never writes `PedagogicalCourseRun`. James Run 1 is not created or mutated by Course Edition.

**Verdict this session:** **CORRECTION SLICE — NOT MERGE-AUTHORIZED — NOT CLASSROOM-OPEN**.
