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

## Targets (ongoing)

- Keyboard operability across Mission Center legacy controls
- Visible focus using `--living-focus`
- Meaningful labels on icon-only controls (prefer text buttons — current Living CTAs are text)
- Tables with column headers on dashboard/exceptions/runs

## Partial / gaps

- Not a full WCAG audit certificate for every legacy workspace page.
- Student 360 JSON block is screen-reader heavy — needs structured headings/lists in a follow-up.
- Some decorative flow arrows rely on characters; ensure surrounding headings provide context (present on hubs/documents).
