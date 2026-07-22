# TEC.ERP Learner Information Architecture

## Primary question

“Where am I in my NordHabitat learning journey, and what should I do next?”

## IA map

```
Poste de travail (/workspace)
├── App launcher (registry apps)
├── État d’apprentissage actuel (progress, current block, next mission, Capstone)
├── Trajet d’apprentissage (M1–M10 cards → Module Hubs + Capstone + Or)
├── Activité récente
├── Attention requise
└── Instantané de compétences

Module Hub (/workspace/modules/:moduleCode)
├── Why / process map / missions / evidence / assessment link
└── Open mission → Centre de mission?mission=

Workspace apps (/workspace/apps/:appId)
├── Centre de mission — execute missions
├── Documents — document flow + transactions
├── Tableaux de bord — explained KPIs + exceptions
├── Coach IA — 5 pedagogical modes
├── Capstone — S1–S7 integrator
├── Certificats — Silver/Gold + verify
├── Évaluations — assessment center
├── Inbox / Tâches / ERP / Profil
└── (role) Professor / Admin
```

## Navigation principles

1. **Journey before apps** — home shows module hierarchy; launcher remains for workplace apps.
2. **Module before flat mission list** — hubs group the 3 missions per module (V2 10×3).
3. **Mission Center remains the execution surface** — hubs deep-link with `?mission=`.
4. **Capstone and Gold are milestones**, not regular modules — separate cards and apps.
5. **Historical runs are read-only** — badges and attention copy; no fake restart CTA.
6. **Curriculum version is always visible** — avoid V1/V2 false equivalence.

## States on home

| State | UI signal |
|-------|-----------|
| Loading | `SkeletonBlock` |
| Error | `ErrorState` |
| Empty course | `EmptyState` |
| Historical run | `RunBadge` historical + status chip |
| Capstone locked / revision | Attention list |
| Mission failed / in progress | Attention list |

## Partial areas

- Competency snapshot is heuristic from module completion, not a full competency graph UI.
- Recent activity is a short derived list, not a full ERP timeline explorer (that lives under Documents / Professor activity).
- Mobile bottom nav covers Home / Missions / AI / Capstone / Profile only.
