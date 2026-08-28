# Implementation evidence — SAP-spine classroom work (in progress)

**Worktree:** `C:\Projetos\tec-erp-wt-sap-spine-los`  
**Branch:** `feature/los-sap-spine-classroom-finish`  
**Base:** `origin/main` @ `3e23022` (PR #34)

Harvested into this line:

- Course Edition M1 (`tec-erp-wt-course-edition-m1`)
- SAP IEE2E Étape B self-report (`Analyste_ERP_Processus_Affaires` uncommitted product source)
- Wave 2B SO-1048 mission-entry + thin playback UI (`tec-erp-wt-wave2b-portal-login`)

Then implemented Waves 2–7 on the same branch: production portal, CE M2–M10 (optional lab cushions), BI Studio, AI Decision Workspace, ELE M3 authored pilot, Teaching Decks **S1–S10** (Comfort Pack séances Collège — not M1–M10), professor freeze/compare UI.

**PR:** [#35](https://github.com/Gibran-T/tec-erp-platform/pull/35)  
**Isolation slice:** Course Edition progress is stored in `course_edition_progress` (`employeeId` + `moduleCode`). It does not create or mutate `PedagogicalCourseRun` (James Run 1 included).

**Not done:** merge, production migrate/deploy, Thiago professor creation, official `docs/` edits. SHA `c78b69c` was not merge-authorized.
