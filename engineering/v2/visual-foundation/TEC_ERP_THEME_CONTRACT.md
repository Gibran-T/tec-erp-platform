# TEC.ERP — Theme Contract

**Branch:** `fix/v2-living-erp-visual-foundation`  
**Authority:** Living ERP Visual Foundation Recovery

## Rendered themes

Exactly **two** rendered themes:

| Rendered | `data-theme` | Surfaces |
|----------|--------------|----------|
| LIGHT | `light` | Cool neutral app bg, ice-blue canvas, white cards, deep navy text |
| DARK | `dark` | Near-black navy app bg, petroleum canvas, elevated dark cards, soft white text |

**SYSTEM is not a third rendered theme.**

## Preference persistence

- Storage key: `tec-erp.theme`
- Allowed values: `light` | `dark` | `system`
- Provider: `apps/web/src/theme/ThemeProvider.tsx`
- Context exposes: `preference`, `resolved`, `setPreference`

## System resolution

1. Observe `prefers-color-scheme`.
2. Resolve fully to `light` or `dark`.
3. Write only the resolved value to `document.documentElement.dataset.theme`.
4. Set `document.documentElement.style.colorScheme` to the same resolved value.
5. Listen for OS preference changes while preference === `system`.
6. Never leave hybrid attributes (`data-theme="system"` is forbidden).

## Semantic tokens

Owned by `apps/web/src/living-erp/living-erp.css`:

- Surfaces: `--living-app-bg`, `--living-canvas`, `--living-surface`, `--living-surface-elevated`, `--living-surface-muted`
- Text: `--living-text`, `--living-text-secondary`, `--living-muted`
- Borders / shadow: `--living-border`, `--living-border-subtle`, `--living-shadow`
- Signals: `--signal-green|yellow|red|blue|purple|gold`
- Typography: `--type-*`, `--font-ui`

Shell chrome (`.tec-app-shell__*`), tiles, badges, and context panel **must** consume these tokens.  
`index.css` must not reintroduce hard-coded `#ffffff` shell overrides (root cause of hybrid Dark).

## Diagnostics

- Header exposes `data-resolved-theme` on `.workspace-topbar`.
- Unit tests assert preference persistence, OS change, and no hybrid `data-theme`.
