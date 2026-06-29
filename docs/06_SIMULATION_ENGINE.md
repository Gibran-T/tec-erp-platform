# TEC.ERP — Simulation Engine

**Document:** Simulation Engine  
**Version:** 1.0  
**Status:** Draft  
**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires  

---

# Purpose

This document defines how the TEC.ERP simulation engine evaluates student actions, calculates consequences, produces feedback and supports certification.

The objective is not to reproduce the full complexity of a commercial ERP.

The objective is to create a pedagogical simulation engine that teaches how ERP decisions affect business processes, departments, KPIs and certifications.

---

# Simulation Engine Philosophy

The simulation engine must support learning before automation.

Every rule must help the student understand:

- what happened;
- why it happened;
- which department was affected;
- which process was impacted;
- which KPI changed;
- what decision would improve the result.

The engine should never behave like a black box.

It must explain consequences clearly.

---

# Core Simulation Principles

## Principle 1 — Mission-Based Simulation

The simulation begins from a Business Mission.

The student is not evaluated only by clicking buttons.

The student is evaluated by how well they understand and complete the mission objective.

## Principle 2 — Decisions Create Consequences

Every meaningful student decision should produce a visible consequence.

Consequences may affect:

- score;
- KPIs;
- inventory;
- purchasing status;
- sales status;
- financial indicators;
- customer service;
- readiness;
- certification progress.

## Principle 3 — Simple Rules, Clear Feedback

Rules must remain simple enough to be understood by students.

Feedback must explain the business reason behind the result.

## Principle 4 — Traceability

Every attempt, decision, score, feedback and certification result must be traceable.

## Principle 5 — Progressive Complexity

The first modules use simple scoring and readiness logic.

Later modules introduce process integration, KPI impact and cross-module reasoning.

---

# Simulation Flow

Every Business Mission follows the same simulation flow.

```text
Mission Start
↓
Initial Business Context Loaded
↓
Student Reviews Inputs
↓
Student Performs Actions
↓
Student Makes Decision
↓
Engine Evaluates Decision
↓
Business Consequences Calculated
↓
KPIs Updated
↓
Feedback Generated
↓
Score Calculated
↓
Progress Updated
↓
Certification Eligibility Checked