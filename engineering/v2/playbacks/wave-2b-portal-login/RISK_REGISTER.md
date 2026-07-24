# Wave 2B — Risk Register (Revision 1)

> **Status:** Architecture Revision 1 risk register — IMPLEMENTATION NOT AUTHORIZED  
> **Baseline:** `3e23022e8cdf6b0b5b9bc273b34f285d93bd7bd9`  
> **Branch / worktree:** `feature/v2-portal-login-wave2b` @ `C:\Projetos\tec-erp-wt-wave2b-portal-login`  
> **Deploy / Push / James Run 2 / Professor implementation:** NOT AUTHORIZED

## Revision 1 product risks (R2B-01 … R2B-08)

| ID | Area | Level | Evidence | Mitigation | Blocks re-approval? | Blocks implementation? |
|----|------|-------|----------|------------|---------------------|------------------------|
| **R2B-01** | Product delta collapse to Wave 2A cosmetic polish | HIGH | Prior pack described “refinements”; Wave 2A already has portal/login/cockpit/preview | Revision 1 forbids cosmetic-only goal; functional mission-entry contract mandatory | No (if Revision 1 held) | **Yes** if implementation ignores engine/session |
| **R2B-02** | Mission 1 remains preview-modal-only | HIGH | Wave 2A `OrientationPage` modal; prior Steps kept preview-only | CTA must start session; preview ≠ COMPLETED | No | **Yes** if CTA only opens modal |
| **R2B-03** | Missing behavioral proof in QA | HIGH | Prior QA was render/theme/isolation | Behavioral tests for start/evidence/decision/consequence/resume/complete | No | **Yes** if only render tests |
| **R2B-04** | State truth lives only in UI toggles | HIGH | Prior `PlaybackProvider` flags only | Isolated in-memory mission service + ledger; optional sessionStorage | No | **Yes** if no engine |
| **R2B-05** | Accidental production auth/API coupling | MEDIUM | Production `LoginPage`/`useAuth` nearby | Fake playback login; no fetch; engine pure client | No | **Yes** if coupling appears |
| **R2B-06** | Scope creep to full M1 / ELE / Professor / schema | MEDIUM | Vision breadth | Hard non-goals; one decision; authored consequences; no Prisma | No | **Yes** if creep enters PR |
| **R2B-07** | Permanent second-V1 via page-only evolution | MEDIUM | Evolving only `playback/v2` pages | Option C mission-entry engine boundary | No | **Yes** if rules embedded only in JSX |
| **R2B-08** | Unauthorized push/deploy or James Run 2 | HIGH if attempted | Multi-worktree / Railway culture | Explicit prohibitions; Run 2 = 0; branch local | **Yes** if claimed | **Yes** if performed |

## Residual Wave 2A P2 (still out of Wave 2B)

- Authorized College logo asset still missing  
- Future route rename `/orientation` → `/mission-cockpit`  

## Branch-name recommendation (document only)

`feature/v2-portal-login-wave2b` is imprecise for the functional slice.  
Recommended: `feature/v2-so1048-mission-entry-wave2b`.  
**Do not rename in this documentation revision.**

## Residual severity summary (this revision)

| Severity | Status |
|----------|--------|
| P0 | None in docs-only Revision 1 |
| P1 (architecture delta) | Closed **in documentation** by Revision 1 contract; remain blocking for **implementation** if ignored (R2B-01…04, 07) |
| P2 | Branch imprecision; presentation coupling vigilance |
| P3 | Marker wording optional refresh after functional slice exists |

## Statement

Revision 1 defines the functional mission-entry delta required for Architecture Re-Approval.  
**IMPLEMENTATION NOT AUTHORIZED** until Architecture Re-Approval and Implementation Checkpoint both pass.
