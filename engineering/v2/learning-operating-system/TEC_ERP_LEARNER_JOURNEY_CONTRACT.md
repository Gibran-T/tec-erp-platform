# TEC.ERP Learner Journey Contract

> **Status:** CONTRACT — NOT IMPLEMENTED · Wave 1 Learning Architecture · Do not treat as shipped UX.

**Authority:** TEC.ERP Learning Operating System Master Contract · Owner review required before Wave 2.

---

## Journey stages (ordered)

portal → onboarding → module introduction → learning → demonstration → mission 1 → mission 2 → mission 3 → BI → AI reflection → assessment → debrief → progression → Capstone → certification

## Stage matrix

| Stage | Learner question | Interface goal (≤5s) | Evidence | Action | Feedback | Next step | Professor visibility | Historical behavior |
|-------|------------------|----------------------|----------|--------|----------|-----------|----------------------|---------------------|
| Portal | Is this the right program? | TEC.ERP identity + promise | — | Enter login | Trust cues | Login | Public only | N/A |
| Onboarding | What will I do first? | Role + run + first module | Onboarding ack | Start parcours | Progress chip | Module intro | Cohort assignment | Consulter if completed run |
| Module introduction (DÉCOUVRIR) | Why this module? | Process map + outcome | Intro view | Open Apprendre | Purpose confirmed | Apprendre | Module progress | Read-only labels |
| Learning (APPRENDRE) | What must I know? | Concept + example | Knowledge check | Complete microlearning | Check result | Observer | Completion | Review content OK |
| Demonstration (OBSERVER) | How does an expert do it? | Demo focus (doc/KPI) | Demo attendance mark | Watch / follow | Key decision called out | Mission 1 | Class presence | Deck learner-safe |
| Mission 1 | What is the situation? | Cadre + actors | Context evidence | Cadre + explain rule | Boundary feedback | Mission 2 | Attempt + evidence | Consulter evidence only |
| Mission 2 | How do I execute safely? | Transaction + control | Doc + control evidence | Execute ERP | Control pass/fail | Mission 3 | Attempt + docs | No rewrite |
| Mission 3 | What went wrong and what do I decide? | Exception + KPI | Recovery + justification | Diagnose + decide | Downstream impact | BI | Attempt + decision | No new attempt |
| BI (ANALYSER) | What do the numbers mean? | KPI + variance | KPI interpretation | Filter/compare/explain | Interpretation quality | AI | BI analysis | View historical KPIs |
| AI reflection | How do I reason with evidence? | Large workspace + evidence | AI reflection + synthesis | Synthesize | Gaps flagged | Assessment | AI oversight (no keys) | No new AI writes that mutate |
| Assessment | Can I prove competence? | Clear item type | Assessment result | Answer / analyze | Pedagogical feedback | Debrief | Scores + correction | Preserve results |
| Debrief | What did I learn for the next module? | Synthesis + next module | Debrief note | Reflect | Readiness | Progression | Debrief visibility | Review OK |
| Progression | Am I unlocked for what’s next? | Unlock state humanized | Unlock signals | Continue | Gate reason | Next module / Capstone | Progression board | Historical complete badge |
| Capstone | Can I integrate the enterprise? | Stage S1–S7 status | Capstone artifacts | Advance stages | Professor review | Certification | Full review | No resubmit if approved historical |
| Certification | Did I earn Gold on evidence? | Certificate status | Certificate record | Download / verify | Eligibility explain | Profile / share | Issue Gold | No certificate mutation |

## Binding rules

1. Every stage MUST expose an explicit next-step CTA.  
2. No stage MAY open with a wall of text.  
3. Historical completed runs MUST use **Consulter** and hide write controls.  
4. Capstone remains outside the 30-mission list.  
5. AI never changes score or unlocks progression.


## Wave 1A Research Addendum cross-links

Preserves Wave 1 logic. Dual journey (enterprise + professional): `TEC_ERP_DUAL_JOURNEY_ROADMAP_CONTRACT.md`. Professional identity stages: `TEC_ERP_PROFESSIONAL_IDENTITY_AND_SITUATED_LEARNING_CONTRACT.md`. Experience modes must be visible in journey IA. See `README.md` §B.
