# SAP Suite End to End — préparation institutionnelle

Note technique hors `docs/` (aucune modification de documentation officielle).

## Périmètre

TEC.ERP organise, associe et accompagne le programme **SAP Suite End to End**.
SAP Learning demeure la source officielle du contenu, des évaluations, des résultats et des achievements.

Code interne conservé : `sap-iee2e` (module déjà amorcé). Programme institutionnel : `SAP_SUITE_E2E`.

Lien officiel unique (nouvel onglet, sans iframe) :

`https://learning.sap.com/courses/exploring-end-to-end-business-processes-in-sap-business-suite-fr`

Titre public SAP Learning (FR) : **Exploring End-to-End Business Processes in SAP Business Suite | FR** (9 units).

## Étapes institutionnelles S1–S10 vs unités publiques SAP

Les séances Collège sont **S1–S10**. Le parcours public SAP Learning FR compte **9 unités**.
Aucune dixième unité SAP n’est inventée. S4 et S5 partagent l’unité publique 4.

Source des titres d’unités : page publique SAP Learning FR, relevée le 2026-09-14, identique à `SAP_SUITE_E2E_OFFICIAL_PATH_UNITS` et `OFFICIAL_UNITS_FR`.
Titre S5 : séance Collège confirmée dans `apps/web/src/poc/sap-iee2e/sessionPlans.ts` (session 5) — ce n’est **pas** un titre d’unité SAP distinct.

| Code | Titre affiché | Unité publique SAP | Statut du titre | Observation |
|------|---------------|--------------------|-----------------|-------------|
| S1 | Identifier les processus de gestion de bout en bout et leur défi en matière d'intégration | 1 | `institutionally_confirmed` | Titre public SAP. Contenu officiel sur SAP Learning. |
| S2 | Description de SAP Business Suite | 2 | `institutionally_confirmed` | Titre public SAP. Contenu officiel sur SAP Learning. |
| S3 | Discussion sur les concepts et objets centraux dans SAP Business Suite | 3 | `institutionally_confirmed` | Titre public SAP. Contenu officiel sur SAP Learning. |
| S4 | Exécution du processus de l'enregistrement au reporting : accent mis sur la comptabilité financière et le contrôle de gestion | 4 (1/2) | `institutionally_confirmed` | Titre public SAP. Première séance Collège sur l’unité 4. |
| S5 | Contrôler les coûts et intégrer (enregistrement au reporting — II) | 4 (2/2) | `institutionally_confirmed` | Titre de **séance Collège**, pas une unité SAP distincte. Même unité publique 4. |
| S6 | Exécution du processus du recrutement à la retraite : focus sur le pilotage de l'expérience humaine | 5 | `institutionally_confirmed` | Titre public SAP. Contenu officiel sur SAP Learning. |
| S7 | Exécution du processus d'approvisionnement : focalisation sur l'approvisionnement | 6 | `institutionally_confirmed` | Titre public SAP. Contenu officiel sur SAP Learning. |
| S8 | Exécution du processus de la conception aux opérations : accent mis sur la production | 7 | `institutionally_confirmed` | Titre public SAP. Contenu officiel sur SAP Learning. |
| S9 | Exécution du processus Lead-to-Cash : accent mis sur les ventes | 8 | `institutionally_confirmed` | Titre public SAP. Contenu officiel sur SAP Learning. |
| S10 | Exécution du processus Lead-to-Cash : focalisation sur le service | 9 | `institutionally_confirmed` | Titre public SAP unité 9. Synthèse Collège — pas une 10ᵉ unité SAP. |

Objectif administratif commun : accompagner la cohorte Collège et enregistrer le suivi institutionnel. Le contenu, les évaluations, la progression officielle et les achievements demeurent sur SAP Learning.

## Ce qui est prêt

- Catalogue S1–S10 avec titres confirmés (ci-dessus).
- Identification publique des 9 unités du parcours officiel (métadonnées de catalogue uniquement).
- Déclaration étudiante, évidence minimale (URL https), statut institutionnel.
- Association de cohortes existantes, calendrier de séance 1, Semaine Zéro.
- Observations professeur internes (hors périmètre étudiant).
- Lien officiel SAP unique, nouvel onglet, sans iframe.
- `sapResultOfficial` toujours `false`.

## Ce qui n’est pas implémenté (volontaire)

- Scraping, login SAP, stockage de credentials / tokens / cookies / session / Universal ID.
- Quiz, examen, Practice System, calcul de note ou émission d’Achievement / certification SAP.
- Course Edition (`/api/v1/me/course-edition/:moduleCode`) — route absente et non créée.
- Éditeur administrateur des titres S1–S10 (catalogue code).
- Upload binaire d’évidence (métadonnées + URL https seulement).

## Décisions encore requises (Thiago)

- Politique d’upload de fichiers d’évidence (binaire vs URL https uniquement).
- Toute évolution future du mapping S4/S5 si le Collège change le découpage pédagogique.

## Traçabilité git

- PR #36 merge SHA : `652841c2a1aae27558057beb483378fed9d074f0` (catalogue encore placeholders).
- PR #37 squash SHA (titres officiels + backup rehearsal) : `cdd10ec9ccb8512e777364613a92be91c9847d22`.
- Déploiement production : voir `PRODUCTION_DEPLOYMENT_EVIDENCE.md`.
