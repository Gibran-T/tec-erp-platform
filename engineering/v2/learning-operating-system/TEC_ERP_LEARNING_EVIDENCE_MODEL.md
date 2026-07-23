# TEC.ERP Learning Evidence Model

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1 Learning Architecture · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Evidence categories

ERP transaction · master-data decision · process sequence · document · approval · exception · reconciliation · KPI interpretation · written justification · AI-supported reflection · assessment result · recovery · Professor observation · Capstone artifact

## Evidence object schema (binding)

Every evidence object MUST carry:

| Field | Requirement |
|-------|-------------|
| source | System origin (ERP, BI, AI, assessment, Capstone, Professor) |
| run | Pedagogical course run id |
| curriculum | V1 or V2 |
| module | M1–M10 or MCapstone |
| mission | Mission key or null |
| learner | Employee id |
| timestamp | UTC |
| type | Category enum (localized label in UI) |
| content | Payload / references |
| score relationship | None / contributes / gates |
| competency relationship | Competency ids |
| editable or immutable | Default immutable after submit |
| learner visibility | Visible / delayed / hidden |
| Professor visibility | Visible / anonymizable |
| historical behavior | Read-only if run historical |
| audit behavior | Append-only audit trail |

## Evidence kinds

| Kind | Meaning |
|------|---------|
| Raw evidence | System fact (transaction, document id) |
| Interpreted evidence | Learner/Professor interpretation of raw fact |
| Automated signal | KPI threshold, unlock, completion flag |
| Professor judgment | Human evaluation / intervention |
| Learner reflection | Written synthesis (incl. AI-supported) |

## Historical rules

V1 historical runs: no new evidence writes that mutate certification meaning; consultation only.


## Wave 1A Research Addendum cross-links

Preserves Wave 1 logic. Additional binding contracts: research canon; serious simulation; case method; flight simulation; facilitation/debrief; cognitive load; reflection/transfer; professional identity; Digital Twin; process chains; consulting mandate; experience modes; Enterprise Life Engine; executive impact; dual journey. See `README.md` §B and `TEC_ERP_LEARNING_TRACEABILITY_MATRIX.md`.
