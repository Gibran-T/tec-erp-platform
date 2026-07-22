# Guide professoral — TEC.ERP (persona James Timothy Zero1)

**Destinataire :** professeur Thiago Gibran  
**Produit :** TEC.ERP — formation ERP française (analyste processus d’affaires)  
**Univers :** NordHabitat Équipements Inc. — Projet Équinoxe  
**Portée :** 10 modules (M1–M10) · 30 missions (3 par module) · parcours Silver → Gold  
**Cadre d’évaluation :** Evaluation generated under the James Timothy Zero1 professional persona.  
**Limitation :** persona simulée de raisonnement professionnel — **pas une opinion humaine réelle**.  
**Nature du présent document :** recommandations pédagogiques pour la revue du pilote Zero1.  
**Statut :** guide d’enseignement — **aucune note runtime inventée** ; ne pas traiter ce document comme un scorecard d’exécution.

---

## 0. Comment utiliser ce guide

### 0.1 Intention

Ce guide aide le professeur à **enseigner le métier dans le système**, pas à faire une visite guidée de menus. Il traduit les attentes du persona Zero1 (logistique, Walmart, approvisionnement, analyse, SQA, TEC.WMS) en gestes de classe concrets pour Thiago Gibran.

### 0.2 Règles d’or pour chaque séance

1. **Situation d’affaires → règles → données → documents → impact → contrôles → décision.**  
2. Ce qui n’a pas été nommé au tableau ne doit pas devenir un piège dans le système.  
3. Un bouton vert n’est pas une preuve de compétence.  
4. Montrer un *happy path* **et** une exception réaliste.  
5. Corriger le raisonnement, pas la personne — toujours ancré sur une règle d’entreprise.  
6. Distinguer clairement : **évidence technique observée** vs **jugement pédagogique Zero1**.

### 0.3 Persona Zero1 — rappel utile en classe

James Timothy Zero1 raisonne comme un praticien senior multidisciplinaire (~25 ans de marché ; ~17 ans liés à Walmart ; ~7 ans analyste logistique ; TEC.WMS complété). Il pose en permanence :

- Cela arriverait-il en entreprise réelle ?  
- La logique ERP est-elle correcte ?  
- L’étudiant comprend-il *pourquoi* l’opération existe ?  
- Les prérequis ont-ils été enseignés avant la tâche ?  
- Thiago pourrait-il l’expliquer clairement en classe ?

**À ne pas faire :** présenter James comme un vrai étudiant interviewé, ni citer de scores pilote inventés.

### 0.4 Structure type d’une séance module (recommandation pilote)

| Bloc | Intention | Temps indicatif |
|------|-----------|-----------------|
| Enseignement tableau | Concepts, définitions, schéma | 25–35 % |
| Démonstration système | Métier dans TEC.ERP | 25–35 % |
| Discussion / mission | Raisonnement guidé | 15–25 % |
| Correction collective | Erreurs fréquentes | 10–15 % |

Les allocations détaillées figurent dans chaque module.

### 0.5 Chaîne NordHabitat à garder vivante (fil rouge)

Signal fondateur : **le système dit 40, l’étagère dit 36** (Tom / DC-MTL).  
Chaîne de conséquence pédagogique : fragmentation info → données maîtres → P2P ThermoControl (PO partiel) → O2C Hôpital du Sacré-Cœur → stocks multi-DC → 3-way match → CRM post-vente → gouvernance/SoD → KPI/limites IA → Capstone / Gold.

---

## M1 — Découverte organisationnelle (fragmentation de l’information, 40 vs 36)

**Thème :** comprendre NordHabitat avant toute transaction.  
**Missions canon :** M1-M01 Découvrir l’entreprise · M1-M02 Relier départements / processus / modules · M1-M03 Diagnostiquer la préparation ERP.

### Objectif de leçon

Faire découvrir que l’ERP ne « répare » pas une entreprise mal comprise : l’étudiant doit d’abord cartographier l’organisation, les silos d’information et le signal **40 vs 36** comme symptôme de fragmentation — pas comme bug isolé.

### Concepts à expliquer avant l’usage du système

- Entreprise vs système ; processus vs écran  
- Fragmentation de l’information (sources multiples, vérités concurrentes)  
- Départements, rôles, déclencheurs métier  
- Cartographie besoin → département → processus → module ERP  
- Préparation ERP (readiness) : données, contrôles, responsabilités  
- Différence TEC.WMS (réalisme entrepôt) vs TEC.ERP (portée bout-en-bout)

### Définitions et acronymes

| Terme | Définition pédagogique |
|-------|------------------------|
| ERP | Enterprise Resource Planning — système intégré de gestion des ressources et processus |
| Fragmentation | Même réalité métier décrite différemment selon le département ou le support |
| Module | Domaine fonctionnel ERP (Achats, Ventes, Stocks, Finance, etc.) |
| Readiness | Capacité de l’organisation à adopter l’ERP sans créer de risque majeur |
| CoE | Center of Excellence (ici : ERP CoE NordHabitat / Claire) |
| Gemba | Aller voir le terrain (étagère, réception) avant de conclure sur un chiffre |

### Structure au tableau

1. NordHabitat : qui sommes-nous ? (distributeur / assemblage léger, bâtiments)  
2. Organigramme simplifié + douleurs par département  
3. Cas Tom : **écran = 40 / étagère = 36** → quelles causes possibles ?  
4. Carte : département → processus → module  
5. Question Marc : « Sommes-nous prêts ? » → Ready / Partial / Not Ready

### Exemple d’entreprise réelle (NordHabitat)

Claire envoie l’étudiant découvrir l’entreprise avant de « configurer ». Tom signale l’écart 40/36. L’étudiant ne corrige pas encore le stock : il **diagnostique** qui est touché (Entrepôt, Achats, Finance, Ventes).

### Exemple Walmart / logistique (pertinent)

En DC retail, un écart système/étagère n’est jamais « juste un inventaire » : il affecte le réapprovisionnement, les promesses rayon, les réceptions et les KPIs d’exactitude. Même discipline ici : **ne pas traiter 40 vs 36 comme un détail WMS**.

### Exemple quantitatif

Stock système : 40 u. Comptage terrain : 36 u. Écart : −4 u (−10 %).  
Si un acheteur se fie au système, il peut retarder un réapprovisionnement ; si Ventes promet 40, le client institutionnel reçoit un mensonge opérationnel.

### Flux documentaire ERP

À M1 : **pas de transaction** — consultation organisationnelle, cartes de besoins, checklist de readiness, journal de réflexion. Le « document » principal est la **carte de vérité** (qui sait quoi).

### Départements impliqués

Direction, Opérations, Finance, Ventes, Approvisionnement, Entrepôt, TI / ERP CoE.

### Conséquence financière

Indirecte mais réelle : décisions basées sur des stocks fantômes → rupture, fret d’urgence, pénalités client, ou surstock (capital immobilisé). M1 enseigne le *risque* avant le *montant*.

### Contrôle clé

Ne pas autoriser une conclusion « Ready » sans preuves (données, rôles, matching, exceptions). Exiger 3 risques classés.

### Erreur fréquente des étudiants

Ouvrir TEC.ERP pour « cliquer des modules » sans relier le problème terrain (40/36) aux départements. Ou déclarer Ready parce que « l’écran existe ».

### Point d’observation professeur

