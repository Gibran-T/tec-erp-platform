# Proposed official `docs/` patches — OWNER APPROVAL REQUIRED

Do **not** apply these to `docs/` until the owner explicitly says yes.

## Intent

Align official specifications with the SAP-spine / sofa decision. Until then, engineering follows this pack; source-of-truth hierarchy in `.cursor/context/TEC_ERP_PROJECT_CONTEXT.md` still lists the unrevised bible/blueprint.

## `docs/00_PRODUCT_VISION.md`

Add a positioning paragraph:

- The college course reference system is **SAP** (Learning Hub, student edition / IEE2E journey).
- TEC.ERP develops universal process analysis in a simulation lab (NordHabitat), transferable to SAP and other ERPs.
- TEC.ERP is not a SAP clone and is not an official SAP-certified curriculum unless separately authorized.

## `docs/00_ENTERPRISE_UNIVERSE_BIBLE.md`

- Keep NordHabitat as the **lab universe**.
- Qualify the line “30 classroom hours = 1 simulated corporate year” as **lab narrative time**, not the Collège calendar.
- Collège calendar = 10 × 180 min sessions on the SAP IEE2E spine.

## `docs/02_ENTERPRISE_EXPERIENCE_BLUEPRINT.md`

- Replace teaching-spine language “One simulated corporate year. Thirty classroom hours. Zero module consciousness” with:
  - **Course spine:** SAP IEE2E units in 10 Collège sessions.
  - **Lab spine:** NordHabitat missions M1–M10 + Capstone, still process-first (students may still not need “module consciousness” inside the lab).
- Keep Hour 1 First Day as **lab onboarding**, after Semaine Zéro SAP access.

## `docs/01_LEARNING_BLUEPRINT.md`

- LB-03: 10-module lab + 10-session SAP calendar.
- LB-05: standard class flow = SAP guided + optional sofa cushion (Course Edition / missions) + debrief (see PEDAGOGY_10X180.md).
- Mark sections from Draft/Pending toward Owner-approved after this pack is accepted.

## Explicitly unchanged without further review

- `docs/17` / `docs/18` schemas and APIs except additive SAP self-report (already in engineering migrations).
- `docs/10` Silver/Gold as **TEC.ERP** certificates, not SAP certificates.
- RC01 OD-6: still no vendor screen reproduction.
