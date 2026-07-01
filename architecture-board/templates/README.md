# TEC.ERP — Architecture Review Board Templates

## Purpose

This folder contains reusable markdown templates for Architecture Review Board (ARB) sessions.

Each template provides a standardized structure: purpose, scope, required inputs, output format, placeholder sections, approval status and constraints.

Templates are copied into numbered working folders (`architecture-board/30/` – `35/`) for each review cycle.

Templates in this folder remain pristine — working copies absorb session content.

---

## Template Index

| Template | Role |
|----------|------|
| `ArchitectureBrief.md` | Initiate ARB session — problem, scope, stakeholders |
| `DomainArchitecture.md` | Business domain and pedagogical architecture review |
| `PlatformReview.md` | Platform integration and service boundary review |
| `KnowledgeReview.md` | Data architecture and persistence review |
| `GovernanceReview.md` | Security, QA, compliance and Approval Gate review |
| `LLMReview.md` | AI/LLM boundary and provider independence review |
| `ArchitectureConsensusReport.md` | Consolidate all reviews into consensus |
| `ArchitectureDecisionPackage.md` | Package approved outcome for promotion |
| `ADR.md` | Record a single architectural decision |
| `DAR.md` | Document resulting technical architecture |

---

## Scope

These templates govern the ARB working process only.

They do not replace official documentation in `docs/`.

---

## Required Inputs (All Sessions)

| Input | Description |
|-------|-------------|
| Review topic | Defined in Architecture Brief |
| Target folder | `architecture-board/30/` – `35/` |
| Official doc references | Applicable `docs/` specifications |
| Stakeholder assignments | Reviewer roles per perspective |

---

## Output Format

Each completed template is saved in the target working folder with its standard filename.

Decision records use numbered filenames: `ADR-NNN-<title>.md`, `DAR-NNN-<title>.md`.

---

## Folder Organization

```text
architecture-board/
├── templates/     ← This folder (pristine templates)
├── 30/            ← Working area
├── 31/
├── 32/
├── 33/
├── 34/
└── 35/
```

---

## Artifact Lifecycle

```text
1. Copy templates → target folder
2. Complete ArchitectureBrief
3. Run perspective reviews (Domain, Platform, Knowledge, Governance, LLM)
4. Produce ArchitectureConsensusReport
5. Package outcome → ArchitectureDecisionPackage
6. Record → ADR + DAR
7. Promote approved content to docs/ (separate governed process)
8. Archive working folder
```

---

## Approval / Status

| Field | Value |
|-------|-------|
| Template Version | 1.0 |
| Status | Standardized |
| Last Updated | 2026 |

---

## Do Not

- Do not edit templates in place during a review session — copy first.
- Do not treat working artifacts as official `docs/` documents.
- Do not mark decisions as Accepted without ARB consensus.
- Do not reference unapproved decisions as final.
- Do not commit working folder content without Approval Gate authorization.
