# Architecture Decision Package

## Purpose

Package approved ARB outcomes into a structured deliverable ready for ADR/DAR recording and optional promotion to official documentation.

## Scope

One approved consensus outcome with implementation guidance, dependencies and promotion checklist.

## Required Inputs

| Input | Source |
|-------|--------|
| Approved Architecture Consensus Report | Working folder |
| All perspective reviews | Working folder |
| Architecture Brief | Working folder |

## Output Format

Completed package copied to working folder as `ArchitectureDecisionPackage.md`.

## Package Sections

### Decision Summary

<!-- One-paragraph summary of the approved architectural direction -->

### Decision Details

<!-- Structured description of what was decided -->

### Implementation Guidance

<!-- High-level direction for engineering — not implementation code -->

### Dependencies

<!-- Upstream and downstream components affected -->

### Documentation Impact

<!-- Which official `docs/` documents require updates upon promotion -->

### Testing and Validation Requirements

<!-- Evidence required before Approval Gate -->

### Rollback Considerations

<!-- How to revert if the decision proves incorrect -->

### Promotion Checklist

| Step | Status |
|------|--------|
| ADR/DAR recorded | ☐ |
| Official docs updated | ☐ |
| Engineering backlog updated | ☐ |
| Approval Gate scheduled | ☐ |

## Approval / Status

| Field | Value |
|-------|-------|
| Status | Draft \| In Review \| Approved \| Rejected |
| Package Author | |
| Approval Date | |
| Linked Consensus Report | |

## Do Not

- Do not include implementation code in the decision package.
- Do not promote to `docs/` without explicit Approval Gate authorization.
- Do not treat the package as an official document until promoted.
- Do not reference unapproved decisions as final.
