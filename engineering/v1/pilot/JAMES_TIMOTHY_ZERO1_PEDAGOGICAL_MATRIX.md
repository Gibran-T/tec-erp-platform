# JAMES TIMOTHY ZERO1 — Pedagogical Matrix

Evaluation generated under the James Timothy Zero1 professional persona.

**Document type:** Per-mission pedagogical matrix (30 missions)  
**Persona:** James Timothy — TEC.ERP Student Zero1 (`TECERP-2026-PILOT-001`)  
**Cohort:** `TECERP-PILOT-001` · Company `TECERP-PILOT`  
**Evidence baseline:** Execution log + production run 2026-07-22  
**Limitation:** Persona simulée — jugements qualitatifs ≠ opinion humaine réelle. Scores runtime : voir `JAMES_TIMOTHY_ZERO1_EXECUTION_LOG.md`.

### Colonnes requises (par mission)

`prerequisite knowledge` · `ERP concept` · `business competency` · `student action` · `expected reasoning` · `professor preparation` · `blackboard explanation` · `real example` · `common error` · `assessment evidence` · `difficulty` · `recommended duration` · `readiness verdict`

**Difficulty scale:** L (Low) · M (Medium) · H (High) · CH (Challenge)  
**Readiness verdict:** `Ready` · `Ready with coaching` · `Needs professor demo` · `Not ready for unsupervised cohort` (lié au mode d’évidence hybrid)

**Note d’évidence :** M1-M01 = full UI ; autres = `ui_observe_api_submit_ordering`. Les verdicts « Ready with coaching » tiennent compte du gap hybrid (Z1-006).

---

## M1 — Découverte organisationnelle

### M1-M01 — Découvrir l’entreprise

| Column | Content |
|--------|---------|
| prerequisite knowledge | Aucun prérequis TEC.ERP ; culture entreprise / organigramme de base |
| ERP concept | Entreprise vs système ; fragmentation de l’information |
| business competency | Cartographier acteurs, sites et symptômes (40 vs 36) avant toute transaction |
| student action | Lire briefing Claire ; mapper départements / douleurs ; soumettre diagnostic initial |
| expected reasoning | « L’écart stock n’est pas un bug isolé — c’est un symptôme multi-départements » |
| professor preparation | Raconter NordHabitat + signal Tom 40/36 ; distinguer WMS vs ERP |
| blackboard explanation | Organigramme → sources de vérité → symptôme 40 vs 36 → qui est touché |
| real example | Tom (DC-MTL) : écran 40 / étagère 36 |
| common error | Vouloir « corriger le stock » immédiatement sans cartographier |
| assessment evidence | Score 100 ; recovery après mapping incorrect volontaire (full UI) |
| difficulty | L |
| recommended duration | 25–35 min |
| readiness verdict | **Ready** (prouvé en full UI) |

### M1-M02 — Connecter les départements

| Column | Content |
|--------|---------|
| prerequisite knowledge | M1-M01 complétée |
| ERP concept | Processus transverse ; dépendance inter-modules |
| business competency | Relier écart local → risque entreprise |
| student action | Relier flux d’information entre départements |
| expected reasoning | Chaîne Entrepôt → Ops → Ventes → Finance → TI |
| professor preparation | Schéma de dépendance ; vocabulaire processus |
| blackboard explanation | Écart inventaire → impacts PO, promesse client, AP/AR |
| real example | Écart inventaire qui traverse entrepôt, TI, ops, ventes, finance |
| common error | Traiter chaque département comme silo |
| assessment evidence | Score 100 ; tentative incomplete submit puis recovery |
| difficulty | M |
| recommended duration | 30–40 min |
| readiness verdict | **Ready with coaching** (hybrid evidence) |

### M1-M03 — Diagnostiquer la préparation

