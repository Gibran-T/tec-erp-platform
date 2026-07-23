# TEC.ERP Performance (Living ERP)

## Goals

Keep the Living workspace responsive under normal pedagogical loads without introducing N+1 UI waterfalls or heavy client bundles for decorative chrome.

## Measured (final gate, 2026-07-22)

| Metric | Value |
|--------|-------|
| Web production build main JS | `dist/assets/index-Cpyf6WEK.js` **524.59 KB** (gzip **144.38 KB**) |
| CSS | `29.58 KB` (gzip 6.43 KB) |
| Vite warning | Chunk > 500 KB |
| Assessment | No observed user-facing initial-load defect in local smoke at 1440/900/390 viewports |
| Classification | **P2** — route-level lazy loading follow-up |

## Patterns in the worktree

| Pattern | Where | Intent |
|---------|-------|--------|
| Parallel `Promise.all` | LearnerHome, ModuleHub, Dashboard, Professor CC | Collapse startup RTTs |
| Typed empty DTO fallbacks | analytics heatmap/competencies | Avoid catch-union type holes without inventing fields |
| Cancellation flags | `useEffect` cleanup | Prevent stale setState |
| Skeleton / loading regions | Living `States` | Perceived performance |
| Context panel collapse | AppShell class | Reduce layout work when unused |

## Guidance

1. Prefer server aggregation for unique-students / heatmap over client joins.
2. Next P2: `React.lazy` for Professor Command Center, Capstone, Assessment Center, Admin.
3. Do not add large chart libraries solely for Living polish without a measured need.

## Partial

- No dedicated Lighthouse CI gate in this pack.
- Bundle warning remains documented P2 (not a smoke UX blocker).
