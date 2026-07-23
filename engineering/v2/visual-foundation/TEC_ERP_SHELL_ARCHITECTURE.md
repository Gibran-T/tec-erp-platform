# TEC.ERP — Shell Architecture

## Compact header (desktop)

```
LEFT:   NordHabitat + compact learner identity
CENTER: unified context line — learner · Run N · curriculum · state · progress
RIGHT:  locale · theme preference · account menu · context-panel toggle
```

Implementation: `WorkspaceTopBar.tsx`  
Example presentation: `James Timothy · Run 1 · V1 · Historique · 30/30`  
Technical run labels stay in `title` tooltip only.

## Left navigation groups

| Group | Items |
|-------|-------|
| PARCOURS | Accueil, Modules M1–M10, Évaluations, Capstone |
| OPÉRATIONS ERP | Documents, Inbox, Tasks, Mission Center, Transactions/ERP, Dashboards, Coach IA |
| RÉSULTATS | Certificats, Historique |
| COMPTE | Profil (+ Administration for ADMIN) |

No « Accès en préparation » in primary navigation.  
Tablet: collapsed density; Mobile: drawer/bottom nav.

## Central workspace

Ice-blue (Light) / petroleum (Dark) canvas. Expands when context panel closes (`tec-app-shell--context-collapsed`).

## Right context panel

- Default **closed** when content is minimal.
- Auto-opens for rich context (historical journey, module hubs, Capstone).
- Bounded width `--context-width` (17.5rem).
- Fully token-themed; no repeated Run/curriculum line.
- Content: objective, evidence, restrictions, timeline, next decision.

## Duplication removal

- Removed separate Run/Curriculum badge boxes from header.
- `PedagogicalRunBanner` only when multiple runs (selector only).
- Learner Home no longer repeats curriculum chips already in the shell context line.