| Column | Content |
|--------|---------|
| prerequisite knowledge | M1-M01, M1-M02 |
| ERP concept | ERP readiness (rôles, données, processus) |
| business competency | Juger Ready / Partial / Not Ready avant M2 |
| student action | Diagnostiquer préparation organisationnelle NordHabitat |
| expected reasoning | Pas de correctif transactionnel — alignement rôles/données/processus |
| professor preparation | Critères readiness ; pièges du « go-live trop tôt » |
| blackboard explanation | Checklist readiness : master data, SoD, processus, formation |
| real example | Question Marc : sommes-nous prêts ? |
| common error | Confondre « système up » et « organisation prête » |
| assessment evidence | Score 100 |
| difficulty | M |
| recommended duration | 25–35 min |
| readiness verdict | **Ready with coaching** |

---

## M2 — Données maîtres & organisation

### M2-M01 — Structurer l’organisation

| Column | Content |
|--------|---------|
| prerequisite knowledge | M1 readiness |
| ERP concept | Unités organisationnelles, usines, centres de coûts |
| business competency | Structurer avant toute transaction |
| student action | Cartographier sièges, DC-MTL, DC-TRT, centres de coûts |
| expected reasoning | Sans structure org, les transactions mentent |
| professor preparation | Modèle org ERP ; centres de coûts vs sites |
| blackboard explanation | Société → sites/DC → centres de coûts → transactions futures |
| real example | DC-MTL / DC-TRT NordHabitat |
| common error | Créer des transactions avant l’org |
| assessment evidence | Score 100 ; FR accents faibles (Z1-005) |
| difficulty | M |
| recommended duration | 30–40 min |
| readiness verdict | **Needs professor demo** (concepts org + FR) |

### M2-M02 — Créer les données de référence

| Column | Content |
|--------|---------|
| prerequisite knowledge | Structure org M2-M01 |
| ERP concept | Master data : client, fournisseur, article, UoM |
| business competency | Créer fiches opérationnellement sûres |
| student action | Créer Sacré-Cœur, ThermoControl, SKU-HVAC-4421, UoM EA |
| expected reasoning | Champs obligatoires ≠ cosmétique — ils gouvernent le flux |
| professor preparation | Champs critiques fournisseur/client/article |
| blackboard explanation | Golden record ; statut actif ; conditions de paiement |
| real example | Fournisseur ThermoControl ; client Hôpital du Sacré-Cœur |
| common error | Remplir le minimum UI sans cohérence métier |
| assessment evidence | Score 100 |
| difficulty | M |
| recommended duration | 35–45 min |
| readiness verdict | **Needs professor demo** |

### M2-M03 — Corriger la qualité des données

| Column | Content |
|--------|---------|
| prerequisite knowledge | M2-M01, M2-M02 |
| ERP concept | Qualité MD ; doublons ; intégrité référentielle |
| business competency | Corriger sans casser les liens |
| student action | Détecter doublons, champs manquants, enregistrements bloqués |
| expected reasoning | Fusion / blocage contrôlé > suppression impulsive |
| professor preparation | Procédure doublons ; impact O2C/P2P |
| blackboard explanation | Défauts qui bloquent vs défauts cosmétiques |
| real example | Doublon fournisseur ; client inactif encore utilisé |
| common error | « Nettoyer » en cassant les références |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 35–45 min |
| readiness verdict | **Needs professor demo** |

---

## M3 — Procure-to-Pay (P2P)

### M3-M01 — Identifier un besoin d’achat

| Column | Content |
|--------|---------|
| prerequisite knowledge | Master data saines |
| ERP concept | Purchase requisition / besoin contrôlé |
| business competency | Transformer tension de stock en demande d’achat |
| student action | Identifier besoin, demandeur, fournisseur éligible |
| expected reasoning | Ops/entrepôt porte le besoin ; contrôles avant création |
| professor preparation | Qui demande / qui approuve / qui achète |
| blackboard explanation | Signal stock → besoin → PR → fournisseur éligible |
| real example | Denise / pièces HVAC / ThermoControl |
| common error | Créer PO sans besoin documenté |
| assessment evidence | Score 100 |
| difficulty | M |
| recommended duration | 30–40 min |
| readiness verdict | **Ready with coaching** |

