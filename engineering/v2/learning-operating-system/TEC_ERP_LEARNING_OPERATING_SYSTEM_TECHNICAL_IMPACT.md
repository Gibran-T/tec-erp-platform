# TEC.ERP Learning Operating System — Technical Impact Assessment

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1 + Wave 1A Research Addendum · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

**Do not implement these changes in this wave.** Classification: reusable · extend · refactor · new subsystem · preserve.

## Wave 1 impacts (preserved)

| Area | Likely impact | Class |
|------|---------------|-------|
| Routes | Add portal public IA; module cycle routes; BI Studio; AI workspace; Teaching Deck; Historique | extend |
| DTOs | Evidence objects; KPI definition; mastery states; deck manifests | extend |
| Mission catalog | Keep keys; enrich pedagogical metadata (role, evidence, BI/AI links) | extend |
| Curriculum overlays | Already V1/V2; keep authority in mission-catalog | preserve |
| Run versioning | pedagogicalCourseRun.curriculumVersion | preserve |
| Evidence model | New persistence / projection for evidence graph | extend / refactor |
| Assessments | Multi-format items beyond MCQ; HCM_M8 remains | extend |
| BI endpoints | Richer KPI metadata + analysis submissions | extend / refactor |
| AI endpoints | Mode + evidence refs + synthesis gate | extend |
| Content storage | Module blueprints → structured content packs | extend |
| Teaching Deck content | New content type + assets | extend |
| Localization | FR/EN catalogs for all new surfaces | extend |
| Image assets | Process visuals pipeline | extend |
| Presentation mode | Professor presentation shell | extend |
| Accessibility | Projector + learner modes | extend |
| Performance | BI queries + deck assets budgets | extend |
| Migration risk | Avoid V1 rewrite; additive only | preserve |

## Wave 1A Research Addendum — future technical subsystems

| Area | Implication (contract only) | Class |
|------|-----------------------------|-------|
| Stakeholder profile registry | Named profiles with authority, incentives, knowledge bounds | new subsystem |
| Event engine | Deterministic / rule / scenario / Professor / delayed events | new subsystem |
| Narrative grounding | Bind ambient text to Twin + documents + prior messages | new subsystem |
| Digital Twin state service | Master/transactional/operational/financial/risk projections | extend / new subsystem |
| Authoritative vs narrative state | Hard split; narrative cannot silently write Twin | new subsystem |
| Communication history | Channel-classified message store | extend |
| Event scheduling | Next cycle/week/month delayed consequences | new subsystem |
| Delayed consequences | Flight-sim timing with audit | new subsystem |
| AI prompt governance | Mode, authority, no-answer-key, Twin grounding | extend |
| Retrieval context | Mandate, docs, KPIs, prior comms, mode | extend |
| Evidence traceability | Link actions → events → preuves | extend |
| Professor event controls | Freeze, trigger, suppress, reveal, compare | extend / new subsystem |
| Scenario authoring | BEFORE/DURING/AFTER packs + event scripts | new subsystem |
| Deterministic test mode | Replayable fixtures without live LLM | new subsystem |
| Simulation replay | Decision path replay for debrief | new subsystem |
| Cost controls | Token budgets per cohort/mode | extend |
| Token usage | Metering and caps | extend |
| Latency | Classroom-safe timeouts + progressive UI | extend |
| Safety | No progression unlock / score mutation by AI | extend |
| Privacy | No sensitive trait inference; PII minimization | preserve / extend |
| Localization | FR/EN stakeholder + channel copy | extend |
| Audit | Full event and mutation audit trail | extend |
| Fallback when AI unavailable | Authored packs + deterministic events | extend / reusable |

## Preserve absolute

James Run 1 V1 data · certificates · Capstone approvals · integrity semantics · Professor count unchanged by this wave · no ELE writes into historical runs
