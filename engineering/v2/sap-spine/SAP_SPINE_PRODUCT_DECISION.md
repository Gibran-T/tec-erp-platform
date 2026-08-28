# SAP Spine — Product Decision (Wave 0)

**Status:** LOCKED for engineering · official `docs/` unchanged until owner approves [PROPOSED_DOCS_PATCHES.md](PROPOSED_DOCS_PATCHES.md)  
**Date:** 2026-08-28  
**Product:** TEC.ERP — Analyste ERP et Processus d'Affaires

## Decision

1. **SAP Learning Hub (IEE2E)** is the course to be taught: official content, quizzes, practice systems, Achievement.
2. **TEC.ERP** is the sofa: session order, cohort, Semaine Zéro, self-declared progress, Teaching Deck S1–S10, optional NordHabitat cushions. It is not the course calendar.
3. Classroom time is **10 Collège sessions × 180 min** following Comfort Pack `SESSION_PLANS` (SAP units 1, 2, 3, 4, 4, 5, 6, 7, 8, 9). Unit 4 occupies two sessions because SAP’s official duration is 6 h 24 min.
4. The **1-year virtual timing** and **M1–M10 as the session spine** belong to the previous TEC.ERP-as-the-course design. They remain a lab library only — never 1:1 with Collège séances.
5. TEC.ERP must not clone SAP/Fiori screens, scrape Learning Hub, or certify SAP progress. Progress shown in TEC.ERP for SAP is **self-declared**.
6. Each learner needs an **individual** SAP Learning Hub account. Sharing is forbidden.
7. **James Run 1** remains immutable. James Run 2 and Thiago professor production setup wait for Teaching Gate + owner ops.
8. Teaching does not start until the Teaching Gate in [TEACHING_GATE.md](TEACHING_GATE.md) is green.

## Architecture 1C-A

```
SAP Learning Hub  →  the course (content, quiz, practice systems, Achievement)
TEC.ERP sofa      →  order, comfort, cohort, autodéclaration, optional lab cushions
Professor         →  Comfort Pack + Teaching Deck S1–S10 + mediation
```

## What falls away as classroom spine

| Former blueprint spine | Replacement |
|------------------------|-------------|
| 30 h = 1 corporate year | 10 × 180 min Collège sessions |
| Student “lives May at NordHabitat” as the course | SAP unit of the week is the course; NordHabitat is the lab case |
| TEC.ERP as the ERP of the classroom | SAP is the ERP of the classroom; TEC.ERP is the thinking room |
| Teaching Deck as replacement for SAP | Teaching Deck S1–S10 follows SAP units; TEC modules are optional cushions |
| One TEC module per Collège session | Forbidden — SAP unit 4 spans séances 4–5; P2P is séance 7 (unité 6), not séance 3 |

NordHabitat canon (Tom 40/36, Claire, DC-MTL, SKU-HVAC-4421) **stays** as lab narrative inside Course Edition / missions. It is no longer the calendar of the college course.

## Non-goals

- SAP screen reproduction
- Claiming TEC.ERP is SAP-certified or an official SAP partner product
- Copying proprietary SAP Learning content into the repo
- Opening a cohort before Teaching Gate
