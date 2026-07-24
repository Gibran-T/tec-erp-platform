# JAMES TIMOTHY ZERO1 — Defect & Improvement Backlog

Evaluation generated under the James Timothy Zero1 professional persona.

**Document type:** Pilot defect / improvement backlog (no product changes in this branch)  
**Persona:** James Timothy — TEC.ERP Student Zero1 (`TECERP-2026-PILOT-001`)  
**Cohort:** `TECERP-PILOT-001` · Company `TECERP-PILOT`  
**Baseline:** main `63897327…` · production app `bca6f462…` · branch `pilot/james-timothy-zero1`  
**Rule:** EXECUTE → OBSERVE → RECORD → CLASSIFY → RECOMMEND → **WAIT FOR OWNER APPROVAL**  
**Limitation:** Persona simulée — classification pédagogique ≠ ticket humain autonome.

### Severity legend

| Sev | Meaning |
|-----|---------|
| **P0** | Production or security blocker |
| **P1** | Prevents learning or mission / cohort completion as designed |
| **P2** | Significant pedagogy, scoring, or UX defect |
| **P3** | Useful improvement |
| **P4** | Optional polish |

### Required fields per item

ID · severity · category · module/mission · observed · expected · business impact · pedagogical impact · reproduction · recommended correction · workaround · blocks real cohort?

---

## Summary

| Sev | Count | IDs |
|-----|------:|-----|
| P0 | 0 | — |
| P1 | 1 | Z1-003 |
| P2 | 7 | Z1-001, Z1-002, Z1-004, Z1-006, Z1-008, Z1-010, Z1-011 |
| P3 | 5 | Z1-005, Z1-007, Z1-009, Z1-012, Z1-013 |
| P4 | 2 | Z1-014, Z1-015 |

**No P0 security breach observed** (student admin/professor APIs correctly return 403).  
**Cohort blockers:** Z1-003 (P1) + pedagogical acceptance of hybrid evidence (Z1-006) + P2 cluster before real cohort.

---

## P1

### Z1-003 — No institutional professor Thiago for pilot cohort assignment

| Field | Content |
|-------|---------|
| **ID** | Z1-003 |
| **Severity** | P1 |
| **Category** | professor portal · admin · certification · pedagogy |
| **Module / mission** | Cohort provisioning · Capstone · Gold |
| **Observed behavior** | Aucun compte professeur institutionnel légitime **Thiago Gibran** n’existait pour l’affectation. Cohorte créée **sans** professeur fabriqué. Compte professeur/admin **temporaire** utilisé uniquement pour Capstone/Gold puis **supprimé**. |
| **Expected behavior** | Professeur institutionnel assigné à `TECERP-PILOT-001` (ou politique explicite d’exemption documentée). Capstone/Gold approuvés par identité professorale durable. |
| **Business impact** | Processus d’encadrement non reproductible pour une vraie cohorte TEC. |
| **Pedagogical impact** | Capstone/Gold ne portent pas la signature professorale institutionnelle attendue ; crédibilité certificat affaiblie. |
| **Reproduction evidence** | Provisioning run : pas de compte Thiago légitime ; temp professor create → approve → delete. Voir PROFILE + EXECUTION_LOG. |
| **Recommended correction** | Créer/activer le compte professeur institutionnel Thiago Gibran (email légitime réel) ; assigner la cohorte ; rejouer Capstone review + Gold issue sous cette identité ; conserver audit trail. |
| **Workaround exists?** | Yes — temp professor (utilisé puis supprimé) — **unacceptable for real cohort** |
| **Blocks real cohort?** | **YES** |

---

## P2

### Z1-001 — Student nav overstates Admin / Professor access

| Field | Content |
|-------|---------|
| **ID** | Z1-001 |
| **Severity** | P2 |
| **Category** | UX · security (perception) · admin · professor portal |
| **Module / mission** | Global student navigation |
| **Observed behavior** | Nav étudiante affiche **Administration** et **Portail professeur** comme **Accès actif**, alors que les APIs admin/professor renvoient **403**. |
| **Expected behavior** | Masquer les entrées non autorisées, ou les marquer clairement « non disponible / réservé », aligné sur les droits réels. |
| **Business impact** | Confusion de rôle ; tickets support ; perception de faille même si API est correcte. |
| **Pedagogical impact** | Étudiant croit avoir des droits qu’il n’a pas — mauvaise leçon de gouvernance. |
| **Reproduction evidence** | Login James → sidebar ; API admin/professor avec token student → 403 (`browser-run-results` security event). |
| **Recommended correction** | Filtrer nav par permissions effectives ; tests e2e rôle STUDENT. |
| **Workaround exists?** | Partial — ignorer les liens (API protège) |
| **Blocks real cohort?** | No (security OK) — **fix before cohort** as trust/UX defect |

