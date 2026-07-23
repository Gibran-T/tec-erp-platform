# TEC.ERP — V2 Production Post-Deploy Report

**UTC:** 2026-07-23  
**Target SHA:** `c625ed506640c8b8658a17f8994cd83f5c907331`  
**Previous SHA:** `76709d62368675d8d6517c592e66e41349569ff2`  
**API deployment:** `f68dc7b2-c01f-452b-8f91-a6757ac3d358`  
**Web deployment:** `796bb2ff-be57-4990-a363-eefc3a9a1ef6`

---

## Verdict

**V2 CONTROLLED PRODUCTION DEPLOYMENT GREEN — READY FOR THIAGO PROFESSOR SETUP**

Stabilization window (≥10 minutes) closed with API/Web health 200, no 500s observed in sampled logs, James integrity hash unchanged.

---

## James Timothy

| Check | Result |
|-------|--------|
| Login | PASS |
| Curriculum | V1 |
| Run 1 | `TECERP-PILOT-001-RUN1` COMPLETED historical |
| 30/30 | PASS |
| Capstone | submitted / approved (preserved) |
| Certificates | silver issued · gold revoked+issued (preserved) |
| HCM exclusion | PASS (not required / not listed for V1 learner assessments) |
| Run 2 | absent |
| Professor | absent |
| Integrity hash pre/post | identical `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4` |

---

## V2 structural

| Check | Result |
|-------|--------|
| Default curriculum | V2 |
| Catalog | 10 modules × 3 missions = 30 regular |
| M8 HCM / M9 Governance / M10 BI | Present |
| Capstone outside 30 | PASS (catalog tests) |
| HCM_M8 bank | seeded exactly once |
| Gold V2 protection | HCM required for V2 (unit + policy tests); V1 James gold path unchanged |

---

## Global non-changes

| Metric | Value |
|--------|-------|
| New learner | 0 |
| New Professor | 0 |
| New James run | 0 |
| New assessment attempts | 0 (HCM attempts 0) |
| New certificates | 0 |
| QA residue | 0 |

---

## Expected changes

- Migrations `20260725120000_v2_curriculum_version`, `20260726120000_v2_hcm_m8_assessment_bank` recorded  
- HCM_M8 definition + 20 questions  
- James Run 1 `curriculumVersion=V1` stamped  
- Deployment IDs / product SHA updated  

---

## Remaining gates (not this release)

1. **Thiago Professor account setup** (next authorized gate)  
2. Optional James Run 2 creation (owner-gated, separate)  
3. Evidence PR review/merge (audit only)

---

## Rollback

Not required. Plan documented in `TEC_ERP_V2_PRODUCTION_ROLLBACK_PLAN.md`.
