# M3 Learning Blueprint — Approvisionnement et Procure-to-Pay

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1 Learning Architecture · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Learning purpose

Maîtriser le cycle **Procure-to-Pay** chez Equinoxe : qualifier un besoin, passer une commande contrôlée, réceptionner, et décider face à un écart fournisseur — avec conséquences stock (M5) et finance (M6).

## Visual concept

Flux horizontal **PR → PO → GR → (facture M6)** avec preuves documentaires et signal OTIF. Hero = process ribbon, not stock warehouse photo.

## Process

Besoin d’achat → demande → approbation → bon de commande → réception → analyse performance fournisseur → récupération.

## Documents

Demande d’achat · Bon de commande · Bon de réception · Évaluation fournisseur · (lien) Facture pour M6

## Actors / departments

Demandeur · Acheteur · Approbateur · Réceptionnaire · Fournisseur · Contrôleur (lecture)

## Missions

### Mission 1 — Comprendre et cadrer (`m3-m01-identifier-besoin-achat`)

| Field | Contract |
|-------|----------|
| Objective | Qualifier besoin vs want; acteurs; données article/fournisseur; frontières P2P |
| Scenario | Urgence opérationnelle avec pression pour court-circuiter l’approbation |
| Learner role | Analyste junior support achats |
| Starting condition | Besoin déclaré, master data partiellement disponible |
| Evidence | Besoin cadré + règle d’approbation citée |
| ERP action | Lecture contexte / identification données (pas PO final) |
| Document | Demande d’achat (brouillon cadré) |
| Control | Seuil d’approbation reconnu |
| Risk | Achat hors process |
| Expected decision | Rester dans le process malgré la pression |
| Possible errors | Confondre urgence et exemption de contrôle |
| Recovery path | Reformuler besoin + route d’approbation |
| AI boundary | Clarifier règles; pas de PO à la place du learner |
| BI connection | Preview délai cycle PR→PO |
| Competency evidence | Process framing P2P |
| Completion | Frontiers + rule explained |
| Debrief | Pourquoi le cadre protège M5/M6 |

### Mission 2 — Exécuter et contrôler (`m3-m02-creer-traiter-commande-achat`)

| Field | Contract |
|-------|----------|
| Objective | Créer/traiter PO avec contrôles |
| Scenario | Commande fournisseur standard sous politique d’approbation |
| Evidence | PO + checkpoint contrôle |
| ERP action | Création/traitement commande |
| Document | Bon de commande |
| Control | Approbation / validation montant |
| Risk | PO sans autorité |
| Expected decision | Respecter séquence et contrôles |
| Recovery | Corriger données puis resoumettre |
| AI boundary | Structurer checklist; pas soumettre |
| BI connection | Temps de cycle |
| Completion | PO valide contrôlé |

### Mission 3 — Analyser, récupérer et décider (`m3-m03-receptionner-analyser-fournisseur`)

| Field | Contract |
|-------|----------|
| Objective | Réceptionner, analyser écart, décider récupération, expliquer aval |
| Scenario | Écart quantité/qualité à la réception |
| Evidence | GR + écart + décision + impact |
| ERP action | Réception + exception |
| Document | Bon de réception + note fournisseur |
| Control | Tolérance réception |
| Risk | Stock faux / facture future fausse |
| Expected decision | Accepter partiel / rejeter / réclamer — justifié |
| BI connection | OTIF + variance réception |
| AI | Préparer décision avec alternatives + incertitude |
| Completion | Décision liée preuves + impact M5/M6 |

## KPI

OTIF fournisseur · délai PR→PO · variance réception

## BI activity

Filtrer fournisseur/période → comparer cible/réel OTIF → expliquer cause process → recommander action → définir mesure de récupération.

## AI activity

Mode **Préparer une décision** sur écart réception; synthèse apprenant obligatoire.

## Teaching Deck anchor

Démo PO · erreur fréquente court-circuit approbation · KPI OTIF · question classe sur pression métier · briefing missions.

## Assessment

`INTEGRATED_M3_M6` (séquence + contrôle + jugement).

## Debrief

P2P crée le stock et la dette; transition M4/M5/M6.

## Capstone contribution

Levier crise approvisionnement (S4).

## Pilot priority

Wave 3 implementation pilot. SHALL NOT ship stub content.


## Wave 1A Research Addendum

### Consulting mandat hooks

Populate per `TEC_ERP_CONSULTING_MANDATE_CONTRACT.md`: mandate title, executive sponsor, client problem, incomplete evidence, decision, facilitation notes. Mission 1=enquête; Mission 2=intervention; Mission 3=consequence/BI/reco.

### Process chain contribution

Procure-to-Pay (primary); feeds inventory/finance

### Experience modes

Exploration for discover/orient; Guided Practice for early practice; Simulation for mandat execution; Evaluation for assessed validation. Mode must be explicit on every activity.

### Dual journey

Company evolution: module position on enterprise journey. Professional identity: Junior → process analyst. Guidance fades per `TEC_ERP_COGNITIVE_LOAD_AND_GUIDANCE_FADING_STANDARD.md`.

### Digital Twin

Reads/writes the shared Equinoxe Twin for V2 Runs. Important changes require source event, consequences, evidence, learner/Professor visibility. V1 historical runs immutable.

## Enterprise Life Engine (pilot candidate)

Wave **5B** controlled pilot. Stakeholders: supplier · buyer supervisor · warehouse · finance · customer. Do not enable full company-wide Ambient AI from this blueprint alone.