L’étudiant parle-t-il de **personnes et conséquences**, ou seulement de menus ? Mentionne-t-il Finance et Achats face à un écart stock ?

### Méthode de correction

Ramener au gemba : « Que sait Tom que le système ignore ? » Faire reclasser Ready / Partial / Not Ready avec 3 preuves.

### Question de discussion

*Si le système et l’étagère se contredisent, quelle décision d’entreprise devient dangereuse en premier — et pourquoi ?*

### Recommandation de démonstration de mission

Démo M1-M01 en lecture seule : profil entreprise + signal 40/36 + mapping départements. Puis M1-M02 carte modules. Terminer par M1-M03 face à Marc (challenge).

### Allocation de temps (recommandation pilote)

| Phase | Minutes (séance ~90) |
|-------|----------------------|
| Enseignement | 30 |
| Démo | 25 |
| Discussion / mission | 20 |
| Correction | 15 |

### Réponse attendue de l’étudiant

Une cartographie crédible : l’écart 40/36 touche inventaire, achats, promesse client et potentiellement AP/AR plus tard ; readiness = Partial avec risques (qualité données, matching, rôles).

### Preuve de compétence

Mapping département–problème ≥ seuil pédagogique ; dépendance inter-modules identifiée ; classification readiness justifiée ; réflexion soumise.

### Transition vers M2

« Nous savons *où* l’information se casse. M2 construit la **vérité structurée** : organisation et données maîtres — sans quoi toute transaction mentira proprement. »

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « Ce n’est pas un cours ERP. C’est NordHabitat. » |
| **Démontrer** | Navigation org + signal 40/36 sans transaction |
| **Demander** | Quels 3 départements souffrent le plus de la fragmentation ? |
| **Observer** | Vocabulaire métier vs jargon écran |
| **Corriger** | « Ready » sans preuve → reformuler Partial + risques |

### Ne pas trop expliquer

Architecture technique ERP, détails d’intégration middleware, comptabilité avancée.

### Où les débutants peinent

Confondre organigramme et processus ; croire que « module = département ».

### Où les étudiants expérimentés peuvent contester

« En vrai, on commence par les transactions. » Réponse : sans découverte, on automatise le chaos — preuve Walmart/DC : on ne réapprovisionne pas sur un fantôme.

---

## M2 — Master data / organisation

**Thème :** préparer une information d’entreprise fiable.  
**Missions :** M2-M01 Structurer l’organisation · M2-M02 Créer les données maîtres essentielles · M2-M03 Corriger la qualité des données (doublon client).

### Objectif de leçon

Montrer que les données maîtres sont la **fondation de vérité** : société, sites, entrepôts, centres de coûts, clients, fournisseurs, articles. Une donnée incorrecte produit des transactions « réussies » et des décisions fausses.

### Concepts à expliquer avant l’usage du système

- Données maîtres vs données transactionnelles  
- Organisation ERP : société, unités, sites, entrepôts, centres de coûts  
- Partenaire (client/fournisseur), article, conditions commerciales  
- Qualité : complétude, unicité, cohérence, fraîcheur  
- Gouvernance : qui crée, qui valide, qui fusionne  
- Impact d’un doublon (Hôpital du Sacré-Cœur)

### Définitions et acronymes

| Terme | Définition |
|-------|------------|
| MDM | Master Data Management — gouvernance des données de référence |
| BP / partenaire | Business Partner — client ou fournisseur |
| SKU | Stock Keeping Unit — unité de gestion d’article |
| Centre de coûts | Unité de responsabilité budgétaire / analytique |
| Golden record | Fiche consolidée retenue comme vérité après dédoublonnage |
| ASL | Approved Supplier List — liste fournisseurs autorisés |

### Structure au tableau

1. Pyramide : Organisation → Maîtres → Transactions → Indicateurs  
2. Exemple centre de coûts dupliqué (blocage budget)  
3. Matrice champs obligatoires : client / fournisseur / article  
4. Cas doublon Sacré-Cœur : 2 numéros → 1 vérité  
5. Règle : « Approuver incomplet = dette technique métier »

### Exemple d’entreprise réelle

Julie : « Ne créez pas de PO avec des fournisseurs cassés. » Finance bloque un upload budget à cause d’un centre de coûts dupliqué. Ventes et Finance se disputent deux fiches client pour le même hôpital.

### Exemple Walmart / logistique

Un article mal classé (unité, barcode, fournisseur primaire) casse réception, putaway et réassort. En retail, la donnée maître est une procédure opérationnelle déguisée.

### Exemple quantitatif

Complétude MDM illustrée pédagogiquement : 78 % → objectif 85 %. Un champ manquant (délai fournisseur ou conditions de paiement) suffit à bloquer ou fausser un PO.

### Flux documentaire ERP

Modèle org → validation centres de coûts → fiches client/fournisseur/article → workflow de validation → procédure de fusion / golden record. Pas encore de PO/SO complets.

### Départements impliqués

Finance, Opérations, RH (structure), Achats, Ventes, Stocks, ERP CoE, gouvernance données.

### Conséquence financière

Mauvais client → créance mal affectée ; mauvais fournisseur → engagement et AP incorrects ; mauvais article → valorisation stock fausse ; doublon → double risque crédit / double historique.

### Contrôle clé

Validation avant usage opérationnel ; interdiction d’« approuver pour débloquer l’écran » ; séparation créer ≠ valider quand le scénario l’exige.

### Erreur fréquente

Compléter le minimum UI pour passer, sans défendre les champs critiques (conditions, statut actif, lien site/entrepôt).

### Point d’observation professeur

L’étudiant peut-il expliquer **quel champ manquant blesse le plus l’hôpital** — et pourquoi ?

### Méthode de correction

Faire rejeter une fiche incomplète à voix haute avec justification métier, puis corriger et revalider.

### Question de discussion

*Quelle est pire pour NordHabitat : une transaction refusée par le système, ou une transaction acceptée sur une donnée maître fausse ?*

### Recommandation de démonstration

Montrer l’échec budget (doublon CC), puis validation stricte de 3 fiches, puis fusion contrôlée du doublon client — avec risque résiduel nommé.

### Allocation de temps

| Phase | Minutes (~90) |
|-------|----------------|
| Enseignement | 30 |
| Démo | 30 |
| Discussion / mission | 15 |
| Correction | 15 |

### Réponse attendue

Structure org cohérente ; fiches validées seulement si opérationnellement sûres ; doublon résolu avec golden record et conscience du risque sur O2C futur.

### Preuve de compétence

Structure validée ; 3 types d’entités correctement traités ; dédoublonnage justifié ; seuil Silver (qualité données) préparé.

### Transition vers M3

« Les maîtres sont sains. M3 déclenche le **Procure-to-Pay** : le besoin d’achat devient engagement, puis stock, puis dette. »

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « Une donnée maître n’est pas du setup admin — c’est de la vérité. » |
| **Démontrer** | Rejet d’une fiche incomplète + fusion doublon |
| **Demander** | Quel champ manquant ferait échouer le PO ThermoControl ? |
| **Observer** | Tentative d’approbation cosmétique |
| **Corriger** | Remplacer « le système a accepté » par une règle de qualité |

### Ne pas trop expliquer

Modèles MDM enterprise complexes, outils de data quality hors portée du module.

### Où les débutants peinent

Distinguer site / entrepôt / centre de coûts ; comprendre pourquoi Finance « se mêle » de l’entrepôt.

