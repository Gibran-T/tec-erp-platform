# TEC.ERP Management Flight Simulation Contract

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1A Research Addendum · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Purpose

TEC.ERP simulates management flight: decisions move through time, capacity, and feedback loops — not only instant CRUD success messages.

## Simulated dynamics

| Dynamic | Pedagogical intent |
|---------|--------------------|
| Time | Actions have sequencing and calendars |
| Delays | Effects may appear next cycle/week/month |
| Accumulations | Inventory, backlog, receivables build |
| Backlogs | Work queues and approval queues |
| Bottlenecks | Capacity constraints create queues |
| Capacity | People, machines, warehouse slots |
| Inventory | Stock, allocation, replenishment |
| Service | OTIF, lead time, complaints |
| Cash | Timing of payments and receipts |
| Margin | Cost and pricing consequences |
| Risk | Control gaps, SoD, compliance |
| Workforce availability | Absences, skills, overload |
| Governance failures | Unauthorized actions, missing approvals |
| Feedback loops | Local fix → enterprise side effect |

## Effect dimensions (every relevant decision)

Every relevant decision MUST distinguish, where applicable:

| Axis | Distinctions |
|------|----------------|
| Timing | Immediate effect · Delayed effect |
| Scope | Local effect · Cross-department effect |
| Domain | Operational · Financial · Customer · Employee · Governance · KPI |

## Time progression options

| Option | Use |
|--------|-----|
| Immediate transaction | Document posted now |
| Next operational cycle | Shift / day boundary |
| Next week | Short operational delay |
| Next month | Financial / planning delay |
| Forecasted consequence | Labeled projection (not fact) |
| Simulated alternative | Counterfactual compare / replay |

## Guardrails

1. **No random unexplainable outcome.** Randomness only if authored, explained, and Professor-visible.  
2. **No invisible calculation.** Learner/Professor can obtain cause of material movements.  
3. **No consequence without traceability.** Source event + audit trace required.  
4. **No KPI movement without underlying cause.** KPIs follow Twin facts.  
5. **No narrative event contradicting the Digital Twin.** Ambient AI cannot invent opposing facts.

## Flight readout (conceptual)

After material decisions, Executive Impact Panel shows: Maintenant · Dans le processus · Dans l’entreprise · Dans le temps (`TEC_ERP_EXECUTIVE_IMPACT_AFTER_ACTION_CONTRACT.md`).

## Related contracts

- `TEC_ERP_DIGITAL_TWIN_PEDAGOGICAL_CONTRACT.md`  
- `TEC_ERP_AI_STAKEHOLDER_AND_ENTERPRISE_LIFE_ENGINE_CONTRACT.md`  
- `TEC_ERP_EXECUTIVE_IMPACT_AFTER_ACTION_CONTRACT.md`
