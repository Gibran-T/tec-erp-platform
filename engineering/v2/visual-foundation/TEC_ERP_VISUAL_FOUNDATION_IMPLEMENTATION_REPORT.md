# TEC.ERP — Visual Foundation Implementation Report

**Branch:** `fix/v2-living-erp-visual-foundation`  
**Baseline:** `c625ed506640c8b8658a17f8994cd83f5c907331`  
**Worktree:** `C:\Projetos\tec-erp-wt-visual-foundation`

## Summary

Recovered the Living ERP visual foundation: semantic Light/Dark/System theme contract, Living Signal System, compact shell with unified context line, grouped learner navigation, proportional context panel, card/typography density, launcher demotion, localization hygiene for shell/home chrome.

## Scope integrity

| Allowed | Done |
|---------|------|
| Design tokens / CSS theme | Yes — `living-erp.css` |
| Shared shell / cards / status | Yes |
| Learner Home presentation | Yes (foundation only) |
| Localization mapping | Yes — shell/home keys |
| A11y / responsive shell | Yes |

| Forbidden | Status |
|-----------|--------|
| Professor features / Thiago | Not touched |
| James Run 2 | Not created |
| Curriculum / scoring / Capstone policy | Unchanged |
| Schema / production data | Unchanged |
| Deploy / merge | Authorized — controlled Web deploy after green gates |

## Key files

- `apps/web/src/living-erp/living-erp.css`
- `apps/web/src/theme/ThemeProvider.tsx`
- `apps/web/src/living-erp/components/SignalLight.tsx`
- `apps/web/src/living-erp/components/StatusChip.tsx`
- `apps/web/src/components/workspace/WorkspaceTopBar.tsx`
- `apps/web/src/components/workspace/WorkspaceSidebar.tsx`
- `apps/web/src/layouts/WorkspaceLayout.tsx`
- `apps/web/src/pages/workspace/LearnerHomePage.tsx`
- `apps/web/src/index.css` (shell hard-code removal)
- `apps/api/scripts/visual-foundation-james-local-seed.mjs` (local fixture only)

## Documentation set

1. `TEC_ERP_VISUAL_FOUNDATION_AUDIT.md`
2. `TEC_ERP_THEME_CONTRACT.md`
3. `TEC_ERP_LIVING_SIGNAL_SYSTEM.md`
4. `TEC_ERP_SHELL_ARCHITECTURE.md`
5. `TEC_ERP_CARD_AND_TYPOGRAPHY_SYSTEM.md`
6. `TEC_ERP_CONTRAST_ACCESSIBILITY.md`
7. `TEC_ERP_VISUAL_BEFORE_AFTER_REVIEW.md`
8. `TEC_ERP_VISUAL_FOUNDATION_IMPLEMENTATION_REPORT.md` (this file)
9. `TEC_ERP_PR32_FULL_APP_VALIDATION.md`
10. `TEC_ERP_PR32_RELEASE_AND_DEPLOYMENT_EVIDENCE.md`

## Verification

- Real full-app local validation (API 3013 + Web 5177 + James historical fixture)
- Screenshots: `evidence/full-app-release/`
- Web unit tests 97/97 (including visual-foundation-theme + shell regressions)
- Typecheck / lint / build / env:check green
- Scope remains visual/presentation only

## Full-app release fixes (Sheriff gate)

- Capstone label localization (`MCapstone` → `Capstone`)
- Unified context accessibility duplication removed
- Legacy Tailwind white/gray remap for ERP/organization theme coherence
- Local seed first-day task key alignment for ERP unlock in fixture
