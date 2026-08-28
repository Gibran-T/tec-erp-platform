# TEC.ERP — Pack de facilitation Session 1 (SAP spine + sofa)

**Document type :** Pack professeur opérationnel  
**Session Collège :** 1 / 10 × 180 min (séance S1)  
**SAP (épine dorsale, séance) :** Unité 1 — entreprise intégrée / processus de bout en bout (Learning Hub, student edition)  
**TEC.ERP (sofa, coussin optionnel) :** Module 1 Course Edition + missions M1-M01…M03 — coussin NordHabitat, pas le calendrier de classe  
**Public :** Professeur / facilitateur  
**Règle d’or :** SAP enseigne. TEC.ERP fait penser. Aucun clonage d’écran SAP. Aucun compte SAP partagé.

Spine lab (simulation seulement, distincte de l’entreprise de formation SAP) : NordHabitat · DC-MTL · SKU-HVAC-4421 · 40 vs 36 · Tom · Claire Fontaine.

---

## 1. Titre de séance

**Session 1 — Voir l’entreprise comme un système intégré**

Sous-titre : sur SAP (unité 1, séance officielle), découvrir pourquoi les processus E2E exigent une lecture partagée ; dans le sofa TEC.ERP, relier le cas NordHabitat 40 versus 36 (coussin M1 optionnel) sans exécuter de transaction SAP.


---

## 2. Durée (180 min)

| Bloc | Durée | Système |
|------|-------|---------|
| Ouverture — SAP enseigne / TEC.ERP pense | 15 min | Professeur |
| Exploration guidée SAP Learning (unité 1) | 40 min | SAP Hub |
| Cas sofa — APPRENDRE (cadres 1–6, coussin M1) | 25 min | TEC.ERP Course Edition |
| Pause | 15 min | — |
| Connection Lab + missions M1 | 50 min | TEC.ERP |
| KPI / synthèse (Bilan ou BI Studio) | 20 min | TEC.ERP |
| Debrief + homework SAP | 15 min | Professeur |
| **Total** | **3 h 00** | |

Si l’accès SAP d’un étudiant manque : Semaine Zéro incomplète — l’étudiant observe le voisin **sans** partager de mot de passe ; rattrapage Hub après la séance.

---

## 3. Objectifs d’apprentissage

À la fin de la séance, l’étudiant·e peut :

1. Expliquer, avec le langage SAP de l’unité 1, pourquoi un processus de bout en bout traverse plusieurs fonctions.
2. Distinguer **cours SAP** (référence, quiz, systèmes de pratique) et **sofa TEC.ERP** (cas NordHabitat, missions, preuves).
3. Relier les sept départements NordHabitat à l’écart 40 versus 36 **sans** copier un écran SAP.
4. Interpréter l’écart comme fragmentation d’information, pas comme geste de correction de stock.
5. Amorcer M1-M01 → M1-M03 dans le Centre de mission TEC.ERP (coussin optionnel).
6. Déclarer dans Parcours SAP (autodéclaration) l’avancement de l’unité 1 — la vérité officielle reste sur SAP Learning.

---

## 4. Préparation requise (professeur)

### Semaine Zéro (14–21 jours avant)

- [ ] Chaque étudiant a un compte **individuel** SAP Learning Hub, student edition.
- [ ] Lien officiel de la learning journey IEE2E communiqué (URL SAP, pas de PDF propriétaire).
- [ ] Calendrier séance 1 renseigné dans TEC.ERP (Parcours SAP / calendrier professeur).
- [ ] Comptes TEC.ERP étudiants + coorte **uniquement après Teaching Gate** — jusqu’alors, rehearsal sur environnement non production.

### Avant la séance (45 min)

- [ ] Ouvrir SAP Learning (votre compte) — ne jamais projeter de quiz avec réponses.
- [ ] Ouvrir Course Edition M1 (coussin optionnel) : `/workspace/modules/M1/course-edition/apprendre`.
- [ ] Ouvrir Parcours SAP (workspace) : autodéclaration, pas scrape.
- [ ] Ouvrir Teaching Deck **S1** (thème Projector) : `/workspace/teaching-deck/S1?professor=1`.
- [ ] Documents lab `NH-INV-SIG-4036` — clairement simulation NordHabitat.

### Matériel étudiant

- Compte SAP Hub personnel  
- Compte TEC.ERP personnel  
- Navigateur à jour  
- Interdit : partager login SAP ou TEC.ERP  

---

## 5. Script d’ouverture (≈ 15 min)

