# TEC.ERP AI Stakeholder and Enterprise Life Engine Contract

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1A Research Addendum · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Purpose

Give the fictional enterprise a governed voice and reaction system without replacing learner judgment or corrupting authoritative Twin state.

**Pilot posture:** Enterprise Life Engine begins as a **controlled pilot** (recommended: M3 Procure-to-Pay). Do not activate full AI-driven company life across all modules at once. Wave **5B**.

## Visible AI vs Ambient AI

| Class | Role | Examples |
|-------|------|----------|
| **Visible AI** | Learner reasoning coach | Explanation, diagnosis, decision preparation, review, reflection |
| **Ambient AI** | Stakeholders + organizational response | Messages, objections, approvals narrative, scenario evolution, controlled enterprise life |

Visible AI = AI Decision Workspace / Coach path.  
Ambient AI = Enterprise Life Engine stakeholder layer.

The Digital Twin remains the **factual source of truth**.

## Enterprise Life Engine role

The Engine gives the enterprise:

voice · requests · objections · approvals · negotiations · escalations · operational communication · human reactions · contextual pressure

## Supported stakeholder categories

customer · supplier · supervisor · manager · executive · buyer · salesperson · warehouse employee · finance employee · controller · HR employee · IT employee · auditor · compliance officer · service agent

## Stakeholder profile schema

Every stakeholder profile MUST define:

name · role · department · responsibilities · authority · decision limits · objectives · incentives · constraints · knowledge · unavailable knowledge · communication style · urgency behavior · relationships · escalation rules · conflict rules · pedagogical function

## Response grounding (required)

Stakeholder responses MUST be grounded in:

- Digital Twin state  
- Current module  
- Current mandate  
- Learner action  
- Documents  
- Process  
- Prior communication  
- Stakeholder authority  
- Active learning mode  
- Professor-configured scenario rules  

## Generatable communication types

inbox message · email · operational chat · request · approval · rejection · objection · counterproposal · supplier response · customer complaint · supervisor question · finance warning · warehouse constraint · HR concern · audit request · executive challenge · simulated meeting · simulated call · delayed event

## Hard prohibitions

The Engine MUST NOT:

- Contradict authoritative data  
- Fabricate official transactions  
- Create untraceable evidence  
- Approve beyond authority  
- Change scores  
- Unlock progression  
- Expose answer keys  
- Decide for the learner  
- Mutate historical runs  
- Produce uncontrolled story drift  
- Change company facts without a governed event  

## Communication classification

Every communication MUST be classified as one of:

| Class | Meaning |
|-------|---------|
| System fact | Twin/authoritative fact |
| Stakeholder communication | Ambient AI / authored stakeholder message |
| AI coaching | Visible AI |
| Simulated projection | Forecast / what-if (labeled) |
| Professor intervention | Explicit Professor action |

## Post-action reaction check

Every important learner action MUST be evaluated for:

affected stakeholders · triggered communication · operational reaction · financial reaction · service reaction · workforce reaction · governance reaction · delayed consequence

**Core rule:** No important learner action should disappear silently. The enterprise MUST react through data, documents, KPIs, stakeholders, or risk.

## Communication channels

- Boîte de réception  
- Chat opérationnel  
- Appel simulé  
- Réunion simulée  
- Comité de direction  
- Notification de processus  
- Alerte de contrôle  

## Stakeholder complexity by level

| Level | Behavior |
|-------|----------|
| NOVICE | Clear identity; one issue at a time; direct information; role explained |
| INTERMEDIATE | Partial information; conflicting interests; follow-up required; less explicit guidance |
| ADVANCED | Ambiguity; pressure; competing priorities; objections; negotiation; delayed response; political and operational tension |

## Recommended M3 pilot stakeholders

supplier · buyer supervisor · warehouse · finance · customer

---

## Enterprise Life Engine event model

Every event MUST define:

| Field | Description |
|-------|-------------|
| Event type | Taxonomy label |
| Trigger | What caused it |
| Source | System / rule / Professor / AI narrative |
| Digital Twin entities | Linked objects |
| Affected process | Chain / process |
| Affected stakeholders | Who receives / reacts |
| Timing | Immediate / delayed / scheduled |
| Channel | Inbox, chat, comité, etc. |
| Factual payload | Twin-aligned facts |
| Narrative payload | Communicative wording |
| Authority | Who may say/do this |
| Confidence | Certainty label |
| Pedagogical purpose | Why the event exists |
| Learner action required | None / acknowledge / decide / respond |
| Evidence generated | What becomes preuve |
| State mutation permitted | Yes/No + rule id |
| Audit trace | Required |
| Expiry | When event ages out |
| Escalation | Next event if ignored |

### Event kinds

| Kind | May mutate authoritative Twin? |
|------|--------------------------------|
| Deterministic event | Only if governed rule says yes |
| Rule-based event | Only via approved rules |
| Scenario-authored event | Per scenario governance |
| AI-generated communication | **No** by itself |
| Professor-triggered event | Yes if within Professor controls |
| Delayed consequence | Yes if scheduled governed effect |
| Forecasted projection | **No** (label as projection) |

**Authority rule:** AI may generate communication. Only governed rules or approved system actions may mutate authoritative business state.

## Historical-run protection

- V1 / James Run 1: no new stakeholder events, no ELE writes.  
- Closed evaluation evidence: immutable.  
- Consulter surfaces: read-only.

## Fallback when AI unavailable

Core learning continues via authored scenario packs, deterministic events, and Professor facilitation. Ambient AI silence must not block mission completion paths that have non-AI alternatives.

## Related contracts

- `TEC_ERP_AI_DECISION_WORKSPACE_CONTRACT.md` (Visible AI)  
- `TEC_ERP_DIGITAL_TWIN_PEDAGOGICAL_CONTRACT.md`  
- `TEC_ERP_MANAGEMENT_FLIGHT_SIMULATION_CONTRACT.md`  
- `TEC_ERP_LEARNING_OPERATING_SYSTEM_TECHNICAL_IMPACT.md`
