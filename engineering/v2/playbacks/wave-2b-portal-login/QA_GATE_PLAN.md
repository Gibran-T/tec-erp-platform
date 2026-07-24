# Wave 2B — QA Gate Plan

> **Status:** PLAN ONLY — TESTS NOT YET EXTENDED IN THIS GATE  
> **Implementation:** NOT STARTED  
> **Deploy / James Run 2 / Professor implementation:** NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch / worktree:** `feature/v2-portal-login-wave2b` @ `C:\Projetos\tec-erp-wt-wave2b-portal-login`

## Existing baseline to preserve

Wave 2A suite in `apps/web/src/playback/v2/__tests__/playback-v2.test.tsx` (17 tests Owner Green). Must remain green.

## Exact tests to add or strengthen (future implementation gate)

1. **Production isolation** — playback routes do not render `production-login` / `login-page`  
2. **Marker present** on portal, login, cockpit  
3. **Journey** — portal → login → orientation (cockpit) navigation  
4. **CTA** — `Commencer l’enquête` / Start the inquiry visible and opens Mission 1 preview  
5. **Preview framing** — states full mission not yet delivered / secure preview  
6. **No M11** — module count 10; Capstone separate  
7. **Visible vs Ambient AI** — distinguishable labels; no hybrid “IA Ambient” FR regression  
8. **Owner canvas** — `#eef4f8` attribute preserved  
9. **Professor preview badge** — preview-not-implemented separation  
10. **Theme attributes** — light/dark/projector toggle updates `data-pb-theme`  
11. **Locale** — FR/EN switch updates headings without residual hybrid terms introduced by Wave 2B  
12. **Reduced motion / keyboard** — focusable pulse nodes; motion-sensitive paths gated (manual + automated where feasible)  

## Production-isolation assertions

- `/playback/v2/*` outside `ProtectedRoute` (static review of `App.tsx`)  
- No `useAuth` import under `playback/v2/`  
- No fetch/XHR during playback journey (spy `fetch` / `globalThis.fetch` in tests)  
- No navigation to production `/workspace` from playback login submit  

## No-fetch / no-mutation assertions

- `vi.spyOn(globalThis, "fetch")` expect not called during portal/login/cockpit/preview  
- No Prisma / API scripts invoked by web tests  
- Confirm no seed scripts run as part of Wave 2B QA  

## Responsive / theme / a11y coverage

| Mode | Coverage |
|------|----------|
| Light / Dark / Projector | Automated attribute + Owner manual |
| Desktop / laptop / tablet / mobile | Playback viewport control + Owner manual |
| Keyboard | Pulse node, nav, CTA, controls |
| Reduced motion | OS setting / Owner script |

## Package gates (future)

```text
pnpm --filter erp-web test
pnpm --filter erp-web typecheck   # or repo-equivalent
pnpm --filter erp-web lint        # or repo-equivalent
pnpm turbo --filter=erp-web... build
```

## Governance checks (every PR)

- James Run 1 untouched  
- James Run 2 count remains 0  
- Professor not implemented  
- No schema/backend/data files in diff  
- Learning-contract worktree not used  

## Pass criteria

All automated tests green · Owner playback accepted · Isolation proven · No prohibited files in diff.

## Fail / HOLD criteria

Any production auth coupling · network AI · schema change · James mutation · implementation without checkpoint authorization.
