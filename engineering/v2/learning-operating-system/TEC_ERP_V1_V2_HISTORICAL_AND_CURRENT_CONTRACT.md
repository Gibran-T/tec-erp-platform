# TEC.ERP V1 Historical and V2 Current Contract

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1 Learning Architecture · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Purpose

Strict separation between **V1 HISTORICAL** and **V2 CURRENT** curricula so James Run 1 and all historical evidence remain immutable while new pedagogy evolves on V2.

## V1 HISTORICAL (binding)

Includes:

- James Timothy Run 1 and any run with `curriculumVersion = V1`  
- Historical module meaning: **M8 Governance**, **M9 BI/IA**, **M10 Capstone Equinoxe missions inside the 30**  
- 30 historical missions as completed  
- Historical Capstone + certificates  
- Read-only presentation  

V1 SHALL NOT:

- be re-executed as a writable curriculum rewrite  
- receive synthetic HCM insertion  
- be converted in place to V2  
- accept new AI evidence writes, new attempts, mission restart, Capstone resubmission, or certificate mutation  

## V2 CURRENT (binding)

Includes:

- New pedagogical course runs with `curriculumVersion = V2`  
- Official modules **M1–M10** with V2 meanings  
- **M8 HCM**, **M9 Governance / access / compliance**, **M10 BI / KPI / AI / consulting**  
- Exactly **30 regular missions**  
- **Separate Capstone** (MCapstone domain)  
- **HCM_M8** assessment (V2 only)  
- Version-aware Gold rules  

## Presentation rules (historical runs)

| Rule | Requirement |
|------|-------------|
| Labels | Cleaned localized labels MAY be applied |
| Stored data | Historical stored data remains unchanged |
| CTA | “**Consulter**” replaces “Ouvrir” on completed historical runs |
| Mission surface | Evidence, feedback, timeline only |
| Write controls | None |
| AI evidence | No new AI evidence |
| Attempts | No new attempts |
| Restart | No mission restart |
| Capstone | No resubmission |
| Certificates | No mutation |

## Equivalence prohibition

UI and analytics MUST NOT imply module-by-module equivalence for M8–M10 between V1 and V2. Surfaces MUST expose `curriculumVersion`.

## Non-goals of this wave

No James Run 2 · No Thiago Professor · No production data alteration · No conversion of V1 runs.
