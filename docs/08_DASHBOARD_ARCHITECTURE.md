# TEC.ERP — Dashboard Architecture

**Document:** Dashboard Architecture  
**Version:** 1.0  
**Status:** Draft  
**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires  

---

# Purpose

This document defines the dashboard architecture of TEC.ERP.

Dashboards are not decorative elements.

They are learning instruments.

Their role is to help students, professors and administrators understand progress, performance, risk, certification status and business consequences.

---

# Dashboard Philosophy

TEC.ERP dashboards must transform data into learning.

Every dashboard should answer at least one clear question:

- What is happening?
- What changed?
- What needs attention?
- What decision should be made?
- What does this mean for learning?
- What does this mean for certification?

Dashboards must be simple, visual and action-oriented.

---

# Dashboard Types

TEC.ERP Version 1 includes six dashboard categories:

1. Student Dashboard
2. Professor Dashboard
3. Mission Dashboard
4. Module Dashboard
5. Certification Dashboard
6. Cohort Analytics Dashboard

---

# 1. Student Dashboard

## Purpose

The Student Dashboard helps the learner understand their own progress.

It should answer:

- Which module am I in?
- Which missions are completed?
- What is my score?
- What should I review?
- Am I progressing toward Silver or Gold?

## Core Widgets

- Current module card
- Mission progress card
- Module score card
- Certification progress card
- Recent feedback card
- Recommended review areas
- KPI learning summary

---

# 2. Professor Dashboard

## Purpose

The Professor Dashboard helps the instructor guide the class.

It should answer:

- Who is progressing well?
- Who needs support?
- Which missions are difficult?
- What errors are common?
- Is the cohort ready for certification?

## Core Widgets

- Cohort progress overview
- Student progress table
- Mission completion heatmap
- Average module score
- Common error summary
- Certification readiness
- At-risk student indicators

---

# 3. Mission Dashboard

## Purpose

The Mission Dashboard summarizes the result of a Business Mission.

It should answer:

- Was the mission completed?
- What decision did the student make?
- What consequence occurred?
- Which KPI changed?
- What feedback was generated?

## Core Widgets

- Mission status
- Score breakdown
- Decision result
- KPI impact
- Feedback summary
- Next recommended action

---

# 4. Module Dashboard

## Purpose

The Module Dashboard summarizes learning progress across the three missions of a module.

It should answer:

- Are all missions complete?
- What was the average score?
- Which competency was developed?
- What needs review before moving forward?

## Core Widgets

- Module completion status
- Mission score comparison
- Competency progress
- Quiz result
- Module feedback
- Next module readiness

---

# 5. Certification Dashboard

## Purpose

The Certification Dashboard tracks Silver and Gold eligibility.

It should answer:

- Is the student eligible for Silver?
- Is the student eligible for Gold?
- Which requirements are missing?
- Has the certificate been awarded?
- Can the certificate be verified publicly?

## Silver Certification View

Silver tracks:

- M1 completion
- M2 completion
- average score
- readiness status
- master data competency
- certification eligibility

## Gold Certification View

Gold tracks:

- Silver prerequisite
- M3 to M10 completion
- module average
- Capstone result
- integrated recommendation
- certification eligibility

## Core Widgets

- Silver status card
- Gold status card
- requirement checklist
- certificate ID
- verification link
- LinkedIn credential action

---

# 6. Cohort Analytics Dashboard

## Purpose

The Cohort Analytics Dashboard supports teaching and institutional monitoring.

It should answer:

- How is the cohort performing?
- Which modules are strongest?
- Which modules are weakest?
- Where should the professor intervene?
- What is the overall certification outlook?

## Core Widgets

- cohort completion rate
- module average scores
- mission difficulty indicators
- certification forecast
- attendance or participation indicators
- common misunderstanding patterns
- cohort-level feedback summary

---

# KPI Categories

Dashboards should organize KPIs by category.

## Learning KPIs

- mission completion rate
- module score
- quiz score
- reflection quality
- certification progress

## Operational KPIs

- ERP readiness score
- data quality score
- purchase order accuracy
- sales order accuracy
- inventory availability
- supplier reliability
- customer service risk

## Financial KPIs

- accounts payable impact
- accounts receivable impact
- inventory value
- margin visibility
- revenue impact

## Governance KPIs

- role clarity
- approval compliance
- access risk
- process control score

## AI Learning KPIs

- recommendation quality
- bottleneck identification
- KPI interpretation accuracy
- AI-assisted reasoning improvement

---

# Dashboard Design Principles

## DB-001 — One Dashboard, One Purpose

Each dashboard must have a clear purpose.

Avoid mixing student learning, teacher analytics and institutional monitoring in the same view.

## DB-002 — Visual Hierarchy

The most important information must appear first.

Status and risk should be visible immediately.

## DB-003 — Actionable Insight

Dashboards should not only display data.

They should indicate what action or review is recommended.

## DB-004 — Minimal Noise

Avoid unnecessary charts, excessive numbers or decorative elements.

Only show indicators that support learning or decision-making.

## DB-005 — Traceability

Every score, KPI and certification status must be traceable to missions, decisions or rules.

## DB-006 — Consistent Language

Dashboard labels must use the same vocabulary as Business Missions and certification rules.

---

# Visual Components

TEC.ERP dashboards should use the following visual components:

## KPI Card

Used for single important indicators.

Examples:

- Module Score
- Readiness Score
- Data Quality
- Gold Progress

## Progress Bar

Used for completion and certification progress.

Examples:

- Missions completed
- Module completion
- Certification requirements

## Status Badge

Used for clear status communication.

Examples:

- Not Started
- In Progress
- Completed
- At Risk
- Eligible
- Awarded

## Score Breakdown

Used to explain performance.

Examples:

- Business understanding
- Process execution
- Decision quality
- KPI interpretation

## Heatmap

Used for professor and cohort views.

Examples:

- Mission difficulty
- Student progress
- common errors

## Checklist

Used for requirements.

Examples:

- Silver eligibility
- Gold eligibility
- data validation
- readiness conditions

## Feedback Panel

Used to explain results.

Examples:

- mission feedback
- module feedback
- AI coaching feedback
- certification feedback

---

# Student Dashboard Layout

Recommended structure:

```text
Header
↓
Current Certification Progress
↓
Current Module Progress
↓
Mission Cards
↓
Recent Feedback
↓
Recommended Review
↓
Learning KPIs