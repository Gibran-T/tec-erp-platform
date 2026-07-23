# TEC.ERP — Card and Typography System

## Card hierarchy

| Level | Class | Role |
|-------|-------|------|
| L1 Executive | `.living-card--l1` / `.living-home-section--primary` | Primary decision / summary |
| L2 Operational | `.living-card--l2` | Evidence, journey, attention |
| L3 Supporting | `.living-card--l3` | Quick access, technical detail |

Shared rules: consistent radius (`--radius-lg`), subtle border (`--living-border-subtle`), restrained shadow, high text contrast, semantic accent only when meaningful. **No bright blue outline on every card.**

## Typography tokens

| Token | Use |
|-------|-----|
| `--type-product` | Product / brand |
| `--type-page` | Page title |
| `--type-section` | Section title |
| `--type-card` | Card title |
| `--type-body` | Body |
| `--type-meta` | Metadata |
| `--type-label` | Labels |
| `--type-status` | Status chips |
| `--type-table` | Tables |

Font stack: `--font-ui` (Segoe UI / IBM Plex Sans) — professional enterprise density, not Inter-default prototype look.

## Density

- Header target ~3rem (`--header-height`)
- Reduced shell padding vs prior 0.75rem/1.5rem oversized chrome
- Compact launcher tiles (no min-height 5.5rem mandate)
- Disciplined gaps in `.living-learner-home`
