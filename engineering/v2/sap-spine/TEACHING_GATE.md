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
| Merge this branch | Not done (no commit required by owner yet) |
| Backup Postgres | Not done |
| `migrate deploy` including `20260725120000_v2_curriculum_version` + SAP self-report | Not done |
| Railway API + Web deploy of Teaching Gate SHA | Not done |
| Thiago professor + cohort (real emails) | Not done — runbook only |
| James Run 2 | Forbidden until Wave 9 owner auth |

**Verdict this session:** **ENGINEERING BRANCH READY FOR OWNER REVIEW** — **NOT CLASSROOM-OPEN**.
