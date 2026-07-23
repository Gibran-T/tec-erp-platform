# TEC.ERP V2 Curriculum Master Map

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1 Learning Architecture · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Canonical shape

| Layer | Rule |
|-------|------|
| Modules | Exactly **M1–M10** (no M11) |
| Regular missions | exactly **30** (3 per module) |
| Capstone | **MCapstone separate** — outside the 30 |
| Gold (V2) | 30 missions + required assessments including HCM_M8 + GOLD_M7_M10 + Capstone professor-approved |

## Module catalog

### M1 — Entreprise intégrée et processus

| Dimension | Definition |
|-----------|------------|
| Business purpose | ERP intégrée E2E |
| Learner competence | Découvrir entreprise; connecter départements; diagnostiquer préparation |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | Ops, toutes directions |
| Actors | Defined in `modules/M1_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | KPI préparation |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | None (entry) |
| Downstream impact | Feeds later modules and Capstone (Base S2) |
| Assessment relationship | SILVER_M1_M2 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Comprendre intégration |
| Capstone relationship | Base S2 |
| Mission keys | `m1-m01-decouvrir-entreprise` · `m1-m02-connecter-departements` · `m1-m03-diagnostiquer-preparation` |

### M2 — Structure organisationnelle et données de base

| Dimension | Definition |
|-----------|------------|
| Business purpose | Org + master data quality |
| Learner competence | Structurer org; créer références; corriger qualité |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | RH org, data steward, Achats, Ventes |
| Actors | Defined in `modules/M2_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | Complétude MD |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | M1–M1 recommended; unlock policy may be stricter |
| Downstream impact | Feeds later modules and Capstone (S3 données) |
| Assessment relationship | SILVER_M1_M2 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Diagnostiquer erreur MD |
| Capstone relationship | S3 données |
| Mission keys | `m2-m01-structurer-organisation` · `m2-m02-creer-donnees-reference` · `m2-m03-corriger-qualite-donnees` |

### M3 — Approvisionnement et Procure-to-Pay

| Dimension | Definition |
|-----------|------------|
| Business purpose | P2P PR→PO→GR |
| Learner competence | Besoin; commande; réception/analyse fournisseur |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | Demandeur, Acheteur, Réception, Fournisseur |
| Actors | Defined in `modules/M3_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | OTIF fournisseur |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | M1–M2 recommended; unlock policy may be stricter |
| Downstream impact | Feeds later modules and Capstone (S4 crise appro) |
| Assessment relationship | INTEGRATED_M3_M6 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Décision écart réception |
| Capstone relationship | S4 crise appro |
| Mission keys | `m3-m01-identifier-besoin-achat` · `m3-m02-creer-traiter-commande-achat` · `m3-m03-receptionner-analyser-fournisseur` |

### M4 — Ventes et Order-to-Cash

| Dimension | Definition |
|-----------|------------|
| Business purpose | O2C SO→alloc→livraison |
| Learner competence | Commande; allocation; livraison/clôture |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | Ventes, Planif, Entrepôt, Client |
| Actors | Defined in `modules/M4_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | OTIF client |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | M1–M3 recommended; unlock policy may be stricter |
| Downstream impact | Feeds later modules and Capstone (S5 service) |
| Assessment relationship | INTEGRATED_M3_M6 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Diagnostiquer rupture service |
| Capstone relationship | S5 service |
| Mission keys | `m4-m01-saisir-commande-institutionnelle` · `m4-m02-allocation-inter-entrepots` · `m4-m03-confirmer-livraison-cloture` |

### M5 — Stocks, réapprovisionnement et S&OP

| Dimension | Definition |
|-----------|------------|
| Business purpose | Stock, transfert, S&OP |
| Learner competence | Analyse stock; transfert DC; S&OP |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | Planif, Entrepôt, Ventes, Achats |
| Actors | Defined in `modules/M5_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | Couverture/ruptures |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | M1–M4 recommended; unlock policy may be stricter |
| Downstream impact | Feeds later modules and Capstone (S4 capacité) |
| Assessment relationship | Module check M5 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Arbitrage transfert vs achat |
| Capstone relationship | S4 capacité |
| Mission keys | `m5-m01-analyser-stock-reappro` · `m5-m02-decision-transfert-inter-dc` · `m5-m03-presentation-sop` |

### M6 — Finance et contrôle

| Dimension | Definition |
|-----------|------------|
| Business purpose | AP + 3-way match |
| Learner competence | Facture; exception 3-way; expliquer écart |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | AP, Contrôleur, Acheteur |
| Actors | Defined in `modules/M6_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | Taux match / écarts |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | M1–M5 recommended; unlock policy may be stricter |
| Downstream impact | Feeds later modules and Capstone (S3/S5 contrôle) |
| Assessment relationship | INTEGRATED_M3_M6 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Structurer explication écart |
| Capstone relationship | S3/S5 contrôle |
| Mission keys | `m6-m01-reception-facture` · `m6-m02-exception-rapprochement-trois-voies` · `m6-m03-expliquer-ecart-finance` |