### M3-M02 — Créer et traiter une commande d’achat

| Column | Content |
|--------|---------|
| prerequisite knowledge | M3-M01 |
| ERP concept | PO, approbation, tolérances, SoD |
| business competency | Créer PO valide sous gouvernance |
| student action | Créer PO-88421 avec prix et limites d’approbation |
| expected reasoning | Fournisseur bloqué = bloquer PO, pas forcer |
| professor preparation | Matrice d’approbation ; éléments PO valides |
| blackboard explanation | PR → PO → approbation → engagement |
| real example | PO-88421 ThermoControl |
| common error | Contourner limite d’approbation |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 40–50 min |
| readiness verdict | **Needs professor demo** |

### M3-M03 — Réceptionner et analyser l’impact fournisseur

| Column | Content |
|--------|---------|
| prerequisite knowledge | M3-M02 |
| ERP concept | Goods receipt ; réception partielle ; OTIF |
| business competency | Enregistrer 36/40 et analyser l’écart |
| student action | Réceptionner, maj stock, évaluer impact fournisseur |
| expected reasoning | Réception partielle correcte : stock +36, reste ouvert |
| professor preparation | OTIF ; écart quantité ; lien finance futur |
| blackboard explanation | PO 40 → GR 36 → conséquences stock/OTIF/AP |
| real example | ThermoControl livre 36/40 |
| common error | Forcer 40 pour « fermer » le dossier |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 40–50 min |
| readiness verdict | **Needs professor demo** |

---

## M4 — Order-to-Cash (O2C)

### M4-M01 — Saisir la commande institutionnelle

| Column | Content |
|--------|---------|
| prerequisite knowledge | Master data client + stock context |
| ERP concept | Sales order ; crédit ; ATP |
| business competency | Promettre seulement après crédit + ATP |
| student action | Créer commande Sacré-Cœur aile pédiatrique (40 u.) |
| expected reasoning | Priorité Patrick ≠ autorisation de promettre sans contrôle |
| professor preparation | Crédit client ; ATP ; promesse institutionnelle |
| blackboard explanation | Demande client → crédit → ATP → SO confirmée |
| real example | Hôpital Sacré-Cœur / Dr Meunier / SKU-HVAC-4421 |
| common error | Confirmer date ferme sans ATP |
| assessment evidence | Score **85** (catalogue-correct → transparence scoring Z1-008) |
| difficulty | H |
| recommended duration | 40–50 min |
| readiness verdict | **Needs professor demo** + revue scoring |

### M4-M02 — Allocation inter-entrepôts

| Column | Content |
|--------|---------|
| prerequisite knowledge | M4-M01 |
| ERP concept | Transfert inter-DC / allocation |
| business competency | Équilibrer stock sous contrainte fret/SLA |
| student action | Organiser transfert urgence DC-MTL → DC-TRT |
| expected reasoning | Owner opérationnel jusqu’à nouvel ordre ; documenter fret |
| professor preparation | Trade-off service vs coût transport |
| blackboard explanation | Manque 12 u. TRT → STO → estimation fret → approbation |
| real example | Elodie owner ; Denise transfert ; Marc fret |
| common error | Transférer sans impact coût documenté |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 40–50 min |
| readiness verdict | **Needs professor demo** |

### M4-M03 — Confirmer livraison et clôturer

| Column | Content |
|--------|---------|
| prerequisite knowledge | M4-M01, M4-M02 |
| ERP concept | Goods issue ; facturation ; AR |
| business competency | Clôturer O2C avec traçabilité |
| student action | Poster GI, déclencher facturation, maj dossier AR |
| expected reasoning | Livraison confirmée ≠ dossier clôturé sans finance |
| professor preparation | Enchaînement GI → invoice → AR |
| blackboard explanation | Livraison 40 → GI → facture → créance |
| real example | Dr Meunier confirme réception aile pédiatrique |
| common error | Oublier l’impact AR |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 35–45 min |
| readiness verdict | **Needs professor demo** |

