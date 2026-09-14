# SAP Suite End to End — préparation institutionnelle

Note technique hors `docs/` (aucune modification de documentation officielle).

## Périmètre

TEC.ERP organise, associe et accompagne le programme **SAP Suite End to End**.
SAP Learning demeure la source officielle du contenu, des évaluations, des résultats et des achievements.

Code interne conservé : `sap-iee2e` (module déjà amorcé). Programme institutionnel : `SAP_SUITE_E2E`.

## Ce qui est prêt

- Catalogue configurable S1–S10 (titres placeholders, descriptions éditables).
- Identification publique des 9 unités du parcours officiel (métadonnées de catalogue uniquement).
- Déclaration étudiante, évidence minimale, statut institutionnel.
- Association de cohortes existantes, calendrier de séance 1, Semaine Zéro.
- Observations professeur internes (hors périmètre étudiant).
- Lien officiel SAP unique (`SAP_SUITE_E2E_OFFICIAL_URL`), nouvel onglet, sans iframe.

## Ce qui n’est pas implémenté (volontaire)

- Scraping, login SAP, stockage de credentials / tokens / cookies / session.
- Quiz, examen, Practice System, calcul de note ou émission d’Achievement SAP.
- Course Edition (`/api/v1/me/course-edition/:moduleCode`) — route absente et non créée.
- Éditeur administrateur des titres S1–S10 (catalogue code, prêt à être rempli).
- Upload binaire d’évidence (métadonnées + URL https seulement).

## Décisions encore requises (Thiago)

- Titres officiels / institutionnels définitifs de S1–S10.
- Correspondance autorisée entre S1–S10 et les 9 unités publiques SAP Learning.
- Politique d’upload de fichiers d’évidence.
- Merge, migration production et déploiement Railway.
