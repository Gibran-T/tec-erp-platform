# TEC.ERP Module Learning Hubs

## Route

`/workspace/modules/:moduleCode` → `ModuleHubPage`

Entered from Learner Home journey cards (`/workspace/modules/{M1…M10}`).

## Purpose

Answer: “Why does this ERP module matter, what process am I in, which missions are mine, and what evidence/assessment follows?”

## Sections (implemented)

1. **Header** — module title, status chip, run + curriculum badges, progress, competency summary, process tags
2. **Pourquoi ce module compte** — purpose / process context / downstream impact (`MODULE_WHY` map M1–M10 with curriculum-aware M8–M10 notes)
3. **Carte de processus** — `living-flow` from `processTags` or fallback nodes
4. **Missions du module** — cards with status chip, unlock explanation, locked message, or **Ouvrir la mission**
5. **Preuves du module** — narrative evidence bullets (documents, exceptions, competencies)
6. **Évaluation du module** — link to `evaluations` app

## Mission open behavior

```
navigate(`/workspace/apps/centre-mission?mission=${missionKey}`)
```

Locked missions show status + explanation; no open CTA.

## Data

- `requestModule(moduleCode)`
- `listMyPedagogicalRuns()` for run/curriculum badges

## Partial / honesty

- `MODULE_WHY` copy is front-end pedagogical narrative, not CMS-authored content.
- Evidence section is summary guidance, not a live evidence ledger per document ID.
- Assessment section links out; does not embed the assessment player.
- V1 historical curricula still surface via API module shape; hub does not invent fake V2 structure for V1.