---

## M5 — Supply chain / S&OP

### M5-M01 — Analyser stock et signal de réappro

| Column | Content |
|--------|---------|
| prerequisite knowledge | Chaîne M3–M4 |
| ERP concept | Couverture stock ; signal de réapprovisionnement |
| business competency | Interpréter stockout et proposer signal |
| student action | Analyser stockout DC-TRT SKU-HVAC-4421 |
| expected reasoning | Couvertures divergentes MTL vs TRT → décision |
| professor preparation | MAPE / prévision (niveau pédagogique) ; couverture jours |
| blackboard explanation | Stockout → causes → options (transfert vs PO) |
| real example | Canicule Ontario ; Karim challenge MAPE |
| common error | Commander immédiatement sans analyser couverture |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 40–50 min |
| readiness verdict | **Ready with coaching** |

### M5-M02 — Décision transfert inter-DC

| Column | Content |
|--------|---------|
| prerequisite knowledge | M5-M01 |
| ERP concept | STO ; arbitrage fret vs service |
| business competency | Approuver transfert avec impact fret documenté |
| student action | Décider transfert MTL→TRT (ex. 20 u.) |
| expected reasoning | Servir clients cette semaine avant PO long délai |
| professor preparation | Coût cumulé fret vs rupture |
| blackboard explanation | 47 j couverture MTL vs rupture TRT → STO |
| real example | Proposition Tom 20 u. ; Marc veut impact fret |
| common error | Ignorer le coût de transfert |
| assessment evidence | Score **85** (Z1-008) |
| difficulty | H |
| recommended duration | 35–45 min |
| readiness verdict | **Needs professor demo** + revue scoring |

### M5-M03 — Présentation S&OP

| Column | Content |
|--------|---------|
| prerequisite knowledge | M5-M01, M5-M02 |
| ERP concept | S&OP cross-functional |
| business competency | Défendre recommandation devant Finance/Ventes/SC |
| student action | Présenter analyse + transfert + réappro 40 u. |
| expected reasoning | Une reco unique cohérente multi-contraintes |
| professor preparation | Faciliter conflits d’objectifs en classe |
| blackboard explanation | Service vs coût vs inventaire — matrice de décision |
| real example | S&OP mensuel ; Marc challenge fret cumulé |
| common error | Présenter des chiffres sans recommandation |
| assessment evidence | Score 100 |
| difficulty | CH |
| recommended duration | 45–60 min |
| readiness verdict | **Needs professor demo** |

---

## M6 — Finance / 3-way match

### M6-M01 — Réceptionner la facture fournisseur

| Column | Content |
|--------|---------|
| prerequisite knowledge | PO + GR M3 |
| ERP concept | AP invoice ; match preview |
| business competency | Saisir facture et préparer rapprochement |
| student action | Saisir INV-TC-88421 pour PO-88421 |
| expected reasoning | Ne pas poster aveuglément — preview match d’abord |
| professor preparation | Cycle AP ; documents requis |
| blackboard explanation | PO / GR / Invoice → preview |
| real example | Facture ThermoControl livraison partielle |
| common error | Poster sans match preview |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 35–45 min |
| readiness verdict | **Needs professor demo** |

### M6-M02 — Exception rapprochement trois voies

| Column | Content |
|--------|---------|
| prerequisite knowledge | M6-M01 |
| ERP concept | 3-way match exception |
| business competency | Résoudre PO40 / GR36 / INV36 avant paiement |
| student action | Traiter exception et expliquer blocage paiement |
| expected reasoning | Payer 36 est cohérent ; forcer 40 est une fraude de processus |
| professor preparation | Tolérances ; escalade Renée/Julie |
| blackboard explanation | Exception → cause → action → déblocage contrôlé |
| real example | Historique livraison partielle mai |
| common error | Débloquer paiement sans explication |
| assessment evidence | Score **85** (Z1-008) |
| difficulty | CH |
| recommended duration | 45–60 min |
| readiness verdict | **Needs professor demo** + revue scoring |

