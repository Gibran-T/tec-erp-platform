# TEC.ERP V2 HCM Mission Design

Three complete HCM missions (catalog keys):

## M8-M01 — Intégrer un nouvel employé (`m8-m01-integrer-nouvel-employe`)
- Objects: ONB request, employee master, position/org/cost-center assignment, access request, checklist
- Traps: invalid CC, cross-company manager, access before identity, missing assignment, excessive access, NAS exposure

## M8-M02 — Gérer le temps, les absences et l’impact financier (`m8-m02-gerer-temps-absences`)
- Quantitative: planned 40, absent 16, capacity 24, OT 8, cost 504 CAD
- Traps: unapproved absence, duplicate timesheet, wrong type, OT beyond policy, wrong company, ignored cost

## M8-M03 — Évaluer les compétences et préparer l’évolution (`m8-m03-evaluer-competences-evolution`)
- Objects: competency matrix, evidence, gap, development plan, training, manager decision
- Traps: unsupported rating, AI as final decision, protected data misuse, no evidence, contradictory scores, unrelated training

AI Coach: HCM safeguards enforced in `ai-coach.guards.ts`.
