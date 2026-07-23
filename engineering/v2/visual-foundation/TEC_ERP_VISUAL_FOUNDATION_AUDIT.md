# TEC.ERP — Living ERP Visual Foundation Audit

**Branch:** `fix/v2-living-erp-visual-foundation`  
**Baseline SHA:** `c625ed506640c8b8658a17f8994cd83f5c907331`  
**Audit date:** 2026-07-22  
**Status:** Confirmed defects — implementation blocked until this document exists (gate §1).

## Product principle (target)

Premium enterprise operations and learning control environment.  
Not: gaming dashboard, Bootstrap launcher, white form on dark chrome, neon decoration, or independent card collage.

Visual priority order: decision → operational state → learning progress → evidence → action → technical detail.

## Before evidence (rejected production-like screenshots)

| File | Defects visible |
|------|-----------------|
| `engineering/v2/living-erp/evidence/final-smoke/05-v2-learner-home.png` | Dense header, repeated Run/curriculum, blue-border launcher, repeated « Accès actif », launcher-first viewport, pale right panel |
| `engineering/v2/living-erp/evidence/final-smoke/29-dark-mode.png` | Hybrid dark: white tiles with pale titles, light sidebar/right panel, invisible panel text, white chrome on dark canvas |
| `engineering/v2/living-erp/evidence/final-smoke/27-tablet.png` | Dark main + white sidebar/tiles hybrid |
| `engineering/v2/living-erp/evidence/final-smoke/28-mobile.png` | Mixed light/dark strips, white tiles, bottom-nav density |

---

## Confirmed defects → responsible component / token

| ID | Confirmed defect | Owner (file / class / token) |
|----|------------------|------------------------------|
| D01 | Header consumes excessive vertical/horizontal space | `WorkspaceTopBar.tsx`, `.workspace-topbar`, `.living-shell-controls`, `.tec-app-shell__top-nav` padding |
| D02 | Run / curriculum / learner context repeated | TopBar `RunBadge` + `CurriculumBadge`; `PedagogicalRunBanner`; `LearnerHomePage` header badges; employee chip |
| D03 | Light mode pale, flat, weak | `--living-canvas` wash + white surfaces; `index.css` flat `#ffffff` shell; weak shadow `--living-shadow` |
| D04 | Dark mode broken contrast | `index.css` hard-coded `#ffffff` on `.tec-app-shell__{top-nav,sidebar,right-panel}` and `.workspace-app-tile` overriding `living-erp.css` tokens |
| D05 | White cards with nearly white / pale titles | `.workspace-app-tile` white bg + inherited / muted title color against dark canvas glare |
| D06 | Right-side content nearly invisible | `.workspace-context-panel__checklist { color: #4b5563 }` on forced white panel; light gray text on light panel in dark hybrid |
| D07 | System behaves as visual hybrid | ThemeProvider correctly sets `data-theme`, but shell/tiles ignore tokens → System→Dark still shows Light chrome |
| D08 | Application launcher dominates learner home | `LearnerHomePage` renders `<AppLauncherGrid />` before learning summary |
| D09 | Normal status « Accès actif » repeated | Hard-coded in `AppTile.tsx` on every day1 tile |
| D10 | Excessive blue borders on cards | `.workspace-app-tile--day1 { border-color: #0a6ed1 }` |
| D11 | Prototype / generic launcher feel | Flat Inter stack, blue outlines, link-grid first, hard-coded FR labels |
| D12 | Does not feel like a living ERP | Priority inverted: controls/launcher before decision/progress |
| D13 | Right panel space without proportional value | Default open (`contextCollapsed = false`); generic first-day checklist for all states |
| D14 | Visible English / technical labels | QA display names in header; product terms Capstone/Run; residual raw enums via `humanizeTechnicalId` |
| D15 | Hierarchy prioritizes controls over learning | Shell control cluster + launcher before « État d'apprentissage » |
| D16 | « Accès en préparation » semantics in nav path | Dead preparing badge path in `WorkspaceSidebar`; copy still references preparing access |
| D17 | Main wash fights dark theme | `.tec-app-shell__main` white gradient overlay in `living-erp.css` |
| D18 | Employee badge stays light in dark | `.workspace-employee-badge__trigger` `#f9fafb` / `#e5e7eb` |
| D19 | Active nav hard-coded light wash | `.workspace-sidebar__link--active` `#e8f4fd` / `#0a6ed1` |
| D20 | Typography dual source / unused tokens | `index.css` Inter vs unused `packages/ui/src/tokens/typography.ts` |
| D21 | Flat card hierarchy (no L1/L2/L3) | Same `.living-*-card` / `.workspace-app-tile` treatment for all surfaces |
| D22 | No reusable SignalLight contract | Only `.living-status-chip__icon`; neon semantic system not formalized |
| D23 | Sidebar is flat app list, not grouped | Single « Applications » + module map; no PARCOURS / OPÉRATIONS / RÉSULTATS / COMPTE |
| D24 | Context duplicated in page header | Home section repeats curriculum + run status already in shell |

---

## Theme architecture (before)

1. Preference persisted: `light` | `dark` | `system` (`tec-erp.theme`).
2. Resolved theme written to `document.documentElement.dataset.theme`.
3. Semantic tokens defined in `living-erp.css` under `:root` / `[data-theme="light"]` / `[data-theme="dark"]`.
4. **Failure:** `index.css` imports living CSS then **redefines** shell selectors with light-only hex, winning cascade.
5. Launcher tiles and employee badge never consume `--living-*`.
6. Result: System and Dark resolve correctly in data attributes but render hybrid chrome.

## Shell structure (before)

```
header: brand + RunBadge + CurriculumBadge + locale + theme + context toggle + employee chip
main: PedagogicalRunBanner (Run · type · status · %) + page
sidebar: flat Applications list + M1–M10
right: always-open first-day checklist / mission
home: welcome (with curriculum chips) → AppLauncherGrid → learning state
```

## Root causes (summary)

1. **Cascade override** of semantic tokens by legacy `index.css` hard-coded whites.
2. **Hard-coded component colors** on tiles, badges, sidebar active, context panel text.
3. **Information architecture** repeats Run/curriculum/learner across three bands.
4. **Home composition** leads with launcher instead of learning/decision summary.
5. **Missing signal/card/typography contracts** — tones exist partially but are incomplete and inconsistently applied.

## Implementation constraints (this wave)

Allowed: tokens, CSS/theme architecture, shared shell/cards/status, learner Home presentation, localization mapping, a11y/responsive shell.  
Not allowed: Professor features, progression/assessment/Capstone/certification logic, schema/curriculum changes, James Run 2, Thiago Professor, deploy, merge.

## Gate note

No implementation may begin until this audit file exists on the branch. Subsequent commits implement the Theme Contract, Living Signal System, compact shell, navigation groups, card/typography hierarchy, contrast restore, and learner Home visual reduction.
