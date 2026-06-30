# TEC.ERP — Architecture Review Board Templates

## Purpose of the Architecture Review Board

The Architecture Review Board (ARB) is the permanent governance workspace for TEC.ERP engineering decisions.

It provides a controlled environment where architectural proposals are reviewed, debated, documented and approved before they influence official documentation in `docs/` or production implementation.

The ARB ensures that TEC.ERP architectural evolution remains:

- aligned with Enterprise Educational Intelligence principles;
- consistent with the official documentation hierarchy (`docs/01–29`);
- governed by institutional standards (Approval Gates, EduQA, Railway-first);
- traceable through decision records and consensus reports.

The ARB workspace is separate from official product documentation.

Working artifacts live here until promoted through formal governance.

---

## Folder Organization

```text
architecture-board/
├── templates/          Reusable markdown templates for review sessions
├── 30/                 Working area — Document 30 reviews
├── 31/                 Working area — Document 31 reviews
├── 32/                 Working area — Document 32 reviews
├── 33/                 Working area — Document 33 reviews
├── 34/                 Working area — Document 34 reviews
└── 35/                 Working area — Document 35 reviews
```

| Location | Role |
|----------|------|
| `templates/` | Blank templates copied into numbered working folders for each review cycle |
| `30/` – `35/` | Session-specific working directories for Architecture Review Board deliberations |

Official documents are **not** created directly in this workspace.

Approved outcomes are promoted to `docs/` through a separate governed process.

---

## Artifact Lifecycle

```text
1. Initiate
   Copy relevant templates from templates/ into the target folder (30–35).

2. Draft
   Complete working artifacts during Architecture Review Board sessions.

3. Review
   Domain, platform, knowledge, governance and LLM perspectives review drafts.

4. Consensus
   Produce ArchitectureConsensusReport and ArchitectureDecisionPackage.

5. Record
   Finalize ADR and/or DAR for institutional traceability.

6. Promote
   Approved content moves to official docs/ — not committed from this workspace without Approval Gate.

7. Archive
   Working folder retains session history for audit and future reference.
```

Templates remain unchanged in `templates/`.

Each review cycle operates on copies within the numbered folder.

Nothing in `architecture-board/` replaces official `docs/` until explicitly promoted and approved.