### Où les expérimentés contestent

« En entreprise les maîtres sont déjà là. » Réponse : justement — le cours enseigne à **défendre et réparer** ce que les opérations tiennent pour acquis.

---

## M3 — Procure-to-Pay

**Thème :** du besoin d’achat à la réception (chaîne ThermoControl / 40→36).  
**Missions :** M3-M01 Identifier un besoin d’achat · M3-M02 Créer et traiter un PO · M3-M03 Réceptionner et analyser l’impact fournisseur.

### Objectif de leçon

Enseigner le P2P comme chaîne de contrôle : besoin → demande/PR → PO → confirmation fournisseur → réception (GR) → scorecard — avec décision **partiel vs attendre** et conséquences visibles.

### Concepts à expliquer avant l’usage du système

- Déclencheur : stock sous seuil + demande future (Sacré-Cœur)  
- PR vs PO ; engagement d’achat  
- Sélection fournisseur / ASL / délai (ex. 14 jours)  
- Réception partielle, écart quantité, hold qualité  
- OTIF fournisseur et impact scorecard  
- Lien avec le signal 40 vs 36 (vérité terrain avant saisie)

### Définitions et acronymes

| Terme | Définition |
|-------|------------|
| P2P | Procure-to-Pay — besoin → achat → réception → (plus tard) facture/paiement |
| PR | Purchase Requisition — demande d’achat |
| PO | Purchase Order — commande fournisseur |
| GR | Goods Receipt — réception marchandises |
| OTIF | On Time In Full — livré à temps et en totalité |
| NCR | Non-Conformance Report — non-conformité |
| Lead time | Délai fournisseur |

### Structure au tableau

1. Chaîne P2P complète (y compris facture future M6)  
2. Gemba : 40 système / 36 réel → besoin réel  
3. Décision : accepter 36/40 maintenant vs attendre  
4. Documents : PR → PO-88421 → packing slip → GR  
5. Qui paie la décision ? (hôpital, marge, fournisseur)

### Exemple d’entreprise réelle

SKU aile pédiatrique ; ThermoControl ; confirmation 36/40 ; Renée met un hold qualité ; Marc exigera plus tard le matching. La décision de M3 ancre la crise de M4/M7.

### Exemple Walmart / logistique

Réception retail : on ne « force » pas une réception pour faire beau. Écart PO/réception = exception documentée, impact fournisseur, parfois mise en hold — exactement la discipline attendue.

### Exemple quantitatif

PO : 40 u. Livré : 36 u. Taux de remplissage réception : 90 %. Écart : 4 u.  
Si la demande hospitalière nécessite la totalité, le « succès » opérationnel partiel crée un risque OTIF client en aval.

### Flux documentaire ERP

Besoin / alerte stock → PR → approbation → PO → confirmation fournisseur → packing slip → GR (partiel) → hold qualité éventuel → mise à jour stock & scorecard.

### Départements impliqués

Inventaire, Approvisionnement, Entrepôt, Qualité, Finance (engagement / futur AP), Opérations, Ventes (demande future).

### Conséquence financière

Engagement fournisseur ; stock valorisé à la réception ; risque de fret d’urgence ou rupture ; impact marge plus tard (transfert, pénalités). Paiement **pas encore** — mais la dette se prépare.

### Contrôle clé

Pas de réception « inventée » sans PO ; respect du hold qualité ; documentation de l’écart ; pas de contournement pour « débloquer ».

### Erreur fréquente

Créer le PO sans gemba ; accepter le partiel sans tracer l’impact client ; ignorer le scorecard.

### Point d’observation professeur

L’étudiant justifie-t-il la quantité et le fournisseur avec stock + demande — ou seulement pour faire avancer la mission ?

### Méthode de correction

Exiger une phrase : « J’accepte 36 parce que… / J’attends parce que… » avec gagnant/perdant nommé.

### Question de discussion

*Qui paie vraiment votre recommandation partielle — le fournisseur, l’hôpital, ou Finance ?*

### Recommandation de démonstration

Parcourir M3-M01→M03 en une démo continue : PR → PO → réception 36 → hold → scorecard. Annoncer explicitement que M6 reviendra sur la facture.

### Allocation de temps

| Phase | Minutes (~100) |
|-------|----------------|
| Enseignement | 30 |
| Démo | 35 |
| Discussion / mission | 20 |
| Correction | 15 |

### Réponse attendue

PR justifiée ; PO cohérent ; GR partiel correct ; écart et hold traités ; conscience de la conséquence hospitalière.

### Preuve de compétence

Chaîne documentaire référencée ; décision partielle argumentée ; impact fournisseur analysé.

### Transition vers M4

« Achats a engagé 36. M4 : le client institutionnel commande — **Order-to-Cash** sous contrainte de stock réel. »

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « P2P n’est pas un écran Achats — c’est un engagement d’entreprise. » |
| **Démontrer** | Écart 36/40 + hold qualité |
| **Demander** | Que se passe-t-il si Ventes ignore cet écart ? |
| **Observer** | Contournement du hold |
| **Corriger** | Remplacer « c’est assez proche » par politique d’écart |

### Ne pas trop expliquer

Négociation complexe Incoterms avancés ; comptabilité AP complète (réservée à M6).

### Où les débutants peinent

PR vs PO ; comprendre que réception ≠ facture.

### Où les expérimentés contestent

« On accepterait toujours le partiel pour ne pas casser le service. » Faire débattre trade-off service vs risque — sans imposer une seule morale, mais exiger une documentation.

---

## M4 — Order-to-Cash

**Thème :** demande client institutionnelle sous contrainte (aile pédiatrique Sacré-Cœur).  
**Missions :** M4-M01 Saisie commande institutionnelle · M4-M02 Allocation multi-DC · M4-M03 Confirmation livraison & clôture client.

### Objectif de leçon

Enseigner O2C comme promesse tenue : demande → commande (SO) → ATP/allocation → livraison → déclenchement facturation — avec **honnêteté** face au conflit de stock hérité de M3.

### Concepts à expliquer avant l’usage du système

- Promesse client vs disponibilité (ATP)  
- SO, crédit, priorité institutionnelle  
- Allocation et transfert inter-DC  
- OTIF / perfect order côté client  
- Trade-off fret d’urgence vs pénalité / NPS  
- Lien CRM (cas) sans confondre vente et service

### Définitions et acronymes

| Terme | Définition |
|-------|------------|
| O2C | Order-to-Cash — commande → livraison → facture → encaissement |
| SO | Sales Order — commande client |
| ATP | Available to Promise — disponible à promettre |
| OTIF | On Time In Full (client) |
| AR | Accounts Receivable — comptes clients |
| DC | Distribution Center — entrepôt / centre de distribution |
| NPS | Net Promoter Score — intention de recommandation |

### Structure au tableau

1. Chaîne O2C + point de facturation  
2. Conflit : SO hôpital vs stock 36 (héritage ThermoControl)  
3. Options : transfert DC-MTL→DC-TRT / expédition urgente / replanifier  
4. Coût fret vs risque service  
5. Clôture : livraison → readiness billing → leçon S&OP

### Exemple d’entreprise réelle

Hôpital du Sacré-Cœur — aile pédiatrique. Patrick pousse la priorité ; Élodie responsabilise l’étudiant ; Dr Meunier fixe une date. La transparence sur le conflit vaut mieux qu’une fausse promesse.

