# Decision Architecture Record (DAR)

## Purpose

Document the architectural structure, component relationships and technical design resulting from an accepted decision.

## Scope

Technical architecture view complementing the ADR — components, interfaces, data flows and deployment topology.

## Required Inputs

| Input | Source |
|-------|--------|
| Accepted ADR | Working folder |
| Architecture Decision Package | Working folder |
| Platform and Knowledge reviews | Working folder |
| Architecture diagrams | Session artifacts |

## Output Format

Completed DAR copied to working folder as `DAR-NNN-<short-title>.md`.

## DAR Sections

### DAR Metadata

| Field | Value |
|-------|-------|
| DAR Number | DAR-NNN |
| Title | |
| Date | |
| Status | Draft \| Approved \| Deprecated |
| Linked ADR | ADR-NNN |
| Author | |

### Architecture Overview

<!-- High-level description of the resulting architecture -->

### Component Map

| Component | Responsibility | Layer |
|-----------|----------------|-------|
| | | |

### Interface Definitions

<!-- Key contracts, APIs, data packages -->

### Data Flow

<!-- How data moves between components -->

```text
<!-- Diagram or flow description -->
```

### Deployment Topology

<!-- Railway services, environment variables, dependencies -->

### Security Boundaries

<!-- Access controls, PII boundaries, audit points -->

### Validation Criteria

<!-- How to verify the architecture is correctly implemented -->

## Approval / Status

| Field | Value |
|-------|-------|
| Status | Draft \| Approved \| Deprecated |
| Approved By | |
| Approval Date | |
| Linked ADR | |

## Do Not

- Do not create a DAR without a linked accepted ADR.
- Do not include implementation code — describe architecture only.
- Do not treat Draft DARs as approved design.
- Do not reference unapproved decisions as final.
