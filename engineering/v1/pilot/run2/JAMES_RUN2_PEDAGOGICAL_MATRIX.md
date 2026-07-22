# James Run 2 — Pedagogical Matrix (M1–M10)

**Purpose:** Structured teaching matrix for instructor-led Run 2.  
**Status:** Prepared from production catalog titles; **session evidence rows empty** until execution is unblocked.  
**Language:** FR teaching surface.

Legend for evidence columns: `—` = not captured (HOLD).

---

## M1 — Découverte organisationnelle

| Field | Content |
|-------|---------|
| moduleCode | M1 |
| moduleTitle | Module 1 — Découverte organisationnelle |
| ERP domain | Foundations / organizational discovery |
| businessProcess | Information fragmentation diagnosis |
| departments | Direction, Opérations, Finance, Ventes, Approvisionnement, Entrepôt, TI |
| missionCodes | m1-m01-decouvrir-entreprise · m1-m02-connecter-departements · m1-m03-diagnostiquer-preparation |
| concepts | Observateur-analyste; signal vs transaction; ownership of process |
| documents | Signal inventaire (40 vs 36); briefing Claire Fontaine |
| controls | No stock adjustment by junior analyst |
| KPIs | Inventory accuracy (intro) |
| financialImpact | Indirect — risk of wrong decisions from bad stock truth |
| AI relevance | Low in M1 — observation first |
| learningObjective | Explain how local gaps become enterprise risk |
| expectedPriorKnowledge | First-day workspace orientation |
| professorExplanation | Map departments to information ownership on blackboard |
| quantitativeExample | 40 système vs 36 terrain |
| studentVerificationQuestion | Which departments own the stock truth? |
| commonError | Attempting to adjust inventory |
| correctionStrategy | Redirect to observation + association |
| blackboardContent | Dept × problem matrix |
| slideReplacementCapability | B — minor blackboard |
| systemLimitation | Module intro may lack explicit KPI/docs panel (LX-MODULE-VISIBILITY) |
| evidenceCaptured | — |

---

## M2 — Données de référence et structure

| Field | Content |
|-------|---------|
| moduleCode | M2 |
| ERP domain | Master Data |
| businessProcess | Org structure + master data quality |
| departments | TI, Finance, Opérations, Approvisionnement |
| missionCodes | m2-m01 · m2-m02 · m2-m03 |
| concepts | Org units, plants, cost centers; customers/vendors/materials/UoM; duplicates |
| documents | Master data records; quality exception list |
| controls | Blocked records; mandatory fields |
| KPIs | Data quality |
| financialImpact | Bad master data → P2P/O2C failures |
| AI relevance | Classification of data issues (teach later in M9) |
| learningObjective | Build coherent reference data before transactions |
| slideReplacementCapability | B/C — structure diagram helpful |
| evidenceCaptured | — |

---

## M3 — Procure-to-Pay

| Field | Content |
|-------|---------|
| moduleCode | M3 |
| ERP domain | Procure-to-Pay |
| businessProcess | PR → PO → GR → Invoice → control |
| departments | Approvisionnement, Entrepôt, Finance |
| missionCodes | m3-m01 · m3-m02 · m3-m03 |
| concepts | Demand, PO approvals, tolerances, OTIF |
| documents | Demande d'achat, PO-88421, réception, facture fournisseur |
| controls | Approval matrix; 3-way match preview |
| KPIs | OTIF; exception rate |
| financialImpact | AP liability; price variance |
| AI relevance | Anomaly on supplier OTIF |
| learningObjective | Trace P2P document chain end-to-end |
| slideReplacementCapability | C — document flow diagram recommended |
| evidenceCaptured | — |

---

## M4 — Order-to-Cash

| Field | Content |
|-------|---------|
| moduleCode | M4 |
| ERP domain | Order-to-Cash |
| businessProcess | SO → allocation → delivery → GI → invoice |
| departments | Ventes, Entrepôt, Finance |
| missionCodes | m4-m01 · m4-m02 · m4-m03 |
| concepts | Credit/ATP; inter-DC allocation; billing trigger |
| documents | Commande institutionnelle; transfert DC; livraison; facture client |
| controls | Credit check; delivery confirmation |
| KPIs | Service level; margin (intro) |
| financialImpact | Revenue recognition timing |
| slideReplacementCapability | C — O2C flow |
| evidenceCaptured | — |

