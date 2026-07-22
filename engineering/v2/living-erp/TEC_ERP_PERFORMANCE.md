# TEC.ERP Performance (Living ERP)

## Goals

Keep the Living workspace responsive under normal pedagogical loads without introducing N+1 UI waterfalls or heavy client bundles for decorative chrome.

## Patterns in the worktree

| Pattern | Where | Intent |
|---------|-------|--------|
| Parallel `Promise.all` | LearnerHome, ModuleHub, Dashboard, Professor CC | Collapse startup RTTs |
| Non-critical `.catch` fallbacks | Capstone/exceptions on home; several professor feeds | Avoid hard-failing whole page |
| Cancellation flags | `useEffect` cleanup on home/hub/professor | Prevent stale setState |
| Skeleton / loading regions | Living `States` | Perceived performance |
| Context panel collapse | AppShell class | Reduce layout work when unused |
| CSS tokens / no image hero packs | `living-erp.css` | Light paint cost |

## Sensitive queries

- Professor Command Center loads many endpoints up front — acceptable for professor sessions; watch payload size of audit/AI lists (UI already slices top N in places).
- Learner home should not fetch full transaction history; it links out to Documents.
- KPI explanation is client-side enrichment — negligible cost.

## Guidance

1. Prefer server aggregation for unique-students / heatmap over client joins.
2. Avoid refetch storms on focus except where freshness matters (certificates already refreshes on focus — intentional).
3. Do not add large chart libraries solely for Living polish without a measured need.

## Partial

- No dedicated Lighthouse CI gate in this pack.
- Professor initial fan-out may need progressive section loading later.
