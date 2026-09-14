# TEC.ERP — Contrast and Accessibility

## Target

WCAG 2.1 AA for normal text and essential controls.

## Theme pairs (design intent)

| Surface | Light | Dark |
|---------|-------|------|
| Primary text on surface | `#0f2744` on `#ffffff` | `#eef3f8` on `#15202b` |
| Secondary text | `#3d5268` on `#ffffff` | `#b7c5d3` on `#15202b` |
| Canvas vs card | `#e4f0f8` vs `#ffffff` | `#0d1620` vs `#1a2734` |
| Nav active | blue electric on pale blue wash | blue electric on dark pale blue |
| Focus ring | `--living-focus` 2px | same token |

## Defects closed

- White card / pale title in Dark (launcher tiles now use `--living-surface` + `--living-text`).
- Invisible right-panel text (`#4b5563` on white) → `--living-text-secondary` on `--living-surface`.
- Hybrid System chrome → shell consumes tokens only.

## Non-color communication

Signals always include localized text + geometric light (`.living-signal__light` / `.living-status-chip__icon`).

## Reduced motion

`prefers-reduced-motion: reduce` disables progress transitions, shimmer, and signal glows.

## Automated coverage

- `visual-foundation-theme.test.tsx` — theme persistence, system resolution, signals
- `living-erp-shell.test.tsx` — locale/theme controls, context panel
- `workspace-shell.test.tsx` — landmarks, skip link, grouped nav, no Accès actif

## Manual / screenshot gate

Capture Light/Dark/System × panel open/closed + tablet/mobile at 1440×900 (see before/after review).