### Exemple Walmart / logistique

En retail, promettre une dispo rayon sans ATP fiable détruit la confiance. Même règle : **ne jamais confirmer une date sans chemin d’allocation**.

### Exemple quantitatif

Stock insuffisant localement ; transfert + fret d’urgence = coût additionnel (impact marge, question Marc en M6/M9). OTIF sauvé peut coûter des points de marge — à rendre visible.

### Flux documentaire ERP

Demande / contrat institutionnel → devis éventuel → SO → contrôle crédit & ATP → ordre de transfert / allocation → bon de livraison → confirmation livraison → déclenchement facturation (AR).

### Départements impliqués

Ventes, Service client, Opérations, Logistique, Entrepôt, Finance, CRM.

### Conséquence financière

Créance future (AR) ; coût de fret / transfert réduit la marge ; mauvaise promesse → coûts de récupération + risque NPS.

### Contrôle clé

Pas de confirmation de livraison sans ATP réel ; documentation du conflit ; traçabilité du transfert ; clôture propre pour billing.

### Erreur fréquente

« Confirmer pour rassurer » sans stock ; traiter le transfert comme détail logistique sans coût ; clôturer sans chemin de facturation.

### Point d’observation professeur

L’étudiant dit-il la vérité au client interne (Élodie) sur le risque — ou optimise-t-il le scénario pour un score ?

### Méthode de correction

Rejouer la conversation : « Que dites-vous jeudi à l’aile pédiatrique si le transfert rate ? »

### Question de discussion

*Que signifie « jeudi » dans une aile pédiatrique — pour le patient, pour l’hôpital, pour NordHabitat ?*

### Recommandation de démonstration

M4-M01 : créer SO + flag conflit. M4-M02 : décision transfert/fret. M4-M03 : confirmation + clôture. Relier verbalement à M3 et annoncer M7.

### Allocation de temps

| Phase | Minutes (~100) |
|-------|----------------|
| Enseignement | 25 |
| Démo | 35 |
| Discussion / mission | 25 |
| Correction | 15 |

### Réponse attendue

SO honnête ; allocation documentée ; livraison confirmée ; leçons pour S&OP ; conscience marge/NPS.

### Preuve de compétence

Conflit documenté ; engagement tenu ou replanifié proprement ; cas/livraison clôturés ; billing path clair.

### Transition vers M5

« La commande est sauvée une fois. M5 enseigne à **gouverner les stocks multi-sites** pour ne pas vivre en mode crise permanent. »

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « O2C commence par une promesse — l’ERP doit la rendre tenable. » |
| **Démontrer** | ATP conflict + transfert + coût |
| **Demander** | Fret urgent : qui approuve le cash impact ? |
| **Observer** | Fausse promesse « on trouvera » |
| **Corriger** | Exiger un plan d’allocation avant confirmation |

### Ne pas trop expliquer

Tarification complexe, taxes, revenue recognition avancée.

### Où les débutants peinent

ATP ; différence livraison vs facture ; rôle du crédit.

### Où les expérimentés contestent

« Sales doit toujours overpromise, Ops rattrape. » Cadrer : TEC.ERP forme des analystes qui rendent le conflit **visible et gouverné**.

---

## M5 — Supply chain / inventaire

**Thème :** performance stocks, transfert inter-DC, S&OP.  
**Missions :** M5-M01 Analyse inventaire & signal de réassort · M5-M02 Décision de transfert inter-DC · M5-M03 Présentation S&OP.

### Objectif de leçon

Traiter les stocks comme **conséquence** des flux amont/aval et comme levier de service/capital — pas comme îlot WMS détaché. Préparer une recommandation S&OP défendable.

### Concepts à expliquer avant l’usage du système

- Couverture jours, seuil, stock de sécurité  
- Déséquilibre multi-DC (excès vs rupture)  
- Transfert (STO) vs achat vs fret urgent  
- Exactitude inventaire (lien 40 vs 36)  
- S&OP : une décision, plusieurs objectifs (service, cash, marge)  
- MAPE / erreur de prévision (niveau pédagogique)

### Définitions et acronymes

| Terme | Définition |
|-------|------------|
| S&OP | Sales & Operations Planning — arbitrage demande/offre |
| STO | Stock Transfer Order — ordre de transfert de stock |
| Fill rate | Taux de service / remplissage |
| Turns | Rotation des stocks |
| MAPE | Mean Absolute Percentage Error — erreur moyenne de prévision |
| Safety stock | Stock de sécurité |
| Working capital | Fonds de roulement (cash immobilisé dans le stock) |

### Structure au tableau

1. Boucle : demande → stock → réassort / transfert → service  
2. Cas vague de chaleur : pic HVAC, rupture DC-TRT  
3. Comparer couverture DC-MTL vs DC-TRT (ex. 47 j vs 14 j)  
4. Matrice décision : qty transfert × mode fret  
5. Slide S&OP : 1 recommandation + 1 risque + 1 coût

### Exemple d’entreprise réelle

Rupture SKU-HVAC-4421 à Mississauga ; Denise alerte OTIF ; Marc demande l’impact cash du fret ; l’étudiant présente en S&OP pendant que Claire observe en silence.

### Exemple Walmart / logistique

Réassort retail sous SLA : optimiser un DC localement peut affamer un autre. Exactitude inventaire et transferts sont des disciplines quotidiennes — TEC.WMS déjà connu ; ici on ajoute l’arbitrage financier.

### Exemple quantitatif

DC-MTL : couverture ~47 jours ; DC-TRT : ~14 jours. Transférer X unités réduit le risque rupture TRT mais ajoute coût fret et réduit couverture MTL. Faire chiffrer le trade-off même simplifié.

### Flux documentaire ERP

Rapports stock / aging → proposition de réassort → demande de transfert → approbation → STO → expédition/réception interne → mise à jour positions → pack S&OP.

### Départements impliqués

Supply chain, Entrepôt, Ventes, Opérations, Finance, BI (Karim).

### Conséquence financière

Capital immobilisé vs coût de rupture ; fret d’urgence ; impact marge ; effet sur OTIF et éventuellement ventes perdues.

### Contrôle clé

Vérifier la vérité terrain avant transfert massif ; documenter le fret ; faire approuver selon matrice ; ne pas « inventer » une prévision pour justifier une qty.

### Erreur fréquente

Recommander un transfert sans coût ; confondre MAPE et « le dashboard est rouge » ; présenter 5 graphiques sans décision.

### Point d’observation professeur

En S&OP, l’étudiant défend-il **une** recommandation sous challenge Marc — ou noie-t-il la salle sous des slides ?

### Méthode de correction

Imposer le format : Situation → Chiffres → Options → Recommandation → Risque → Demande de décision.

### Question de discussion

*Working capital ou service client : qui tranche chez NordHabitat — et avec quelles preuves ?*

### Recommandation de démonstration

Montrer l’analyse d’écart de couverture, créer le STO avec fret, puis simuler 8–10 min de S&OP (rôle Marc).

### Allocation de temps

| Phase | Minutes (~100) |
|-------|----------------|
| Enseignement | 25 |
| Démo | 30 |
| Discussion / S&OP | 30 |
| Correction | 15 |

### Réponse attendue

Proposition de qty fondée ; transfert + fret documentés ; recommandation S&OP tenue sous pression.

### Preuve de compétence

