# TEC.ERP Design System (Living ERP)

## Source of truth

- CSS tokens: `apps/web/src/living-erp/living-erp.css`
- Status mapping: `apps/web/src/living-erp/components/StatusChip.tsx`
- Shell layout: `@tec-platform/ui` `AppShell` + Living overlays
- Color heritage: enterprise pale/strong blue (Fiori-adjacent), TEC institutional clarity — not purple-on-white marketing chrome

## Semantic tokens

Light (`:root` / `[data-theme="light"]`) and dark (`[data-theme="dark"]`) define:

| Token | Role |
|-------|------|
| `--living-canvas` | Page atmosphere |
| `--living-surface` / `--living-surface-solid` | Panels / cards |
| `--living-border` | Separators |
| `--living-text` / `--living-muted` | Primary / secondary copy |
| `--living-pale-blue` / `--living-strong-blue` | Brand / progress / focus family |
| `--living-green` | Success / completed |
| `--living-amber` | Warning / pause / revision |
| `--living-red` | Failure / locked / rejected |
| `--living-purple` | AI assistance only |
| `--living-gold` | Certification / premium milestone |
| `--living-gray` | Historical / archived / draft |
| `--living-flow` | Process-flow node wash |
| `--living-focus` | Focus ring target |
| `--living-shadow` | Light elevation |

Theme resolution sets `document.documentElement.dataset.theme` and `colorScheme`.

## StatusChip rules

Component: `StatusChip` + `toneForStatus(raw)`.

| Tone | Typical statuses |
|------|------------------|
| `green` | completed, approved, issued, resolved, passed |
| `strong` | active, in_progress, available, sent |
| `amber` | paused, revision_requested, stale, warning |
| `red` | failed, rejected, revoked, cancelled, error, locked |
| `gold` | gold, silver |
| `purple` | ai, coach |
| `gray` | historical, completed_run, archived, draft |
| `pale` | fallback / unspecified |

Rules:

1. Never show raw technical IDs as the only label — pair with `statusLabel()` where Living surfaces are wired.
2. Chip uses `role="status"`; icon is decorative (`aria-hidden`).
3. Purple tone is reserved for AI affordances, not general CTAs.
4. Gold tone is reserved for certification milestones.

## Composition primitives

- `RunBadge` / `CurriculumBadge` / `ProgressBar` — shell and journey hierarchy
- `EmptyState` / `ErrorState` / `SkeletonBlock` — async states
- `living-flow` / `living-flow__node` — process maps (module hub, document flow, presentation)
- `living-kpi-card` — explained KPI block
- `living-module-card` / `living-mission-card` — journey / hub cards

## Accessibility & motion

- Skip link to `#contenu-principal` in `WorkspaceLayout`
- `prefers-reduced-motion` disables progress-bar transition
- Focus color via `--living-focus`

## Honesty

Living CSS wraps the existing AppShell; Mission Center and many legacy pages still use older workspace classes. Full visual homogenization is **partial**.