### M6-M03 — Expliquer l’écart à la finance

| Column | Content |
|--------|---------|
| prerequisite knowledge | Chaîne M3–M6 |
| ERP concept | Impact trésorerie / marge |
| business competency | Narration finance claire (≤3 lignes exécutives) |
| student action | Expliquer à Marc cash + marge + décisions acceptées |
| expected reasoning | Relier écart opérationnel → cash → marge |
| professor preparation | Modèle de narration executive |
| blackboard explanation | Trace écart → quantifie → justifie décisions |
| real example | Frets urgence Sacré-Cœur + STO-4512 |
| common error | Jargon technique sans impact $ |
| assessment evidence | Score 100 |
| difficulty | CH |
| recommended duration | 30–40 min |
| readiness verdict | **Ready with coaching** (si M6-M02 maîtrisé) |

---

## M7 — CRM / service

### M7-M01 — Ouvrir le dossier client

| Column | Content |
|--------|---------|
| prerequisite knowledge | O2C Sacré-Cœur |
| ERP concept | Case CRM ; garantie ; preuve livraison |
| business competency | Qualifier réclamation avant promesse |
| student action | Ouvrir dossier structuré pour 2 unités défectueuses |
| expected reasoning | Preuve + garantie + SLA avant engagement 48 h |
| professor preparation | Discipline case management institutionnel |
| blackboard explanation | Signal client → case → qualification P1 |
| real example | Dr Meunier / SO-12047 / SKU-HVAC-4421 |
| common error | Promettre remplacement immédiatement |
| assessment evidence | Score **85** (Z1-008) |
| difficulty | H |
| recommended duration | 35–45 min |
| readiness verdict | **Needs professor demo** + revue scoring |

### M7-M02 — Coordonner l’escalade

| Column | Content |
|--------|---------|
| prerequisite knowledge | M7-M01 |
| ERP concept | Escalade multi-départements traçable |
| business competency | Une vérité client, plusieurs actions internes |
| student action | Escalader CAS-7701 qualité + logistique |
| expected reasoning | Éviter trois versions divergentes au client |
| professor preparation | RACI escalade P1 |
| blackboard explanation | Case → Qualité lot → Logistique stock remplacement |
| real example | Lot ThermoControl suspect ; stock DC-TRT |
| common error | Emails parallèles non tracés |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 35–45 min |
| readiness verdict | **Ready with coaching** |

### M7-M03 — Clôturer le cas et NPS

| Column | Content |
|--------|---------|
| prerequisite knowledge | M7-M01, M7-M02 |
| ERP concept | Case closure ; NPS institutionnel |
| business competency | Clôturer avec cause racine + NPS |
| student action | Documenter résolution et collecter NPS |
| expected reasoning | Remplacement installé ≠ clôture sans mesure |
| professor preparation | NPS comme indicateur de compte, pas vanity metric |
| blackboard explanation | Cause → actions → délai réel → NPS |
| real example | Deux unités remplacées ; Dr Meunier confirme |
| common error | Clôturer sans NPS / sans cause racine |
| assessment evidence | Score **85** |
| difficulty | M |
| recommended duration | 30–40 min |
| readiness verdict | **Ready with coaching** |

---

## M8 — Gouvernance

### M8-M01 — Matrice d’approbation sous pression

| Column | Content |
|--------|---------|
| prerequisite knowledge | P2P + CRM pression |
| ERP concept | Approval matrix ; limites VP |
| business competency | Respecter gouvernance sous urgence |
| student action | Traiter demande 32 000 CAD (limite VP 25 000) |
| expected reasoning | Pression Patrick ≠ contournement Marc |
| professor preparation | SoD + matrice montants |
| blackboard explanation | Montant → seuil → approbateur → preuve |
| real example | PO urgence CAS-7701 / 256 unités lot LT-8842 |
| common error | « Liberer avant 17 h » sans escalade formelle |
| assessment evidence | Score **85** |
| difficulty | CH |
| recommended duration | 40–50 min |
| readiness verdict | **Needs professor demo** |