Analyse inventaire evidence-based ; STO cohérent ; communication S&OP acceptée ou révisée avec justification.

### Transition vers M6

« Les mouvements de stock ont un prix. M6 suit l’argent : **facture, 3-way match, variance** sur la chaîne ThermoControl. »

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « Le stock n’est pas un îlot — c’est du cash et du service. » |
| **Démontrer** | Déséquilibre DC + STO + coût |
| **Demander** | Quelle couverture minimale défendez-vous à TRT ? |
| **Observer** | Slideshow sans décision |
| **Corriger** | Une slide = une décision |

### Ne pas trop expliquer

Optimisation mathématique avancée, solvers, détail WMS picking.

### Où les débutants peinent

Couverture ; différence transfert et achat ; lire un écart sans paniquer.

### Où les expérimentés contestent

Définitions OTIF/fill rate / perfect order. Excellent : renvoyer à M9 pour formaliser — mais exiger une définition **provisoire cohérente** dès M5.

---

## M6 — Finance / 3-way match

**Thème :** conséquences financières et contrôle AP.  
**Missions :** M6-M01 Réception de facture · M6-M02 Exception de three-way match · M6-M03 Expliquer la variance à Finance.

### Objectif de leçon

Rendre visible le pont opération → finance : PO + GR + facture doivent concordés. Former l’étudiant à **expliquer une variance en langage de cash/marge**, pas en jargon d’écran.

### Concepts à expliquer avant l’usage du système

- Engagement vs réception vs facturation vs paiement  
- Three-way match : prix, quantité, références documentaires  
- Tolérances et blocage paiement légitime  
- AP / dette fournisseur ; lien DPO / trésorerie  
- Événement opérationnel ≠ reconnaissance comptable  
- Narratif exécutif (3 lignes + annexe)

### Définitions et acronymes

| Terme | Définition |
|-------|------------|
| 3-way match | Concordance PO ↔ réception (GR) ↔ facture fournisseur |
| AP | Accounts Payable — comptes fournisseurs |
| AR | Accounts Receivable — comptes clients |
| GL | General Ledger — grand livre |
| DPO | Days Payable Outstanding — délai paiement fournisseurs |
| Variance | Écart prix/quantité/conditions entre documents |
| Tolérance | Écart acceptable avant blocage / escalade |

### Structure au tableau

1. Timeline P2P financière : PR→PO→GR→Invoice→Payment  
2. Triangle du match (PO / GR / Invoice)  
3. Cas : facture 36 u liée à PO-88421 — où est l’écart ?  
4. Options : payer / hold / avoir / corriger document  
5. Exercice : expliquer à Marc en 3 lignes

### Exemple d’entreprise réelle

Facture ThermoControl ; Marc : « Explain before I sign. » L’étudiant doit relier M3 (partiel), M4 (fret/crise), et l’impact cash — sans blâmer « le système ».

### Exemple Walmart / logistique

En grande distribution, le matching protège contre surpaiement et fraudes soft. Un écart non expliqué n’est pas une paperasse : c’est un risque de contrôle.

### Exemple quantitatif

PO 40 @ prix P ; GR 36 ; facture 36 (ou prix différent).  
Montrer : montant facturable attendu = 36 × P (si prix conforme). Tout écart prix ou quantité hors tolérance = exception. Ajouter le coût fret M4/M5 dans le récit de marge.

### Flux documentaire ERP

Facture fournisseur → entrée AP → prévisualisation match → exception → résolution (avoir/correction/approbation) → libération paiement.

### Départements impliqués

Finance/AP, Approvisionnement, Entrepôt/Qualité, ERP CoE.

### Conséquence financière

Dette AP ; trésorerie ; marge ; relations fournisseur ; risque de paiement indu.

### Contrôle clé

Interdiction de poster en aveugle ; matching avant paiement ; piste d’audit ; séparation création facture / approbation paiement (lien M8).

### Erreur fréquente

« La réception est faite, donc on paie » ; contourner le blocage ; expliquer la variance par « erreur système » sans cause métier.

### Point d’observation professeur

L’étudiant peut-il raconter la chaîne Mai→Septembre sans jargon — cash et marge inclus ?

### Méthode de correction

Template forcé : (1) fait documentaire (2) cause opérationnelle (3) impact $ (4) action demandée.

### Question de discussion

*Pourquoi Marc refuse-t-il de payer même si « tout le monde sait » que ThermoControl a livré ?*

### Recommandation de démonstration

Entrer facture → montrer exception → résoudre selon politique → faire un étudiant présenter le narratif 3 lignes en live.

### Allocation de temps

| Phase | Minutes (~100) |
|-------|----------------|
| Enseignement | 30 |
| Démo | 30 |
| Discussion / narration | 25 |
| Correction | 15 |

### Réponse attendue

Exception correctement classée ; résolution conforme ; explication cash/marge acceptée par le standard Marc (clarté, cause, impact).

### Preuve de compétence

Match exception résolue ; narration financière ; libération paiement justifiée.

### Transition vers M7

« La facture est gouvernée. Mais le client institutionnel se souvient de la friction : M7 — **CRM post-vente** et récupération de confiance. »

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « Un succès opérationnel peut créer un problème financier. » |
| **Démontrer** | Blocage match légitime |
| **Demander** | Tracez l’erreur jusqu’à une décision humaine |
| **Observer** | Contournement / blâme système |
| **Corriger** | Remplacer blâme par cause + contrôle |

### Ne pas trop expliquer

Plan comptable complet, IFRS avancé, clôture mensuelle détaillée.

### Où les débutants peinent

Comprendre pourquoi on ne paie pas sur packing slip seul ; lire une exception.

### Où les expérimentés contestent

Tolérances « trop strictes ». Réponse pédagogique : discuter politique — ne pas saboter le contrôle pour la commodité.

---

## M7 — CRM post-vente

**Thème :** relation client après la vente — dossier, escalade, NPS.  
**Missions :** M7-M01 Ouvrir un dossier client · M7-M02 Coordonner une escalade · M7-M03 Clôturer le cas et récupérer le NPS.

### Objectif de leçon

Montrer que CRM n’est pas un ticketing décoratif : chaque cas s’ancre dans l’historique SO/livraison/données client, avec SLA, escalade transverse et mesure NPS.

### Concepts à expliquer avant l’usage du système

- Cycle de vie du cas (ouverture → triage → escalade → clôture)  
- Priorité vs urgence émotionnelle  
- Lien cas ↔ compte client golden record (héritage M2)  
- RMA / qualité / ingénierie  
- Service recovery et NPS  
- Ton de communication institutionnelle

### Définitions et acronymes

| Terme | Définition |
|-------|------------|
| CRM | Customer Relationship Management |
| Case / dossier | Dossier de service client tracé |
| SLA | Service Level Agreement — engagement de délai/qualité |
| RMA | Return Merchandise Authorization — autorisation de retour |
| NPS | Net Promoter Score |
| CSAT | Customer Satisfaction |
| NCR | Non-conformité (qualité) |

### Structure au tableau

1. Timeline émotionnelle client : promesse → friction → colère → récupération  
2. Structure d’un bon dossier (faits, impact, owner, next action)  
3. Matrice d’escalade (CS → Qualité/Ingénierie → Ventes)  
4. Clôture : preuve de fix + enquête + leçon KB  
5. Lien avec doublon client M2 (mauvais compte = mauvaise histoire)

### Exemple d’entreprise réelle