### M7 — CRM et service client

| Dimension | Definition |
|-----------|------------|
| Business purpose | Case → escalade → NPS |
| Learner competence | Ouvrir dossier; escalader; clôturer NPS |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | Service, Superviseur, Ventes |
| Actors | Defined in `modules/M7_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | NPS / délai |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | M1–M6 recommended; unlock policy may be stricter |
| Downstream impact | Feeds later modules and Capstone (S5 voix client) |
| Assessment relationship | GOLD_M7_M10 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Réfléchir causes expérience |
| Capstone relationship | S5 voix client |
| Mission keys | `m7-m01-ouvrir-dossier-client` · `m7-m02-coordonner-escalade` · `m7-m03-cloturer-cas-nps` |

### M8 — Ressources humaines et HCM

| Dimension | Definition |
|-----------|------------|
| Business purpose | HCM onboarding/temps/compétences (V2) |
| Learner competence | Intégrer; temps/absences; évaluer compétences |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | RH, Manager, Employé |
| Actors | Defined in `modules/M8_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | Onboarding/temps/compétences |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | M1–M7 recommended; unlock policy may be stricter |
| Downstream impact | Feeds later modules and Capstone (S4 capacité humaine) |
| Assessment relationship | HCM_M8 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Plan évolution fondé preuves |
| Capstone relationship | S4 capacité humaine |
| Mission keys | `m8-m01-integrer-nouvel-employe` · `m8-m02-gerer-temps-absences` · `m8-m03-evaluer-competences-evolution` |

### M9 — Gouvernance, accès et conformité

| Dimension | Definition |
|-----------|------------|
| Business purpose | Accès, SoD, conformité (V2) |
| Learner competence | Matrice; revue SoD; autoévaluation |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | Gouvernance, Manager, Audit |
| Actors | Defined in `modules/M9_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | SoD / accès orphelins |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | M1–M8 recommended; unlock policy may be stricter |
| Downstream impact | Feeds later modules and Capstone (S3–S5 risque) |
| Assessment relationship | GOLD_M7_M10 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Diagnostiquer conflit SoD |
| Capstone relationship | S3–S5 risque |
| Mission keys | `m8-m01-matrice-approbation-pression` · `m8-m02-revue-acces-sod` · `m8-m03-autoevaluation-probation` |

### M10 — BI, KPI, IA et conseil

| Dimension | Definition |
|-----------|------------|
| Business purpose | KPI, comité, conseil IA (V2) |
| Learner competence | Définir KPI; tableau comité; analyse IA/conseil |
| Process scope | See module blueprint; end-to-end inside module with explicit upstream/downstream |
| Departments involved | Analyste, Comité, Coach IA |
| Actors | Defined in `modules/M10_LEARNING_BLUEPRINT.md` |
| Master data | Module-relevant master entities only; quality rules explicit |
| Transactions | Mission 2 primary; Mission 3 exception/recovery |
| Documents | Process documents with evidence links |
| Controls | Approvals, SoD-relevant checks, validation gates |
| Risks | Operational, financial, compliance, service as applicable |
| KPIs | Qualité KPI / recommandation |
| Decisions | Mission 3 + BI/AI synthesis |
| Prerequisite modules | M1–M9 recommended; unlock policy may be stricter |
| Downstream impact | Feeds later modules and Capstone (Méthode S3/S5) |
| Assessment relationship | GOLD_M7_M10 |
| BI relationship | Module BI activity mandatory in learning cycle phase ANALYSER |
| AI relationship | Tous modes + synthèse |
| Capstone relationship | Méthode S3/S5 |
| Mission keys | `m9-m01-atelier-definition-kpi` · `m9-m02-tableau-bord-comite` · `m9-m03-analyse-concurrentielle-ia` |

## Capstone (separate)

**MCapstone** is not a module in the 30 and is not M11. Stages S1–S7 are defined in `TEC_ERP_CAPSTONE_LEARNING_CONTRACT.md`.

## V1 note

V1 historical meaning for M8–M10 differs. See `TEC_ERP_V1_V2_HISTORICAL_AND_CURRENT_CONTRACT.md`.