### M8-M02 — Revue d’accès et SoD

| Column | Content |
|--------|---------|
| prerequisite knowledge | M8-M01 |
| ERP concept | Segregation of Duties |
| business competency | Identifier conflits créer/approuver |
| student action | Cartographier rôles achats/finance post PO-URG-9033 |
| expected reasoning | Julie crée+approuve = conflit SoD |
| professor preparation | Matrice SoD type audit interne |
| blackboard explanation | Rôle A vs rôle B ; conflits incompatibles |
| real example | Audit trimestriel ; conflit Julie/Marc |
| common error | Traiter SoD comme formalité IT |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 40–50 min |
| readiness verdict | **Needs professor demo** |

### M8-M03 — Autóévaluation de probation

| Column | Content |
|--------|---------|
| prerequisite knowledge | Preuves M1–M8 |
| ERP concept | Réflexion compétence / écarts |
| business competency | Autoévaluation honnête avec preuves |
| student action | Soumettre bilan probation Équinoxe |
| expected reasoning | Réflexion > perfection cosmétique |
| professor preparation | Rubrique d’observation des preuves |
| blackboard explanation | Compétences / écarts / preuves missions |
| real example | Fin de probation avant certification Or |
| common error | Liste de succès sans écarts |
| assessment evidence | Score **85** |
| difficulty | M |
| recommended duration | 30–40 min |
| readiness verdict | **Ready with coaching** |

---

## M9 — BI / KPI / IA

### M9-M01 — Atelier définition KPI

| Column | Content |
|--------|---------|
| prerequisite knowledge | Chaîne M1–M8 |
| ERP concept | KPI définition (owner, formule, seuil) |
| business competency | Sélectionner peu de KPI directeurs |
| student action | Animer atelier KPI comités |
| expected reasoning | Chaque KPI a une question métier |
| professor preparation | Anti-pattern « 40 indicateurs » |
| blackboard explanation | NPS, délai P1, écart P2P, marge O2C |
| real example | Comité direction Équinoxe |
| common error | KPI orphelins non actionnables |
| assessment evidence | Score 100 |
| difficulty | H |
| recommended duration | 40–50 min |
| readiness verdict | **Needs professor demo** |

### M9-M02 — Tableau de bord comité

| Column | Content |
|--------|---------|
| prerequisite knowledge | M9-M01 |
| ERP concept | Dashboard décisionnel |
| business competency | Construire tuiles vert/jaune/rouge actionnables |
| student action | Structurer dashboard CRM/P2P/O2C/GOV |
| expected reasoning | 30 secondes de lecture executive |
| professor preparation | Critiquer dashboards décoratifs |
| blackboard explanation | Domaine → signal → question → action |
| real example | Marc / Patrick / Sophie |
| common error | Graphiques sans décision |
| assessment evidence | Score **85** |
| difficulty | H |
| recommended duration | 40–50 min |
| readiness verdict | **Ready with coaching** |

### M9-M03 — Analyse concurrentielle et frontières IA

| Column | Content |
|--------|---------|
| prerequisite knowledge | M9-M01, M9-M02 |
| ERP concept | Limites éthiques AI Coach |
| business competency | Positionner concurrence + frontières IA |
| student action | Analyser ThermoRival ; définir où l’IA aide/ne décide pas |
| expected reasoning | Coach = raisonnement, pas answer key |
| professor preparation | Politique IA pédagogique |
| blackboard explanation | Aide réflexive vs spoiler vs décision humaine |
| real example | ThermoRival délais −30 % ; Coach Equinoxe |
| common error | Demander la « bonne réponse » au coach |
| assessment evidence | Score 100 ; AI Coach fallback observé (Z1-004) |
| difficulty | M |
| recommended duration | 35–45 min |
| readiness verdict | **Ready with coaching** (profondeur coach à améliorer) |

