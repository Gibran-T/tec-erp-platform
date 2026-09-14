# TEC.ERP — Living Signal System

## Principle

Neon is **semantic**, never decorative. Never use neon as full-page or full-card background.

## Signals

| Signal | Token | Meaning |
|--------|-------|---------|
| GREEN NEON | `--signal-green` | healthy, completed, valid, compliant, recovered |
| YELLOW NEON | `--signal-yellow` | attention, pending, recoverable risk, review required |
| RED NEON | `--signal-red` | blocked, failed, critical, intervention required |
| BLUE ELECTRIC | `--signal-blue` | selection, active process, primary nav, current mission |
| PURPLE LUMINOUS | `--signal-purple` | AI assistance, advisory insight |
| CONTROLLED GOLD | `--signal-gold` | certification, final approval, verified achievement |

## Usage

- Small status lights, active edges, timeline nodes, process lines, attention indicators.
- Dark: restrained soft glow via `--signal-glow-*`.
- Light: saturated clean color, glow tokens transparent.
- Always pair color with **icon/shape + localized text**.

## Components

- `SignalLight` — `apps/web/src/living-erp/components/SignalLight.tsx`
- `StatusChip` — `apps/web/src/living-erp/components/StatusChip.tsx`
- Helpers: `signalToneForStatus`, `toneForStatus`

## Non-goals

- Do not repeat « Accès actif » as a green/blue badge on every tile.
- Exceptional states only: Action requise, En attente, Verrouillé, Historique, Révision requise, Terminé, Approuvé, Bloqué.