### Z1-002 — Course API duplicate locked M2 module

| Field | Content |
|-------|---------|
| **ID** | Z1-002 |
| **Severity** | P2 |
| **Category** | technical · progression · functional |
| **Module / mission** | Course payload / M2 |
| **Observed behavior** | Snapshot fin de parcours : modules M1–M10 `completed`, **plus** une entrée dupliquée `M2` avec `status: locked`, `percent: 0`, `missions: []`. `percentComplete` global reste 100. |
| **Expected behavior** | Un seul enregistrement module M2 cohérent avec le progrès réel. |
| **Business impact** | Risque analytics/progression incorrects ; confusion UI future. |
| **Pedagogical impact** | Étudiant/professeur peuvent lire un « M2 locked » fantôme. |
| **Reproduction evidence** | `browser-run-results.json` → `course_snapshot_end.modules` last entry. |
| **Recommended correction** | Deduplicate course aggregation ; regression test on completed course payload. |
| **Workaround exists?** | Yes — ignorer l’entrée locked si completed sibling exists |
| **Blocks real cohort?** | No — fix **before** cohort reporting relied upon |

### Z1-004 — AI Coach fallback-only / weak professional depth

| Field | Content |
|-------|---------|
| **ID** | Z1-004 |
| **Severity** | P2 |
| **Category** | AI Coach · pedagogy · content |
| **Module / mission** | AI Coach (cross-module) ; pertinent M9-M03 |
| **Observed behavior** | Réponse déterministe de fallback pédagogique ; **pas** de clés de réponses ; FR OK ; **aucun** changement note/unlock. Profondeur faible pour un praticien senior (guidance générique). |
| **Expected behavior** | Coach réflexif contextualisé à la mission/processus, toujours sans spoiler, avec profondeur professionnelle variable. |
| **Business impact** | Différenciateur IA sous-exploité. |
| **Pedagogical impact** | Utile comme garde-fou anti-cheat, insuffisant comme tuteur de processus. |
| **Reproduction evidence** | `ai_coach_ask` 200 + answerPreview fallback (`browser-run-results`). |
| **Recommended correction** | Enrichir prompts/context mission-aware ; conserver interdiction answer-key ; tests « no grade mutation ». |
| **Workaround exists?** | Yes — professeur + briefings missions |
| **Blocks real cohort?** | No — but **significant** for claimed AI value |

### Z1-006 — Hybrid mission execution path / UI automation gap

| Field | Content |
|-------|---------|
| **ID** | Z1-006 |
| **Severity** | P2 |
| **Category** | technical · UX · pedagogy · assessment |
| **Module / mission** | M1-M02 → M10-M03 (majority) |
| **Observed behavior** | Playwright ouvre UI (briefing observé) puis soumission authentifiée API ; mode `ui_observe_api_submit_ordering`. Durées ~4 s non pédagogiques. |
| **Expected behavior** | Pour validation pédagogique Zero1 « complete student », exécution **full UI** mission par mission (ou automation UI qui remplit réellement les contrôles). |
| **Business impact** | Preuve de complétion technique ≠ preuve d’expérience UI bout-en-bout. |
| **Pedagogical impact** | Limite la confiance sur clarté UX, feedback inline, et friction réelle étudiant. |
| **Reproduction evidence** | `browser-run-results.json` modes ; EXECUTION_LOG. |
| **Recommended correction** | (a) Améliorer automation UI fill/submit ; (b) revue manuelle professoral d’un échantillon full UI ; (c) documenter clairement la limite d’évidence. |
| **Workaround exists?** | Partial — M1-M01 full UI + briefings observés |
| **Blocks real cohort?** | **Conditionally YES** until pedagogical review accepts hybrid evidence scope |

### Z1-008 — Scores 85 despite catalog-correct answers (scoring transparency)

| Field | Content |
|-------|---------|
| **ID** | Z1-008 |
| **Severity** | P2 |
| **Category** | scoring · pedagogy · assessment |
| **Module / mission** | Highlighted: **M4-M01, M5-M02, M6-M02, M7-M01** ; also observed 85 on M7-M03, M8-M01, M8-M03, M9-M02, M10-M01, M10-M02 |
| **Observed behavior** | Soumissions catalogue-correctes (chemin hybrid) produisent **85** sur plusieurs missions sans feedback transparent sur la pénalité. |
| **Expected behavior** | Score explicable : rubrique visible, items partiels, ou message pédagogique de ce qui manque. |
| **Business impact** | Contestation de notes ; perte de confiance certificat. |
| **Pedagogical impact** | Étudiant ne sait pas quoi améliorer — feedback non instructif. |
| **Reproduction evidence** | Scores in `browser-run-results.json` ; EXECUTION_LOG distribution. |
| **Recommended correction** | Exposer breakdown de score ; aligner correcteurs catalogue ↔ runtime ; tests de régression scoring. |
| **Workaround exists?** | Partial — assessments integrated/silver/gold still 100 |
| **Blocks real cohort?** | No hard block — **should fix before graded cohort** |

