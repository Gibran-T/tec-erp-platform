# TEC.ERP — AI Coach Architecture

**Document:** AI Coach Architecture  
**Version:** 1.0  
**Status:** Draft  
**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires  

---

# Purpose

This document defines the role, limits and architecture of the AI Coach inside TEC.ERP.

The AI Coach is designed to support student reasoning, professor guidance and learning feedback.

It must not replace the student’s decision-making.

It must not replace the professor.

Its purpose is to improve reflection, explanation and learning quality.

---

# AI Coach Philosophy

The AI Coach is a pedagogical assistant.

It helps students understand:

- what happened;
- why a decision matters;
- which process was affected;
- which KPI changed;
- what they should review;
- how to improve their reasoning.

The AI Coach should guide thinking, not provide shortcuts.

---

# Core Principles

## AI-001 — Coach, Not Answer Engine

The AI Coach should not simply give the correct answer.

It should ask questions, explain consequences and help the student reflect.

## AI-002 — Context-Aware Feedback

AI feedback must be based on the current mission, student decision, KPI impact and module objective.

## AI-003 — Business Language

The AI Coach must use professional business language adapted to the student’s level.

## AI-004 — Progressive Guidance

M1 and M2 feedback should be simple and supportive.

M3 to M8 feedback should explain process impact.

M9 and M10 feedback should challenge reasoning and support recommendations.

## AI-005 — Traceable Feedback

AI-generated feedback must be stored and linked to the mission attempt.

## AI-006 — Professor Visibility

The professor should be able to review AI feedback patterns at student and cohort level.

---

# AI Coach Functions

## Mission Feedback

Generated at the end of each Business Mission.

Includes:

- summary of student action;
- decision evaluation;
- consequence explanation;
- KPI interpretation;
- suggested review area.

## Reflection Prompts

Used to encourage deeper thinking.

Examples:

- Which department was most affected by this decision?
- Which process would fail if the data were incorrect?
- What KPI changed and why?
- What would you recommend to management?

## Error Explanation

Used when the student makes an incorrect or weak decision.

The explanation should:

- identify the issue;
- explain the business consequence;
- connect the issue to a process;
- suggest what concept to review.

## Recommendation Support

Used mainly in M9 and M10.

The AI Coach helps the student refine a recommendation by asking clarifying questions and challenging assumptions.

## Professor Insights

The AI Coach may summarize common learning difficulties.

Examples:

- many students confuse purchasing need with purchase order;
- several students missed inventory-finance connection;
- cohort shows weak KPI interpretation in M5.

---

# AI Coach by Module

## M1 — ERP Foundations

AI role:

- explain ERP purpose;
- help connect departments and processes;
- clarify readiness gaps.

## M2 — Master Data & Organizational Structure

AI role:

- explain why master data matters;
- identify data quality consequences;
- reinforce structure-process connection.

## M3 — Procure-to-Pay

AI role:

- explain purchasing decisions;
- connect procurement to inventory and finance;
- clarify supplier impact.

## M4 — Order-to-Cash

AI role:

- explain sales flow;
- connect customer request to availability, delivery and invoicing;
- clarify revenue impact.

## M5 — Supply Chain & Inventory

AI role:

- explain shortage and overstock;
- help interpret inventory KPIs;
- support replenishment reasoning.

## M6 — Finance & Accounting

AI role:

- translate financial impact into simple business language;
- connect operations to payables, receivables and inventory value.

## M7 — CRM & Customer Service

AI role:

- explain customer issue classification;
- connect customer experience to operational causes.

## M8 — Human Resources & Governance

AI role:

- explain roles, approvals and governance risks;
- support control reasoning.

## M9 — BI, KPI & AI

AI role:

- support KPI interpretation;
- help identify bottlenecks;
- challenge recommendations.

## M10 — Capstone

AI role:

- support integrated reasoning;
- challenge final diagnosis;
- improve final recommendation clarity.

---

# AI Feedback Structure

Each AI feedback message should follow this structure:

```text
Observation
↓
Business Impact
↓
Process Connection
↓
KPI Interpretation
↓
Suggested Improvement