---

## M5 — Supply Chain et inventaire

| Field | Content |
|-------|---------|
| moduleCode | M5 |
| ERP domain | Supply Chain |
| businessProcess | Demand signal → transfer/replenishment → movement → reconciliation |
| departments | Opérations, Entrepôt, Planification |
| missionCodes | m5-m01 · m5-m02 · m5-m03 |
| concepts | Stockout signal; inter-DC transfer; S&OP recommendation |
| documents | Stock snapshot; transfer order; S&OP brief |
| controls | Transfer approval |
| KPIs | Inventory accuracy; service level |
| financialImpact | Working capital / stockout cost |
| slideReplacementCapability | B |
| evidenceCaptured | — |

---

## M6 — Finance et comptabilité

| Field | Content |
|-------|---------|
| moduleCode | M6 |
| ERP domain | Finance |
| businessProcess | Invoice receipt → 3-way match exception → variance explanation |
| departments | Finance, Approvisionnement, Entrepôt |
| missionCodes | m6-m01 · m6-m02 · m6-m03 |
| concepts | Three-way match; P&L vs cash; exception workflow |
| documents | Facture fournisseur; écart; écriture/contrôle |
| controls | Three-way match |
| KPIs | Exception rate; cash-flow impact |
| financialImpact | Direct AP / variance |
| slideReplacementCapability | B |
| evidenceCaptured | — |

---

## M7 — CRM et service client

| Field | Content |
|-------|---------|
| moduleCode | M7 |
| ERP domain | CRM |
| businessProcess | Case → escalation → resolution → NPS |
| departments | Service client, Ventes, Opérations |
| missionCodes | m7-m01 · m7-m02 · m7-m03 |
| concepts | Case ownership; escalation path; NPS recovery |
| documents | Dossier client; escalation; clôture |
| controls | Escalation rules |
| KPIs | NPS / customer service |
| slideReplacementCapability | B |
| evidenceCaptured | — |

---

## M8 — Gouvernance et conformité

| Field | Content |
|-------|---------|
| moduleCode | M8 |
| ERP domain | Governance |
| businessProcess | Approvals under pressure; SoD access review; probation self-eval |
| departments | Direction, TI, Conformité |
| missionCodes | m8-m01 · m8-m02 · m8-m03 |
| concepts | Approval matrix; segregation of duties; probation |
| documents | Matrice d'approbation; revue d'accès |
| controls | SoD; approval thresholds |
| KPIs | Governance / compliance |
| slideReplacementCapability | B/C |
| evidenceCaptured | — |

---

## M9 — BI et intelligence artificielle

| Field | Content |
|-------|---------|
| moduleCode | M9 |
| ERP domain | BI & AI |
| businessProcess | KPI definition → executive dashboard → AI boundaries |
| departments | Direction, Finance, TI, Opérations |
| missionCodes | m9-m01 · m9-m02 · m9-m03 |
| concepts | KPI lineage; decision vs display; hallucination/governance |
| documents | KPI dictionary; dashboard pack |
| controls | Human-in-the-loop; AI audit |
| KPIs | All taught KPIs synthesis |
| AI relevance | High — generative, forecasting, governance |
| slideReplacementCapability | C — KPI card + AI responsibility diagram |
| evidenceCaptured | — |

---

## M10 — Capstone Équinoxe

| Field | Content |
|-------|---------|
| moduleCode | M10 |
| ERP domain | Capstone / integrated crisis |
| businessProcess | Diagnose → prioritize → execute → analyze → recommend → submit |
| departments | Cross-enterprise |
| missionCodes | m10-m01 · m10-m02 · m10-m03 |
| concepts | Executive synthesis; integrated risk; Gold eligibility |
| documents | Conseil slide; crisis pack; Capstone dossier |
| controls | Professor review gate |
| KPIs | Multi-KPI narrative |
| slideReplacementCapability | C/D — executive narrative support |
| evidenceCaptured | — |

---

## Session checklist (A–T) — all modules

A Module introduction · B Learning objectives · C Concepts · D ERP process flow · E Departments · F Documents · G Risks/controls · H KPI/BI · I AI use · J Professor explanation · K Student question · L Demonstration · M Mission 1 · N Correction · O Mission 2 · P Correction · Q Mission 3 · R Synthesis · S Student reflection · T Professor assessment  

**Execution status:** not started (HOLD).
