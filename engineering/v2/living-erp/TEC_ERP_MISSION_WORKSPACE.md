# TEC.ERP Mission Workspace

## Surface

Primary execution UI: `MissionCenterPage` at `/workspace/apps/centre-mission`.

Living ERP **does not replace** the Mission Center engine UI; it improves discovery (home + module hubs) and deep-links with `?mission=`.

## Learner flow

1. Discover next mission on Learner Home or Module Hub
2. Open Mission Center (optionally preselected mission)
3. Read briefing / context / interactions
4. Submit decisions per mission interaction model
5. Receive feedback, unlock next, feed documents/KPIs

## State matrix (mission cards)

| Status | UX |
|--------|----|
| `locked` | Badge + `unlockExplanation` when present; no open that bypasses gates |
| `available` / `in_progress` | Open CTA |
| `completed` / `failed` | Status visible; retry guidance where API provides it |
| Historical run | Write paths blocked by run writability / banner |

## Living integrations

- Module Hub mission buttons → Mission Center query param
- Home “prochaine action” → same deep link
- Status chips / localized labels on Living surfaces; Mission Center still uses legacy `workspace-mission__*` classes in places

## Partial areas

- Full Living visual restyle of Mission Center interactions is **not** done.
- Flat 30-mission list remains available inside Mission Center; hierarchy is provided by hubs/home.
- No answer keys or expected choices documented here.
