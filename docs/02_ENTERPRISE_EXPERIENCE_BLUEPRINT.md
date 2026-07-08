# TEC.ERP — Enterprise Experience Blueprint

**Document:** Enterprise Experience Blueprint  
**Version:** 1.0 — The Student's Professional Journey  
**Status:** Official Operational Guide — Bridge Document  
**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires  
**Pilot Institution:** Collège de la Concorde  
**Programme Owner Objective:** Deliver the course as soon as possible without compromising institutional quality *(Nadia / institutional mandate)*

---

> *Constitutional authority: `docs/00_ENTERPRISE_UNIVERSE_BIBLE.md` — immutable. Do not modify.*  
> *The student does NOT progress through lessons. The student progresses through a career.*  
> *The educational journey is invisible. The professional journey is visible.*

**Bridge flow:**

```text
Enterprise Universe Bible (immutable)
        ↓
Student Experience (this document)
        ↓
Learning Architecture
        ↓
Scenario Execution
        ↓
Future Software Implementation
```

---

# Table of Contents

- [Part 0 — The Complete Professional Journey](#part-0--the-complete-professional-journey)
- [Part 1 — Enterprise Learning Journey](#part-1--enterprise-learning-journey)
- [Part 2 — Complete Module Architecture](#part-2--complete-module-architecture)
- [Part 3 — Complete Scenario Architecture](#part-3--complete-scenario-architecture)
- [Part 4 — Enterprise Workspace Experience](#part-4--enterprise-workspace-experience)
- [Part 5 — Human Interaction Architecture](#part-5--human-interaction-architecture)
- [Part 6 — AI Collaboration Architecture](#part-6--ai-collaboration-architecture)
- [Part 7 — Living Learning Flow](#part-7--living-learning-flow)
- [Part 8 — Emotional Journey](#part-8--emotional-journey)
- [Part 9 — Professional Competency Map](#part-9--professional-competency-map)
- [Part 10 — Living Assessment Architecture](#part-10--living-assessment-architecture)
- [Part 11 — Story Continuity](#part-11--story-continuity)
- [Part 12 — Release Mapping](#part-12--release-mapping)
- [Part 13 — Production MVP Definition](#part-13--production-mvp-definition)

- [Part 13 — Production MVP Definition](#part-13--production-mvp-definition)
- [Part 14 — Professional Growth Architecture](#part-14--professional-growth-architecture)
- [Part 15 — AI Enterprise Participation (Day 1 → Year End)](#part-15--ai-enterprise-participation-day-1--year-end)
- [Part 16 — Human Interaction Playbook](#part-16--human-interaction-playbook)
- [Part 17 — Scenario Chapters (Narrative Experience)](#part-17--scenario-chapters-narrative-experience)
- [Part 18 — Module Experience Maps (Complete)](#part-18--module-experience-maps-complete)

---

# Document Authority & Hierarchy

| Priority | Document | Role |
|---|---|---|
| 1 | `docs/00_ENTERPRISE_UNIVERSE_BIBLE.md` | Living world — immutable |
| 2 | **This document** | Student experience operational guide |
| 3 | `docs/00_LEARNING_PHILOSOPHY.md` | Pedagogical principles |
| 4 | `docs/01_LEARNING_BLUEPRINT.md` | Module structure |
| 5 | `docs/03_SCENARIO_LIBRARY.md` | Scenario canon |
| 6 | Architecture Board ADRs | Platform decisions |
| 7 | Implementation specs (15–20) | Engineering execution |

**Audience:** Software Engineers · Scenario Designers · UX Designers · Instructional Designers · AI Engineers · Professors · QA · Architecture Board

---

# Part 0 — The Complete Professional Journey

*From offer letter to future career. The student never sees a syllabus — they live a hire.*

## 0.1 Journey Arc (Canonical)

```text
OFFER LETTER          Sophie Bergeron — Employee #NHE-XXXX assigned
      ↓
HIRING                Panel remembered; Claire chose you for questions, not answers
      ↓
ONBOARDING            Policies, benefits, Rémy video — "C'est la fondation"
      ↓
FIRST DAY             Badge, MFA, Claire: "This is not about ERP"
      ↓
FIRST MISSION         Tom's 40 vs 36 — before any transaction
      ↓
TRAINING              Learning Center — because work requires it, not because course requires it
      ↓
BUSINESS RESPONSIBILITY  ThermoControl PO — your recommendation, your consequence
      ↓
DEPARTMENT ROTATION   Gemba (Ops) → Procurement → CS → Finance → BI — through crises, not tours
      ↓
STRATEGIC PARTICIPATION  Steering committee, S&OP, competitive task force
      ↓
ENTERPRISE TRANSFORMATION  Projet Équinoxe go-live — hypercare at 01:00
      ↓
PERFORMANCE REVIEW    Sophie + Claire — "Who have you become?"
      ↓
END OF PROBATION      HR Portal: Confirmed
      ↓
RECOGNITION           Isabelle town hall; Claire's maple pin
      ↓
FUTURE CAREER         Business Analyst I; Career Portal BA II posting; 90-day portfolio access
```

## 0.2 Phase Detail — What the Student Experiences

### Offer Letter → Hiring

| Element | Experience |
|---|---|
| **Student sees** | PDF from Sophie; salary range; Projet Équinoxe mentioned; Claire named as manager |
| **Student feels** | Hired — not enrolled |
| **Company state** | NordHabitat hiring for Équinoxe; 2,380 employees; June go-live target |
| **Invisible learning** | Institutional entry; employment framing |

### Onboarding → First Day

| Element | Experience |
|---|---|
| **Student sees** | HR circle-not-rows; Amélie video; Alex MFA; Lucas coffee tip |
| **Student feels** | Fear → first warmth (Sophie, Lucas) |
| **Teaching** | Security culture; bilingual courtesy; Claire's three rules |
| **Canonical** | Universe Bible §23 — minute-by-minute |

### First Mission → Training

| Element | Experience |
|---|---|
| **Student sees** | Mission Center: *Discover the Company* — not "M1-M01" |
| **Student feels** | Responsibility without permission to break production |
| **Teaching** | Observation before ERP; Tom's message as foreshadowing |
| **Training trigger** | Learning Center unlocks when ERP access level requires it |

### Business Responsibility → Department Rotation

| Element | Experience |
|---|---|
| **Student sees** | PO-88421; gemba; hospital thread; S&OP |
| **Student feels** | Stress → achievement → trust |
| **Rotation model** | Not scheduled tours — **crisis pulls you into each department** |
| **Maturity** | Observer → Accountable Analyst |

### Strategic Participation → Transformation

| Element | Experience |
|---|---|
| **Student sees** | Steering presentation; go-live bridge; BuildTech response |
| **Student feels** | Recognition; exhaustion; pride |
| **Teaching** | Executive communication; hypercare reality |

### Performance Review → Future Career

| Element | Experience |
|---|---|
| **Student sees** | Evidence portfolio; probation pass; Gold certificate as footnote |
| **Student feels** | *"I truly became part of this company"* |
| **Future** | BA I title; LinkedIn credential; portfolio for job interviews |

## 0.3 What the Student Never Sees

- Module numbers (M1–M10) in Mission Center UI
- Quiz buttons as primary navigation
- "Simulation" or "Learner" labels
- Grades — only competency evidence and employment milestones
- Instructor slides as primary content path

## 0.4 What the Professor Sees (Supporting the Journey)

- Enterprise Timeline — cohort pacing
- Mission Control — who is stuck at ThermoControl decision
- At-risk signals — trust < 40%, mission stall 2× duration
- **Not:** slide deck delivery system

---

*One simulated corporate year. Thirty classroom hours. Zero module consciousness.*

## 1.1 Journey Philosophy

The student never sees "Module 3." The student lives **May at NordHabitat** — ThermoControl is late, Julie is waiting, the hospital project needs those units, and Claire asks: *"What's your recommendation?"*

Every stage below maps **corporate time → classroom time → career maturity**. Competencies emerge from work evidence, not from completing a checklist labeled "M3."

## 1.2 Time Architecture (Canonical)

| Classroom hours | Simulated period | Corporate title (student-facing) |
|---|---|---|
| Hour 1 | Day 1 | *First day at NordHabitat* |
| Hours 1–3 | Weeks 1–4 / January | *Discovery quarter* |
| Hours 4–6 | February | *Foundation month* |
| Hours 7–9 | March + Q1 close | *First accountability* |
| Hours 10–12 | April–May | *Procurement responsibility* |
| Hours 13–15 | June + go-live | *Transformation week* |
| Hours 16–18 | July–August | *Customer & supply pressure* |
| Hours 19–21 | September | *One version of the truth* |
| Hours 22–24 | October–November | *Market & performance* |
| Hours 25–30 | December | *Year-end & belonging* |

---

## 1.3 Stage 0 — Pre-Arrival (Before Hour 1)

| Dimension | Definition |
|---|---|
| **Business context** | NordHabitat Projet Équinoxe hiring junior BAs; ERP Phase 1 targeting June go-live |
| **Corporate context** | Offer signed; Employee #NHE-XXXX assigned; Sophie Bergeron owns onboarding |
| **Student emotional state** | Anticipation, imposter fear, professional hope |
| **Expected competencies** | None yet — institutional entry |
| **Business processes** | Hiring, contract, policy acknowledgment |
| **ERP exposure** | None |
| **Relationships** | Sophie (HR), offer letter from NordHabitat |
| **Responsibility level** | 0 — candidate becoming employee |
| **Decision autonomy** | Accept offer; policy sign-off only |
| **AI interaction** | None |
| **Mentor participation** | Claire mentioned in offer as manager/mentor |
| **Executive participation** | None |
| **Expected maturity** | Pre-professional |

**Deliverables (in-universe):** Offer letter, contract, benefits summary, Day 1 schedule email.

---

## 1.4 Stage 1 — Day 1 (Hour 1, Part A)

*Canonical detail: Universe Bible §23 Phase 2*

| Dimension | Definition |
|---|---|
| **Business context** | New ERP CoE analyst onboarding during transformation programme |
| **Corporate context** | January 6; HQ-MTL; cohort starts; Tom reports 40 vs 36 at DC-MTL |
| **Student emotional state** | Excitement 85%, Fear 60%, Curiosity 70% → Belonging 35% by 17:00 |
| **Expected competencies** | C-ORG-01 observe organizational structure; C-COM-01 professional communication readiness |
| **Business processes** | Onboarding, security provisioning, HR policy acceptance |
| **ERP exposure** | Read-only login once; **no transactions** |
| **Relationships formed** | Sophie, Alex, Claire, Lucas, Julie (lunch), Marie-Claude, Tom (Teams only) |
| **Responsibility level** | Observer (Level 0) |
| **Decision autonomy** | None operational; journal reflection optional |
| **AI interaction** | None Day 1 |
| **Mentor participation** | Claire: high — manager + mentor sessions 11:00, 11:30, 16:00 |
| **Executive participation** | Amélie video; Isabelle absent |
| **Expected maturity** | Employee identity forming |

**Mission unlocked:** CH-01 / M1-M01 *Discover the Company* (15:00).

---

## 1.5 Stage 2 — Discovery Quarter (Hours 1–3 / January / Weeks 1–4)

| Dimension | Definition |
|---|---|
| **Business context** | Company fragmented; ERP readiness questioned before Phase 1 |
| **Corporate context** | Steering committee forming; Marc demands readiness proof |
| **Student emotional state** | Fear → Curiosity → first Confidence spikes |
| **Expected competencies** | Business structure, process-module mapping, readiness diagnosis (Silver path) |
| **Business processes** | Discovery, process observation, governance review |
| **ERP exposure** | Read-only navigation; org views; process map (no posting) |
| **Relationships** | Claire daily; Lucas peer; Julie testing; Tom's problem visible |
| **Responsibility level** | Observer-Analyst (Level 1) |
| **Decision autonomy** | Recommendations only — Claire reviews |
| **AI interaction** | None until Month 2 end |
| **Mentor participation** | Daily → weekly transition begins Week 3 |
| **Executive participation** | Marc "convince me" steering prep Month 3 |
| **Expected maturity** | Can explain NordHabitat without ERP jargon |

**Scenarios:** CH-01 to CH-04 (M1-M01, M1-M02, M1-M03)  
**Certification path:** Silver competency accumulation begins

---

## 1.6 Stage 3 — Foundation Month (Hours 4–6 / February)

| Dimension | Definition |
|---|---|
| **Business context** | Master data blocking operational readiness; Data Quality Month campaign |
| **Corporate context** | Duplicate customers, incomplete suppliers, org structure gaps |
| **Student emotional state** | Curiosity high; Shame→Relief (phishing sim); Confidence building |
| **Expected competencies** | Org structure, master data validation, data quality correction |
| **Business processes** | MDM, data governance, duplicate resolution |
| **ERP exposure** | Supervised master data create/edit in sandbox; validation workflows |
| **Relationships** | Julie respects duplicate catch; Alex kind post-phishing; Lucas ally |
| **Responsibility level** | Contributing Analyst (Level 2) |
| **Decision autonomy** | Approve/reject master data with review |
| **AI interaction** | Claire persona intro optional Hour 6 (transparency) |
| **Mentor participation** | Weekly 1:1; Claire asks harder questions |
| **Executive participation** | None direct |
| **Expected maturity** | Understands "garbage in, garbage out" with real names attached |

**Scenarios:** CH-05 to CH-07 (M2-M01, M2-M02, M2-M03)  
**Certification:** Silver eligibility if M1+M2 missions + evidence threshold met

---

## 1.7 Stage 4 — First Accountability (Hours 7–9 / March / Q1 Close)

| Dimension | Definition |
|---|---|
| **Business context** | Q1 close; board asks ERP readiness; fiscal pressure |
| **Corporate context** | Steering committee; student may present one readiness slide |
| **Student emotional state** | Fear (Marc test) → Confidence if prepared |
| **Expected competencies** | Readiness assessment, executive communication, risk classification |
| **Business processes** | Governance, readiness assessment, quarterly reporting |
| **ERP exposure** | Readiness checklist in ERP; gap documentation |
| **Relationships** | Marc tests; Claire protects if needed; Isabelle aware |
| **Responsibility level** | Contributing Analyst with executive visibility |
| **Decision autonomy** | Classify readiness; defend one gap |
| **AI interaction** | Claire persona for reflection prompts |
| **Mentor participation** | Claire prepares student for steering |
| **Executive participation** | Marc direct; Isabelle observes |
| **Expected maturity** | Speaks in business language to Finance |

**Scenarios:** CH-04 completion; steering committee narrative  
**Certification:** **Silver awarded** (probation continues)

---

## 1.8 Stage 5 — Procurement Responsibility (Hours 10–12 / April–May)

| Dimension | Definition |
|---|---|
| **Business context** | UAT; purchasing needs; ThermoControl partial delivery crisis |
| **Corporate context** | Gemba DC-MTL; PO-88421; hospital allocation seed |
| **Student emotional state** | Discovery (gemba) → Responsibility → first sustained Stress |
| **Expected competencies** | P2P cycle, supplier selection, goods receipt, discrepancy handling |
| **Business processes** | Requisition → PO → receipt → invoice prep |
| **ERP exposure** | PR, PO, GR creation (supervised → solo); quality hold interaction |
| **Relationships** | Tom gemba ally; Julie tough teacher; Renée blocks rushed GR; Martin supplier |
| **Responsibility level** | Accountable Analyst (Level 3) |
| **Decision autonomy** | Partial receipt recommendation — **consequence chain starts** |
| **AI interaction** | Julie persona for P2P challenges |
| **Mentor participation** | Available on request; lets student fail safely |
| **Executive participation** | Denise gemba; Marc PO sign-off |
| **Expected maturity** | Owns a procurement decision with cross-functional awareness |

**Scenarios:** CH-08 (M3-M01, M3-M02, M3-M03)  
**Memory effect:** Partial receipt → Month 7 hospital allocation

---

## 1.9 Stage 6 — Transformation Week (Hours 13–15 / June / Go-Live)

| Dimension | Definition |
|---|---|
| **Business context** | ERP Phase 1 go-live: Finance, Procurement, Inventory |
| **Corporate context** | Hypercare; P1 incident; celebration; Étoile NordHabitat team award |
| **Student emotional state** | Fear → Exhaustion → Achievement (peak) |
| **Expected competencies** | Hypercare support, incident documentation, end-to-end P2P in production |
| **Business processes** | Cutover, hypercare, three-way match prep |
| **ERP exposure** | Full Phase 1 transactional; hypercare bridge |
| **Relationships** | Lucas 01:00 coffee; Claire proud/exhausted; Sylvie visible |
| **Responsibility level** | Accountable Analyst in crisis |
| **Decision autonomy** | Incident triage with escalation paths |
| **AI interaction** | IT persona; Claire persona overnight |
| **Mentor participation** | High availability → sends student home |
| **Executive participation** | Isabelle 06:00 thank-you email |
| **Expected maturity** | Has lived an ERP go-live, not read about one |

**Scenarios:** Go-live narrative wraps M3; CH-08 consequences surface

---

## 1.10 Stage 7 — Customer & Supply Pressure (Hours 16–18 / July–August)

| Dimension | Definition |
|---|---|
| **Business context** | Hôpital du Sacré-Cœur order; S&OP crisis; heat wave demand |
| **Corporate context** | Cross-DC transfer; DC-TRT stockout vs DC-MTL excess |
| **Student emotional state** | Responsibility peak → Confidence under pressure |
| **Expected competencies** | O2C coordination, S&OP, inventory allocation, customer empathy |
| **Business processes** | Order promising, allocation, replenishment, case management |
| **ERP exposure** | Sales order, allocation, transfer order, inventory views |
| **Relationships** | Élodie crisis partner; Patrick thanks privately; Tom backs S&OP |
| **Responsibility level** | Trusted Analyst (Level 4) — owns cross-functional thread |
| **Decision autonomy** | Allocation + replenishment recommendation presented in S&OP |
| **AI interaction** | Élodie persona; Tom persona |
| **Mentor participation** | Shadow mode begins — attends, rarely speaks |
| **Executive participation** | Patrick, Denise in S&OP |
| **Expected maturity** | Connects customer urgency to inventory math |

**Scenarios:** CH-09, CH-10 (M4-M01–M03, M5-M01–M03)

---

## 1.11 Stage 8 — One Version of the Truth (Hours 19–21 / September)

| Dimension | Definition |
|---|---|
| **Business context** | Q3 close; BI dashboards; AI persona rollout; Innovation Week |
| **Corporate context** | Karim parental leave; steering committee student-led section |
| **Student emotional state** | Confidence → Recognition |
| **Expected competencies** | Three-way match, KPI definition, dashboard design, AI governance |
| **Business processes** | AP invoice match, BI publishing, AI use case boundaries |
| **ERP exposure** | FI-AP, Power BI embedded, persona chat |
| **Relationships** | Marc asks margin explanation; Karim co-designs dashboard; Emmanuel AI intro |
| **Responsibility level** | Trusted Analyst — presents to steering |
| **Decision autonomy** | KPI definitions; invoice exception recommendation |
| **AI interaction** | **Full persona suite** — Claire, Julie, Karim, Emmanuel intro |
| **Mentor participation** | Shadow — nods once when student presents |
| **Executive participation** | Steering committee |
| **Expected maturity** | Data-informed recommender |

**Scenarios:** CH-11, CH-12, CH-14 (M6, M7, M9)

---

## 1.12 Stage 9 — Market & Performance (Hours 22–24 / October–November)

| Dimension | Definition |
|---|---|
| **Business context** | BuildTech pricing attack; budget season; probation reviews |
| **Corporate context** | Rémy visit; performance self-assessment; governance under pressure |
| **Student emotional state** | Pressure → Reflective → Belonging solidifies |
| **Expected competencies** | Margin analysis, delegation matrix, governance, self-assessment |
| **Business processes** | Competitive response, approval authority, performance management |
| **ERP exposure** | Margin reports, approval workflows, HR Portal review |
| **Relationships** | Patrick uses analysis; Sophie probation; Julie nominates |
| **Responsibility level** | Business Analyst candidate (Level 5) |
| **Decision autonomy** | Approval routing recommendations; probation evidence portfolio |
| **AI interaction** | Marc persona challenger; Sophie persona HR |
| **Mentor participation** | Probation prep only |
| **Executive participation** | Rémy Month 10; competitive task force |
| **Expected maturity** | Professional self-awareness |

**Scenarios:** CH-13, CH-15, CH-17 (M8, M9–M10 prep, HR arc)

---

## 1.13 Stage 10 — Year-End & Belonging (Hours 25–30 / December)

| Dimension | Definition |
|---|---|
| **Business context** | Year-end close; integrated capstone; probation confirmation |
| **Corporate context** | Town hall; Claire maple pin; holiday party; Equinoxe Final Challenge |
| **Student emotional state** | Pride → Peace → Professional identity |
| **Expected competencies** | Integrated ERP thinking, capstone recommendation, executive presentation |
| **Business processes** | All domains — supplier + customer + inventory + finance crisis |
| **ERP exposure** | Full workspace mastery |
| **Relationships** | Claire release; Isabelle names student; full trust matrix >75% |
| **Responsibility level** | Business Analyst I (confirmed) |
| **Decision autonomy** | Full mission ownership — capstone |
| **AI interaction** | Personas defer to student judgment |
| **Mentor participation** | Final 1:1 — *"You don't need me anymore."* |
| **Executive participation** | CEO town hall; steering capstone |
| **Expected maturity** | Junior ERP Business Analyst — workplace ready |

**Scenarios:** CH-16, CH-18, CH-19 (M10, capstone, finale)  
**Certification:** **Gold awarded** — epilogue to belonging

---

## 1.14 Responsibility Level Model (Canonical)

| Level | Title | ERP write | Approval | Mentor |
|---|---|---|---|---|
| 0 | Observer | Read-only | None | High |
| 1 | Observer-Analyst | Read-only + sandbox | None | High |
| 2 | Contributing Analyst | Supervised writes | None | Weekly |
| 3 | Accountable Analyst | Solo with review | Recommend | On request |
| 4 | Trusted Analyst | Solo | Limited | Shadow |
| 5 | BA Candidate | Solo | Limited expanded | Release |
| 6 | Business Analyst I | Full | Per matrix | None required |

---

# Part 2 — Complete Module Architecture

*Students experience these as **periods of work**, not course modules. Internal reference only.*

---

## 2.1 M1 — ERP Foundations

| Attribute | Definition |
|---|---|
| **Business purpose** | Understand NordHabitat before configuring anything |
| **Professional purpose** | Junior BA discovery phase on ERP transformation programme |
| **Learning objectives** | Map org to processes; connect processes to ERP domains; assess readiness |
| **ERP concepts** | ERP core, organizational units, process map, readiness dimensions |
| **Market terminology** | ERP, module, integration, master data, go-live, UAT, hypercare |
| **SAP equivalent** | S/4HANA Enterprise Management overview, SAP Activate Discover phase |
| **Oracle equivalent** | Fusion Cloud ERP overview, Implementation Project Scoping |
| **Microsoft Dynamics equivalent** | D365 F&O module map, FastTrack Discover |
| **Odoo equivalent** | Apps architecture, Settings → Companies, Implementation methodology |
| **Professional competencies** | Business discovery, stakeholder identification, AS-IS observation |
| **Business value** | Prevents failed implementations; aligns scope to reality |
| **Typical roles** | Junior BA, PMO analyst, ERP consultant (discover) |
| **Departments** | All — Executive, Finance, Ops, Sales, Procurement, IT |
| **Actors** | Claire, Marc, Denise, Isabelle (distant), Lucas, Sophie |
| **Documents** | Company profile, dept list, process map, readiness checklist |
| **Systems** | Email, Teams, ERP (read-only), Documents, Mission Center |
| **KPIs** | Readiness score, process fragmentation index, department visibility |
| **Risks** | Scope creep; tool-first thinking; ignoring floor reality |
| **Typical mistakes** | Jumping to transactions; org chart without responsibilities |
| **Expected outcomes** | Readiness classification; stakeholder map; Silver competency 33% |

**Corporate title (student-facing):** *"Discovery quarter"* — never "Module 1"

---

## 2.2 M2 — Master Data & Organizational Structure

| Attribute | Definition |
|---|---|
| **Business purpose** | Build reliable foundation for all transactions |
| **Professional purpose** | Data steward / BA foundation setup |
| **Learning objectives** | Structure org; validate product/customer/supplier; fix quality issues |
| **ERP concepts** | Org units, plants, cost centers, business partners, material master |
| **Market terminology** | MDM, golden record, duplicate, data governance, data steward |
| **SAP equivalent** | MM/SD/FI master data, BP model, LSMW migration concept |
| **Oracle equivalent** | Fusion Setup Manager, FBDI templates, Trading Community Architecture |
| **Microsoft Dynamics equivalent** | Data management framework, dual-write, legal entities |
| **Odoo equivalent** | Contacts, Products, Multi-company, deduplication |
| **Professional competencies** | Data validation, governance awareness, structural thinking |
| **Business value** | Transaction accuracy; reporting integrity; compliance |
| **Typical roles** | MDM analyst, ERP functional consultant (foundation) |
| **Departments** | Finance, Sales, Procurement, Operations, ERP CoE |
| **Actors** | Julie, Marc, Claire, Renée, Karim |
| **Documents** | MDM policy, duplicate reports, validation checklists |
| **Systems** | ERP master data, Approvals, Knowledge Base |
| **KPIs** | MD completeness, duplicate rate, validation pass rate |
| **Risks** | Duplicate creation; incomplete supplier bank data |
| **Typical mistakes** | Creating PO before supplier approved; wrong UoM |
| **Expected outcomes** | Clean foundation; **Silver certification eligible** |

**Corporate title:** *"Foundation month"*

---

## 2.3 M3 — Procure-to-Pay

| Attribute | Definition |
|---|---|
| **Business purpose** | Source and pay for goods/services with control |
| **Professional purpose** | Procurement analyst / AP support on P2P cycle |
| **Learning objectives** | Trigger purchase; create PO; receive goods; analyse supplier impact |
| **ERP concepts** | PR, PO, GR, IR, three-way match prep, supplier master |
| **Market terminology** | P2P, OTIF, maverick spend, supplier scorecard |
| **SAP equivalent** | MM-PUR, ME21N/ME23N, MIGO, MIRO pathway |
| **Oracle equivalent** | Procurement Cloud, Receiving, Payables invoice matching |
| **Microsoft Dynamics equivalent** | AP + Procurement, PO confirmation, product receipt |
| **Odoo equivalent** | Purchase → Receipt → Vendor Bill flow |
| **Professional competencies** | Supplier selection, PO accuracy, receipt discrepancy handling |
| **Business value** | Cost control; supply continuity; audit trail |
| **Typical roles** | Buyer, AP clerk, inventory receiver, BA (procurement) |
| **Departments** | Procurement, Finance, Warehouse, Operations |
| **Actors** | Julie, Martin Kowalski, Tom, Renée, Marc, Denise |
| **Documents** | PO, packing slip, supplier contract, scorecard |
| **Systems** | ERP Purchasing, Inventory, Approvals, Email, Teams |
| **KPIs** | PO cycle time, supplier OTIF, receiving accuracy |
| **Risks** | Maverick spend; partial receipt without logic; hospital downstream |
| **Typical mistakes** | Wrong supplier; accept receipt without QC |
| **Expected outcomes** | End-to-end P2P; ThermoControl decision in Enterprise Memory |

**Corporate title:** *"Procurement responsibility"* (April–May)

---

## 2.4 M4 — Order-to-Cash

| Attribute | Definition |
|---|---|
| **Business purpose** | Win revenue and deliver on customer commitments |
| **Professional purpose** | Sales ops / CS coordination on institutional order |
| **Learning objectives** | Qualify order; promise delivery; coordinate fulfilment; manage escalation |
| **ERP concepts** | Sales order, availability check, allocation, delivery, billing trigger |
| **Market terminology** | O2C, ATP, OTIF, institutional account, case management |
| **SAP equivalent** | SD order-to-cash, ATP check, delivery document |
| **Oracle equivalent** | Order Management, Promising, Receivables |
| **Microsoft Dynamics equivalent** | Sales order processing, reservation, shipment |
| **Odoo equivalent** | Sales → Delivery → Invoice |
| **Professional competencies** | Customer empathy, cross-DC coordination, promise integrity |
| **Business value** | Revenue; NPS; institutional trust |
| **Typical roles** | CS manager, sales coordinator, logistics planner |
| **Departments** | Sales, CS, Operations, Logistics, Finance |
| **Actors** | Élodie, Dr. Meunier, Patrick, Denise, Tom |
| **Documents** | Quote, sales order, case record, delivery note |
| **Systems** | ERP Sales, CRM, Inventory, Teams crisis channel |
| **KPIs** | NPS, OTIF, order cycle time, perfect order rate |
| **Risks** | Overpromise; allocation conflict from Month 5 decision |
| **Typical mistakes** | Promising before ATP check |
| **Expected outcomes** | Sacré-Cœur order resolved; trust +Élodie +Customer |

**Corporate title:** *"The hospital cannot wait"* (July)

---

## 2.5 M5 — Supply Chain & Inventory

| Attribute | Definition |
|---|---|
| **Business purpose** | Balance demand, supply, and inventory investment |
| **Professional purpose** | S&OP participant / inventory analyst |
| **Learning objectives** | Interpret stock levels; recommend replenishment; present S&OP |
| **ERP concepts** | Inventory positions, transfer orders, safety stock, demand plan |
| **Market terminology** | S&OP, fill rate, inventory turns, MAPE, DC network |
| **SAP equivalent** | MM inventory, STO, IBP/S&OP concepts |
| **Oracle equivalent** | Inventory Management, Supply Planning, GATP |
| **Microsoft Dynamics equivalent** | Warehouse management, transfer orders, planning |
| **Odoo equivalent** | Inventory routes, reordering rules, inter-warehouse transfers |
| **Professional competencies** | Inventory analysis, S&OP presentation, trade-off reasoning |
| **Business value** | Stockout prevention; working capital optimization |
| **Typical roles** | Planner, supply chain analyst, warehouse supervisor |
| **Departments** | Supply Chain, Warehouse, Operations, Sales |
| **Actors** | Denise, Karim, Tom, Patrick, Marc |
| **Documents** | S&OP pack, inventory aging, transfer request |
| **Systems** | ERP Inventory, Power BI, Calendar (S&OP) |
| **KPIs** | Fill rate, inventory accuracy, MAPE, excess/obsolete |
| **Risks** | Heat wave demand; TRT stockout; freight cost spike |
| **Typical mistakes** | Transfer without freight cost analysis |
| **Expected outcomes** | S&OP recommendation accepted; inventory accuracy path to 98.5% |

**Corporate title:** *"Inventory is a lie until counted"* (August)

---

## 2.6 M6 — Finance & Accounting

| Attribute | Definition |
|---|---|
| **Business purpose** | Record transactions and protect financial integrity |
| **Professional purpose** | AP analyst / BA supporting three-way match |
| **Learning objectives** | AP process; three-way match; explain variance to Finance |
| **ERP concepts** | Invoice receipt, PO match, GR match, payment block |
| **Market terminology** | Three-way match, DPO, GL posting, variance |
| **SAP equivalent** | MIRO, F110, invoice block |
| **Oracle equivalent** | Invoice validation, Payables matching |
| **Microsoft Dynamics equivalent** | Vendor invoice matching, workflow |
| **Odoo equivalent** | Vendor bill from PO, matching |
| **Professional competencies** | Financial impact articulation, variance analysis |
| **Business value** | Fraud prevention; accurate liabilities; audit readiness |
| **Typical roles** | AP clerk, financial analyst, controller support |
| **Departments** | Finance, Accounting, Procurement |
| **Actors** | Marc, Julie, Claire |
| **Documents** | Invoice, PO, GR, match exception report |
| **Systems** | ERP Finance, Approvals, Email |
| **KPIs** | Invoice processing time, match exception rate, DPO |
| **Risks** | Pay without GR; TherControl invoice mismatch |
| **Typical mistakes** | Ignoring quantity variance |
| **Expected outcomes** | Marc accepts explanation; payment unblocked |

**Corporate title:** *"Three-way match"* (September)

---

## 2.7 M7 — CRM & Customer Service

| Attribute | Definition |
|---|---|
| **Business purpose** | Retain and serve institutional relationships |
| **Professional purpose** | Case coordinator on escalation |
| **Learning objectives** | Manage case; coordinate resolution; protect NPS |
| **ERP concepts** | Case/ticket, account hierarchy, RMA link, activity log |
| **Market terminology** | NPS, case escalation, institutional account, SLA |
| **SAP equivalent** | C4C / Service Cloud case, SAP CRM activities |
| **Oracle equivalent** | Service Cloud, B2B service requests |
| **Microsoft Dynamics equivalent** | Customer Service cases, entitlements |
| **Odoo equivalent** | Helpdesk, CRM pipeline |
| **Professional competencies** | Empathy, escalation management, cross-team coordination |
| **Business value** | Retention; reference accounts; reputation |
| **Typical roles** | CSM, service desk, account manager |
| **Departments** | CRM, Sales, Operations |
| **Actors** | Élodie, Dr. Meunier, Patrick |
| **Documents** | Case record, escalation log, satisfaction survey |
| **Systems** | CRM, Teams, Email, ERP order history |
| **KPIs** | NPS, case resolution time, CSAT |
| **Risks** | Clinical urgency underestimated |
| **Typical mistakes** | Promising without Ops confirmation |
| **Expected outcomes** | Case closed; Dr. Meunier gratitude email |

**Corporate title:** *"The angry facility director"* (woven July–September)

---

## 2.8 M8 — Human Resources & Governance

| Attribute | Definition |
|---|---|
| **Business purpose** | Govern people, roles, and approval authority |
| **Professional purpose** | Probation review; delegation matrix application |
| **Learning objectives** | Navigate approval matrix; complete self-assessment; governance under pressure |
| **ERP concepts** | Role-based access, approval workflow, segregation of duties |
| **Market terminology** | SoD, delegation of authority, probation, compliance |
| **SAP equivalent** | GRC, PFCG roles, workflow WS |
| **Oracle equivalent** | SOX controls, approval management |
| **Microsoft Dynamics equivalent** | Security roles, workflow, D365 HR integration |
| **Odoo equivalent** | Access rights, approval rules |
| **Professional competencies** | Governance awareness, ethical escalation, self-assessment |
| **Business value** | Fraud prevention; compliance; clear accountability |
| **Typical roles** | HR BP, compliance analyst, ERP security admin |
| **Departments** | HR, Legal, Compliance, Finance, IT |
| **Actors** | Sophie, Amélie, David Chen, Marc |
| **Documents** | Delegation matrix, probation form, access review |
| **Systems** | HR Portal, Approvals, ERP security, Knowledge Base |
| **KPIs** | Engagement, access review completion, maverick spend |
| **Risks** | Approval bypass; SoD violation |
| **Typical mistakes** | Wrong approver; emergency PO without workflow |
| **Expected outcomes** | Probation pass; governance competency validated |

**Corporate title:** *"Performance has a name"* (November)

---

## 2.9 M9 — Business Intelligence, KPI & AI

| Attribute | Definition |
|---|---|
| **Business purpose** | Turn data into decisions; deploy AI responsibly |
| **Professional purpose** | BI analyst / AI governance participant |
| **Learning objectives** | Define KPIs; build decision dashboard; interact with personas within bounds |
| **ERP concepts** | KPI catalog, data lineage, embedded analytics |
| **Market terminology** | OTIF vs perfect order, MAPE, NPS, augmentation |
| **SAP equivalent** | SAC, embedded analytics, Joule concepts |
| **Oracle equivalent** | OTBI, Fusion Analytics, AI Apps |
| **Microsoft Dynamics equivalent** | Power BI, Copilot boundaries |
| **Odoo equivalent** | Spreadsheet/BI, Odoo AI policies |
| **Professional competencies** | KPI design, dashboard storytelling, AI literacy |
| **Business value** | Faster decisions; aligned metrics; responsible AI |
| **Typical roles** | BI developer, data analyst, AI governance officer |
| **Departments** | BI, ATO, all departments (consumers) |
| **Actors** | Karim, Emmanuel, Marc, Isabelle |
| **Documents** | KPI definition sheet, dashboard spec, AI use policy |
| **Systems** | Power BI, ERP analytics, Digital Personas, Learning Center |
| **KPIs** | Dashboard adoption, data quality score |
| **Risks** | Vanity metrics; persona over-reliance |
| **Typical mistakes** | Dashboard without decision purpose |
| **Expected outcomes** | Steering committee dashboard; AI boundaries understood |

**Corporate title:** *"One version of the truth"* (September–October)

---

## 2.10 M10 — ERP Capstone & Final Certification

| Attribute | Definition |
|---|---|
| **Business purpose** | Integrated crisis requiring cross-functional ERP mastery |
| **Professional purpose** | Junior BA capstone — Equinoxe Final Challenge |
| **Learning objectives** | Integrate P2P, O2C, inventory, finance, CRM in one narrative |
| **ERP concepts** | End-to-end process chain, exception handling across modules |
| **Market terminology** | Integrated business planning, executive recommendation |
| **SAP equivalent** | Cross-module scenario (SD+MM+FI integration) |
| **Oracle equivalent** | End-to-end Cloud scenario |
| **Microsoft Dynamics equivalent** | Cross-app business process flow |
| **Odoo equivalent** | Full app stack scenario |
| **Professional competencies** | Integration thinking, executive communication, crisis leadership |
| **Business value** | Proves transformation ROI; validates hire decision |
| **Typical roles** | ERP BA, solution consultant, PMO lead |
| **Departments** | All |
| **Actors** | Full cast — Claire release, Isabelle town hall |
| **Documents** | Board pack, capstone recommendation, probation confirmation |
| **Systems** | Full Digital Workplace |
| **KPIs** | Composite business score; competency portfolio |
| **Risks** | Silo thinking under pressure |
| **Typical mistakes** | Fixing one module while ignoring root cause |
| **Expected outcomes** | **Gold certification**; Business Analyst I confirmed |

**Corporate title:** *"Equinoxe Final Challenge"* (December)

---

# Part 3 — Complete Scenario Architecture

*Each scenario is a **chapter** in NordHabitat's year. Scenario IDs: `SCN-{MODULE}-{MISSION}` plus narrative chapter `CH-{NN}` from Universe Bible.*

## 3.0 Scenario Design Template (Reference)

Every scenario below includes: Timeline · Trigger · Departments · People · Personas · Apps · Communications · Meetings · Documents · ERP transactions · Decisions · Consequences · Prior/Future links · Memory · Trust · Reputation · KPIs · Educational KPIs · Reflection · Competencies · Completion conditions

---

## 3.1 SCN-M1-M01 — Discover the Company

**Chapter title:** *The Email That Starts Everything* → *Discover the Building*  
**Timeline:** Day 1 15:00 → Week 2 (Hour 1–2)

| Field | Definition |
|---|---|
| **Business trigger** | CEO memo: know NordHabitat before configuring ERP; Tom's 40 vs 36 surfaces fragmentation |
| **Departments** | Executive, Operations, Finance, Sales, Procurement, Warehouse, IT |
| **People** | Claire (assigner), Lucas (peer), Tom (problem voice), Sophie (context) |
| **Digital personas** | Claire (optional reflection prompts after Hour 2) |
| **Workspace apps** | Mission Center, Documents, Email, Teams, ERP (read-only org views) |
| **Incoming communications** | Claire mission email; Tom Teams message; Corporate News Q4 results |
| **Meetings** | None required — optional Claire 1:1 |
| **Documents** | Company profile, department list, current issues summary, org chart draft |
| **ERP transactions** | None — navigation only: org units, module map |
| **Business decisions** | Identify departments most affected by fragmentation |
| **Possible consequences** | Correct → readiness narrative unlocked; weak → Claire Socratic follow-up |
| **Prior scenario** | Day 1 onboarding (Stage 1) |
| **Future scenarios** | M1-M02 mapping; M2 org structure; Tom gemba payoff |
| **Memory effects** | Department choices referenced in steering committee |
| **Trust effects** | +Claire if reflection quality high |
| **Reputation effects** | Internal: "asks good questions" flag if strong |
| **Business KPIs** | Readiness baseline; fragmentation index |
| **Educational KPIs** | C-ORG-01, C-BUS-01 |
| **Reflection moment** | Journal: *"What did I learn that no screenshot could teach?"* |
| **Competencies validated** | Business discovery, stakeholder identification |
| **Completion conditions** | Correct department-problem mapping ≥80%; reflection submitted; Claire acknowledgment |

---

## 3.2 SCN-M1-M02 — Connect Departments, Processes and ERP Modules

**Chapter title:** *The Module Map*  
**Timeline:** Week 2–3 (Hour 2)

| Field | Definition |
|---|---|
| **Business trigger** | Management needs ERP scope map before Phase 1 commitment |
| **Departments** | Sales, Purchasing, Inventory, Finance, CRM, HR, BI |
| **People** | Claire, Karim (data view), Lucas |
| **Personas** | Claire |
| **Apps** | Mission Center, Documents, ERP process map, Knowledge Base |
| **Communications** | Claire Teams: *"Departments aren't silos. Neither is ERP."* |
| **Meetings** | ERP CoE stand-up — student presents draft map |
| **Documents** | Business needs cards, module cards, dependency diagram |
| **ERP transactions** | None — process map tool only |
| **Decisions** | Match need → dept → process → module; identify cross-module deps |
| **Consequences** | Gap in mapping → Marc challenge in M1-M03 |
| **Prior** | M1-M01 |
| **Future** | M2 foundation; all module scenarios |
| **Memory** | Module map stored in Enterprise Memory |
| **Trust** | +Karim if dependency logic sound |
| **Business KPIs** | Process coverage score |
| **Educational KPIs** | C-PROC-01, C-ERP-01 |
| **Reflection** | *"Which dependency surprised me?"* |
| **Competencies** | Process integration thinking |
| **Completion** | Mapping accuracy ≥85%; cross-module dependency identified |

---

## 3.3 SCN-M1-M03 — Diagnose ERP Readiness

**Chapter title:** *The Readiness Question*  
**Timeline:** Week 4 / March prep (Hour 3)

| Field | Definition |
|---|---|
| **Business trigger** | Marc: *"Are we ready? Convince me."* before Q1 steering |
| **Departments** | Management, IT, Finance, Operations, Sales, Procurement |
| **People** | Marc, Claire, Sylvie, Denise |
| **Personas** | Marc (challenger), Claire (coach) |
| **Apps** | ERP readiness checklist, Documents, Email, Mission Center |
| **Communications** | Marc email with three blocking gaps |
| **Meetings** | Steering committee prep with Claire |
| **Documents** | Readiness checklist, data issues log, role matrix |
| **ERP transactions** | Readiness assessment workflow (status only) |
| **Decisions** | Classify: Ready / Partially Ready / Not Ready + top 3 risks |
| **Consequences** | "Ready" without evidence → Marc public challenge; Partially Ready → canonical path |
| **Prior** | M1-M01, M1-M02 |
| **Future** | Q1 steering; M2 urgency; go-live scope |
| **Memory** | Readiness classification persists |
| **Trust** | +Marc if gap #2 (three-way match) identified |
| **Business KPIs** | Readiness score 62%→71% |
| **Educational KPIs** | C-GOV-01, C-ANL-01 |
| **Reflection** | *"What would happen if we go-live anyway?"* |
| **Competencies** | Readiness analysis, risk classification |
| **Completion** | Classification matches evidence; top risks ranked; steering prep done |

---

## 3.4 SCN-M2-M01 — Structure the Organization

**Chapter title:** *Org Chart Is Destiny*  
**Timeline:** February Week 1 (Hour 4)

| Field | Definition |
|---|---|
| **Business trigger** | Duplicate cost centre blocks budget upload to ERP |
| **Departments** | Finance, Operations, HR, ERP CoE |
| **People** | Claire, Marc, Sophie, Lucas |
| **Personas** | Claire |
| **Apps** | ERP org management (sandbox), Approvals, Documents |
| **Communications** | Finance email: budget upload failed — duplicate CC-4421 |
| **Meetings** | None |
| **Documents** | Org structure template, cost centre list, location/warehouse list |
| **ERP transactions** | Org unit create/link (supervised); cost centre validation |
| **Decisions** | Confirm correct structure; resolve duplicate |
| **Consequences** | Wrong structure → M2-M02 master data errors cascade |
| **Prior** | M1 complete |
| **Future** | All transactional scenarios |
| **Memory** | Org structure canonical in EIC |
| **Trust** | +Marc if duplicate caught |
| **Business KPIs** | Structure completeness |
| **Educational KPIs** | C-ORG-02, C-MDM-01 |
| **Reflection** | *"Why does Finance care about warehouse as separate unit?"* |
| **Competencies** | Organizational design for ERP |
| **Completion** | Structure validated; duplicate resolved; approver sign-off |

---

## 3.5 SCN-M2-M02 — Create Essential Master Data

**Chapter title:** *Three Records, One Truth*  
**Timeline:** February Week 2 (Hour 5)

| Field | Definition |
|---|---|
| **Business trigger** | Julie: *"Don't create POs with broken suppliers."* |
| **Departments** | Sales, Procurement, Inventory, Finance |
| **People** | Julie, Claire, Renée |
| **Personas** | Julie |
| **Apps** | ERP master data, Mission Center, Knowledge Base |
| **Communications** | Julie email with three incomplete records |
| **Meetings** | Optional Julie 15-min review |
| **Documents** | Product, customer, supplier templates; field requirement matrix |
| **ERP transactions** | BP create/edit (supervised); validation workflow |
| **Decisions** | Approve/reject records for operational use |
| **Consequences** | Approve incomplete → M3 PO block; reject correctly → +Julie trust |
| **Prior** | M2-M01 |
| **Future** | M3 ThermoControl PO |
| **Memory** | Supplier master state affects Month 5 |
| **Trust** | +Julie +Renée on strict validation |
| **Business KPIs** | MD completeness 78%→85% |
| **Educational KPIs** | C-MDM-02 |
| **Reflection** | *"Which missing field would hurt the hospital most?"* |
| **Competencies** | Master data validation |
| **Completion** | All three entity types validated correctly |

---

## 3.6 SCN-M2-M03 — Correct Data Quality Issues

**Chapter title:** *The Duplicate Customer*  
**Timeline:** February Week 3–4 (Hour 6)

| Field | Definition |
|---|---|
| **Business trigger** | Sales vs Finance: same Hôpital du Sacré-Cœur, two customer numbers |
| **Departments** | Sales, Finance, CRM, ERP CoE |
| **People** | Julie, Marc, Élodie (background), Claire |
| **Personas** | Julie, Claire |
| **Apps** | ERP MDM, Documents, Email |
| **Communications** | Élodie FYI: case opened on wrong customer account |
| **Meetings** | Data governance council (observe) |
| **Documents** | Duplicate report, merge procedure, risk classification |
| **ERP transactions** | Duplicate merge (supervised); golden record selection |
| **Decisions** | Identify duplicates; correct; classify residual risk |
| **Consequences** | Wrong merge → hospital order issues Month 7 |
| **Prior** | M2-M02 |
| **Future** | M4 Sacré-Cœur order; **Silver certification gate** |
| **Memory** | Customer golden record canonical |
| **Trust** | +Julie: *"Renée ne t'a pas aimé — moi si."* |
| **Reputation** | Data steward credibility flag |
| **Business KPIs** | Duplicate rate ↓; data quality score ↑ |
| **Educational KPIs** | C-MDM-03, C-QLT-01 |
| **Reflection** | *"Who suffered from bad data before I fixed it?"* |
| **Competencies** | Data quality remediation |
| **Completion** | Duplicates resolved; Silver evidence threshold met |

---

## 3.7 SCN-M3-M01 — Identify a Purchasing Need

**Chapter title:** *Forty Becomes Thirty-Six* (setup)  
**Timeline:** April (Hour 10)

| Field | Definition |
|---|---|
| **Business trigger** | Stock below reorder; pediatric wing SKU; ThermoControl lead time 14 days |
| **Departments** | Inventory, Procurement, Sales, Operations |
| **People** | Tom, Julie, Denise, Claire |
| **Personas** | Tom (floor truth) |
| **Apps** | ERP inventory, Power BI (stock view), Teams, Mission Center |
| **Communications** | Tom Teams 40 vs 36; Denise gemba invite |
| **Meetings** | Gemba walk DC-MTL (canonical Hour 10) |
| **Documents** | Stock report, reorder policy, demand note (Sacré-Cœur future) |
| **ERP transactions** | Stock inquiry; purchase requisition create |
| **Decisions** | Create PR or recommend wait; justify with stock + demand |
| **Consequences** | No PR → stockout path; PR → M3-M02 |
| **Prior** | M2 complete; Tom message from Day 1 |
| **Future** | ThermoControl crisis; hospital allocation |
| **Memory** | PR linked to PO-88421 chain |
| **Trust** | +Tom if gemba attended before ERP action |
| **Business KPIs** | Stock availability; shortage risk index |
| **Educational KPIs** | C-P2P-01, C-SC-01 |
| **Reflection** | *"What did the shelf tell me that the screen didn't?"* |
| **Competencies** | Demand-triggered procurement |
| **Completion** | PR created with correct qty/logic; gemba evidence noted |

---

## 3.8 SCN-M3-M02 — Create and Process a Purchase Order

**Chapter title:** *Forty Becomes Thirty-Six* (decision)  
**Timeline:** May (Hour 11)

| Field | Definition |
|---|---|
| **Business trigger** | Approved PR; ThermoControl selected; manufacturing constraint incoming |
| **Departments** | Procurement, Finance, Inventory |
| **People** | Julie, Martin Kowalski, Marc, David Chen (contract ref) |
| **Personas** | Julie, Martin (supplier) |
| **Apps** | ERP Purchasing, Approvals, Email, Documents |
| **Communications** | Martin email: 36/40 confirmation; Julie verification request |
| **Meetings** | Emergency procurement sync (optional) |
| **Documents** | Approved PR, supplier ASL entry, PO-88421, contract §4.2 |
| **ERP transactions** | PO create; approval workflow; supplier confirmation log |
| **Decisions** | Select supplier; PO terms; **partial vs wait recommendation** |
| **Consequences** | **Accept partial → Month 7 hospital conflict**; wait → margin + delay trade-off |
| **Prior** | M3-M01 |
| **Future** | M3-M03, M4, M7 |
| **Memory** | **Critical consequence chain anchor** |
| **Trust** | +Julie if logic documented; −Renée if bypass QC |
| **Business KPIs** | PO cycle time; supplier OTIF |
| **Educational KPIs** | C-P2P-02, C-DEC-01 |
| **Reflection** | *"Who pays for my recommendation — supplier, hospital, or Finance?"* |
| **Competencies** | PO creation, supplier selection |
| **Completion** | PO approved; decision logged with rationale |

---

## 3.9 SCN-M3-M03 — Receive Goods and Analyse Supplier Impact

**Chapter title:** *Forty Becomes Thirty-Six* (resolution)  
**Timeline:** May–June (Hour 12)

| Field | Definition |
|---|---|
| **Business trigger** | Delivery arrives 36 units; Renée quality hold; Marc blocks invoice |
| **Departments** | Warehouse, Quality, Procurement, Finance |
| **People** | Tom, Renée, Julie, Marc |
| **Personas** | Renée, Tom |
| **Apps** | ERP Inventory, Approvals, Teams |
| **Communications** | Renée HOLD message; Marc sign-off requirement |
| **Meetings** | None |
| **Documents** | Packing slip, GR draft, NCR if defect, supplier scorecard |
| **ERP transactions** | Goods receipt; quality hold status; partial receipt posting |
| **Decisions** | Accept partial with hold; flag discrepancy; supplier scorecard impact |
| **Consequences** | Inventory position for Month 7; Martin scorecard −8 Month 9 |
| **Prior** | M3-M02 decision |
| **Future** | Go-live hypercare; hospital |
| **Memory** | Inventory qty canonical |
| **Trust** | +Renée if hold respected; +Marc if variance explained early |
| **Business KPIs** | Receiving accuracy; supplier performance |
| **Educational KPIs** | C-P2P-03, C-QLT-02 |
| **Reflection** | *"Would I make the same partial accept knowing the hospital?"* |
| **Competencies** | Goods receipt, supplier analysis |
| **Completion** | GR posted correctly; hold resolved per policy |

---

## 3.10 SCN-M4-M01 — Institutional Order Entry

**Chapter title:** *The Pediatric Wing*  
**Timeline:** July Week 1 (Hour 16)

| Field | Definition |
|---|---|
| **Business trigger** | Hôpital du Sacré-Cœur pediatric wing retrofit order — SKU overlaps ThermoControl shortage |
| **Departments** | Sales, CS, Operations, Finance |
| **People** | Élodie, Patrick, Dr. Meunier (email), Claire |
| **Personas** | Élodie |
| **Apps** | ERP Sales, CRM, Email, Teams |
| **Communications** | Patrick priority email; Dr. Meunier delivery requirement |
| **Meetings** | Customer coordination channel `#sacre-coeur-urgent` |
| **Documents** | Quote, institutional contract, sales order draft |
| **ERP transactions** | Sales order create; credit check; availability check |
| **Decisions** | Confirm ATP; flag allocation conflict from Month 5 |
| **Consequences** | False promise → Élodie escalation; honest conflict → M4-M02 |
| **Prior** | M3 partial receipt memory |
| **Future** | M4-M02 allocation; M7 case |
| **Memory** | SO linked to hospital thread |
| **Trust** | +Élodie on transparency |
| **Business KPIs** | Order cycle time; NPS at risk |
| **Educational KPIs** | C-O2C-01 |
| **Reflection** | *"What does Thursday mean in a pediatric wing?"* |
| **Competencies** | Order entry, ATP awareness |
| **Completion** | SO created; conflict documented honestly |

---

## 3.11 SCN-M4-M02 — Cross-DC Allocation

**Chapter title:** *The Pediatric Wing* (crisis)  
**Timeline:** July Week 2 (Hour 16–17)

| Field | Definition |
|---|---|
| **Business trigger** | Élodie phone: *"Tu es le owner jusqu'à nouvel ordre."* |
| **Departments** | Operations, Logistics, Warehouse, Sales |
| **People** | Élodie, Denise, Tom, Patrick, Marc (freight cost) |
| **Personas** | Élodie, Tom |
| **Apps** | ERP Inventory, Teams, Email, Calendar |
| **Communications** | Élodie urgent call/chat; Denise allocation request |
| **Meetings** | Ad hoc cross-functional sync |
| **Documents** | Allocation plan, transfer order, freight estimate |
| **ERP transactions** | Transfer order DC-MTL→DC-TRT path; allocation update |
| **Decisions** | Transfer vs expedite supplier balance; freight vs penalty |
| **Consequences** | Freight hits margin (Month 9 Marc question) |
| **Prior** | M4-M01; M3 inventory state |
| **Future** | M6 margin; M7 gratitude email |
| **Memory** | Transfer cost in Finance narrative |
| **Trust** | +Denise +Élodie on execution |
| **Business KPIs** | OTIF; perfect order rate |
| **Educational KPIs** | C-O2C-02, C-COM-02 |
| **Reflection** | *"Who trusted me with the hospital?"* |
| **Competencies** | Cross-functional coordination |
| **Completion** | Delivery commitment met; transfer documented |

---

## 3.12 SCN-M4-M03 — Delivery Confirmation & Customer Closure

**Chapter title:** *The Pediatric Wing* (resolution)  
**Timeline:** July Week 3 (Hour 17)

| Field | Definition |
|---|---|
| **Business trigger** | Delivery confirmed; Dr. Meunier acknowledgment |
| **Departments** | CS, Sales, Finance |
| **People** | Élodie, Dr. Meunier, Patrick |
| **Personas** | Élodie |
| **Apps** | ERP delivery confirm, CRM case, Email |
| **Communications** | Dr. Meunier gratitude email |
| **Meetings** | None |
| **Documents** | Delivery note, case closure, billing trigger |
| **ERP transactions** | Delivery posting; billing readiness |
| **Decisions** | Close case; document lessons for S&OP |
| **Consequences** | NPS recovery 51→53 |
| **Prior** | M4-M02 |
| **Future** | M5 S&OP; M7 case reference |
| **Memory** | Customer gratitude in reputation |
| **Trust** | +Patrick private thank-you |
| **Business KPIs** | NPS; case resolution time |
| **Educational KPIs** | C-O2C-03, C-CRM-01 |
| **Reflection** | *"Would the patient ever know my name?"* |
| **Competencies** | Customer delivery closure |
| **Completion** | Case closed; billing path clear |

---

## 3.13 SCN-M5-M01 — Inventory Analysis & Reorder Signal

**Chapter title:** *The Empty Shelf in Mississauga* (setup)  
**Timeline:** August Week 1 (Hour 17)

| Field | Definition |
|---|---|
| **Business trigger** | Heat wave; HVAC demand spike; DC-TRT stockout on SKU-HVAC-4421 |
| **Departments** | Supply Chain, Warehouse, Sales |
| **People** | Denise, Tom, Karim, Graham Whitfield (background) |
| **Personas** | Karim (data) |
| **Apps** | ERP Inventory, Power BI, Mission Center |
| **Communications** | Denise OTIF alert; Karim MAPE definition challenge |
| **Meetings** | S&OP prep |
| **Documents** | Inventory aging, demand forecast, safety stock policy |
| **ERP transactions** | Stock reports; replenishment proposal |
| **Decisions** | Recommend replenishment qty; identify DC imbalance |
| **Consequences** | Wrong qty → M5-M02 failure |
| **Prior** | M4 complete |
| **Future** | S&OP presentation |
| **Memory** | TRT vs MTL imbalance |
| **Trust** | +Karim if MAPE understood |
| **Business KPIs** | Fill rate; inventory turns |
| **Educational KPIs** | C-SC-02, C-ANL-02 |
| **Reflection** | *"Heat wave — who forecasted leisure, not HVAC?"* |
| **Competencies** | Inventory analysis |
| **Completion** | Replenishment proposal with evidence |

---

## 3.14 SCN-M5-M02 — Inter-DC Transfer Decision

**Chapter title:** *The Empty Shelf in Mississauga*  
**Timeline:** August Week 2 (Hour 18)

| Field | Definition |
|---|---|
| **Business trigger** | DC-MTL excess 47-day cover vs TRT 14-day |
| **Departments** | Operations, Logistics, Finance |
| **People** | Denise, Marc, Tom, Patrick |
| **Personas** | Tom |
| **Apps** | ERP transfer, Approvals, Power BI |
| **Communications** | Marc: *"Cash impact of emergency freight?"* |
| **Meetings** | Transfer approval workflow |
| **Documents** | Transfer request, freight quote |
| **ERP transactions** | STO create; approval |
| **Decisions** | Transfer qty; expedite vs standard freight |
| **Consequences** | Margin impact Month 9 |
| **Prior** | M5-M01 |
| **Future** | M5-M03 S&OP |
| **Memory** | Freight cost canonical |
| **Trust** | +Tom if floor count verified |
| **Business KPIs** | Inventory accuracy path to 98.5% |
| **Educational KPIs** | C-SC-03, C-FIN-01 |
| **Reflection** | *"Working capital vs customer service — who decides?"* |
| **Competencies** | Transfer order reasoning |
| **Completion** | Transfer approved with freight documented |

---

## 3.15 SCN-M5-M03 — S&OP Presentation

**Chapter title:** *The Empty Shelf in Mississauga* (resolution)  
**Timeline:** August Week 3 (Hour 18)

| Field | Definition |
|---|---|
| **Business trigger** | Monthly S&OP — student presents replenishment recommendation |
| **Departments** | Supply Chain, Sales, Operations, Finance |
| **People** | Denise, Patrick, Karim, Marc, Claire (silent) |
| **Personas** | Claire (silent observer) |
| **Apps** | Calendar, Power BI, Teams, Documents |
| **Communications** | S&OP agenda invite |
| **Meetings** | **Monthly S&OP — student leads section** |
| **Documents** | S&OP pack, recommendation slide |
| **ERP transactions** | None live — presentation of plans |
| **Decisions** | Defend recommendation under Marc freight challenge |
| **Consequences** | Accepted → Denise public trust; weak → rework |
| **Prior** | M5-M01, M5-M02 |
| **Future** | M9 dashboard |
| **Memory** | S&OP decision logged |
| **Trust** | +Denise: *"Tu as les chiffres?"* moment |
| **Business KPIs** | MAPE; fill rate |
| **Educational KPIs** | C-COM-03, C-LEAD-01 |
| **Reflection** | *"Claire didn't speak. Why?"* |
| **Competencies** | S&OP communication |
| **Completion** | Recommendation accepted or justified revision |

---

## 3.16 SCN-M6-M01 — Invoice Receipt

**Chapter title:** *Three-Way Match* (setup)  
**Timeline:** September Week 1 (Hour 19)

| Field | Definition |
|---|---|
| **Business trigger** | ThermoControl invoice for 36 units; PO-88421 match prep |
| **Departments** | Finance, Procurement |
| **People** | Marc, Julie |
| **Personas** | Marc |
| **Apps** | ERP AP, Documents, Email |
| **Communications** | AP team invoice queue assignment |
| **Meetings** | None |
| **Documents** | Vendor invoice, PO, GR |
| **ERP transactions** | Invoice entry; match preview |
| **Decisions** | Identify match status before posting |
| **Consequences** | Blind post → Marc block |
| **Prior** | M3 receipt chain |
| **Future** | M6-M02 exception |
| **Memory** | Invoice linked to PO-88421 |
| **Trust** | +Marc if preview used |
| **Business KPIs** | Invoice processing time |
| **Educational KPIs** | C-FIN-02 |
| **Reflection** | *"Why won't Marc pay?"* |
| **Competencies** | AP basics |
| **Completion** | Invoice entered; exception flagged |

---

## 3.17 SCN-M6-M02 — Three-Way Match Exception

**Chapter title:** *Three-Way Match*  
**Timeline:** September Week 2 (Hour 19)

| Field | Definition |
|---|---|
| **Business trigger** | Quantity/price variance; payment blocked |
| **Departments** | Finance, Procurement, Warehouse |
| **People** | Marc, Julie, Renée |
| **Personas** | Marc (challenger) |
| **Apps** | ERP AP match workbench, Approvals |
| **Communications** | Marc: *"Explain before I sign."* |
| **Meetings** | Optional 15-min with Julie |
| **Documents** | Match exception report, GR, PO, invoice |
| **ERP transactions** | Match resolution workflow |
| **Decisions** | Root cause; corrective action; pay/hold |
| **Consequences** | Unblock → Month 9 steering credibility |
| **Prior** | M6-M01; full P2P chain |
| **Future** | Steering presentation |
| **Memory** | Payment block state |
| **Trust** | +Marc if variance explained in 3 lines |
| **Business KPIs** | Match exception rate |
| **Educational KPIs** | C-FIN-03, C-P2P-04 |
| **Reflection** | *"Trace the error to a person — not a system."* |
| **Competencies** | Three-way match |
| **Completion** | Exception resolved per policy |

---

## 3.18 SCN-M6-M03 — Explain Variance to Finance

**Chapter title:** *Three-Way Match* (resolution)  
**Timeline:** September Week 3 (Hour 20)

| Field | Definition |
|---|---|
| **Business trigger** | Marc requires student explanation before steering committee |
| **Departments** | Finance, ERP CoE |
| **People** | Marc, Claire |
| **Personas** | Marc |
| **Apps** | Email, Documents, Mission Center |
| **Communications** | Marc assignment email |
| **Meetings** | Informal review with Claire |
| **Documents** | Variance narrative (3 lines + appendix) |
| **ERP transactions** | Payment release approval |
| **Decisions** | Articulate cash and margin impact of Month 5–7 chain |
| **Consequences** | Marc CC student on executive email if strong |
| **Prior** | Full consequence chain |
| **Future** | M9 margin analysis |
| **Memory** | Executive visibility flag |
| **Trust** | +Marc threshold → advocate |
| **Business KPIs** | DPO; working capital |
| **Educational KPIs** | C-FIN-04, C-COM-04 |
| **Reflection** | *"Can I tell the story without jargon?"* |
| **Competencies** | Financial communication |
| **Completion** | Marc accepts explanation; payment released |

---

## 3.19 SCN-M7-M01 — Case Opening

**Chapter title:** *The Angry Facility Director*  
**Timeline:** July–September bridge (Hour 20)

| Field | Definition |
|---|---|
| **Business trigger** | Dr. Meunier case on warranty sensor; wrong customer account history |
| **Departments** | CRM, CS, Engineering |
| **People** | Élodie, Dr. Meunier |
| **Personas** | Élodie |
| **Apps** | CRM, Email, Teams |
| **Communications** | Case auto-open from email |
| **Meetings** | Case triage |
| **Documents** | Case record, warranty policy |
| **ERP transactions** | Case linked to SO history |
| **Decisions** | Priority classification; owner assignment |
| **Consequences** | Mishandle → NPS drop |
| **Prior** | M4 hospital thread |
| **Future** | M7-M02 escalation |
| **Memory** | Case ID canonical |
| **Trust** | +Élodie |
| **Business KPIs** | Case resolution SLA |
| **Educational KPIs** | C-CRM-02 |
| **Reflection** | *"Angry yet — what happened before the anger?"* |
| **Competencies** | Case management |
| **Completion** | Case prioritized and owned |

---

## 3.20 SCN-M7-M02 — Escalation Coordination

**Chapter title:** *The Angry Facility Director* (peak)  
**Timeline:** September (Hour 20)

| Field | Definition |
|---|---|
| **Business trigger** | Engineering spec error suspected; pediatric sensitivity |
| **Departments** | CS, Engineering, Quality, Sales |
| **People** | Élodie, Renée, Patrick |
| **Personas** | Élodie, Renée |
| **Apps** | CRM, Teams, ERP RMA link |
| **Communications** | Dr. Meunier escalation email |
| **Meetings** | Cross-functional case review |
| **Documents** | NCR draft, RMA, spec sheet |
| **ERP transactions** | RMA create; quality hold link |
| **Decisions** | Coordinate fix vs replace; customer communication tone |
| **Consequences** | Resolution → gratitude email |
| **Prior** | M7-M01 |
| **Future** | NPS recovery |
| **Memory** | Case resolution quality |
| **Trust** | +Renée +Customer |
| **Business KPIs** | NPS; CSAT |
| **Educational KPIs** | C-CRM-03, C-QLT-03 |
| **Reflection** | *"What would Claire ask?"* |
| **Competencies** | Escalation management |
| **Completion** | Resolution plan approved |

---

## 3.21 SCN-M7-M03 — Case Closure & NPS Recovery

**Chapter title:** *The Angry Facility Director* (close)  
**Timeline:** September (Hour 21)

| Field | Definition |
|---|---|
| **Business trigger** | Fix deployed; survey pending |
| **Departments** | CS, Sales |
| **People** | Élodie, Dr. Meunier |
| **Personas** | Élodie |
| **Apps** | CRM, Email |
| **Communications** | Gratitude email from Dr. Meunier |
| **Meetings** | None |
| **Documents** | Closure report, satisfaction survey |
| **ERP transactions** | Case closed; RMA completed |
| **Decisions** | Document lessons learned for KB |
| **Consequences** | NPS +2 |
| **Prior** | M7-M02 |
| **Future** | KB article Month 11 |
| **Memory** | Customer reputation restored |
| **Trust** | +Élodie permanent ally |
| **Business KPIs** | NPS 53 |
| **Educational KPIs** | C-CRM-04 |
| **Reflection** | *"Institutional trust — how long to rebuild?"* |
| **Competencies** | Service recovery |
| **Completion** | Case closed; survey positive |

---

## 3.22 SCN-M8-M01 — Approval Matrix Under Pressure

**Chapter title:** *Who Can Approve This?*  
**Timeline:** November Week 1 (Hour 22)

| Field | Definition |
|---|---|
| **Business trigger** | Emergency PO request $32K — wrong approver chain attempted |
| **Departments** | Procurement, Finance, Legal |
| **People** | Julie, Marc, David Chen |
| **Personas** | Julie |
| **Apps** | Approvals, ERP workflow, Knowledge Base |
| **Communications** | Maverick spend alert |
| **Meetings** | None |
| **Documents** | Delegation of authority matrix |
| **ERP transactions** | PO approval workflow reroute |
| **Decisions** | Correct approver path; reject bypass |
| **Consequences** | Bypass attempt → compliance flag |
| **Prior** | M3 PO experience |
| **Future** | Probation governance evidence |
| **Memory** | SoD compliance record |
| **Trust** | +Julie +David |
| **Business KPIs** | Maverick spend |
| **Educational KPIs** | C-GOV-02 |
| **Reflection** | *"Urgency doesn't erase authority."* |
| **Competencies** | Approval routing |
| **Completion** | Correct chain applied |

---

## 3.23 SCN-M8-M02 — Access Review & Segregation of Duties

**Chapter title:** *Who Can Approve This?* (controls)  
**Timeline:** November Week 2 (Hour 23)

| Field | Definition |
|---|---|
| **Business trigger** | Quarterly access review — student validates own ERP permissions |
| **Departments** | IT, Finance, Compliance |
| **People** | Alex, Sylvie, Marc |
| **Personas** | Alex |
| **Apps** | HR Portal, ERP security, IT Help Desk |
| **Communications** | Access review ticket |
| **Meetings** | None |
| **Documents** | SoD matrix, role catalog |
| **ERP transactions** | Access review checklist (no change) |
| **Decisions** | Identify excessive permissions; recommend removal |
| **Consequences** | Miss SoD issue → audit finding narrative |
| **Prior** | M8-M01 |
| **Future** | Probation |
| **Memory** | Access profile clean |
| **Trust** | +Alex +Sylvie |
| **Business KPIs** | Access review completion |
| **Educational KPIs** | C-GOV-03, C-SEC-01 |
| **Reflection** | *"Why can't I approve my own PO?"* |
| **Competencies** | SoD awareness |
| **Completion** | Review signed off |

---

## 3.24 SCN-M8-M03 — Probation Self-Assessment

**Chapter title:** *Probation*  
**Timeline:** November Week 3–4 (Hour 23–24)

| Field | Definition |
|---|---|
| **Business trigger** | Day 85 probation review approaching |
| **Departments** | HR, ERP CoE |
| **People** | Sophie, Claire, Julie (nominator) |
| **Personas** | Sophie |
| **Apps** | HR Portal, Mission Center, Documents |
| **Communications** | Sophie calendar invite; Julie recommendation Teams |
| **Meetings** | Probation review (canonical script in Bible §31.10) |
| **Documents** | Self-assessment, evidence portfolio, Claire evaluation |
| **ERP transactions** | None |
| **Decisions** | Honest self-assessment with evidence |
| **Consequences** | Pass → BA I; extend only if critical failures (recoverable) |
| **Prior** | All competency evidence |
| **Future** | Capstone |
| **Memory** | Probation status permanent |
| **Trust** | All departments factor |
| **Business KPIs** | Engagement |
| **Educational KPIs** | C-PRO-01, C-REF-01 |
| **Reflection** | *"Who have I become since Day 1?"* |
| **Competencies** | Professional self-assessment |
| **Completion** | Probation pass confirmed in HR Portal |

---

## 3.25 SCN-M9-M01 — KPI Definition Workshop

**Chapter title:** *The Dashboard That Changed a Meeting* (setup)  
**Timeline:** September–October (Hour 21)

| Field | Definition |
|---|---|
| **Business trigger** | Karim: OTIF vs Perfect Order confusion in S&OP |
| **Departments** | BI, Operations, Finance |
| **People** | Karim, Denise, Marc |
| **Personas** | Karim |
| **Apps** | Power BI, Documents, Mission Center |
| **Communications** | Karim assignment |
| **Meetings** | KPI definition workshop |
| **Documents** | KPI catalog draft |
| **ERP transactions** | None — definition only |
| **Decisions** | Define metrics with decision owners |
| **Consequences** | Bad definitions → useless dashboard |
| **Prior** | M5 S&OP |
| **Future** | M9-M02 dashboard |
| **Memory** | KPI definitions canonical |
| **Trust** | +Karim |
| **Business KPIs** | Metric consistency |
| **Educational KPIs** | C-BI-01 |
| **Reflection** | *"What decision does OTIF support?"* |
| **Competencies** | KPI design |
| **Completion** | Catalog approved by Karim |

---

## 3.26 SCN-M9-M02 — Steering Committee Dashboard

**Chapter title:** *The Dashboard That Changed a Meeting*  
**Timeline:** September Week 4 (Hour 21)

| Field | Definition |
|---|---|
| **Business trigger** | Student leads steering section with live ERP dashboard |
| **Departments** | All executives |
| **People** | Karim, Marc, Isabelle, Claire (nods once) |
| **Personas** | Karim, Claire (observer) |
| **Apps** | Power BI embedded, ERP analytics, Calendar |
| **Communications** | Steering agenda |
| **Meetings** | **ERP steering committee — student presents** |
| **Documents** | Dashboard spec, board pack excerpt |
| **ERP transactions** | Read-only analytics |
| **Decisions** | Narrate P2P→O2C→inventory story with data |
| **Consequences** | Executive visibility flag; Isabelle awareness |
| **Prior** | M9-M01; full year data |
| **Future** | Capstone |
| **Memory** | Presentation logged |
| **Trust** | +Executive tier |
| **Business KPIs** | Dashboard adoption |
| **Educational KPIs** | C-BI-02, C-COM-05 |
| **Reflection** | *"One chart. One decision. No vanity."* |
| **Competencies** | Data storytelling |
| **Completion** | Presentation complete; Karim sign-off |

---

## 3.27 SCN-M9-M03 — Competitive Analysis & AI Personas

**Chapter title:** *The Competitor's Price*  
**Timeline:** October (Hour 22)

| Field | Definition |
|---|---|
| **Business trigger** | BuildTech undercuts 8% on core SKUs |
| **Departments** | Sales, Finance, BI, ATO |
| **People** | Patrick, Marc, Emmanuel |
| **Personas** | Marc (margin), Emmanuel (AI policy) |
| **Apps** | Power BI, ERP margin reports, Digital Personas |
| **Communications** | Market news alert; competitive task force invite |
| **Meetings** | Competitive response task force |
| **Documents** | Margin impact model, competitor brief |
| **ERP transactions** | Margin simulation (read-only) |
| **Decisions** | Recommend hold price vs selective match |
| **Consequences** | Patrick adjusts quote strategy |
| **Prior** | M6 margin chain |
| **Future** | M10 capstone |
| **Memory** | Competitive response logged |
| **Trust** | +Patrick |
| **Business KPIs** | Gross margin 28.2% target |
| **Educational KPIs** | C-ANL-03, C-AI-01 |
| **Reflection** | *"When did I ask the persona vs the person?"* |
| **Competencies** | Margin analysis, AI boundary literacy |
| **Completion** | Recommendation delivered to task force |

---

## 3.28 SCN-M10-M01 — Board Slide & Executive Summary

**Chapter title:** *The Board Slide*  
**Timeline:** October–November (Hour 24)

| Field | Definition |
|---|---|
| **Business trigger** | June board pack needs one ERP readiness slide — student owns retroactive completion narrative |
| **Departments** | ERP CoE, Finance, Executive |
| **People** | Claire, Marc, Isabelle |
| **Personas** | Claire |
| **Apps** | Documents, Power BI, Email |
| **Communications** | Claire assignment |
| **Meetings** | Board prep review |
| **Documents** | Single slide — one message rule |
| **ERP transactions** | None |
| **Decisions** | Synthesize year transformation in one slide |
| **Consequences** | Weak slide → Claire feedback loop |
| **Prior** | Full journey |
| **Future** | Capstone |
| **Memory** | Board visibility |
| **Trust** | +Claire +Isabelle |
| **Business KPIs** | ERP adoption |
| **Educational KPIs** | C-EXEC-01 |
| **Reflection** | *"If Isabelle reads one slide?"* |
| **Competencies** | Executive communication |
| **Completion** | Slide in board pack |

---

## 3.29 SCN-M10-M02 — Equinoxe Final Challenge (Integrated Crisis)

**Chapter title:** *Equinoxe*  
**Timeline:** December Week 1–2 (Hours 25–28)

| Field | Definition |
|---|---|
| **Business trigger** | Simultaneous: Martin delay + hospital backup order + TRT stockout + invoice block |
| **Departments** | All |
| **People** | Full cast — rotating demands |
| **Personas** | Julie, Élodie, Marc, Tom — bounded |
| **Apps** | **Full Digital Workplace** |
| **Communications** | Multi-channel crisis flood (controlled) |
| **Meetings** | Emergency sync; steering escalation |
| **Documents** | Integrated action plan |
| **ERP transactions** | Cross-module: PO, transfer, SO, GR, invoice match, case |
| **Decisions** | Prioritize; allocate; communicate; resolve without silos |
| **Consequences** | Composite business score; Gold eligibility |
| **Prior** | **Entire consequence chain** |
| **Future** | Finale |
| **Memory** | Capstone decisions permanent in portfolio |
| **Trust** | All relationships tested |
| **Business KPIs** | Composite OTIF, NPS, margin, accuracy |
| **Educational KPIs** | All Gold competencies |
| **Reflection** | *"What would I do differently in May?"* |
| **Competencies** | Integrated ERP thinking |
| **Completion** | Crisis resolved; steering accepts plan |

---

## 3.30 SCN-M10-M03 — Capstone Presentation & Gold Certification

**Chapter title:** *You Don't Need Me Anymore*  
**Timeline:** December Week 3–4 (Hours 29–30)

| Field | Definition |
|---|---|
| **Business trigger** | Capstone presentation; probation already passed; town hall |
| **Departments** | All |
| **People** | Claire (release), Isabelle, Sophie, full team |
| **Personas** | Claire — final human moment, not persona |
| **Apps** | Mission Center, HR Portal, Corporate News, Employee Profile |
| **Communications** | Town hall invite; Gold certificate email |
| **Meetings** | Capstone steering; CEO town hall; Claire final 1:1 |
| **Documents** | Capstone recommendation, Gold certificate |
| **ERP transactions** | None — narrative closure |
| **Decisions** | Present integrated recommendation; accept belonging |
| **Consequences** | Gold certified; BA I confirmed; 90-day replay access |
| **Prior** | M10-M02 |
| **Future** | Post-course portfolio (90 days) |
| **Memory** | Permanent employee narrative |
| **Trust** | Maximum |
| **Business KPIs** | Year targets summarized |
| **Educational KPIs** | Gold portfolio complete |
| **Reflection** | Claire: *"You don't need me anymore."* |
| **Competencies** | Professional identity |
| **Completion** | Gold issued; probation closed; town hall complete |

---

*(Parts 4–13 continue below)*

---

# Part 4 — Enterprise Workspace Experience

*The Digital Workplace is the center of learning — not a sidebar to "the course."*

## 4.1 Workspace Shell — NordHabitat Digital Workplace

| Attribute | Definition |
|---|---|
| **Purpose** | Unified SSO entry; notification hub; institutional identity |
| **Visual behavior** | NordHabitat Blue header; employee photo + #NHE-XXXX; bilingual greeting by preference |
| **Typical interactions** | App launch; notification triage; global search |
| **Evolution** | 4 apps Day 1 → 18+ Month 12 |
| **First appears** | Hour 1 IT provisioning |
| **Becomes important** | Hour 1 — always |
| **Scenario connections** | All |
| **AI connections** | Persona launcher Month 9 |
| **Department connections** | IT (Alex), ERP CoE (Claire) |
| **People connections** | All |
| **Process connections** | Gateway to all workflows |

---

## 4.2 Application Matrix (Complete)

| Application | Purpose | Visual behavior | Evolution | First appears | Peak importance | Scenarios |
|---|---|---|---|---|---|---|
| **ERP (TEC.ERP)** | System of record | Fiori-inspired tiles; role-based home | Read-only → hypercare → full | Day 1 | Month 6+ | All transactional |
| **Email (Outlook)** | Official record | Inbox + Action Required folder | 3/day → 80/day crisis | Day 1 | Month 7, 10 | All |
| **Teams** | Real-time collab | Channels; crisis badges | 3 channels → 12+ | Day 1 | Month 6–7 | All |
| **Calendar** | Corporate rhythm | Meeting types color-coded | Sparse → dense | Day 1 | Month 8 S&OP | M8, meetings |
| **Corporate News** | Internal journalism | Hero banner + newsletter archive | Static → student feature | Day 1 | Month 6, 12 | Culture |
| **Approvals** | Authority embodied | Card-based; SLA timer | Observer → approver | Week 2 | Month 5, 8, 11 | M3, M8 |
| **Knowledge Base** | Process canon | Search-first; Claire articles | 50 → 120 articles | Week 1 | Month 5+ | M2, M8 |
| **Documents (SharePoint)** | Repository | Mission inputs; restricted folders | Read → write Month 3 | Day 1 | All missions | All |
| **Power BI** | Decision analytics | Embedded; dark mode default | Screenshots → live Month 9 | Month 3 peek | Month 9–10 | M5, M9 |
| **Tasks** | Mission + To Do | Mission tracker primary tab | Manual → ERP-linked Month 6 | Day 1 | Always | All |
| **HR Portal (Workday)** | Employment admin | Probation clock visible | Sign → confirm Month 12 | Day 1 | Month 11–12 | M8 |
| **IT Help Desk (ServiceNow)** | ITSM | Ticket SLAs visible | Provisioning → P1 Month 6 | Day 1 | Month 6 | Go-live |
| **Learning Center** | Required training | Compliance banners | MFA, ERP nav, phishing | Day 1 | Day 3, Month 2 | Onboarding |
| **Notifications Hub** | Unified alerts | Priority-sorted; never spammy | Low → crisis → calm | Day 1 | Month 6–7 | Hypercare |
| **Enterprise Timeline** | Corporate clock | January–December slider; fiscal markers | Locked to student progress | Week 2 | Always | Continuity |
| **Mission Center** | Work command | **Never labeled "LMS"** — "Assignments" | 1 mission → portfolio | Day 1 15:00 | Always | All 30 |
| **Employee Profile** | Identity + trust | Badge photo; trust by dept (Month 9+) | Basic → confirmed | Day 1 | Month 12 | Belonging |
| **Performance Reviews** | Growth evidence | Evidence portfolio; not grades | Hidden → Month 11 | Month 9 | Month 11–12 | M8, M10 |
| **Career Portal** | Growth path | BA II posting Month 11 | Aspirational | Month 6 | Month 11 | M8 |

---

## 4.3 Mission Center — Learning Heart

**Visual behavior:** Mission cards show **chapter title** (*The Pediatric Wing*), not *M4-M02*. Subtitle: business trigger one-liner. Status: Not Started / In Progress / Awaiting Review / Complete.

**Interactions:** Open mission → Context panel (people, documents) → Workspace apps linked → Decision panel → Consequence reveal → Reflection prompt → Claire or persona comment.

**Never show:** Module number, XP points, quiz buttons.

---

# Part 5 — Human Interaction Architecture

## 5.1 Interaction Matrix

| Relationship | Frequency | Tone | Purpose | Evolution | Trust arc |
|---|---|---|---|---|---|
| **Student ↔ Claire** | Daily→Weekly→Release | Warm Socratic | Mentor/coach | Guide→Witness | 40→95 |
| **Student ↔ Manager (Claire dual)** | Same | Professional + personal | Performance, scope | Manager formal at probation only | Same |
| **Student ↔ HR (Sophie)** | Day 1, 30, 85, 365 | Reassuring firm | Policy, probation | Onboarding→Confirmation | 60→90 |
| **Student ↔ IT (Alex)** | Day 1, 2, 6, quarterly | Direct kind | Security, access | Provisioning→peer respect | 50→85 |
| **Student ↔ CEO (Isabelle)** | 3–4 touchpoints/year | Brief precise | Strategic framing | Unaware→Named at town hall | 20→80 |
| **Student ↔ CFO (Marc)** | 6–8/year | Dry challenging | Financial truth | Skeptic→Advocate | 30→85 |
| **Student ↔ Procurement (Julie)** | Weekly Month 4–6 | Precise tough | P2P excellence | Testing→Nomination | 35→90 |
| **Student ↔ Customer (Dr. Meunier)** | 3 indirect | Urgent precise | Urgency lesson | Escalation→Gratitude | N/A external |
| **Student ↔ Supplier (Martin)** | 4–5 | Apologetic professional | Supplier reality | Crisis→Recovery | 70→60→75 |
| **Student ↔ Colleagues (Lucas)** | Daily early→Weekly | Casual bilingual | Peer support | Rivalry→Friendship | 45→90 |
| **Student ↔ AI Personas** | On demand Month 2+ | In-character | Coach, challenge | Claire first→full suite | Bounded |

## 5.2 Communication Evolution Model

| Phase | Email | Teams | Meetings | Phone |
|---|---|---|---|---|
| Month 1 | Receive only | Lurk | Attend | None |
| Month 3 | Reply to Marc | Post in Équinoxe | Present 5 min | None |
| Month 6 | Hypercare threads | Crisis channel | Bridge | None |
| Month 7 | Customer visible | `#sacre-coeur-urgent` | Escalation | **Élodie call** |
| Month 9 | Executive CC | Lead debrief | **Lead steering** | Optional |
| Month 12 | Certificate | Team welcome | Capstone | None |

---

# Part 6 — AI Collaboration Architecture

## 6.1 AI Philosophy (From Universe Bible — Operationalized)

**AI amplifies people. Never replaces judgment.**

## 6.2 When AI Helps

| Situation | Persona | Behavior |
|---|---|---|
| Student stuck after 10 min investigation | Claire | Socratic question — not answer |
| P2P process confusion | Julie | Process citation + challenge |
| KPI definition ambiguity | Karim | Definition + "what decision?" |
| Floor vs system conflict | Tom | Floor truth reminder |
| Hospital urgency emotional load | Élodie | Context — not promise |
| Margin impact unclear | Marc | Challenger — 3-line limit |
| Security policy question | Alex | Policy link + remediation |
| HR probation question | Sophie | Policy + human referral |
| AI ethics boundary | Emmanuel | Meta-explanation |

## 6.3 When AI Stays Silent

- During capstone decision window (30 min)
- First 15 min of any new mission (LP-002 Context Before Action)
- When student has not opened mission context documents
- When trust < 40% with mentor — Claire persona redirects to human Claire
- Payment approval, PO approval, quality hold release — **always refused**

## 6.4 When AI Asks Questions

- Default mode for Claire persona
- After student submits decision — before consequence reveal
- Reflection prompts post-mission

## 6.5 When AI Provides Analysis

- Karim persona: KPI calculations, trend summary — **labeled as analysis, not decision**
- Emmanuel persona: AI capability/limit explanation
- Never: "You should approve the PO"

## 6.6 When AI Recommends

- Recommendations phrased as: *"Three options exist. Which aligns with NordHabitat values?"*
- Supplier choice: Julie persona lists criteria — never selects
- Allocation: Tom + Karim personas provide data — student decides

## 6.7 When AI Refuses to Decide

**Hard refusals (canonical):**
- PO approval
- Payment release
- Quality hold bypass
- Customer delivery date promise
- Role/permission changes

**Refusal template:** *"This requires [Name]'s authority. Here's what to prepare for that conversation."*

## 6.8 Uncertainty Expression

*"I'm not certain about [X]. The person who knows is [Y]. Here's what we do know from ERP."*

## 6.9 Human Accountability Preservation

- All persona interactions logged in Enterprise Memory
- Claire explains personas Month 2: *"She's me in a meeting. Not me when you need trust with a mistake."*
- Capstone evaluated on **student** decisions — persona usage is evidence, not substitute

## 6.10 Enterprise Intelligence Core Support

| EIC Component | Persona support |
|---|---|
| Context Engine | Mission state, relationship memory |
| Learning Intelligence | Competency tagging on interactions |
| Operational Intelligence | Consequence preview data |
| Reasoning Orchestrator | Boundary enforcement |
| Enterprise Memory | "Remember Month 5?" callbacks |

---

# Part 7 — Living Learning Flow

## 7.1 Canonical Flow (Replaces Slides → Quiz → Next)

```text
BUSINESS CONTEXT       Mission chapter opens — stakes, people, trigger (not slides)
        ↓
CORPORATE COMMUNICATION Email · Teams · phone — student triages like Day 1
        ↓
OBSERVATION            Documents · meetings · gemba — ERP closed until justified
        ↓
DISCUSSION             Teams threads · 1:1 · meeting — peer and mentor (not lecture)
        ↓
ERP ACTION             Transaction when process demands — supervised → solo
        ↓
BUSINESS ANALYSIS      Investigate data · personas ask · mentor silent when ready
        ↓
DECISION               Student commits in system — owns recommendation
        ↓
BUSINESS CONSEQUENCE   KPIs shift · emails arrive · trust updates · company remembers
        ↓
REFLECTION             Journal · Claire · persona prompt — never graded harshly
        ↓
CAREER GROWTH          Responsibility level ↑ · evidence logged · probation portfolio
```

**The student must feel that work itself teaches.**

## 7.2 Anti-Patterns (Forbidden)

- Slide deck → quiz → next module
- ERP screen tour without business trigger
- Graded multiple choice as primary assessment
- "Click here to learn PO" without Julie's email first
- Breaking character with "simulation" label

## 7.3 Professor Role in Flow

Professor facilitates **corporate time**, not slides. Cohort pacing via Enterprise Timeline — pause at Month 6 go-live for debrief if needed.

---

# Part 8 — Emotional Journey

## 8.1 Master Emotional Curve

| Stage | Hours | Dominant emotions | Module anchor (internal) |
|---|---|---|---|
| Beginning | 1 | Excitement, Fear | Day 1 |
| Uncertainty | 1–3 | Fear, Curiosity | M1 |
| Curiosity | 4–6 | Curiosity, Confidence | M2 |
| Belonging | 6–7 | Belonging, Confidence | Silver |
| Confidence | 7–9 | Confidence, Responsibility | M1-M3 wrap |
| Pressure | 10–15 | Stress, Achievement | M3-M6 |
| Leadership | 16–21 | Responsibility, Recognition | M4-M9 |
| Recognition | 22–24 | Pride, Belonging | M8-M9 |
| Professional identity | 25–30 | Pride, Peace | M10 Gold |

## 8.2 Emotional Reinforcement per Module (Internal)

Each module must include: one **human moment**, one **stress moment**, one **recognition moment**, one **reflection moment**. Defined in Part 3 scenarios.

---

# Part 9 — Professional Competency Map

## 9.1 Competency Dimensions

| Code | Dimension |
|---|---|
| C-BUS | Business understanding |
| C-ORG | Organizational structure |
| C-PROC | Process integration |
| C-MDM | Master data management |
| C-P2P | Procure-to-Pay |
| C-O2C | Order-to-Cash |
| C-SC | Supply chain |
| C-FIN | Finance impact |
| C-CRM | Customer relationship |
| C-GOV | Governance |
| C-BI | Business intelligence |
| C-AI | AI literacy |
| C-ANL | Analytical thinking |
| C-DEC | Decision-making |
| C-COM | Communication |
| C-LEAD | Leadership |
| C-QLT | Quality |
| C-SEC | Security |
| C-PRO | Professional behavior |
| C-REF | Reflection |
| C-EXEC | Executive communication |
| C-ERP | ERP conceptual |

## 9.2 Module Competency Progression

| Module | Primary | Secondary | Certification |
|---|---|---|---|
| M1 | C-BUS, C-ORG, C-PROC | C-GOV, C-REF | Silver path |
| M2 | C-MDM, C-QLT | C-GOV | Silver |
| M3 | C-P2P, C-DEC | C-QLT, C-FIN | Gold path |
| M4 | C-O2C, C-CRM | C-COM, C-LEAD | Gold |
| M5 | C-SC, C-ANL | C-FIN, C-BI | Gold |
| M6 | C-FIN | C-P2P | Gold |
| M7 | C-CRM | C-COM | Gold |
| M8 | C-GOV, C-PRO | C-SEC | Gold |
| M9 | C-BI, C-AI | C-ANL, C-EXEC | Gold |
| M10 | All integrated | C-EXEC, C-LEAD | Gold award |

## 9.3 Year Evolution Thresholds

| Checkpoint | Min competencies at Level 2 |
|---|---|
| Silver (Month 3) | M1+M2 primary set |
| Gold eligibility (Month 11) | 80% of Gold set |
| Gold award (Month 12) | Capstone pass + 90% Gold set |

---

# Part 10 — Living Assessment Architecture

## 10.1 Evidence-Based Assessment (No Quizzes Primary)

| Evidence type | Source | Weight |
|---|---|---|
| Business decisions | ERP + Mission Center | 25% |
| Communication quality | Email/Teams analysis | 15% |
| Meeting participation | S&OP, steering, capstone | 10% |
| Problem solving | Scenario completion paths | 15% |
| Document quality | Variance narrative, board slide | 10% |
| KPI improvements | Simulation engine | 10% |
| Customer/supplier outcomes | NPS, scorecard | 5% |
| Executive trust | Trust matrix | 5% |
| Mentor observations | Claire flags | 5% |
| Reflection quality | Journal entries | 5% |
| ERP accuracy | Transaction validation | 5% |

## 10.2 How the Company "Knows" Employee Progress

- **Sophie (HR):** Probation portal shows evidence portfolio — not grades
- **Claire:** Mentor observation log — qualitative flags
- **Marc:** "Would I CC this person?" threshold
- **Mission Center:** Competency badges labeled as **skills demonstrated**, not points
- **Performance Reviews app:** Manager review mirrors real corporate forms

## 10.3 Intervention Triggers

| Signal | Action |
|---|---|
| Trust < 40% any dept | Claire proactive 1:1 |
| Mission stalled 2x expected time | Persona hint → human offer |
| Two failed decision paths | Recovery mission — not punishment |
| Phishing fail | Alex remediation — no grade penalty |

---

# Part 11 — Story Continuity

## 11.1 Consequence Chain (Master)

```text
SCN-M3-M02 partial receipt
  → inventory short 4 units
    → SCN-M4-M01 allocation conflict
      → SCN-M4-M02 emergency transfer
        → freight cost
          → SCN-M6-M03 Marc margin question
            → SCN-M9-M03 competitive margin context
              → SCN-M10-M02 capstone references full chain
```

## 11.2 Memory Persistence Rules

1. PO-88421 referenced until capstone closure
2. Dr. Meunier relationship state persists
3. Martin scorecard reflects Month 5
4. Claire relationship stage gates dialogue tone
5. Probation clock always visible HR Portal

## 11.3 Market Evolution

| Month | Market event |
|---|---|
| 3 | TSX analyst ERP ROI question |
| 5 | HVAC supply press |
| 7 | Institutional sector growth |
| 8 | Heat wave demand |
| 10 | BuildTech price attack |
| 12 | Year-end institutional push |

## 11.4 Company Evolution

- Month 6: ERP Phase 1 live
- Month 9: AI personas deployed
- Month 12: BA I cohort confirmed — next cohort hiring teased (future)

---

# Part 12 — Release Mapping

*RC waves align educational milestones with engineering delivery. Each RC ends with Approval Gate per `docs/19`.*

## RC01 — Identity & First Day

| Attribute | Definition |
|---|---|
| **Educational objectives** | Student feels hired; Day 1 complete; Mission 1 unlocked |
| **Technical objectives** | Auth, Digital Workplace shell, Email/Teams mock, Mission Center skeleton |
| **Scope** | Stage 0–1; SCN pre-M1; onboarding documents |
| **Dependencies** | Sprint 0–1 foundation |
| **Acceptance criteria** | 30-min Day 1 playable; badge; Claire emails; read-only ERP |
| **Approval Gate** | Business Rules · UI · Backend · Simulation · DB · API · Testing · Docs · Prod |
| **Priority** | P0 |
| **V2 defer** | Full HR Portal integrations |

## RC02 — Discovery Quarter (M1)

| Attribute | Definition |
|---|---|
| **Educational objectives** | M1 three missions; discovery competency |
| **Technical objectives** | Mission engine; Documents; ERP read-only org; Enterprise Timeline |
| **Scope** | SCN-M1-M01 to M1-M03; Hours 1–3 |
| **Dependencies** | RC01 |
| **Acceptance criteria** | Consequence-free discovery; steering prep narrative |
| **Priority** | P0 |

## RC03 — Foundation & Silver (M2)

| Attribute | Definition |
|---|---|
| **Educational objectives** | Master data missions; **Silver certification** |
| **Technical objectives** | ERP MDM sandbox; Approvals; Assessment evidence engine |
| **Scope** | SCN-M2-*; phishing sim; Hour 4–6 |
| **Dependencies** | RC02 |
| **Acceptance criteria** | Silver auto-issued at threshold; duplicate scenario works |
| **Priority** | P0 |

## RC04 — Procurement Arc (M3 Part 1)

| Attribute | Definition |
|---|---|
| **Educational objectives** | Gemba; PR; PO; consequence chain start |
| **Technical objectives** | ERP P2P write; Enterprise Memory; trust scores |
| **Scope** | SCN-M3-M01, M3-M02; Hour 10–11 |
| **Dependencies** | RC03 |
| **Acceptance criteria** | Partial receipt decision persists |
| **Priority** | P0 |

## RC05 — Go-Live Experience (M3 Part 2 + Month 6)

| Attribute | Definition |
|---|---|
| **Educational objectives** | GR; hypercare; go-live emotional peak |
| **Technical objectives** | Simulation P1 incident; Notifications flood; hypercare UI |
| **Scope** | SCN-M3-M03; go-live narrative |
| **Dependencies** | RC04 |
| **Acceptance criteria** | Full P2P in production mode; celebration content |
| **Priority** | P0 |

## RC06 — Hospital & O2C (M4)

| Attribute | Definition |
|---|---|
| **Educational objectives** | Customer urgency; cross-DC allocation |
| **Technical objectives** | ERP O2C; CRM case link; crisis Teams channel |
| **Scope** | SCN-M4-*; Hour 16–17 |
| **Dependencies** | RC05; Memory chain |
| **Acceptance criteria** | Month 5 decision affects allocation |
| **Priority** | P0 |

## RC07 — Supply Chain (M5)

| Attribute | Definition |
|---|---|
| **Educational objectives** | S&OP; student presentation |
| **Technical objectives** | Power BI embed; S&OP meeting UI; transfer orders |
| **Scope** | SCN-M5-*; Hour 18 |
| **Dependencies** | RC06 |
| **Acceptance criteria** | Student presents in S&OP meeting simulation |
| **Priority** | P0 |

## RC08 — Finance & CRM (M6–M7)

| Attribute | Definition |
|---|---|
| **Educational objectives** | Three-way match; case management |
| **Technical objectives** | AP match workbench; CRM module |
| **Scope** | SCN-M6-*, M7-*; Hour 19–21 |
| **Dependencies** | RC07 |
| **Acceptance criteria** | Full P2P invoice chain; case close |
| **Priority** | P0 |

## RC09 — BI, AI & Governance (M8–M9)

| Attribute | Definition |
|---|---|
| **Educational objectives** | Dashboard; personas; probation |
| **Technical objectives** | AI Coach personas; Power BI live; HR Portal probation |
| **Scope** | SCN-M8-*, M9-*; Hour 21–24 |
| **Dependencies** | RC08; `docs/27` AI architecture |
| **Acceptance criteria** | Persona boundaries enforced; steering presentation |
| **Priority** | P0 |

## RC10 — Capstone & Gold (M10)

| Attribute | Definition |
|---|---|
| **Educational objectives** | Integrated crisis; Gold; Claire release |
| **Technical objectives** | Capstone orchestrator; Certification engine; portfolio export |
| **Scope** | SCN-M10-*; Hour 25–30 |
| **Dependencies** | RC09 |
| **Acceptance criteria** | Gold issued; town hall; probation confirmed |
| **Priority** | P0 |

## RC11 — Professor & Operations (Collège Pilot)

| Attribute | Definition |
|---|---|
| **Educational objectives** | Professor monitors cohort; session pacing |
| **Technical objectives** | Teacher portal; Mission Control; cohort analytics |
| **Scope** | `docs/11`; proven institutional playbook patterns |
| **Dependencies** | RC05 minimum |
| **Acceptance criteria** | Professor can run 3-hour session without engineering support |
| **Priority** | P0 for Concorde |

## RC12 — Production Hardening & Concorde Launch

| Attribute | Definition |
|---|---|
| **Educational objectives** | Full 30-hour year playable |
| **Technical objectives** | Railway prod; smoke tests; operational playbook |
| **Scope** | All RC01–RC11 integration |
| **Dependencies** | RC10, RC11 |
| **Acceptance criteria** | Approval Gate; Concorde pilot sign-off |
| **Priority** | P0 |

**V2 candidates:** Multi-cohort replay; next employee cohort narrative; advanced manufacturing (LACC deep dive); blockchain credentials; continuing education credits.

---

# Part 13 — Production MVP Definition — Collège de la Concorde

## 13.1 MVP Mission

Launch the **minimum unforgettable year** for one founding cohort at Collège de la Concorde — 30 classroom hours, ~25 students, one professor, Railway production.

## 13.2 Mandatory Features (MVP)

| Feature | RC | Rationale |
|---|---|---|
| Digital identity + Day 1 experience | RC01 | Belonging from minute one |
| Mission Center (30 scenarios) | RC02–RC10 | Learning heart |
| Email + Teams simulation | RC01+ | Communication realism |
| ERP read + transactional (P2P, O2C, Inventory, AP) | RC03–RC08 | Process execution |
| Enterprise Memory + consequences | RC04 | Story continuity |
| Trust matrix | RC04 | Relationship evolution |
| Enterprise Timeline | RC02 | Corporate time |
| Silver + Gold certification | RC03, RC10 | Institutional outcome |
| Claire mentor + 3 core personas | RC09 | AI bounded |
| Professor Mission Control | RC11 | Classroom operability |
| HR Portal probation clock | RC09 | Employment realism |
| Go-live hypercare narrative | RC05 | Emotional peak |
| Performance evidence portfolio | RC09 | Assessment |

## 13.3 Optional Features (MVP+ — ship if ready)

- Full persona suite (10+)
- Career Portal BA II posting
- Volunteer event branch
- Power BI student-built dashboard editor
- 90-day post-course replay mode

## 13.4 Version 2 Candidates

- Multi-language beyond FR/EN institutional
- Second company universe
- Professor-authored scenarios
- Institutional cross-product learning pattern (shared student identity)
- Mobile app
- Blockchain verification

## 13.5 Educational Priorities (Ordered)

1. Day 1 emotional belonging
2. Consequence chain M3→M4→M6→M10
3. Claire mentor arc
4. Go-live experience
5. Hospital crisis
6. S&OP presentation
7. Probation + Gold closure

## 13.6 Technical Priorities (Ordered)

1. Mission engine + Memory
2. ERP vertical slice P2P
3. Communication layer
4. Simulation KPIs
5. AI personas (bounded)
6. Certification
7. Teacher portal

## 13.7 Critical Path

```text
RC01 Day 1 → RC02 M1 → RC03 M2 Silver → RC04-05 P2P+GoLive
  → RC06 Hospital → RC07 S&OP → RC08 Finance/CRM
    → RC09 BI/AI/Probation → RC10 Gold → RC11 Professor → RC12 Launch
```

## 13.8 Risk Mitigation

| Risk | Mitigation |
|---|---|
| Scope creep | RC gates; MVP feature lock at RC08 |
| AI overreach | Persona refusal rules Part 6 |
| Emotional safety | Recovery missions; Claire always available peak stress |
| Railway outage | `docs/21` playbook; professor pre-class verify (institutional pattern) |
| Cohort data loss | Enterprise Memory backup; student portfolio export |

## 13.9 Institutional Pattern Reuse Opportunities

| Institutional pattern | ERP adaptation |
|---|---|
| Mission Control pacing UI | Enterprise Timeline + professor monitor |
| Pilot cohort policy | Institutional founding cohort — permanent records |
| Pre-class verification workflow | 30-min Railway health check |
| demo account pattern | Official professor demo employee #NHE-DEMO |
| Session run report | End-of-class learning + operational report |
| Instructor analytics | At-risk student detection via trust/mission stall |
| Operational playbook structure | instructor operational playbook → ERP Concorde playbook clone |

**Isolation rule preserved:** Each product maintains an independent database and student record boundary (RAIL-006). Reuse patterns and UI conventions only.

## 13.10 Concorde Launch Acceptance

- [ ] 30-hour experience playable end-to-end
- [ ] Day 1 tested with 3 pilot users — emotional belonging validated
- [ ] Consequence chain verified automated
- [ ] Silver/Gold certificates generate with QR
- [ ] Professor completes session without developer present
- [ ] Approval Gate passed all 9 criteria
- [ ] Railway production smoke test post-deploy
- [ ] Student feedback: *"I worked there"* ≥ 80% agree

---

# Appendix A — Blueprint → Scenario Library Sync

Scenarios M4–M10 in this blueprint **extend** `docs/03_SCENARIO_LIBRARY.md`. Scenario writers must copy Part 3 definitions into Scenario Library format without contradicting Universe Bible.

# Appendix B — Blueprint → Implementation Sync

Engineering sprints in `docs/20` map to RC waves:

| Sprint cluster | RC |
|---|---|
| Sprint 0–2 | RC01 |
| Sprint 3–4 | RC02–RC04 |
| Sprint 4–5 | RC05–RC07 |
| Sprint 5–7 | RC08–RC09 |
| Sprint 6–8 | RC09–RC10 |
| Sprint 9–11 | RC11–RC12 |

---

---

# Part 14 — Professional Growth Architecture

*Growth is invisible to the student. Visible to the company as employment maturity.*

## 14.1 Growth Dimensions — Year Progression

| Dimension | Month 1 | Month 6 | Month 12 |
|---|---|---|---|
| **Knowledge** | Company names, departments | P2P end-to-end, go-live | Cross-module integration |
| **Confidence** | Afraid to click ERP | Hypercare contributor | Leads steering section |
| **Autonomy** | Read-only | Solo PO with review | Capstone owner |
| **Communication** | Receive email | Reply to Marc with numbers | Executive presentation |
| **Decision quality** | Recommendations only | Partial receipt — owns consequence | Integrated crisis resolution |
| **Business vision** | "Why ERP?" | "Why hospital allocation?" | "Why margin vs price war?" |
| **Leadership** | None | Coordinate DC transfer | S&OP + capstone |
| **Analytical thinking** | Map problems | MAPE, freight cost | Dashboard + competitor model |
| **ERP mastery** | Navigation | Phase 1 transactional | Full workspace fluency |
| **AI collaboration** | None | Claire persona | Full suite — knows boundaries |
| **Professional identity** | "New hire" | "Équinoxe team" | "Business Analyst I" |

## 14.2 Growth Evidence Sources (Not Grades)

- Mission Center completion quality
- Enterprise Memory decision log
- Trust matrix by department
- Performance Reviews portfolio
- Mentor observation flags (Claire)
- Executive CC events (Marc, Isabelle)

## 14.3 Regression & Recovery

Growth is not linear. Failed phishing click, wrong PO recommendation, weak steering prep — all recoverable via work, not retakes labeled "quiz 2."

---

# Part 15 — AI Enterprise Participation (Day 1 → Year End)

*Enterprise Intelligence exists from Day 1. Students work inside an AI-powered enterprise — they do not "use AI."*

## 15.1 AI by Function — Always-On Support Model

| Function | AI role | Day 1 | Month 6 | Month 12 | Human owns |
|---|---|---|---|---|---|
| **HR** | Sophie persona: policy FAQ, probation reminders | Background | Active | Confirmation | Hiring decisions, probation pass |
| **IT** | Alex persona: MFA, ticket status | Active | Hypercare triage | Access review help | Security exceptions |
| **ERP** | Process hints via Claire/Julie personas | Silent | P2P guidance | Full process map | All postings |
| **Finance** | Marc persona: variance questions | Silent | Match challenges | Margin analysis | Payment release |
| **Procurement** | Julie persona: ASL, PO rules | Week 2 | ThermoControl | Scorecard | Supplier selection |
| **BI** | Karim persona: KPI definitions | Silent | Static views | Live dashboard | Metric ownership |
| **Executives** | Isabelle persona: rare strategic framing | Silent | Go-live message | Town hall prep | All commitments |
| **Mentors** | Claire persona: Socratic coach | Week 2 | Hypercare | Release | Judgment, trust |
| **Customers** | Élodie persona: urgency context | Silent | Hospital | Case tone | Promises |
| **Suppliers** | Martin persona: delivery facts | Silent | Delay | Recovery | Relationship |

## 15.2 EIC Visibility — Student Never Sees

Context Engine · Learning Intelligence · Operational Intelligence · Reasoning Orchestrator · Mission Control · Enterprise Memory · Knowledge Graph · Simulation Engine

## 15.3 Student Accountability Rule

**Every business decision** logged against Employee #NHE-XXXX — never against "AI suggestion ID."

---

# Part 16 — Human Interaction Playbook

## 16.1 Student ↔ Claire (Mentor)

| Attribute | Definition |
|---|---|
| **Purpose** | Socratic development; never solve |
| **Frequency** | Daily → Weekly → Shadow → Release |
| **Professional evolution** | Manager formally only at probation |
| **Trust evolution** | 40 → 95 |
| **Communication maturity** | Student learns to bring hypothesis, not questions |
| **Teaching moments** | Day 1 coffee; Month 3 steering prep; Month 6 "go sleep"; Month 12 maple pin |
| **Silence teaches** | Month 9 steering — Claire nods once, says nothing — student learns they lead now |

## 16.2 Student ↔ Julie (Procurement)

| Attribute | Definition |
|---|---|
| **Purpose** | Process discipline; real P2P standards |
| **Frequency** | Weekly Months 4–6; nomination Month 11 |
| **Trust evolution** | 35 → 90 |
| **Teaching moments** | Lunch Month 1; PO-88421; *"Renée ne t'a pas aimé — moi si."* |
| **Silence teaches** | Julie goes very polite — student learns danger |

## 16.3 Student ↔ Marc (CFO)

| Attribute | Definition |
|---|---|
| **Purpose** | Financial truth; numbers before narrative |
| **Frequency** | 6–8 touchpoints/year |
| **Trust evolution** | 30 → 85 |
| **Teaching moments** | *"Convince me"* Month 3; 3-line variance Month 9 |
| **Silence teaches** | Marc closes door — returns with one-page summary — student learns preparation standard |

## 16.4 Student ↔ Isabelle (CEO)

| Attribute | Definition |
|---|---|
| **Purpose** | Strategic altitude; belonging climax |
| **Frequency** | 3–4/year |
| **Trust evolution** | 20 → 80 |
| **Teaching moments** | Town hall Month 12 |
| **Silence teaches** | Month 3 — one nod in steering — more valuable than praise |

## 16.5 Student ↔ Denise / Tom (Operations / Warehouse)

| Attribute | Definition |
|---|---|
| **Purpose** | Floor truth before screen |
| **Frequency** | Gemba Month 4; S&OP Month 8 |
| **Teaching moments** | *"Le système dit 40. L'étagère dit 36."* |
| **Silence teaches** | Tom shows shelf — doesn't explain — student must observe |

## 16.6 Student ↔ Élodie / Dr. Meunier (Customer)

| Attribute | Definition |
|---|---|
| **Purpose** | Customer urgency — pediatric wing |
| **Frequency** | Crisis Month 7 |
| **Teaching moments** | Élodie phone owner assignment |
| **Silence teaches** | Dr. Meunier gratitude email — no names — student learns invisible impact |

## 16.7 Student ↔ Martin Kowalski (Supplier)

| Attribute | Definition |
|---|---|
| **Purpose** | Supplier as human; contract reality |
| **Teaching moments** | 36/40 apology; scorecard Month 9 |
| **Silence teaches** | Delay email — no excuse accepted without plan |

## 16.8 Student ↔ Lucas (Colleague)

| Attribute | Definition |
|---|---|
| **Purpose** | Peer normalization; rivalry → friendship |
| **Teaching moments** | Day 1 tips; 01:00 go-live coffee |
| **Silence teaches** | Lucas stops sending tips Month 8 — trust assumed |

## 16.9 Student ↔ AI Personas

| Attribute | Definition |
|---|---|
| **Purpose** | Amplify humans — never replace |
| **Rule** | Persona defers on: PO approve, payment, promise, hold bypass |
| **Silence teaches** | Capstone 30-min window — all personas silent |

---

# Part 17 — Scenario Chapters (Narrative Experience)

*Every scenario is a chapter. Never an exercise. Template applied to all 30.*

## 17.0 Chapter Template

1. **Narrative introduction** — story hook  
2. **Business trigger** — why today  
3. **Corporate communication** — email/Teams/phone  
4. **Meetings** — if any  
5. **Documents** — what to read  
6. **ERP activities** — when justified  
7. **Business investigation** — observation first  
8. **Decision** — student commits  
9. **Consequence** — company responds  
10. **Memory / relationship / KPI updates**  
11. **Reflection** — Claire or journal  
12. **Career progression** — responsibility level change  
13. **What changed in the company**  
14. **What changed in the student**  
15. **Connection to future chapters**

---

## 17.1 CH-01 — *The Email That Starts Everything* (SCN-M1-M01)

**Narrative introduction:** You are not in class. You are in the parking lot at 800 boulevard Marcel-Laurin, holding a badge that doesn't work yet, reading an email from Sophie that says *"You've got this."*

**Business trigger:** NordHabitat needs analysts who understand the company before configuring Projet Équinoxe. Tom reports 40 vs 36 again.

**Communications:** Sophie welcome · Claire mission · Tom Teams · Corporate News Q4

**Decision:** Which departments suffer most from fragmentation?

**Consequence:** Steering committee reads your analysis Month 3.

**Company change:** ERP CoE knows your name.

**Student change:** Employee → Observer-Analyst.

**Future:** Every module assumes you know who Tom is.

---

## 17.2 CH-08 — *Forty Becomes Thirty-Six* (SCN-M3-M02 — pivotal)

**Narrative introduction:** Julie forwards Martin's email without comment. That silence is louder than shouting.

**Business trigger:** PO-88421; 36/40 units; pediatric wing SKU overlap.

**Communications:** Martin apology · Julie verification · Renée HOLD preview

**Decision:** Accept partial vs wait for balance.

**Consequence:** **Hospital allocation Month 7 · Martin scorecard · Marc margin question Month 9 · Capstone reference Month 12**

**Company change:** Inventory short 4 units canonical.

**Student change:** Contributing → Accountable Analyst.

**Future:** Élodie phone call traces to this moment.

---

## 17.3 CH-09 — *The Pediatric Wing* (SCN-M4-M01–M03)

**Narrative introduction:** Élodie's voice on the phone: *"Tu es le owner jusqu'à nouvel ordre."* You are twenty-six years old and a hospital pediatric wing waits.

**Business trigger:** Hôpital du Sacré-Cœur delivery; allocation conflict from May.

**Decision:** Cross-DC transfer vs expedite supplier balance.

**Consequence:** Freight cost · NPS recovery · Dr. Meunier gratitude.

**Company change:** NordHabitat proves institutional reliability under pressure.

**Student change:** Trusted Analyst — cross-functional owner.

**Future:** S&OP references allocation pattern.

---

## 17.4 CH-18 — *Equinoxe* (SCN-M10-M02 — capstone)

**Narrative introduction:** Everything happens at once — because that's what integration means. Martin delays. Hospital backup order. TRT stockout. Invoice blocked. The company doesn't pause for you to finish Module 10.

**Business trigger:** Integrated crisis — all consequence chains converge.

**Decision:** Prioritize without silos.

**Consequence:** Gold eligibility · executive trust maximum.

**Company change:** Year transformation validated.

**Student change:** Business Analyst I.

**Future:** Career Portal · next cohort hiring tease.

---

## 17.5 CH-19 — *You Don't Need Me Anymore* (SCN-M10-M03)

**Narrative introduction:** Claire's office. No slides. No Teams. A maple pin on the desk.

**Business trigger:** Probation confirmed. Town hall in one hour.

**Communications:** Isabelle thanks · Sophie confirmation · team channel welcome

**Decision:** None — acceptance.

**Consequence:** Gold certificate — institutional epilogue.

**Company change:** Employee #NHE-XXXX permanent in registry.

**Student change:** Professional identity complete.

**Future:** 90-day portfolio · BA II path.

---

## 17.6 Remaining Chapters (Summary Index)

| Ch | Title | Scenario | Pivotal change |
|---|---|---|---|
| CH-02 | *The Module Map* | M1-M02 | Integration thinking |
| CH-03 | *The Readiness Question* | M1-M03 | Marc test |
| CH-04 | *Org Chart Is Destiny* | M2-M01 | Structure |
| CH-05 | *Three Records, One Truth* | M2-M02 | MDM |
| CH-06 | *The Duplicate Customer* | M2-M03 | Silver |
| CH-07 | Gemba prelude | M3-M01 | Floor truth |
| CH-10 | *Empty Shelf Mississauga* | M5-* | S&OP |
| CH-11 | *Three-Way Match* | M6-* | Finance voice |
| CH-12 | *Angry Facility Director* | M7-* | CRM |
| CH-13 | *Who Can Approve?* | M8-* | Governance |
| CH-14 | *Dashboard Changed Meeting* | M9-M02 | Recognition |
| CH-15 | *Competitor's Price* | M9-M03 | Market |
| CH-16 | *Board Slide* | M10-M01 | Executive |
| CH-17 | *Probation* | M8-M03 | HR milestone |

*Full scenario field definitions: Part 3. Narrative canon: Universe Bible §18.*

---

# Part 18 — Module Experience Maps (Complete)

*Internal reference M1–M10. Student-facing titles only in UI.*

## 18.1 M1 — Discovery Quarter

| Field | Content |
|---|---|
| **Business process** | Business discovery, process observation, readiness assessment |
| **Professional goal** | Junior BA — understand client organization before ERP config |
| **Student responsibility** | Map org; connect processes to modules; classify readiness |
| **Departments** | All major — Executive, Finance, Ops, Sales, Procurement, IT |
| **Primary mentor** | Claire Fontaine |
| **Secondary actors** | Lucas, Marc, Tom (Teams), Sophie |
| **Executive involvement** | Marc challenge Month 3; Isabelle distant |
| **ERP functions** | Org views, process map, readiness checklist (read-only) |
| **Workspace apps** | Mission Center, Email, Teams, Documents, ERP read, Enterprise Timeline |
| **Business documents** | Company profile, dept list, readiness checklist |
| **KPIs** | Readiness score, fragmentation index |
| **Professional competencies** | C-BUS, C-ORG, C-PROC, C-GOV |
| **ERP competencies** | Module identification, org structure literacy |
| **Business decisions** | Readiness classification; dept-problem mapping |
| **Business consequences** | Steering committee agenda; Phase 1 scope clarity |
| **Reflection moments** | Day 1 journal; readiness defense |
| **Previous module** | Onboarding |
| **Next module** | Foundation month (M2) |
| **SAP equivalent** | SAP Activate Discover, S/4 module overview |
| **Oracle equivalent** | Fusion scoping, Implementation Project |
| **Dynamics equivalent** | FastTrack Discover, D365 module map |
| **Odoo equivalent** | Apps model, company setup overview |
| **Market terminology** | ERP, integration, go-live, UAT, business process, stakeholder |
| **Business value** | Prevents failed transformation; aligns investment |
| **Expected maturity** | Can explain NordHabitat without software jargon |

**Student-facing title:** *Discovery quarter*

---

## 18.2 M2 — Foundation Month

| Field | Content |
|---|---|
| **Business process** | MDM, org setup, data governance, duplicate resolution |
| **Professional goal** | Establish reliable ERP foundation |
| **Student responsibility** | Validate/create master data; fix quality issues |
| **Departments** | Finance, Sales, Procurement, ERP CoE |
| **Primary mentor** | Claire Fontaine |
| **Secondary actors** | Julie, Marc, Renée, Élodie (duplicate customer) |
| **Executive involvement** | None direct |
| **ERP functions** | Org units, BP master, material/customer/supplier MD |
| **Workspace apps** | ERP MDM, Approvals, Knowledge Base, Learning Center (phishing) |
| **Business documents** | MDM policy, duplicate report, validation matrix |
| **KPIs** | MD completeness, duplicate rate |
| **Professional competencies** | C-MDM, C-QLT, C-GOV |
| **ERP competencies** | Master data create/validate, governance workflow |
| **Business decisions** | Approve/reject records; merge duplicates |
| **Business consequences** | Silver cert; hospital customer golden record |
| **Reflection moments** | *"Who suffered from bad data?"* |
| **Previous module** | M1 |
| **Next module** | Procurement responsibility (M3) |
| **SAP equivalent** | BP model, LSMW, material master |
| **Oracle equivalent** | FBDI, Trading Community Architecture |
| **Dynamics equivalent** | Data management framework, legal entities |
| **Odoo equivalent** | Contacts, products, deduplication |
| **Market terminology** | MDM, golden record, data steward, data quality |
| **Business value** | Transaction accuracy; audit integrity |
| **Expected maturity** | Data steward mindset |

**Student-facing title:** *Foundation month*

---

## 18.3 M3 — Procurement Responsibility

| Field | Content |
|---|---|
| **Business process** | P2P: requisition → PO → GR → invoice prep |
| **Professional goal** | Execute procurement with compliance |
| **Student responsibility** | PR, PO, GR; partial receipt recommendation |
| **Departments** | Procurement, Warehouse, Finance, Quality |
| **Primary mentor** | Claire Fontaine |
| **Secondary actors** | Julie, Tom, Renée, Martin, Marc, Denise |
| **Executive involvement** | Denise gemba; Isabelle go-live thanks |
| **ERP functions** | MM-PUR equivalent: PR, PO, GR, quality hold |
| **Workspace apps** | ERP Purchasing, Inventory, Approvals, Teams, IT Help Desk (go-live) |
| **Business documents** | PO-88421, contract §4.2, packing slip, scorecard |
| **KPIs** | PO cycle, OTIF, receiving accuracy |
| **Professional competencies** | C-P2P, C-DEC, C-QLT |
| **ERP competencies** | End-to-end P2P posting |
| **Business decisions** | **Partial vs wait — canonical consequence anchor** |
| **Business consequences** | Hospital Month 7; scorecard Month 9 |
| **Reflection moments** | *"Who pays for my recommendation?"* |
| **Previous module** | M2 |
| **Next module** | Hospital (M4) |
| **SAP equivalent** | ME21N, MIGO, MIRO pathway |
| **Oracle equivalent** | Procurement, Receiving, Payables |
| **Dynamics equivalent** | PO, product receipt |
| **Odoo equivalent** | Purchase → Receipt → Bill |
| **Market terminology** | P2P, OTIF, maverick spend, three-way match prep |
| **Business value** | Supply continuity; cost control |
| **Expected maturity** | Accountable Analyst |

**Student-facing title:** *Procurement responsibility* / *Forty becomes thirty-six*

---

## 18.4 M4 — The Hospital Cannot Wait

| Field | Content |
|---|---|
| **Business process** | O2C: quote-to-order, ATP, allocation, delivery |
| **Professional goal** | Deliver institutional commitment |
| **Student responsibility** | SO, allocation, cross-DC coordination |
| **Departments** | Sales, CS, Operations, Logistics, Finance |
| **Primary mentor** | Claire (shadow begins) |
| **Secondary actors** | Élodie, Patrick, Dr. Meunier, Denise, Tom |
| **Executive involvement** | Patrick priority; Isabelle aware |
| **ERP functions** | Sales order, ATP, transfer, delivery |
| **Workspace apps** | ERP Sales, CRM, Teams `#sacre-coeur-urgent`, Calendar |
| **Business documents** | SO, case, delivery note, transfer request |
| **KPIs** | NPS, OTIF, perfect order |
| **Professional competencies** | C-O2C, C-CRM, C-LEAD, C-COM |
| **ERP competencies** | Order promising, allocation |
| **Business decisions** | Transfer vs expedite; promise integrity |
| **Business consequences** | NPS recovery; freight cost chain |
| **Reflection moments** | *"What does Thursday mean in pediatric wing?"* |
| **Previous module** | M3 partial receipt |
| **Next module** | S&OP (M5) |
| **SAP equivalent** | SD order-to-cash, ATP |
| **Oracle equivalent** | Order Management, Promising |
| **Dynamics equivalent** | Sales order, reservation |
| **Odoo equivalent** | Sales → Delivery |
| **Market terminology** | O2C, ATP, OTIF, institutional account |
| **Business value** | Revenue; clinical trust |
| **Expected maturity** | Trusted Analyst |

---

## 18.5 M5 — Inventory Is a Lie Until Counted

| Field | Content |
|---|---|
| **Business process** | S&OP, replenishment, inter-DC transfer |
| **Professional goal** | Balance service vs inventory investment |
| **Student responsibility** | Replenishment proposal; S&OP presentation |
| **Departments** | Supply Chain, Warehouse, Finance, Sales |
| **Primary mentor** | Claire (silent at S&OP) |
| **Secondary actors** | Denise, Karim, Tom, Marc, Patrick |
| **Executive involvement** | S&OP forum |
| **ERP functions** | Inventory, transfer orders, planning views |
| **Workspace apps** | Power BI, ERP Inventory, Calendar, Documents |
| **Business documents** | S&OP pack, freight quote, aging report |
| **KPIs** | Fill rate, MAPE, inventory accuracy |
| **Professional competencies** | C-SC, C-ANL, C-BI |
| **ERP competencies** | Transfer orders, stock analysis |
| **Business decisions** | Replenishment + transfer recommendation |
| **Business consequences** | 98.5% accuracy path; margin freight |
| **Reflection moments** | *"Claire didn't speak. Why?"* |
| **Previous module** | M4 |
| **Next module** | Three-way match (M6) |
| **SAP equivalent** | IBP/S&OP, STO |
| **Oracle equivalent** | Supply Planning, Inventory |
| **Dynamics equivalent** | Planning, transfer orders |
| **Odoo equivalent** | Reordering rules, inter-warehouse |
| **Market terminology** | S&OP, fill rate, safety stock, MAPE |
| **Business value** | Stockout prevention; working capital |
| **Expected maturity** | Presents to executives |

---

## 18.6 M6 — Three-Way Match

| Field | Content |
|---|---|
| **Business process** | AP invoice matching, variance resolution |
| **Professional goal** | Protect financial integrity |
| **Student responsibility** | Match exception resolution; explain to Marc |
| **Departments** | Finance, Procurement, Warehouse |
| **Primary mentor** | Claire |
| **Secondary actors** | Marc, Julie, Renée |
| **Executive involvement** | Marc direct; CC student if strong |
| **ERP functions** | AP invoice, three-way match, payment block |
| **Workspace apps** | ERP Finance, Approvals, Email |
| **Business documents** | Invoice, PO, GR, variance narrative |
| **KPIs** | Match exception rate, DPO |
| **Professional competencies** | C-FIN, C-P2P, C-COM |
| **ERP competencies** | MIRO-equivalent matching |
| **Business decisions** | Pay/hold; variance explanation |
| **Business consequences** | Payment release; executive visibility |
| **Reflection moments** | *"Trace error to a person"* |
| **Previous module** | M5 |
| **Next module** | CRM case (M7) |
| **SAP equivalent** | MIRO, F110 |
| **Oracle equivalent** | Invoice validation |
| **Dynamics equivalent** | Vendor invoice matching |
| **Odoo equivalent** | Vendor bill from PO |
| **Market terminology** | Three-way match, variance, DPO |
| **Business value** | Fraud prevention; accurate liabilities |
| **Expected maturity** | Speaks Finance language |

---

## 18.7 M7 — The Angry Facility Director

| Field | Content |
|---|---|
| **Business process** | Case management, escalation, RMA, service recovery |
| **Professional goal** | Protect institutional relationship |
| **Student responsibility** | Case priority, cross-functional resolution |
| **Departments** | CRM, CS, Engineering, Quality |
| **Primary mentor** | Claire |
| **Secondary actors** | Élodie, Dr. Meunier, Renée, Patrick |
| **Executive involvement** | Patrick background |
| **ERP functions** | Case, RMA, quality link |
| **Workspace apps** | CRM, Teams, Email, ERP order history |
| **Business documents** | Case, NCR, RMA, closure report |
| **KPIs** | NPS, case resolution time |
| **Professional competencies** | C-CRM, C-COM, C-QLT |
| **ERP competencies** | Case-to-order traceability |
| **Business decisions** | Escalation path; fix vs replace |
| **Business consequences** | NPS +2; gratitude email |
| **Reflection moments** | *"Anger before anger — what happened?"* |
| **Previous module** | M4 hospital thread |
| **Next module** | Governance (M8) |
| **SAP equivalent** | C4C Service Cloud |
| **Oracle equivalent** | Service Cloud |
| **Dynamics equivalent** | Customer Service |
| **Odoo equivalent** | Helpdesk |
| **Market terminology** | NPS, SLA, escalation, RMA |
| **Business value** | Retention; reference accounts |
| **Expected maturity** | Service recovery leader |

---

## 18.8 M8 — Performance Has a Name

| Field | Content |
|---|---|
| **Business process** | Approval matrix, SoD, access review, probation |
| **Professional goal** | Demonstrate governance and professional maturity |
| **Student responsibility** | Correct approval routing; self-assessment |
| **Departments** | HR, Legal, Compliance, Finance, IT |
| **Primary mentor** | Claire + Sophie (HR) |
| **Secondary actors** | Julie, Alex, David Chen |
| **Executive involvement** | None — HR milestone |
| **ERP functions** | Workflow, security roles, approval chains |
| **Workspace apps** | HR Portal, Approvals, Performance Reviews, Knowledge Base |
| **Business documents** | Delegation matrix, probation form, portfolio |
| **KPIs** | Engagement, access review completion |
| **Professional competencies** | C-GOV, C-SEC, C-PRO |
| **ERP competencies** | SoD, approval workflow |
| **Business decisions** | Reject bypass; honest self-assessment |
| **Business consequences** | Probation pass → BA I track |
| **Reflection moments** | *"Who have I become since Day 1?"* |
| **Previous module** | M7 |
| **Next module** | BI/AI (M9) |
| **SAP equivalent** | GRC, PFCG |
| **Oracle equivalent** | SOX controls |
| **Dynamics equivalent** | Security roles |
| **Odoo equivalent** | Access rights |
| **Market terminology** | SoD, delegation of authority, probation |
| **Business value** | Compliance; fraud prevention |
| **Expected maturity** | Self-aware professional |

---

## 18.9 M9 — One Version of the Truth

| Field | Content |
|---|---|
| **Business process** | KPI management, BI, AI governance, competitive analysis |
| **Professional goal** | Data-informed recommendation |
| **Student responsibility** | KPI definitions; dashboard; margin analysis |
| **Departments** | BI, ATO, Finance, Sales |
| **Primary mentor** | Karim + Claire |
| **Secondary actors** | Marc, Emmanuel, Patrick, Isabelle |
| **Executive involvement** | Steering committee — student leads |
| **ERP functions** | Analytics, embedded BI |
| **Workspace apps** | Power BI, ERP analytics, Digital Personas, Corporate News |
| **Business documents** | KPI catalog, dashboard spec, competitor brief |
| **KPIs** | Dashboard adoption, gross margin |
| **Professional competencies** | C-BI, C-AI, C-ANL, C-EXEC |
| **ERP competencies** | KPI-linked reporting |
| **Business decisions** | Metric definitions; price war response |
| **Business consequences** | Executive visibility; quote strategy change |
| **Reflection moments** | *"When did I ask persona vs person?"* |
| **Previous module** | M8 |
| **Next module** | Capstone (M10) |
| **SAP equivalent** | SAC, embedded analytics |
| **Oracle equivalent** | OTBI, Fusion Analytics |
| **Dynamics equivalent** | Power BI, Copilot boundaries |
| **Odoo equivalent** | Spreadsheet/BI |
| **Market terminology** | OTIF vs perfect order, MAPE, augmentation |
| **Business value** | Decision speed; margin protection |
| **Expected maturity** | Executive presenter |

---

## 18.10 M10 — Equinoxe Final Challenge

| Field | Content |
|---|---|
| **Business process** | Integrated cross-module crisis |
| **Professional goal** | Prove Junior BA → BA I readiness |
| **Student responsibility** | Capstone owner; integrated resolution |
| **Departments** | All |
| **Primary mentor** | Claire (release) |
| **Secondary actors** | Full cast |
| **Executive involvement** | Isabelle town hall; steering capstone |
| **ERP functions** | All Phase 1 modules |
| **Workspace apps** | Full Digital Workplace |
| **Business documents** | Capstone plan, board slide, Gold certificate |
| **KPIs** | Composite business score |
| **Professional competencies** | All Gold set integrated |
| **ERP competencies** | Cross-module fluency |
| **Business decisions** | Prioritize under multi-crisis |
| **Business consequences** | Gold; employment confirmed |
| **Reflection moments** | *"You don't need me anymore."* |
| **Previous module** | All prior chains |
| **Next module** | Career — BA II path |
| **SAP equivalent** | Cross-module integration scenario |
| **Oracle equivalent** | End-to-end Cloud scenario |
| **Dynamics equivalent** | Cross-app process |
| **Odoo equivalent** | Full stack scenario |
| **Market terminology** | Integrated business planning |
| **Business value** | Transformation ROI proof |
| **Expected maturity** | Business Analyst I |

**Student-facing title:** *Equinoxe* / *You are NordHabitat*

---

# Part 4 Supplement — Workspace Teaching Model

*How each application teaches naturally — expanded from Part 4.*

| Application | Why employees use it | How it teaches | Scenarios |
|---|---|---|---|
| **ERP** | System of record | Consequences visible in inventory, finance, orders | All transactional |
| **Email** | Official audit trail | Teaches async professionalism, approval chains | Marc, Julie, Dr. Meunier |
| **Teams** | Speed + culture | Teaches urgency vs formality; Tom's 40 vs 36 | All crises |
| **Power BI** | Decisions need data | Karim: *"What decision does this support?"* | M5, M9 |
| **Approvals** | Authority is real | Wrong approver = compliance failure | M3, M8 |
| **Calendar** | Time is corporate | S&OP rhythm; probation date | M8, M5 |
| **Corporate Portal** | Strategy visibility | Go-live countdown; ESG campaigns | Month 6 |
| **HR Portal** | Employment is real | Probation clock — not course progress | M8, M12 |
| **IT Help Desk** | Systems break | P1 hypercare — ERP is not magic | Month 6 |
| **Knowledge Base** | Process outlives people | Student contributes Month 11 — full circle | M2, M11 |
| **Documents** | Evidence for decisions | Board packs, contracts | All |
| **Reports** | Period close | Q1/Q3 pressure | M1, M6 |
| **Notifications** | Triage skill | Month 6–7 flood — not all equal | Hypercare, hospital |
| **Mission Center** | Work assignments | Never labeled LMS | All 30 |
| **Career Center** | Growth path | BA II posting — future self | M11 |
| **Employee Profile** | Identity + trust | Badge confirmed Month 12 | Day 1, M12 |
| **Performance Reviews** | Company evaluates | Portfolio not grades | M11 |
| **Enterprise Timeline** | Corporate time | January in hour 1 — December in hour 30 | All |

---

# Part 12 Supplement — RC Roadmap (Effort & Nadia Priority)

*Nadia's mandate: fastest path to Concorde production without quality compromise.*

| RC | Educational objective | Technical objective | Deliverables | Deps | Effort | Priority |
|---|---|---|---|---|---|---|
| **RC01** | Day 1 belonging | Auth, workspace shell, comms mock | Day 1 playable 30 min | S0–S1 | L | P0 |
| **RC02** | Discovery quarter | Mission engine, timeline, docs | M1 3 chapters | RC01 | L | P0 |
| **RC03** | Silver / foundation | MDM sandbox, assessment evidence | M2 + Silver | RC02 | L | P0 |
| **RC04** | P2P + memory | ERP P2P write, trust, EIC seed | M3 + consequence chain | RC03 | XL | P0 |
| **RC05** | Go-live experience | Simulation P1, notifications | Hypercare narrative | RC04 | L | P0 |
| **RC06** | Hospital O2C | Sales, CRM, crisis channel | M4 chapters | RC05 | L | P0 |
| **RC07** | S&OP | Power BI embed, transfer orders | M5 + presentation UI | RC06 | L | P0 |
| **RC08** | Finance + CRM | AP match, cases | M6–M7 | RC07 | L | P0 |
| **RC09** | BI, AI, probation | Personas bounded, HR portal | M8–M9 | RC08 | XL | P0 |
| **RC10** | Gold capstone | Capstone orchestrator, cert engine | M10 + finale | RC09 | L | P0 |
| **RC11** | Professor ops | Teacher portal, Mission Control | Concorde session run | RC05 min | M | P0 |
| **RC12** | Production launch | Railway hardening, playbook | Concorde sign-off | RC10–11 | M | P0 |

**Approval Gate (every RC):** Business Rules · UI · Backend · Simulation · Database · API · Testing · Documentation · Production Readiness

**V2 wait:** Multi-cohort replay · Career Center full · Volunteer branch · Mobile · shared institutional identity model

**Reuse proven institutional patterns:** certification governance, pilot cohort policy, demo account pattern → `#NHE-DEMO`

**New development:** Enterprise Memory · Trust matrix · Narrative Mission Center · Persona boundaries · Consequence chain engine

---

# Part 13 Supplement — MVP for Collège de la Concorde (Nadia Matrix)

| Category | Items |
|---|---|
| **Must exist before first class** | RC01–RC03: Day 1, M1, M2, Silver, Email/Teams, Mission Center, read-only→MDM ERP |
| **Must exist before mid-course (Hour 10)** | RC04–RC05: P2P, memory, go-live |
| **Must exist before Gold (Hour 25)** | RC06–RC10: full year |
| **Professor minimum** | RC11 Mission Control |
| **Production** | RC12 |
| **V2** | Full persona suite(10+), Career Center, 90-day replay, volunteer event |
| **Highest educational value / lowest cost** | Day 1 + ThermoControl chain + Claire arc + Gold moment |
| **Critical path** | RC01→RC03→RC04→RC05→RC06→RC10→RC12 |

---

**End of Enterprise Experience Blueprint v1.0 — The Student's Professional Journey**

---

*Document owner: TEC.ERP Product & Learning Architecture*  
*Constitutional input: `docs/00_ENTERPRISE_UNIVERSE_BIBLE.md`*  
*Next review: After Concorde pilot cohort feedback*


