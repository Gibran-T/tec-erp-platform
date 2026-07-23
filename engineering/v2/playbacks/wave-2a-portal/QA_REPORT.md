# QA Report — Wave 2A Portal Playback Zero (Revision 2)

## Scope

Visual Revision 2 of isolated Playback Zero routes under `/playback/v2/*`.

## Automated

| Check | Result |
|---|---|
| Playback tests (`playback-v2.test.tsx`) | PASS (16) |
| erp-web typecheck | PASS |
| erp-web lint | PASS |
| Full erp-web tests | PASS (114 / 19 files) |
| erp-web build (`turbo --filter=erp-web...`) | PASS |

## Manual checklist

| Viewport / mode | Result | Notes |
|---|---|---|
| 1440 desktop | PASS (manual) | Cockpit uses available width |
| 1024 laptop | PASS (manual) | |
| 768 tablet | PASS (manual) | Mission full width, panels below |
| 390 mobile | PASS (manual) | Mandate + CTA first; no h-overflow |
| FR | PASS | No Investigatez / Wave / IA Ambient |
| EN | PASS | Locale switch |
| Light | PASS | Owner canvas `#eef4f8` |
| Dark | PASS | Elevated surfaces, not crushed black |
| Projector | PASS | Larger type; simplified readability |
| College branding | PASS | Text endorsement |
| Independent branding | PASS | Endorsement hidden |
| Keyboard | PASS | Pulse nodes / modules focusable |
| Reduced motion | PASS | CSS `prefers-reduced-motion` disables pulse animations |
| Mission Cockpit | PASS | One primary CTA → mission preview modal |
| No dead CTA | PASS | Preview modal (safe) |
| No production mutation | PASS | No fetch/auth calls |
| No horizontal overflow (journey) | PASS | Chapter grids |

## Isolation

- Production `/login` untouched  
- No Prisma / backend / migration changes  
- No live AI network calls  
- James Run 1 / Run 2 / Professor production data untouched  

## Screenshots

See `screenshots/README.md` — capture list for Owner evidence pack (Revision 2).

## Residual risks

- P2: authorized College logo asset not in repository  
- Mission 1 full experience not implemented (safe preview only)  
- Visual “alive” feeling is subjective — Owner gate required  
