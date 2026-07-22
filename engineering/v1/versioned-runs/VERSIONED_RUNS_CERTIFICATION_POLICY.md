# TEC.ERP — Versioned Pedagogical Runs · Certification Policy

**Baseline `main`:** `e8761d8` · Product SHA: `2378b2b`  
**Schema:** `certificate.sourceRunId`, `certificate.achievementType`  
**Services:** `assessment.service` (Silver), `certification.service` (Gold)

---

## 1. Provenance model

Every newly issued certificate should record:

| Column | Meaning |
|--------|---------|
| `sourceRunId` | Pedagogical run that produced the eligibility evidence |
| `achievementType` | Logical achievement (`silver` / `gold`); backfill uses `certificateType` when null |
| `certificateType` | Existing product type field (`silver` / `gold`) |
| `status` | `issued` \| `revoked` |

Migration attaches existing certificates to Run 1 and sets `achievementType` from `certificateType` when missing.

---

## 2. Run 1 certificates — no automatic revoke

Creating, activating, or completing a later run **must not** auto-revoke certificates earned on Run 1 (or any prior run).

| Action | Effect on prior certificates |
|--------|------------------------------|
| New run created | None |
| Prior run paused / completed / archived | None |
| Migration backfill | Provenance only — status unchanged |

Revocation remains an **explicit** professor/admin action (Gold: `revokeGold` with reason + audit). There is no “revoke Run1 because Run2 started” path.

---

## 3. No blind duplicate active Silver / Gold

Issuance guards (existing + preserved):

| Certificate | Guard |
|-------------|-------|
| Silver | `findFirst` where `certificateType = silver` and `status = issued` → conflict `Certificat Silver deja emis.` |
| Gold | same pattern for `gold` → `Certificat Gold deja emis.` |

“Blind duplicate” means issuing a second **active (`issued`)** Silver or Gold for the same employee without an intentional revoke/re-issue workflow. That is forbidden.

Notes:

- A revoked certificate does not block a later legitimate re-issue (query filters `status: issued`)  
- Eligibility for Gold/Silver is evaluated against the **resolved pedagogical run** (missions, assessments, capstone scoped by run)  
- Silver attaches `sourceRunId` from `getCurrentPedagogicalRun()`; Gold from `resolvePedagogicalRunForEmployee`

---

## 4. Eligibility scoping

Gold checklist (`loadEligibility`) filters mission attempts, GOLD assessment, and capstone by the resolved run id. Without a resolvable run, filters use a sentinel that yields empty evidence (fail closed).

Completing a second run does not automatically mint a second Gold while an issued Gold exists.

---

## 5. Production constraints for this wave

- Do **not** create James Run 2 in production  
- Do **not** re-issue or revoke James Zero1 certificates as part of migration  
- Certificate public verify tokens remain valid unless explicitly revoked  

---

## 6. Audit

Issue and revoke continue to write `certificate_audit` and company `audit_event`. Pedagogical run audits are separate (`pedagogical_course_run_audit`) and do not imply certificate changes.
