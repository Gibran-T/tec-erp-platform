# TEC.ERP Living ERP — Implementation Report

## Baseline

| Item | Value |
|------|-------|
| Worktree baseline / main reference | `c6c242a` |
| Production SHA | `76709d6` **HOLD** |
| PR #26 | Open, independent, untouched |
| Docs pack | `engineering/v2/living-erp/` (this folder) |

## Delivered surfaces (worktree)

### Shell & preferences

- `ThemeProvider` (light/dark/system) wrapping app
- `LocaleProvider` (FR default, EN switch, status/date helpers, login error localization)
- `WorkspaceTopBar` run/curriculum badges + locale/theme + context collapse
- `WorkspaceLayout` skip link, Living bottom nav, pedagogical banner
- `living-erp.css` + StatusChip / Badges / States / KpiExplainedCard

### Learner

| Surface | File | Status |
|---------|------|--------|
| Learner home | `LearnerHomePage.tsx` | **Implemented** — journey, attention, competencies |
| Module hubs | `ModuleHubPage.tsx` + route | **Implemented** |
| Document flow strip | `TransactionWorkspacePage.tsx` | **Implemented** (plus existing tabs) |
| Explained KPIs | `DashboardPage.tsx` + `kpiCatalog.ts` | **Implemented** |
| AI Coach modes | `AiCoachPage.tsx` | **Implemented** — 5 modes + safeguards |
| Capstone locked CTA | `CapstonePage.tsx` | **Implemented** — S1–S7 stepper + CTA hide |
| Certificates | `CertificatesPage.tsx` | **Retained / lightly integrated** |
| Mission Center | `MissionCenterPage.tsx` | **Retained** — discovery via hubs/home |

### Professor

| Surface | File | Status |
|---------|------|--------|
| Command Center | `ProfessorCommandCenterPage.tsx` | **Implemented** — 14 sections + presentation + legacy |
| Unique-students alias | `pedagogical-run.routes.ts` + web API client | **Implemented** |
| Student 360 | section in Command Center | **Partial** — functional, JSON-heavy |
| Analytics / AI / interventions / compare | sections | **Implemented at explorer depth** |

### Tests added/extended (representative)

- `apps/web/src/__tests__/living-erp-shell.test.tsx` — locale, theme, context, login FR, Capstone locked CTA
- `apps/api/src/modules/pedagogical-run/__tests__/professor-unique-students.route.test.ts`
- Workspace shell tests updated for Living layout expectations

## Known P2 closures (wave)

| # | Item | Closure |
|---|------|---------|
| 1 | EN login validation in FR | Closed (provider + test) |
| 2 | Professor unique-students | Closed (alias + test) |
| 3 | Capstone locked CTA | Closed (UI + test) |
| 4 | Raw enum leakage | Partial — Living labels; legacy pages remain |
| 5 | Historical vs current | Closed on shell/home; deepen elsewhere |
| 6 | Mixed-language labels | Partial — catalogs for shell; page bodies mixed |
| 7 | Unexplained KPIs | Closed (explained cards) |
| 8 | Unknown professor labels | Partial |
| 9 | Concatenated labels | Partial |
| 10 | Flat 30-mission list | Closed via hubs/home hierarchy |

## Remaining gaps (honest)

1. Full EN translation of legacy Mission Center / transactions / Capstone body copy
2. Student 360 structured panels (replace JSON dump)
3. Professor activity/documents/exceptions specialized explorers (beyond shared audit list)
4. Per-KPI rich catalog entries beyond default template
5. Mission Center visual Living homogenization
6. Browser smoke evidence not yet filled (template only) — local only, no prod writes
7. Production deploy still HOLD; James integrity / prod mutation out of scope
8. AI mode as first-class persisted server enum (client framing today)
9. Progressive loading for Professor Command Center fan-out
10. Formal a11y audit beyond skip link / roles / reduced motion

## Explicit non-delivery

- No production deployment or production data writes
- No merge/interference with PR #26
- No assessment answer keys in docs or UI
- No claim of full Living visual redesign of every pre-wave page

## Documentation pack files

See directory listing under `engineering/v2/living-erp/` — 21 markdown specifications including this report.
