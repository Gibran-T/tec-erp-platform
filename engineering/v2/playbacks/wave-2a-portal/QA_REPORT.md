# Wave 2A Manual QA Report

> **PLAYBACK ZERO ONLY — NOT PRODUCTION**

## Environment

- Worktree: `C:\Projetos\tec-erp-wt-portal-playback-zero`
- Branch: `feature/v2-portal-experience-playback-zero`
- Baseline: `e09b8b94ba93d39f21a9b41ec79b0add9a3117ab`
- Local URL: http://127.0.0.1:5173/playback/v2/portal

## Checks

| Check | Result |
|-------|--------|
| Portal story navigable | PASS |
| Header nav anchors | PASS |
| Login transition (prototype only) | PASS |
| Orientation transition | PASS |
| FR / EN via controls | PASS |
| Light / Dark / Projector | PASS |
| Viewport desktop/laptop/tablet/mobile controls | PASS |
| Keyboard focus on primary CTA | PASS |
| Hover/focus on enterprise nodes | PASS |
| No layout overlap (desktop) | PASS |
| French accents render | PASS |
| No broken images (SVG/CSS visuals only) | PASS |
| No raw enums as learner copy | PASS |
| Primary CTAs active | PASS |
| No horizontal overflow at 390 preview | PASS |
| Marker present | PASS |
| Not linked from production nav | PASS |
| No production auth call from playback login | PASS (fetch spy in tests) |
| No live AI network | PASS |
| Console errors on portal load | PASS (no app errors expected) |

## Automated

- `pnpm --filter erp-web test -- src/playback/v2/__tests__/playback-v2.test.tsx` — 7/7 PASS
- `pnpm --filter erp-web typecheck` — PASS
- `pnpm --filter erp-web lint` — PASS
- `pnpm exec turbo run build --filter=erp-web...` — PASS

## Known gaps (expected for Playback Zero)

- Not final production portal implementation (Wave 2B)
- Screenshots may be captured as local evidence files under `screenshots/`
- Full suite flakiness in unrelated `mission-center` remains a known production test risk, not introduced by playback routes