### Z1-010 — Temporary professor dependency for Capstone/Gold governance

| Field | Content |
|-------|---------|
| **ID** | Z1-010 |
| **Severity** | P2 |
| **Category** | certification · professor portal · admin · pedagogy |
| **Module / mission** | Capstone review · Gold issue/revoke/reissue |
| **Observed behavior** | Cycle Capstone approve + Gold issue/revoke/reissue dépendait d’un professeur temporaire ensuite supprimé. |
| **Expected behavior** | Identité professorale stable liée à la cohorte pour toute certification. |
| **Business impact** | Audit trail de certification fragile. |
| **Pedagogical impact** | Lien « professeur Thiago » non matérialisé dans le système. |
| **Reproduction evidence** | EXECUTION_LOG certificates section ; IDENTITY facts. |
| **Recommended correction** | Lié à Z1-003 ; conserver historique d’émetteur sur certificats. |
| **Workaround exists?** | Temp account (deleted) |
| **Blocks real cohort?** | **YES** (same root as Z1-003) |

### Z1-011 — Student role vs institutional teaching model incomplete

| Field | Content |
|-------|---------|
| **ID** | Z1-011 |
| **Severity** | P2 |
| **Category** | pedagogy · professor portal · progression |
| **Module / mission** | Cross-course |
| **Observed behavior** | Pilote prouve le parcours étudiant isolé, mais pas la boucle complète professeur institutionnel → cohort analytics → intervention pédagogique. |
| **Expected behavior** | Boucle enseignement complète validée avant cohorte réelle. |
| **Business impact** | Risque opérationnel de première cohorte. |
| **Pedagogical impact** | Zero1 ne peut pas encore certifier le modèle professoral live. |
| **Reproduction evidence** | Absence Thiago + temp professor path. |
| **Recommended correction** | Mini-pilote professoral avec Thiago réel sur la même cohorte Zero1 (lecture seule + 1 revue Capstone). |
| **Workaround exists?** | Guide professoral documentaire (`JAMES_TIMOTHY_ZERO1_PROFESSOR_GUIDE.md`) |
| **Blocks real cohort?** | **YES** for “controlled real cohort with professor” claim |

---

## P3

### Z1-005 — FR accents missing in some mission titles

| Field | Content |
|-------|---------|
| **ID** | Z1-005 |
| **Severity** | P3 |
| **Category** | French language · content · UX |
| **Module / mission** | Notably M2 titles/objectives in UI preview (« Definissez », « Creer », « unites », etc.) |
| **Observed behavior** | Accents / orthographe FR absents ou dégradés dans certains titres et textes de mission. |
| **Expected behavior** | Français professionnel cohérent (accents, apostrophes, terminologie). |
| **Business impact** | Crédibilité produit FR Québec/Canada. |
| **Pedagogical impact** | Distraction ; mauvaise norme linguistique pour étudiants. |
| **Reproduction evidence** | `visibleTextPreview` entries in browser results (M2+). |
| **Recommended correction** | Pass linguistique catalogue missions ; lint FR. |
| **Workaround exists?** | Yes — professeur corrige oralement |
| **Blocks real cohort?** | No |

### Z1-007 — Certificates UI may show revoked cert until refresh

| Field | Content |
|-------|---------|
| **ID** | Z1-007 |
| **Severity** | P3 |
| **Category** | certification · UX |
| **Module / mission** | Certificates UI / Gold lifecycle |
| **Observed behavior** | UI certificats a brièvement affiché le numéro Gold **révoqué** avant refresh. |
| **Expected behavior** | État certificat toujours frais (issued vs revoked) sans stale display. |
| **Business impact** | Risque de confusion / capture d’écran incorrecte. |
| **Pedagogical impact** | Faible, mais nuit à la confiance certification. |
| **Reproduction evidence** | Pilot observation post revoke/reissue (IDENTITY/EXECUTION facts). |
| **Recommended correction** | Invalidate cache / refetch on focus ; hide revoked by default. |
| **Workaround exists?** | Yes — refresh |
| **Blocks real cohort?** | No |

### Z1-009 — Professor moduleProgress may omit M10 in roster preview