Dr Meunier / directeur d’installations mécontent ; capteur garantie ; sensibilité pédiatrique ; Élodie guide ; résolution → gratitude et mouvement NPS.

### Exemple Walmart / logistique

En retail, un défaut post-livraison non tracé revient en chargeback / reclaim. La discipline : ownership clair, délai, preuve de correction — pas d’excuses vagues.

### Exemple quantitatif

Illustrer pédagogiquement un mouvement NPS (ex. recovery +2 points dans le récit canon) : l’important n’est pas le chiffre magique, c’est le **lien action de service → confiance mesurée**.

### Flux documentaire ERP / CRM

Email/signal → ouverture cas → lien SO/historique → triage priorité → NCR/RMA si besoin → plan de résolution → clôture → enquête satisfaction → article KB.

### Départements impliqués

Service client / CRM, Ingénierie, Qualité, Ventes, parfois Supply chain.

### Conséquence financière

Coût de remplacement/RMA ; risque de perte de compte institutionnel ; effet marge indirect ; coût d’escalade.

### Contrôle clé

Cas rattaché au bon compte ; pas de clôture sans résolution vérifiable ; pas de promesse hors politique garantie.

### Erreur fréquente

Traiter le cas comme chat ; clôturer pour « green » ; ignorer le lien avec la crise stock/livraison antérieure.

### Point d’observation professeur

L’étudiant cherche-t-il la **cause amont** (données, allocation, qualité) ou seulement calme-t-il le client ?

### Méthode de correction

Exiger : fait → impact patient/hôpital → cause probable → action → owner → date.

### Question de discussion

*Combien de temps faut-il pour reconstruire une confiance institutionnelle — et que doit prouver le dossier ?*

### Recommandation de démonstration

Ouvrir le cas correctement (bon compte), montrer une escalade transverse, clôturer avec leçon apprise. Relier à M2 doublon et M4 livraison.

### Allocation de temps

| Phase | Minutes (~90) |
|-------|----------------|
| Enseignement | 25 |
| Démo | 30 |
| Discussion / mission | 20 |
| Correction | 15 |

### Réponse attendue

Dossier priorisé et owned ; escalade coordonnée ; clôture avec preuve ; conscience NPS/réputation.

### Preuve de compétence

Cas complet tracé ; RMA/qualité liés si requis ; recovery documentée.

### Transition vers M8

« Le service a récupéré la confiance. M8 demande : **qui a le droit d’approuver et d’accéder** — surtout sous pression. »

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « Le CRM raconte l’histoire que Finance et Ops ont créée. » |
| **Démontrer** | Lien cas ↔ historique commande |
| **Demander** | Que s’est-il passé *avant* la colère ? |
| **Observer** | Clôture cosmétique |
| **Corriger** | Rouvrir tant que la preuve de fix manque |

### Ne pas trop expliquer

Psychologie client avancée, scripts call-center exhaustifs.

### Où les débutants peinent

Priorisation ; distinguer escalade utile et panique.

### Où les expérimentés contestent

« NPS est un vanité metric. » Accueillir le débat : exiger néanmoins une **mesure de recovery** liée à l’action.

---

## M8 — Governance / SoD / approvals

**Thème :** autorités, accès, séparation des tâches, probation.  
**Missions :** M8-M01 Matrice d’approbation sous pression · M8-M02 Revue d’accès / SoD · M8-M03 Autoévaluation de probation.

### Objectif de leçon

Enseigner que l’urgence ne suspend pas l’autorité. Former à lire une matrice d’approbation, détecter un conflit SoD, et produire une autoévaluation professionnelle evidence-based.

### Concepts à expliquer avant l’usage du système

- Délégation d’autorité / seuils $  
- Séparation des tâches (SoD)  
- Maverick spend  
- Revue d’accès périodique  
- Piste d’audit  
- Probation : preuves de compétence, pas narration héroïque

### Définitions et acronymes

| Terme | Définition |
|-------|------------|
| SoD | Segregation of Duties — séparation des tâches |
| DoA | Delegation of Authority — matrice d’autorité |
| Maverick spend | Achat hors processus / hors panel |
| RBAC | Role-Based Access Control |
| Audit trail | Journal qui / quoi / quand / sur quel document |
| Compliance | Conformité aux politiques internes et exigences |

### Structure au tableau

1. Pourquoi les contrôles existent (fraude, erreur, audit)  
2. Cas PO urgence 32 k$ — mauvaise chaîne d’approbation  
3. Matrice SoD : créer fournisseur ≠ approuver paiement ; créer PO ≠ s’auto-approuver  
4. Revue d’accès : permissions excessives  
5. Portfolio de probation : 5 preuves observables

### Exemple d’entreprise réelle

Alerte maverick ; Julie et Legal (David) ; revue trimestrielle d’accès avec Alex/Sylvie ; Sophie et Claire sur la probation — Julie peut nominateur.

### Exemple Walmart / logistique

En environnements retail à fort volume, les contournements « pour le shift » deviennent des findings d’audit. La pression SLA n’autorise pas l’auto-approbation.

### Exemple quantitatif

PO urgence 32 000 $ : si le seuil du rôle étudiant/analyste est inférieur, la chaîne doit monter. Montrer le coût du bypass : finding + risque paiement non contrôlé — pas seulement un refus UI.

### Flux documentaire ERP

Demande d’achat urgente → workflow d’approbation (reroute) → journal → revue d’accès (checklist) → dossier de probation (preuves missions).

### Départements impliqués

Approvisionnement, Finance, Legal/Compliance, TI sécurité, RH, ERP CoE.

### Conséquence financière

Paiements non autorisés ; fraudes ; retraitements ; sanctions internes ; perte de confiance audit/Finance.

### Contrôle clé

Respect DoA ; détection SoD ; pas de bypass « juste cette fois » ; evidence pour probation.

### Erreur fréquente

Chercher qui « va cliquer oui » plutôt que la bonne autorité ; garder des accès « au cas où ».

### Point d’observation professeur

Sous pression temporelle de démo, l’étudiant tente-t-il le raccourci ? C’est le moment pédagogique central.

### Méthode de correction

Refuser collectif du bypass, puis rejouer la bonne chaîne. Phrase murale : « L’urgence n’efface pas l’autorité. »

### Question de discussion

*Pourquoi ne puis-je pas approuver mon propre PO — même si je « sais » que c’est correct ?*

### Recommandation de démonstration

Tenter (en sandbox pédagogique) une mauvaise chaîne → refus → reroute correct. Puis checklist SoD. Puis structure d’autoévaluation (preuves M3–M7).

### Allocation de temps

| Phase | Minutes (~90) |
|-------|----------------|
| Enseignement | 30 |
| Démo | 25 |
| Discussion / mission | 20 |
| Correction | 15 |

### Réponse attendue

Chaîne d’approbation correcte ; conflits SoD identifiés ; autoévaluation honnête avec preuves.

### Preuve de compétence

Workflow conforme ; revue d’accès signée ; portfolio de probation crédible.

### Transition vers M9

« Les contrôles protègent. M9 demande : **mesurer** la santé des chaînes et utiliser l’IA sans abdiquer le jugement. »

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « Un écran vert n’est pas une preuve d’audit. » |
| **Démontrer** | Refus de bypass + SoD |
| **Demander** | Quel conflit SoD voyez-vous sur votre propre profil ? |
| **Observer** | Rationalisation de l’urgence |
| **Corriger** | Remplacer « il fallait livrer » par « voici la bonne escalade » |

