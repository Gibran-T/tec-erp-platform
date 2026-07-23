# TEC.ERP Accessibility (Living ERP)

## Implemented affordances

| Item | Where |
|------|-------|
| Skip link to main | `WorkspaceLayout` → `#contenu-principal` |
| Main landmark focusable | `tabIndex={-1}` on main content wrapper |
| Status semantics | `StatusChip` `role="status"`; alerts use `role="alert"` |
| Tab patterns | AI modes, transaction tabs, professor nav `aria-current` |
| Language | `html[lang]` follows locale |
| Theme / contrast | Light/dark token sets; system preference supported |
| Reduced motion | Progress bar transition disabled under `prefers-reduced-motion` |
| Mobile nav | Bottom links for key learner destinations |
| Presentation overlay | Quit control restores pointer access to nav |

## Final gate notes (2026-07-22)

| Surface | Automated | Manual spot |
|---------|-----------|-------------|
| Login / home / module / mission / assessment / Capstone | Visual smoke + roles | Keyboard not fully scripted |
| Professor overview / Student 360 / Presentation | Smoke screenshots | Presentation quit verified |
| Verdict | **No P0/P1 a11y blockers observed in smoke** | Not a full WCAG certification |

## Targets (ongoing P2)

- Formal axe-core suite on the nine listed routes
- Student 360 structured headings instead of JSON dump
- Visible focus audit on legacy Mission Center controls

## Partial / gaps

- Not a full WCAG audit certificate for every legacy workspace page.
- Some decorative flow arrows rely on characters; surrounding headings provide context on hubs/documents.
