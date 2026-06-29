# TEC.ERP — UI / UX Architecture

**Document:** UI / UX Architecture  
**Version:** 1.0  
**Status:** Draft  
**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires  

---

# Purpose

This document defines the user experience and interface architecture of TEC.ERP.

The objective is to create a professional, simple and pedagogically powerful ERP learning environment.

TEC.ERP must not look like a generic school portal.

It must feel like a modern enterprise system adapted for education.

The interface must help the student understand business processes, complete Business Missions, interpret consequences and progress toward certification.

The professor interface must help the instructor guide the class, monitor progress, identify learning difficulties and support cohort-level decisions.

---

# UI / UX Vision

TEC.ERP must combine three design worlds:

1. The clarity of modern enterprise ERP systems.
2. The guidance of a pedagogical simulation platform.
3. The simplicity required for a thirty-hour professional training program.

The design must be professional, calm and structured.

The student should feel that they are working inside a real business system.

At the same time, the interface must remain approachable and guided.

---

# Design Inspiration

TEC.ERP may be visually inspired by:

- SAP Fiori principles;
- Microsoft Dynamics enterprise navigation patterns;
- Oracle Redwood clarity and spacing;
- Odoo modular simplicity;
- modern learning dashboards;
- TEC.WMS validated pedagogical patterns.

TEC.ERP must not copy any commercial ERP interface.

It must use professional ERP design language while keeping its own institutional identity.

---

# Core UX Principle

The student never begins with a transaction.

The student begins with a Business Mission.

Every interface must support this principle.

A screen exists only if it helps the student:

- understand the business context;
- execute a mission;
- make a decision;
- interpret a consequence;
- receive feedback;
- progress toward certification.

---

# User Roles

TEC.ERP supports four primary user roles.

## Student

The student acts as a Junior ERP Analyst.

The student completes Business Missions, reviews dashboards, answers quizzes, receives feedback and progresses toward Silver and Gold certification.

## Professor

The professor acts as a business facilitator.

The professor monitors cohort progress, guides discussion, reviews common errors and supports certification validation.

## Administrator

The administrator manages cohorts, users, access, configuration and institutional records.

## Public Verifier

The public verifier accesses certificate verification pages without authentication.

This role is limited to certificate validation only.

---

# Experience Principles

## UX-001 — Mission First

The primary entry point is Mission Control.

Students should not start by choosing a module screen or transaction.

They should start by understanding the mission they need to solve.

## UX-002 — Context Before Form

Every form must be preceded by business context.

The student must understand why they are entering or validating information.

## UX-003 — Guided Complexity

The system must reveal complexity progressively.

M1 and M2 must feel simple and guided.

M3 to M8 introduce operational processes.

M9 and M10 introduce integrated analysis and decision-making.

## UX-004 — Business Language

The interface should use business language before technical language.

For example:

Use:

- customer request;
- purchasing need;
- stock risk;
- supplier reliability;
- readiness score.

Avoid starting with purely technical ERP terminology unless it is explained.

## UX-005 — Visible Consequences

Student actions must create visible consequences.

The interface should show how decisions affect:

- KPIs;
- process status;
- inventory;
- finance;
- customer service;
- readiness;
- certification progress.

## UX-006 — Teacher Visibility

The professor must always be able to understand what is happening in the cohort.

The teacher dashboard should prioritize:

- progress;
- risk;
- common mistakes;
- module completion;
- certification readiness.

## UX-007 — Minimal Cognitive Load

TEC.ERP must avoid visual overload.

Students should see only the information needed for the current mission.

Additional detail may be available, but not forced.

## UX-008 — Institutional Credibility

The interface must feel credible enough for a college, professional training environment and enterprise partner.

Design must be clean, stable and consistent.

---

# Global Navigation Model

TEC.ERP should use a stable navigation structure.

The recommended navigation is:

- Mission Control
- Modules
- Company
- Master Data
- Processes
- Dashboard
- Certifications
- Resources

For professors:

- Teacher Dashboard
- Cohorts
- Students
- Missions
- Analytics
- Certifications
- Settings

For administrators:

- Users
- Cohorts
- Access
- Documents
- Certificates
- System Configuration

---

# Progressive Navigation

Not all menu items should be equally visible from the beginning.

The platform should progressively unlock or highlight navigation areas according to the student’s journey.

## M1

Visible emphasis:

- Mission Control
- Company
- Process Map
- Readiness

## M2

Visible emphasis:

- Organization
- Master Data
- Data Quality

## M3

Visible emphasis:

- Purchasing
- Suppliers
- Inventory Impact

## M4

Visible emphasis:

- Sales
- Customers
- Delivery
- Revenue Impact

## M5

Visible emphasis:

- Supply Chain
- Inventory
- Replenishment
- Stock Risk

## M6

Visible emphasis:

- Finance
- Payables
- Receivables
- Financial Indicators

## M7

Visible emphasis:

- CRM
- Customer Service
- Cases
- Customer History

## M8

Visible emphasis:

- Roles
- Approvals
- Governance
- Access Risk

## M9

Visible emphasis:

- BI Dashboard
- KPI Analysis
- AI Coach
- Recommendations

## M10

Visible emphasis:

- Capstone
- Integrated Diagnosis
- Final Recommendation
- Gold Certification

---

# Core Layout Principles

## Page Layout

Each main page should follow a consistent structure:

1. Page title
2. Business context
3. Mission objective
4. Key data
5. Student action area
6. Decision area
7. KPI / consequence area
8. Feedback panel
9. Progress indicator

## Card-Based Design

Information should be organized in cards.

Cards should be used for:

- missions;
- KPIs;
- business objects;
- process steps;
- warnings;
- feedback;
- certification status.

## Dashboard Layout

Dashboards should be structured around questions.

Examples:

- What is happening?
- What changed?
- What needs attention?
- What decision should be made?
- What does this mean for certification?

## Forms

Forms must remain short and purposeful.

Every field should have a business reason.

Avoid long administrative forms in classroom flow.

## Tables

Tables should be used when comparison is necessary.

Examples:

- suppliers;
- products;
- customers;
- purchase orders;
- sales orders;
- inventory balances;
- student progress.

Tables must be readable and not overloaded.

---

# Mission Control

Mission Control is the main student entry point.

It shows:

- current module;
- current Business Missions;
- mission status;
- progress;
- score;
- certification track;
- next recommended action.

Mission Control must answer:

- Where am I?
- What should I do next?
- Why does this mission matter?
- How does this affect my progress?

---

# Mission Card

Each Business Mission should be represented by a mission card.

A mission card contains:

- mission ID;
- mission title;
- module;
- difficulty;
- estimated duration;
- business objective;
- status;
- score when completed;
- start or continue action.

Mission cards should not contain excessive text.

Detailed context appears after opening the mission.

---

# Mission Detail Page

The Mission Detail Page is the main learning workspace.

It should include:

## Mission Header

- mission title;
- module;
- estimated duration;
- difficulty;
- certification relevance;
- status.

## Business Context Panel

Explains the business situation.

This panel must appear before any action.

## Mission Objective

States what the student must accomplish.

## Input Data Area

Shows the data required for the mission.

Examples:

- company profile;
- product list;
- customer request;
- supplier options;
- stock levels;
- dashboard values.

## Action Area

Allows the student to execute the required ERP activity.

## Decision Area

Requires the student to make a business decision.

## Consequence Area

Shows the impact of the decision.

## Feedback Panel

Explains the result pedagogically.

## Completion Area

Shows score, progress and next step.

---

# End of Part 1/3