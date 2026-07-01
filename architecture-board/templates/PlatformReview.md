# Platform Review

## Purpose

Evaluate platform integration, service boundaries, API contracts, deployment constraints and technical stack alignment.

## Scope

Application layer, service orchestration, Express/React/TypeScript implementation direction, Railway deployment and cross-component integration.

## Required Inputs

| Input | Source |
|-------|--------|
| Completed Architecture Brief | Working folder |
| Domain Architecture Review | Working folder |
| System and API specifications | `docs/` |
| Service boundary diagrams | Session artifacts |

## Output Format

Completed review copied to working folder as `PlatformReview.md` with findings, risks and recommendations.

## Review Sections

### Platform Context

<!-- Components and services affected -->

### Service Boundary Assessment

<!-- Layer placement, dependencies, coupling -->

### API and Integration Impact

<!-- Endpoint changes, contract compatibility -->

### Stack Alignment

<!-- React, Express, TypeScript, Prisma, Railway compliance -->

### Deployment and Operations Impact

<!-- Railway-first constraints, monitoring, rollback -->

### Findings

| ID | Finding | Severity | Recommendation |
|----|---------|----------|----------------|
| PL-001 | | | |

### Risks

<!-- Platform-level risks if proposal proceeds unchanged -->

### Recommendations

<!-- Required changes before approval -->

## Approval / Status

| Field | Value |
|-------|-------|
| Status | Draft \| In Review \| Approved \| Rejected |
| Reviewer | |
| Review Date | |
| Consensus Required | Yes |

## Do Not

- Do not approve changes that violate service boundary rules.
- Do not treat platform recommendations as merged code.
- Do not skip Railway deployment impact assessment.
- Do not reference unapproved decisions as final.
