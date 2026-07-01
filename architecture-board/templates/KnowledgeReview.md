# Knowledge Review

## Purpose

Evaluate data architecture, persistence model, Prisma schema alignment, knowledge retrieval patterns and institutional data integrity.

## Scope

PostgreSQL schema, Prisma models, data layer boundaries, AI context data flows and learning history persistence.

## Required Inputs

| Input | Source |
|-------|--------|
| Completed Architecture Brief | Working folder |
| Domain Architecture Review | Working folder |
| Database Schema specification | `docs/` |
| Entity relationship diagrams | Session artifacts |

## Output Format

Completed review copied to working folder as `KnowledgeReview.md` with findings, risks and recommendations.

## Review Sections

### Data Context

<!-- Entities and persistence concerns under review -->

### Schema Alignment Assessment

<!-- Consistency with official Database Schema -->

### Retrieval and Access Patterns

<!-- Query boundaries, Prisma responsibilities, read/write separation -->

### Data Integrity and Traceability

<!-- Audit trails, immutability rules, learning history -->

### AI Context Data Impact

<!-- Effect on Context Engine data requirements if applicable -->

### Findings

| ID | Finding | Severity | Recommendation |
|----|---------|----------|----------------|
| KN-001 | | | |

### Risks

<!-- Data-level risks if proposal proceeds unchanged -->

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

- Do not approve schema changes without migration impact assessment.
- Do not allow LLM or provider direct database access.
- Do not treat data recommendations as applied migrations.
- Do not reference unapproved decisions as final.