| Field | Content |
|-------|---------|
| **ID** | Z1-009 |
| **Severity** | P3 |
| **Category** | professor portal · progression · technical |
| **Module / mission** | Professor students roster / M10 |
| **Observed behavior** | Preview roster : `completedMissions: 30` mais `moduleProgress` liste M1–M9 (M10 absent dans le preview capturé). |
| **Expected behavior** | `moduleProgress` inclut M10 quand le module est complété. |
| **Business impact** | Professeur sous-estime l’avancement Capstone/Gold readiness. |
| **Pedagogical impact** | Mauvaise intervention professorale possible. |
| **Reproduction evidence** | `certification-followup.json` → `professorStudents.preview`. |
| **Recommended correction** | Fix aggregation moduleProgress ; test 10 modules completed. |
| **Workaround exists?** | Yes — se fier à completedMissions / course API |
| **Blocks real cohort?** | No — annoying for professors |

### Z1-012 — Capstone/Gold API discovery friction (404 on wrong routes)

| Field | Content |
|-------|---------|
| **ID** | Z1-012 |
| **Severity** | P3 |
| **Category** | technical · API · certification |
| **Module / mission** | Capstone / Gold issuance tooling |
| **Observed behavior** | Pendant le follow-up, certaines routes tentées ont renvoyé 404 (`POST /api/v1/me/capstone`, chemins gold professor incorrects) avant d’utiliser le chemin supporté. |
| **Expected behavior** | Documentation API claire + SDK/helpers stables pour professor certificate flows. |
| **Business impact** | Friction outillage / automation. |
| **Pedagogical impact** | Indirect (ops professeur). |
| **Reproduction evidence** | `browser-run-results` capstone_submit 404 ; `certification-followup` gold 404s. |
| **Recommended correction** | Documenter routes canoniques ; aligner scripts pilote. |
| **Workaround exists?** | Yes — supported routes eventually used |
| **Blocks real cohort?** | No |

### Z1-013 — Integrated assessment feedback laconic

| Field | Content |
|-------|---------|
| **ID** | Z1-013 |
| **Severity** | P3 |
| **Category** | assessment · pedagogy · French language |
| **Module / mission** | SILVER / INTEGRATED / GOLD assessments |
| **Observed behavior** | Feedback générique « Evaluation reussie. » (sans accents / sans diagnostic). |
| **Expected behavior** | Feedback par compétence / domaine même en réussite. |
| **Business impact** | Faible. |
| **Pedagogical impact** | Occasion manquée de consolidation. |
| **Reproduction evidence** | Assessment submit bodies score 100. |
| **Recommended correction** | Templates de feedback par assessment. |
| **Workaround exists?** | Yes — debrief professeur |
| **Blocks real cohort?** | No |

---

## P4

### Z1-014 — Hybrid duration metrics not usable for pedagogy analytics

| Field | Content |
|-------|---------|
| **ID** | Z1-014 |
| **Severity** | P4 |
| **Category** | performance · assessment · technical |
| **Module / mission** | All hybrid missions |
| **Observed behavior** | Durées ~3–5 s enregistrées ; non représentatives. |
| **Expected behavior** | Métriques durée seulement si full UI interaction timing. |
| **Business impact** | Analytics durée faussées si consommées telles quelles. |
| **Pedagogical impact** | N/A si documenté. |
| **Reproduction evidence** | startedAt/completedAt deltas in browser results. |
| **Recommended correction** | Tag execution mode on attempts ; exclude hybrid from duration KPIs. |
| **Workaround exists?** | Yes — exclude from reports |
| **Blocks real cohort?** | No |

### Z1-015 — Public certificate verify privacy posture (positive polish)

| Field | Content |
|-------|---------|
| **ID** | Z1-015 |
| **Severity** | P4 |
| **Category** | certification · accessibility (trust) |
| **Module / mission** | Public verify |
| **Observed behavior** | Verify public montre nom + numéro, **pas d’email** — comportement souhaitable. |
| **Expected behavior** | Conserver cette posture privacy. |
| **Business impact** | Positif (privacy by design). |
| **Pedagogical impact** | Positif pour crédibilité certificat. |
| **Reproduction evidence** | `publicVerify.hasEmail: false`. |
| **Recommended correction** | None (keep) ; ajouter test de non-régression privacy. |
| **Workaround exists?** | N/A |
| **Blocks real cohort?** | No — **keep as strength** |

---

## Priority recommendation (owner)

1. **Before any real cohort:** Z1-003 (+ Z1-010/Z1-011), pedagogical acceptance plan for Z1-006, triage Z1-001/Z1-002/Z1-008.  
2. **Soon after / parallel:** Z1-004, Z1-005, Z1-007, Z1-009.  
3. **Backlog polish:** Z1-012–Z1-015.

**Do not implement in `pilot/james-timothy-zero1` evidence branch without owner approval.**