> « Cette formation a une référence totale : **SAP**. Vous construisez des compétences d’analyste sur Learning Hub et, plus tard, sur des systèmes de pratique SAP.  
> TEC.ERP est le **sofa** : on organise la séance, on ralentit, on relie les départements, on garde des preuves. Les modules NordHabitat (comme M1) sont des **coussins optionnels** — pas le calendrier de classe. Ce n’est pas un clone SAP. L’entreprise NordHabitat n’est pas l’entreprise de vos exercices SAP.  
> Aujourd’hui, unité 1 SAP (séance S1) : pourquoi l’intégration. Ensuite, cas TEC.ERP : Tom voit 36, le système NordHabitat affiche 40. La question n’est pas « quelle transaction SAP ? ». C’est : qui est impacté, quelle information circule, quelle preuve avant de conclure. »

Points à marquer :

- SAP = cours officiel · TEC.ERP = sofa de raisonnement · M1 = coussin optionnel  
- Interdit : copier l’écran SAP · partager un compte  
- Interdit pédagogique lab M1 : ajustement de stock / transaction  

---

## 6. Timing

| Minute | Activité | Rôle professeur | Rôle étudiant |
|--------|----------|-----------------|---------------|
| 0–15 | Ouverture duale | Script | Écoute |
| 15–55 | Unité 1 SAP Learning | Circuler, ne pas recopier l’UI | Parcours officiel |
| 55–80 | Cadres APPRENDRE 1–6 | Questions ciblées | Cas NordHabitat |
| 80–95 | Pause | — | — |
| 95–115 | Connection Lab | Débloquer sans donner toutes les paires | Pratique |
| 115–145 | Missions M1 | Transition Centre de mission | Exécuter |
| 145–165 | Bilan / KPI | Débrief | Consolider |
| 165–180 | Clôture + homework SAP quiz unité 1 | Synthèse | Autodéclaration Parcours SAP |

---

## 7. Notes — bloc SAP

- Utiliser uniquement le contenu **officiel** SAP Learning.
- Ne pas photographier / coller l’UI dans TEC.ERP.
- Si un étudiant est perdu dans le jargon Suite : glossaire de cohorte, pas copie d’écran.
- Homework : quiz SAP unité 1 **sur SAP**, puis case à cocher autodéclarée dans TEC.ERP.

## 8. Notes — sofa APPRENDRE (cadres TEC.ERP, coussin M1)

Conserver les 8 cadres M1 existants. Cadre 7 (démo ERP) = **ERP organisationnel TEC.ERP**, jamais un écran SAP.

## 9. Questions à poser

1. Que change un processus E2E si un département optimise son silo ? (pont SAP → lab)
2. Pourquoi un écart de 4 unités n’est-il pas seulement un problème d’entrepôt ?
3. Quelle preuve minimale avant de conclure à un problème d’intégration ?
4. Où s’arrête SAP (référence) et où commence NordHabitat (simulation) ?

## 10. Connection Lab / missions / bilan

Inchangé côté runtime TEC.ERP (seuil Lab 70 %, missions M1-M01→M03, quiz de consolidation). Rappeler : le quiz TEC.ERP **ne remplace pas** le quiz SAP.

## 11. Idées fausses

| Idée fausse | Correction |
|-------------|------------|
| « TEC.ERP est SAP. » | SAP est la référence ; TEC.ERP est le sofa. |
| « On peut partager un login Hub. » | Interdit. Semaine Zéro individuelle. |
| « Il faut ajuster le stock maintenant. » | M1 lab = diagnostic, pas transaction. |
| « Recopier l’écran SAP aide la classe. » | Interdit (gouvernance + licence). |
| « NordHabitat = entreprise des exercices SAP. » | Univers distincts. |
| « M1 définit le calendrier de classe. » | SAP unité 1 = séance ; M1 = coussin optionnel. |

## 12. Clôture

> « Vous quittez la séance avec une compétence de lecture systémique **et** un pas officiel sur SAP. Ce n’est pas encore l’exécution transactionnelle SAP — et c’est volontaire. Homework : quiz unité 1 sur Learning Hub ; autodéclaration dans Parcours SAP. »

## 13. Checklist fin de séance

- [ ] Accès SAP individuel confirmé ou plan de rattrapage (jamais partage)
- [ ] Unité 1 entamée sur Hub
- [ ] Course Edition M1 ouvert (coussin optionnel)
- [ ] Lab tenté ; missions lancées selon rythme
- [ ] Autodéclaration Parcours SAP proposée (non obligatoire si Hub down)
- [ ] Aucun écran SAP capturé dans les supports TEC.ERP

## 14. Références runtime

| Élément | Emplacement |
|---------|-------------|
| Parcours SAP | `/workspace/apps/parcours-sap-iee2e` |
| Course Edition M1 | `/workspace/modules/M1/course-edition/apprendre` |
| Teaching Deck S1 | `/workspace/teaching-deck/S1?professor=1` |
| Comfort Pack | `apps/web/src/poc/sap-iee2e/sessionPlans.ts` |
| Décision produit | `engineering/v2/sap-spine/SAP_SPINE_PRODUCT_DECISION.md` |
