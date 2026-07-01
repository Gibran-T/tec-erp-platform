# LLM Review

## Purpose

Evaluate AI/LLM integration boundaries, provider independence, prompt governance, context safety and Enterprise Educational Intelligence alignment.

## Scope

Reasoning provider layer, Context Engine boundaries, Orchestrator strategies, EduQA validation, prompt templates and replaceable LLM principles.

## Required Inputs

| Input | Source |
|-------|--------|
| Completed Architecture Brief | Working folder |
| Platform and Knowledge reviews | Working folder |
| AI architecture specifications | `docs/` |
| Provider abstraction diagrams | Session artifacts |

## Output Format

Completed review copied to working folder as `LLMReview.md` with findings, risks and recommendations.

## Review Sections

### AI Context

<!-- AI components and provider interactions under review -->

### Provider Boundary Assessment

<!-- OpenAI as replaceable provider; no direct DB access -->

### Context and Orchestration Impact

<!-- Context Engine and Reasoning Orchestrator boundaries -->

### Prompt and Strategy Governance

<!-- Template versioning, strategy selection, answer-leak prevention -->

### EduQA and Safety Alignment

<!-- Validation pipeline, hallucination controls, fallback behaviour -->

### Findings

| ID | Finding | Severity | Recommendation |
|----|---------|----------|----------------|
| LL-001 | | | |

### Risks

<!-- LLM-level risks if proposal proceeds unchanged -->

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

- Do not treat the LLM as institutional intelligence.
- Do not approve direct provider-to-database access paths.
- Do not skip EduQA validation requirements for student-facing AI.
- Do not reference unapproved decisions as final.