### Ne pas trop expliquer

Frameworks SOX complets, design sécurité réseau.

### Où les débutants peinent

Lire une matrice ; comprendre « moindre privilège ».

### Où les expérimentés contestent

« Les contrôles ralentissent le business. » Réponse : les contrôles mal conçus oui ; les contrôles absents coûtent plus cher — illustrer par paiement indu / maverick.

---

## M9 — BI / KPI / limites de l’IA

**Thème :** indicateurs décisionnels et frontières du AI Coach.  
**Missions :** M9-M01 Atelier définition KPI · M9-M02 Tableau de bord comité · M9-M03 Analyse concurrentielle + IA.

### Objectif de leçon

Former à définir des KPI liés aux processus, raconter une histoire P2P→O2C→stock→marge en comité, et utiliser l’IA comme **coach de raisonnement**, jamais comme machine à réponses ou décideur de notes.

### Concepts à expliquer avant l’usage du système

- KPI : définition, propriétaire, décision supportée, période, filtre  
- Descriptif vs décisionnel  
- OTIF vs Perfect Order (ambiguïté S&OP)  
- Variance et hypothèses derrière le chiffre  
- Limites AI Coach : guide, ne note pas, ne contourne pas, ne spoil pas  
- Analyse concurrentielle : prix vs marge vs promesse de service

### Définitions et acronymes

| Terme | Définition |
|-------|------------|
| KPI | Key Performance Indicator |
| BI | Business Intelligence |
| OTIF | On Time In Full |
| Perfect Order | Commande parfaite (critères multiples : délai, qty, doc, qualité…) |
| Dashboard | Vue d’indicateurs pour une décision / audience |
| AI Coach | Assistant pédagogique contextualisé (limites strictes) |
| Stale data | Donnée non fraîche — à signaler |

### Structure au tableau

1. Template KPI : Nom / Formule / Source / Owner / Décision  
2. Piège : deux définitions d’OTIF dans la même salle  
3. Règle comité : 1 graphique → 1 décision → 1 risque  
4. Frontières IA (ce qu’il peut / ne peut pas)  
5. Cas BuildTech −8 % : hold price vs match sélectif

### Exemple d’entreprise réelle

Karim refuse les vanity metrics ; l’étudiant présente au steering ; Emmanuel cadre la politique IA ; Patrick/Marc arbitrent marge vs prix concurrent.

### Exemple Walmart / logistique

Les ops retail vivent sous KPI SLA. Un indicateur mal défini crée de fausses guerres entre départements (transport vs DC vs merchandising). Même leçon : **définir avant de dashboarder**.

### Exemple quantitatif

Concurrent −8 % sur SKUs cœur. Simuler pédagogiquement l’effet marge si match total vs sélectif. Cible narrative de marge brute (ex. objectif ~28 %) : discuter le **sens** du trade-off, sans inventer un score étudiant.

### Flux documentaire ERP / BI

Catalogue KPI → validation owners → dashboard comité → pack steering → brief concurrentiel → recommandation (humain) avec assistance IA bornée.

### Départements impliqués

BI, Opérations, Finance, Ventes, Direction, ATO / gouvernance IA.

### Conséquence financière

Mauvaise décision prix → érosion marge ; mauvais KPI → mauvaise allocation de cash/fret/stock.

### Contrôle clé

Définition KPI signée ; pas de décision automatisée par IA ; pas de spoiler mission ; données périmées signalées.

### Erreur fréquente

Galerie de graphiques ; demander à l’IA la « bonne saisie » ; confondre corrélation et décision.

### Point d’observation professeur

L’étudiant utilise-t-il l’IA pour **clarifier son raisonnement** ou pour éviter de penser ?

### Méthode de correction

Si spoiler IA : arrêter, reformuler la question coach (« quel document amont as-tu vérifié ? »), reprendre.

### Question de discussion

*Quelle décision concrète OTIF soutient-il ce mois-ci — et qui en est propriétaire ?*

### Recommandation de démonstration

Atelier définition (OTIF vs Perfect Order) → présentation dashboard courte → scénario concurrentiel avec rappel limites IA en live.

### Allocation de temps

| Phase | Minutes (~100) |
|-------|----------------|
| Enseignement | 25 |
| Démo | 30 |
| Discussion / comité | 30 |
| Correction | 15 |

### Réponse attendue

KPI définis avec owners ; narration comité sobre ; recommandation concurrentielle justifiée ; usage IA conforme aux frontières.

### Preuve de compétence

Catalogue KPI ; présentation steering ; analyse marge/prix ; littératie limites IA.

### Transition vers M10

« Vous savez mesurer et raconter. M10 prouve que vous pouvez **tenir une chaîne complète sous pression** — Capstone / Gold. »

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « Un dashboard sans décision est de la décoration. » |
| **Démontrer** | 1 chart / 1 décision ; refus de spoiler IA |
| **Demander** | Si les données sont insuffisantes, que recommandez-vous ? |
| **Observer** | Dépendance IA / vanity metrics |
| **Corriger** | Reformuler en hypothèses + risque + prochaine preuve |

### Ne pas trop expliquer

Data science avancée, ML ops, tuning de modèles.

### Où les débutants peinent

Formules ; période/filtre ; parler à des exécutifs.

### Où les expérimentés contestent

Choix des KPI, politiques prix. Excellent terrain — exiger une recommandation **défendable**, pas « la » vérité unique.

---

## M10 — Capstone / Gold

**Thème :** intégration sous pression et certification Gold.  
**Missions :** M10-M01 Diapositive conseil · M10-M02 Défi final Équinoxe · M10-M03 Présentation Capstone Or.

### Objectif de leçon

Prouver la compétence intégrée : diagnostiquer une crise multi-modules, exécuter sans silos, communiquer à la direction, et mériter un certificat aligné sur des **preuves**, non sur la complétion cosmétique.

### Concepts à expliquer avant l’usage du système

- Synthèse exécutive (une slide, un message)  
- Priorisation sous contraintes simultanées  
- Chaîne de conséquence annuelle (M1→M9)  
- Matrice de décision Capstone : service / cash / contrôles / confiance  
- Critères Gold vs Silver (prérequis Silver)  
- Posture professionnelle : appartenance NordHabitat, autonomie

### Définitions et acronymes

| Terme | Définition |
|-------|------------|
| Capstone | Épreuve intégrative finale |
| Gold | Certification de capacité ERP intégrée (après Silver) |
| Silver | Seuil intermédiaire (fondations + données / preuves) |
| Équinoxe | Programme de transformation ERP NordHabitat |
| Portfolio | Ensemble de preuves de missions et décisions |
| Composite score | Lecture d’ensemble OTIF / NPS / marge / exactitude (pédagogique) |

### Structure au tableau

1. Règle de la slide board : 1 message  
2. Crise simultanée : délai fournisseur + commande hôpital + rupture TRT + facture bloquée  
3. Ordre de bataille analyste : faits → risques → actions → owners → contrôles  
4. Checklist Gold : processus, documents, finance, SoD, KPI, exception  
5. Clôture : « You don’t need me anymore » (autonomie)

### Exemple d’entreprise réelle

Crise décembre : Martin en retard, backup hospitalier, stockout TRT, invoice block — le cast complet sollicite l’étudiant. Puis présentation Capstone et town hall Isabelle : appartenance.

