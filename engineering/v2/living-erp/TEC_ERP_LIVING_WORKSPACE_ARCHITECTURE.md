# TEC.ERP Living Workspace Architecture

## Intent

Living ERP turns the authenticated workspace into a **coherent ERP learning environment**: shell + learner home + module hubs + mission/document/KPI/AI/Capstone surfaces, with a parallel Professor Command Center. Business missions remain the unit of learning; UI is a workplace, not a form farm.

## Layering (apps/web)

```
ThemeProvider → AuthProvider → LocaleProvider → BrowserRouter
  ProtectedRoute
    WorkspaceLayout (AppShell)
      WorkspaceTopBar (run/curriculum badges, locale, theme, context toggle)
      WorkspaceSidebar (RBAC app list)
      PedagogicalRunBanner
      Outlet → LearnerHomePage | ModuleHubPage | WorkspaceAppPage
      WorkspaceContextPanel (collapsible)
      living-bottom-nav (mobile)
```

Shared Living primitives live under `apps/web/src/living-erp/`:

- `living-erp.css` — tokens, chips, flow, cards, professor presentation
- `components/StatusChip.tsx`, `Badges.tsx`, `States.tsx`, `KpiExplainedCard.tsx`
- `kpiCatalog.ts` — KPI explanation enrichment

## Route composition

| URL | Responsibility |
|-----|----------------|
| `/workspace` | Learner command surface (`LearnerHomePage`) |
| `/workspace/modules/:moduleCode` | Module Learning Hub |
| `/workspace/apps/:appId` | App switch (`WorkspaceAppPage` + `appRegistry`) |

`getAppPath("accueil")` resolves to `/workspace`; all other day-1 apps use `/workspace/apps/{id}`.

## Shell contracts

- **Left:** role-filtered apps (`getSidebarApps`).
- **Center:** pedagogical/operational content.
- **Right:** contextual panel; collapsible via top bar (`tec-app-shell--context-collapsed`).
- **Top:** NordHabitat brand, active run + curriculum badges, language, theme, employee menu.
- **Banner:** pedagogical run status (writable vs historical).

## Data dependencies (learner)

| Concern | Typical API |
|---------|-------------|
| Course / modules | `/course` overview + module detail |
| Runs | `listMyPedagogicalRuns` |
| Missions | Mission Center / mission APIs |
| Documents | transaction document APIs |
| KPIs / exceptions | analytics dashboards/KPIs/exceptions |
| Capstone / Gold | capstone + gold-eligibility |
| AI Coach | ask + interaction log |
| Certificates | list + public verify |

## Professor surface

`appId=portail-professeur` → `ProfessorCommandCenterPage` (14 command sections + Presentation Mode + legacy portal escape). Company-scoped APIs only; no cross-tenant browse.

## Non-goals

- No production deploy from this pack.
- PR #26 remains independent.
- Does not replace simulation engine or mission catalog content.
- Does not invent new business rules in the UI layer.
