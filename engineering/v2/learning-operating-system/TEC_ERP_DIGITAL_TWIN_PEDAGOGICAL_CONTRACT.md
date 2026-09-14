# TEC.ERP Digital Twin Pedagogical Contract

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1A Research Addendum · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Core rule

TEC.ERP uses **one persistent fictional enterprise** (Digital Twin) as the factual source of truth for V2 learning simulation state.

V1 historical runs remain **immutable and isolated** from V2 simulation state.

## Master state

company · departments · employees · customers · suppliers · products · warehouses · cost centers · accounts · roles · permissions

## Transactional state

sales orders · purchase orders · receipts · deliveries · invoices · payments · inventory movements · approvals · service cases · HCM events · audit events

## Operational state

inventory · backlog · capacity · productivity · lead time · service level · fulfillment · supplier performance

## Financial state

revenue · cost · margin · cash · receivables · payables · inventory value · commitments

## Risk state

access risk · segregation · audit findings · compliance · data quality · process exceptions · unresolved approvals

## Module obligation

Every module MUST read from or change the **same** enterprise Twin for a given pedagogical Run (V2). No private contradictory mini-worlds per module.

## Change traceability

Every important change MUST identify:

| Field | Meaning |
|-------|---------|
| Source event | What triggered the change |
| Affected entities | Master/transaction objects |
| Affected processes | Chain links impacted |
| Affected stakeholders | Who should react or be informed |
| Immediate consequence | Now |
| Delayed consequence | Later (labeled timing) |
| Evidence | Learner-visible proof |
| Audit trace | System/Professor-visible |
| Learner visibility | What the learner can see |
| Professor visibility | What the Professor can see |

## Authority vs narrative

| Layer | May mutate Twin? |
|-------|------------------|
| Governed system actions / approved rules | Yes |
| Professor-triggered governed events | Yes (within scenario rules) |
| AI-generated stakeholder communication | Narrative only unless paired with governed mutation |
| Visible AI coaching | Never |
| Exploration mode | No official mutation |
| Historical V1 runs | Never |

## Continuity and isolation

- Same Twin continuity across M1–M10 within a V2 Run.  
- Cohort/Run isolation as configured by Professor control (Wave 7).  
- James Run 1 / V1 history: consult-only; no new stakeholder events; no Twin writes from V2 engines.

## Related contracts

- `TEC_ERP_END_TO_END_PROCESS_CHAIN_CONTRACT.md`  
- `TEC_ERP_AI_STAKEHOLDER_AND_ENTERPRISE_LIFE_ENGINE_CONTRACT.md`  
- `TEC_ERP_V1_V2_HISTORICAL_AND_CURRENT_CONTRACT.md`