### Exemple Walmart / logistique

Les vraies journées de peak cumulent exceptions. Le professionnel priorise sans casser les contrôles. C’est le standard Capstone.

### Exemple quantitatif

Ne pas inventer de score runtime étudiant. En classe, faire construire une **grille de priorisation** (impact patient/hôpital, cash, risque contrôle, délai) et scorer les options 1–5 de façon pédagogique transparente.

### Flux documentaire ERP

Plan d’action intégré couvrant PO/transfert/SO/GR/match/cas + slide board + dossier Capstone + preuves portfolio → éligibilité Gold.

### Départements impliqués

Tous — c’est le point.

### Conséquence financière

Arbitrages explicites marge/fret/AP/AR/service ; une mauvaise priorisation coûte cash **et** confiance.

### Contrôle clé

Aucun contournement SoD/match « parce que Capstone » ; traçabilité complète ; recommandations exécutives honnêtes sur les limites.

### Erreur fréquente

Rejouer des écrans module par module sans plan intégré ; slide board bavarde ; certificat vu comme badge automatique.

### Point d’observation professeur

Sous flood multi-canal, l’étudiant impose-t-il un ordre de bataille — ou réagit-il en silos ?

### Méthode de correction

Stop-and-structure : 5 minutes pour écrire le plan avant toute transaction Capstone.

### Question de discussion

*Que feriez-vous différemment en mai, maintenant que vous avez vu décembre ?*

### Recommandation de démonstration

(1) Construire la slide board en live (brutalement courte). (2) Walkthrough de crise avec priorisation au tableau avant clics. (3) Rubric Gold affichée — sans scores inventés.

### Allocation de temps

| Phase | Minutes (~120 recommandé) |
|-------|---------------------------|
| Enseignement / cadre Gold | 20 |
| Démo / walkthrough crise | 40 |
| Discussion / exécution guidée | 40 |
| Correction / debrief | 20 |

### Réponse attendue

Slide unique claire ; plan de crise multi-modules avec contrôles respectés ; présentation Capstone défendable devant non-spécialistes.

### Preuve de compétence

Crise résolue selon critères Capstone ; portfolio cohérent ; narration intégrée ; éligibilité Gold basée sur preuves (pas sur cosmétique).

### Transition post-M10

Vers pratique professionnelle / portfolio 90 jours : l’étudiant doit pouvoir dire sans notes comment un besoin devient dette, comment une SO devient créance, et quels contrôles protègent l’entreprise.

### Dire / démontrer / demander / observer / corriger

| Verbe | Contenu |
|-------|---------|
| **Dire** | « Gold prouve que vous n’êtes pas un danger en réunion de processus. » |
| **Démontrer** | Priorisation avant clics ; slide d’une phrase |
| **Demander** | Quelle exception traitez-vous en premier — et pourquoi ? |
| **Observer** | Panique silo / contournement contrôles |
| **Corriger** | Revenir au plan intégré et à la piste documentaire |

### Ne pas trop expliquer

Stratégie corporate hors périmètre ; « secrets » de notation automatisée.

### Où les débutants peinent

Charge cognitive de la crise ; synthèse exécutive.

### Où les expérimentés contestent

Réalisme des délais, arbitrages prix/service. En faire un débat cadré sur preuves NordHabitat — sans déraper hors scénario.

---

## Annexe A — Grille de démo live (Thiago)

Recommandation pilote pour chaque module :

1. **2–3 min** situation d’affaires (personnages NordHabitat)  
2. **Règle au tableau** (1 phrase)  
3. **Happy path** dans TEC.ERP  
4. **Exception** (écart, hold, refus, conflit ATP, SoD, KPI mal défini, spoiler IA refusé)  
5. **Impact** immédiat (stock / document / $ / indicateur / confiance)  
6. **Phrase de clôture** : ce que le module ne couvre pas encore

---

## Annexe B — Erreurs à corriger collectivement (transverses)

Recommandations Zero1 pour correction de cohorte :

1. Exécuter sans document amont / sans besoin métier  
2. Ignorer une donnée maître critique  
3. Contourner un contrôle légitime  
4. Confondre succès d’écran et succès de processus  
5. Lire un KPI sans définition / période  
6. Isoler un module alors que l’effet est transverse  
7. Traiter l’AI Coach comme machine à réponses  
8. Justifier par « le système a accepté »

---

## Annexe C — Ce que les étudiants doivent pouvoir expliquer en sortie (sans notes)

- Comment un besoin d’achat devient dette puis paiement — et où ça casse  
- Comment une commande client devient créance et mouvement de stock  
- Pourquoi les données maîtres gouvernent la qualité des décisions  
- Ce qu’est un flux documentaire auditable  
- Quels contrôles protègent l’entreprise  
- Comment lire 3–5 KPI liés aux processus et recommander  
- En quoi TEC.ERP dépasse TEC.WMS (portée, finance, intégration, analyse)  
- Comment parler processus à Ops, Finance et Direction

---

## Annexe D — Distinction évidence vs jugement (rappel gouvernance pilote)

| Type | Exemples | Usage professoral |
|------|----------|-------------------|
| Évidence technique | HTTP, unlock, persistence, 403 admin | Faits observables — ne pas inventer |
| Jugement persona Zero1 | Réalisme, clarté, crédibilité certificat | Toujours attribué à la persona |
| Recommandation pédagogique | Le présent guide | Revue pilote — approbation propriétaire avant changement produit |

**Protocole :** EXECUTE → OBSERVE → RECORD → CLASSIFY → RECOMMEND → WAIT FOR OWNER APPROVAL.

---

## Annexe E — Allocation synthétique M1–M10 (recommandation pilote)

| Module | Enseignement | Démo | Discussion | Correction | Focus exception |
|--------|--------------|------|------------|------------|-----------------|
| M1 | 30 | 25 | 20 | 15 | Ready sans preuve |
| M2 | 30 | 30 | 15 | 15 | Approbation fiche incomplète |
| M3 | 30 | 35 | 20 | 15 | Partiel 36/40 non documenté |
| M4 | 25 | 35 | 25 | 15 | Fausse promesse ATP |
| M5 | 25 | 30 | 30 | 15 | S&OP sans décision |
| M6 | 30 | 30 | 25 | 15 | Paiement malgré mismatch |
| M7 | 25 | 30 | 20 | 15 | Clôture sans fix |
| M8 | 30 | 25 | 20 | 15 | Bypass approbation |
| M9 | 25 | 30 | 30 | 15 | Spoiler IA / vanity KPI |
| M10 | 20 | 40 | 40 | 20 | Crise en silos |

Durées en minutes pour séances de référence ; ajuster selon cohorte.

---

## Clôture

Ce guide est une **recommandation pédagogique** produite dans le cadre du pilote James Timothy Zero1 pour le professeur Thiago Gibran. Il ne constitue pas une opinion humaine réelle, ni un relevé de scores d’exécution runtime.

Utilisation attendue : préparer les séances M1–M10, aligner tableau et système, corriger collectivement les erreurs de raisonnement, et garder la barre : **former des analystes de processus, non des opérateurs d’interface**.

**Prochaine étape (hors présent document) :** revue propriétaire des recommandations → décisions d’ajustement pédagogique / produit → éventuelle mise à jour officielle des specs `docs/` uniquement sur approbation explicite.