---

## M10 — Capstone path / Gold

### M10-M01 — Diapositive conseil

| Column | Content |
|--------|---------|
| prerequisite knowledge | Synthèse M1–M9 |
| ERP concept | Executive synthesis |
| business competency | Condenser risques/opportunités/reco en 1 page |
| student action | Préparer diapositive conseil DG |
| expected reasoning | Vision, pas détail opérationnel |
| professor preparation | Rubrique one-pager executive |
| blackboard explanation | Message unique → 3 risques → 1 reco |
| real example | DG Équinoxe avant défi final |
| common error | Empiler 10 slides de détail |
| assessment evidence | Score **85** |
| difficulty | H |
| recommended duration | 35–45 min |
| readiness verdict | **Ready with coaching** |

### M10-M02 — Défi final Équinoxe

| Column | Content |
|--------|---------|
| prerequisite knowledge | Tous modules |
| ERP concept | Crise intégrée multi-contraintes |
| business competency | Prioriser sans contourner gouvernance |
| student action | Gérer lot LT-8842 + ThermoRival + pression DG |
| expected reasoning | Priorisation + coordination + non-contournement |
| professor preparation | Faciliter crise live ; observer SoD sous stress |
| blackboard explanation | Triage P1 / concurrence / PO urgence / gouvernance |
| real example | 5 unités LT-8842 ; Sacré-Cœur courtisé ; 3 cas P1 |
| common error | Sacrifier gouvernance pour vitesse |
| assessment evidence | Score **85** |
| difficulty | CH |
| recommended duration | 60–90 min |
| readiness verdict | **Needs professor demo** / supervision live |

### M10-M03 — Présentation Capstone et certification Or

| Column | Content |
|--------|---------|
| prerequisite knowledge | M10-M01, M10-M02 + assessments |
| ERP concept | Capstone defense ; certification Gold |
| business competency | Présenter parcours et compétence intégrée |
| student action | Présenter transformation M1–M10 au jury |
| expected reasoning | Preuves + erreurs corrigées + vision pro |
| professor preparation | Grille Capstone ; approbation professeur **institutionnelle** |
| blackboard explanation | Diagnose → Prioritize → Execute → Analyze → Recommend |
| real example | Jury DG / Marc / Isabelle / Nadia |
| common error | Récit UI sans compétence métier |
| assessment evidence | Score 100 mission ; Capstone approved (temp professor) ; Gold lifecycle OK |
| difficulty | CH |
| recommended duration | 45–60 min (+ revue Capstone professeur) |
| readiness verdict | **Not ready for unsupervised cohort** jusqu’à professeur institutionnel (Z1-003) |

---

## Matrix rollup (persona Zero1)

| Module | Dominant readiness | Professor intensity | Scoring notes |
|--------|--------------------|---------------------|---------------|
| M1 | Ready / Ready with coaching | Medium | Full UI proven on M1-M01 |
| M2 | Needs professor demo | High | FR accents + master data rigor |
| M3 | Needs professor demo | High | P2P core |
| M4 | Needs professor demo | High | M4-M01 score 85 transparency |
| M5 | Needs demo on decisions | High | M5-M02 score 85 |
| M6 | Needs professor demo | Very high | 3-way match critical |
| M7 | Mixed | High | M7-M01 score 85 |
| M8 | Needs professor demo | Very high | SoD under pressure |
| M9 | Ready with coaching | Medium–High | AI depth weak |
| M10 | Not ready unsupervised | Very high | Professor assignment blocker |

**Verdict matrice :** le contenu métier est globalement **crédible et enseignable**, mais une cohorte réelle exige (1) professeur institutionnel assigné, (2) revue pédagogique des preuves hybrid, (3) correction des défauts P2 listés au backlog.
