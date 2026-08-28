# Governance — no SAP clone (Wave 0 / Agent E)

## Hard rules

| ID | Rule |
|----|------|
| SAP-GOV-001 | No reproduction of SAP GUI, Fiori chrome, or Learning Hub screenshots as product UI. |
| SAP-GOV-002 | No scrape, crawl, or unofficial API against learning.sap.com. |
| SAP-GOV-003 | SAP progress in TEC.ERP is self-declared; TEC.ERP never certifies SAP Achievement. |
| SAP-GOV-004 | No shared SAP accounts. Semaine Zéro requires one Hub login per learner. |
| SAP-GOV-005 | No proprietary SAP Learning text, quiz items, or media in git. Public metadata (unit titles, durations, official URLs) only. |
| SAP-GOV-006 | AI Coach must not reveal SAP exam answers or impersonate SAP support. |
| SAP-GOV-007 | Professor projector mode defaults to anonymized cohort evidence. |
| SAP-GOV-008 | James Run 1 is read-only for this program. No production seed of fabricated professor emails. |
| SAP-GOV-009 | Secrets stay in Railway env — never in repo. |
| SAP-GOV-010 | Claims “SAP partner / SAP-certified TEC.ERP course” are forbidden without a separate institutional authorization. |

## Allowed

- Links to official SAP Learning URLs
- Self-report PUT/GET under `/api/v1/me/sap-iee2e-self-report`
- Professor cohort view of **declared** progress
- Comfort Pack / Teaching Deck authored by TEC (process language, not SAP UI)
- NordHabitat lab documents clearly labeled as simulation

## EduQA

Student-facing AI remains coach-not-answer-engine (`docs/09`). Visible AI never mutates scores, unlocks, or certificates. Ambient / ELE events (M3 pilot only) never write historical V1 runs.
