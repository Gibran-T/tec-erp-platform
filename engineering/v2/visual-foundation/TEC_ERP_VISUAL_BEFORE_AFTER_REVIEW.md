# TEC.ERP — Visual Before / After Review

## Before references (rejected production-like)

| # | Path | Defects |
|---|------|---------|
| B1 | `engineering/v2/living-erp/evidence/final-smoke/05-v2-learner-home.png` | Dense header, repeated context, blue-border launcher, Accès actif × N, launcher-first |
| B2 | `engineering/v2/living-erp/evidence/final-smoke/29-dark-mode.png` | Hybrid dark: white tiles + pale titles, light chrome, invisible right panel |
| B3 | `engineering/v2/living-erp/evidence/final-smoke/27-tablet.png` | Dark main + white sidebar/tiles |
| B4 | `engineering/v2/living-erp/evidence/final-smoke/28-mobile.png` | Mixed strips, white tiles |

Copy retained under this gate as immutable “before” evidence (do not overwrite).

## After acceptance matrix (1440×900 target)

| Shot | Theme | Context | Expected |
|------|-------|---------|----------|
| 1 | Light | Open | Compact header, unified context line, learning summary first, themed panel |
| 2 | Light | Closed | Workspace expands; no hybrid whites |
| 3 | Dark | Open | Dark elevated cards; readable titles; dark panel |
| 4 | Dark | Closed | Full-width canvas; no white chrome |
| 5 | System→Light | — | Identical to Light tokens |
| 6 | System→Dark | — | Identical to Dark tokens |
| 7 | Tablet | — | Collapsed nav density |
| 8 | Mobile | — | Bottom nav; no horizontal overflow |

Close-ups required: compact header, navigation groups, primary summary, card hierarchy, right panel, green/yellow/red signals.

## After evidence (captured)

Directory: `engineering/v2/visual-foundation/evidence/after/`

| Shot | File |
|------|------|
| Light context open | `01-light-context-open.png` |
| Light context closed | `02-light-context-closed.png` |
| Dark context open | `03-dark-context-open.png` |
| Dark context closed | `04-dark-context-closed.png` |
| System→Light | `05-system-resolved-light.png` |
| System→Dark | `06-system-resolved-dark.png` |
| Tablet | `07-tablet.png` |
| Mobile | `08-mobile.png` |
| Close-ups | `closeup-header.png`, `closeup-navigation.png`, `closeup-primary-summary.png`, `closeup-signals.png`, `closeup-right-panel.png` |

Source fixture: `evidence/visual-smoke.html` (token-backed shell mock of James historical presentation).  
Owner should still confirm against the full React learner Home with isolated James local data.

## Before evidence copies

`engineering/v2/visual-foundation/evidence/before/` — copies of rejected final-smoke shots.

| Check | Evidence |
|-------|----------|
| Theme preference persistence | `visual-foundation-theme.test.tsx` |
| System resolves to light/dark only | same |
| OS preference change updates resolved | same |
| No Accès actif repetition | `workspace-shell.test.tsx` |
| Grouped navigation | `workspace-nav-parcours|operations|results|account` |
| Context default collapsed | `living-erp-shell.test.tsx` |
| Unified context line | `shell-unified-context` |
| Compact identity | `shell-learner-identity` |
| Signal accessible labels | `SignalLight` aria-label + text |

## Side-by-side narrative

| Concern | Before | After |
|---------|--------|-------|
| Header | Brand + Run badge + Curriculum badge + controls + large employee chip | One compact row; unified context line; avatar menu |
| Context duplication | Header + banner + home chips | Single shell context line; banner only for multi-run selector |
| Light | Flat white / pale | Ice canvas + white cards + navy text + subtle depth |
| Dark | White tiles on dark canvas | Token surfaces throughout shell/tiles/panel |
| System | Hybrid chrome | Exact resolved Light or Dark |
| Launcher | Dominant first viewport + Accès actif | Compact quick access below learning summary |
| Nav | Flat Applications list | PARCOURS / OPÉRATIONS / RÉSULTATS / COMPTE |
| Signals | Ad-hoc chips | Living Signal contract (green/yellow/red/blue/purple/gold) |

## Owner visual review

Full raster after-shots at 1440×900 against isolated James historical local data remain the owner visual gate. Automated suite validates structure, theme contract, and contrast token application; it does **not** alone declare GREEN.
