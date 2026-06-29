# TEC.ERP — UI Blueprint

**Document:** UI Blueprint  
**Version:** 1.0  
**Status:** Draft  
**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires

---

# 1. Purpose

This document defines the complete user interface blueprint for TEC.ERP Version 1.

It translates the Product Vision, Learning Blueprint, Functional Specification, UI/UX Architecture and Dashboard Architecture into concrete screens, layouts, navigation flows and component requirements.

The UI Blueprint is the reference document for UX design and React implementation.

---

# 2. UI Vision

TEC.ERP must feel like a professional ERP learning environment.

It should not feel like a generic LMS.

The interface must combine:

- enterprise credibility;
- pedagogical guidance;
- mission-based learning;
- dashboard visibility;
- certification clarity;
- simple navigation.

---

# 3. Design Direction

The interface follows a modern enterprise design language inspired by:

- SAP Fiori clarity;
- Microsoft Dynamics navigation logic;
- Oracle Redwood spacing;
- Odoo modular simplicity;
- TEC.WMS learning patterns.

TEC.ERP must preserve its own institutional identity.

---

# 4. Global Layout

Every authenticated page uses the same high-level structure.

```text
Top Navigation Bar
↓

Left Sidebar

↓

Main Content Area

↓

Contextual Right Panel

↓

Footer / System Status
```

---

# 5. Top Navigation Bar

The Top Navigation Bar contains:

- TEC.ERP logo
- active cohort
- active module
- certification progress shortcut
- notifications
- user menu

The top bar should remain visible across the authenticated experience.

---

# 6. Left Sidebar

The left sidebar contains primary navigation.

Student navigation:

- Home
- Mission Control
- Modules
- Company
- Processes
- Dashboard
- AI Coach
- Certifications
- Resources
- Profile

Professor navigation:

- Teacher Dashboard
- Cohorts
- Students
- Missions
- Analytics
- Certifications
- Reports
- Settings

Administrator navigation:

- Users
- Cohorts
- Configuration
- Certificates
- System
- Audit Logs

---

# 7. Main Content Area

The Main Content Area displays the current workspace.

It must support:

- dashboards;
- Business Missions;
- ERP workspaces;
- forms;
- tables;
- reports;
- certification screens;
- AI feedback.

The layout should remain calm, spacious and structured.

---

# 8. Contextual Right Panel

The Right Panel provides contextual guidance.

Possible contents:

- current mission summary;
- AI Coach suggestions;
- KPI explanations;
- next action;
- professor notes;
- certification requirements.

The Right Panel should support learning without distracting from the primary task.

---

# 9. Footer / System Status

The footer may display:

- platform status;
- version;
- last saved activity;
- support link;
- accessibility shortcut.

The footer remains minimal.

---

# 10. Page Design Principles

UI-001

Mission before menu.

UI-002

Business context before action.

UI-003

One primary action per screen.

UI-004

Visible progress.

UI-005

Consistent component behavior.

UI-006

Professional visual hierarchy.

UI-007

Reduced cognitive load.

UI-008

Accessible by design.

---

# End of Part 01/10
---

# 11. Student Home Page

The Student Home Page is the first page after student login.

Its purpose is to orient the student immediately.

The page must answer:

- Where am I in the program?
- What should I do next?
- What is my current progress?
- What certification am I working toward?
- What feedback should I review?

---

# 12. Student Home Layout

Recommended structure:

```text
Welcome Header
↓

Current Module Card
↓

Next Mission Card
↓

Certification Progress

↓

Recent Feedback

↓

Recommended Review
```

---

# 13. Welcome Header

Displays:

- student name;
- cohort name;
- current date;
- current program;
- short welcome message.

The message should reinforce the student identity as a Junior ERP Business Analyst.

---

# 14. Current Module Card

Displays:

- module code;
- module title;
- module status;
- module progress;
- module score when available;
- certification track.

Primary action:

Continue module.

---

# 15. Next Mission Card

Displays:

- next mission ID;
- mission name;
- estimated duration;
- difficulty;
- business objective.

Primary action:

Start Mission or Continue Mission.

---

# 16. Certification Progress Section

Displays:

Silver:

- M1 status;
- M2 status;
- eligibility status.

Gold:

- Silver prerequisite;
- M3–M10 progress;
- Capstone status;
- eligibility status.

Certification should be visible but not visually dominant.

Learning remains the main experience.

---

# 17. Recent Feedback Section

Displays the most recent feedback from:

- Business Mission completion;
- module assessment;
- AI Coach;
- professor notes.

Each feedback card should show:

- source;
- short summary;
- related module;
- recommended action.

---

# 18. Recommended Review Section

Displays learning areas that require attention.

Examples:

- Review master data quality.
- Revisit supplier selection logic.
- Improve KPI interpretation.
- Complete pending reflection.

Recommendations must be actionable.

---

# 19. Student Home UI Rules

HOME-001

The page must not overload the student.

HOME-002

Only current priorities are displayed.

HOME-003

Certification progress is visible but secondary.

HOME-004

The next learning action is always clear.

HOME-005

Feedback is summarized, not overwhelming.

---

# End of Part 02/10
---

# 20. Mission Control

Mission Control is the operational heart of TEC.ERP.

Every Business Mission starts here.

Mission Control provides students with complete visibility of their current learning journey.

---

# 21. Mission Control Layout

```text
Mission Header
↓

Current Module Overview

↓

Business Mission Timeline

↓

Mission Cards

↓

Progress Summary

↓

Continue Button
```

The page should immediately communicate where the student is in the program.

---

# 22. Mission Header

Displays:

- Module Code
- Module Name
- Current Business Mission
- Estimated Remaining Time
- Current Competency
- Certification Track

The header remains fixed while navigating Mission Control.

---

# 23. Module Overview Card

Displays:

- module objective;
- competencies developed;
- related departments;
- ERP domains involved;
- expected outcomes.

Students should understand why the module exists before starting any mission.

---

# 24. Business Mission Timeline

The timeline visually represents the three Business Missions.

Example:

```text
Mission 1
↓

Mission 2
↓

Mission 3
↓

Quiz

↓

Reflection

↓

Module Complete
```

Completed items display a success indicator.

Current activities remain highlighted.

Future activities remain locked.

---

# 25. Business Mission Cards

Each Business Mission Card displays:

- Mission ID
- Mission Title
- Business Context
- Estimated Duration
- Difficulty
- Competency
- Current Status

Primary Action:

Start Mission

or

Continue Mission

Completed missions display:

View Summary

instead of

Start Mission.

---

# 26. Progress Summary

Displays:

- mission completion percentage;
- average mission score;
- competency progression;
- dashboard availability;
- quiz readiness;
- reflection status.

Students should immediately understand module progress.

---

# 27. Continue Learning Section

The final section recommends the next activity.

Possible actions:

- Continue Mission
- Review Feedback
- Complete Reflection
- Start Quiz
- Open Dashboard
- Continue Next Module

Only one recommendation should appear at a time.

---

# 28. Mission Control UX Principles

MISSION-001

One clear next action.

MISSION-002

Visible learning progression.

MISSION-003

Minimal navigation.

MISSION-004

Business context before execution.

MISSION-005

Professional appearance.

MISSION-006

Consistent visual hierarchy.

---

# 29. Mission Card States

Every Mission Card supports the following states:

Locked

Available

In Progress

Completed

Needs Review

Validated

Each state uses a consistent badge system across the platform.

---

# 30. Mission Control Completion Criteria

Mission Control is complete when students can:

- understand the module;
- visualize progression;
- access Business Missions;
- monitor competency growth;
- identify the next required activity;
- continue learning without confusion.

Mission Control should become the operational center of the entire platform.

---

# End of Part 03/10
---

# 31. Business Mission Screen

The Business Mission Screen is the core operational screen of TEC.ERP.

Every Business Mission uses the same layout regardless of module.

Students should immediately recognize where information is located.

---

# 32. Business Mission Layout

```text
Mission Header
↓

Business Context

↓

Mission Objective

↓

Business Information

↓

ERP Workspace

↓

Decision Panel

↓

Business Consequences

↓

Feedback

↓

Mission Progress
```

The screen should support focus and structured decision-making.

---

# 33. Mission Header

Displays:

- Mission ID
- Mission Title
- Module
- Estimated Duration
- Difficulty
- Competency
- Current Status

A breadcrumb navigation should remain visible.

Example:

Home

>

Mission Control

>

M3

>

Mission 02

---

# 34. Business Context Section

Appears at the top of every Business Mission.

Displays:

- enterprise situation;
- departments involved;
- operational problem;
- expected outcome.

Students should understand the situation before interacting with the ERP.

---

# 35. Mission Objective Section

Displays:

- primary objective;
- expected deliverable;
- success criteria.

Objectives should remain concise.

---

# 36. Business Information Section

Contains operational information required for the mission.

Examples:

- customers;
- suppliers;
- products;
- inventory;
- purchase requests;
- dashboards;
- KPIs;
- reports.

Business information should use reusable cards and data tables.

---

# 37. ERP Workspace

The ERP Workspace is where students perform actions.

Examples:

- select records;
- validate data;
- approve requests;
- analyse reports;
- update information.

The interface should prioritize clarity over realism.

Students are learning business processes, not memorizing software clicks.

---

# 38. Decision Panel

Every Business Mission ends with a business decision.

The Decision Panel presents:

- available alternatives;
- expected consequences;
- related KPIs;
- affected departments.

Students should think before confirming.

---

# 39. Consequence Panel

Immediately after confirmation, the platform displays:

- business impact;
- process impact;
- KPI variation;
- operational consequence;
- learning explanation.

Students should clearly understand cause and effect.

---

# 40. Mission Feedback Section

Displays:

- score;
- competency achieved;
- strengths;
- improvement opportunities;
- AI Coach observations;
- professor notes (when available).

Feedback should reinforce learning rather than simply evaluate performance.

---

# 41. Mission Completion Banner

Upon successful completion, display:

Mission Completed

with:

- score;
- competency update;
- certification progress;
- next recommendation.

Students should experience a sense of professional achievement.

---

# 42. Business Mission UX Principles

MISSION-UI-001

Business first.

MISSION-UI-002

One decision at a time.

MISSION-UI-003

Immediate consequences.

MISSION-UI-004

Visible progress.

MISSION-UI-005

Professional language.

MISSION-UI-006

Consistent layouts across all modules.

---

# End of Part 04/10
---

# 43. Dashboard Pages

Dashboards transform operational activities into business intelligence.

Each dashboard should answer a business question rather than simply display data.

Dashboards should support decision-making.

---

# 44. Student Dashboard

Purpose

Help students understand their learning performance.

Sections

Learning Summary

↓

Current Module

↓

Competencies

↓

Mission Scores

↓

KPIs

↓

Certification Progress

↓

Recommended Actions

The dashboard should motivate continuous improvement.

---

# 45. Professor Dashboard

Purpose

Provide complete classroom visibility.

Sections

Class Summary

↓

Student Progress

↓

Module Performance

↓

Competency Heatmap

↓

Certification Status

↓

AI Learning Insights

↓

Intervention Recommendations

Professors should immediately identify students requiring support.

---

# 46. Executive Dashboard

Purpose

Support institutional management.

Displays:

- active cohorts;
- completion rate;
- certification rate;
- professor workload;
- platform usage;
- learning analytics.

Executive information remains aggregated.

No individual learning details are emphasized.

---

# 47. Dashboard Components

Reusable dashboard components include:

- KPI Card
- Progress Card
- Analytics Card
- Certification Card
- Competency Card
- Heatmap
- Timeline
- Score Chart
- Recommendation Panel
- AI Insight Panel

Components should remain consistent throughout the platform.

---

# 48. KPI Cards

Each KPI Card displays:

- KPI Name
- Current Value
- Previous Value
- Trend
- Business Meaning
- Related Module

Color should communicate status without becoming the primary source of meaning.

---

# 49. Analytics Panels

Analytics Panels summarize:

- operational performance;
- learning performance;
- competency development;
- certification readiness.

Students should understand the meaning behind every metric.

---

# 50. AI Insight Panel

The AI Insight Panel summarizes:

- learning observations;
- competency trends;
- suggested reviews;
- recommended Business Missions.

Insights remain advisory.

Students retain decision autonomy.

---

# 51. Dashboard UX Principles

DASH-001

Every dashboard answers a business question.

DASH-002

Information before decoration.

DASH-003

KPIs support decisions.

DASH-004

Progress remains visible.

DASH-005

Recommendations are actionable.

DASH-006

Analytics reinforce learning.

---

# 52. Dashboard Completion Criteria

Dashboard implementation is complete when:

- KPIs update automatically;
- analytics remain accurate;
- recommendations are contextual;
- certification progress is synchronized;
- navigation remains intuitive.

Dashboards should become decision-support tools rather than reporting pages.

---

# End of Part 05/10
---

# 53. AI Coach Interface

The AI Coach is available throughout the platform.

Its interface should feel like an experienced ERP mentor rather than a chatbot.

Students interact with the AI naturally while remaining inside their Business Mission.

---

# 54. AI Coach Layout

```text
Conversation Header

↓

Current Business Context

↓

Student Question

↓

AI Guidance

↓

Reflection Prompt

↓

Suggested Resources
```

The AI panel should never replace the Business Mission.

It complements learning.

---

# 55. AI Coach Header

Displays:

- AI Coach
- Current Module
- Current Mission
- Current Competency

Quick actions:

- Explain Concept
- Explain KPI
- Explain Process
- Ask for Hint
- Review My Decision

---

# 56. Context Panel

Before answering, the AI always displays the current learning context.

Context includes:

- module;
- mission;
- department;
- business process;
- competency;
- current objective.

The AI should always understand where the student is.

---

# 57. Conversation Area

The conversation window displays:

Student Question

↓

AI Explanation

↓

Business Relationship

↓

Reflection Question

↓

Suggested Review

Messages should remain concise and educational.

---

# 58. Suggested Resources

The AI may recommend:

- module review;
- Business Mission review;
- glossary entries;
- dashboard analysis;
- competency reinforcement.

Recommendations should always be directly related to the current mission.

---

# 59. Reflection Prompts

At the end of each AI interaction, one reflection question should appear.

Examples:

- Why is this process important?
- Which department benefits?
- Which KPI would change?
- What alternative decision exists?

Reflection reinforces long-term learning.

---

# 60. AI UX Principles

AI-UI-001

The AI guides rather than solves.

AI-UI-002

Business language before technical language.

AI-UI-003

Context-aware responses.

AI-UI-004

Minimal interface.

AI-UI-005

Professional tone.

AI-UI-006

Reflection concludes every interaction.

---

# 61. AI Coach Completion Criteria

The AI Coach interface is complete when students can:

- ask contextual questions;
- receive business-oriented guidance;
- understand ERP concepts;
- review decisions;
- continue learning without leaving the mission.

The AI should feel like an intelligent business mentor integrated into TEC.ERP.

---

# End of Part 06/10
---

# 62. Certification Pages

Certification Pages celebrate professional achievement while providing institutional credibility.

Every certification page should feel official, trustworthy and career-oriented.

The design should resemble a professional credential portal rather than a learning completion screen.

---

# 63. Certification Home

The Certification Home summarizes certification progress.

Sections:

Certification Progress

↓

Silver Status

↓

Gold Status

↓

Requirements

↓

Earned Certificates

↓

Professional Sharing

Students should immediately understand where they are in the certification journey.

---

# 64. Silver Certification Page

Purpose

Present the first institutional achievement.

Displays:

- Silver status
- completed modules
- competencies achieved
- issue date
- certificate ID
- verification status
- QR Code
- LinkedIn button
- Download PDF

If Silver has not yet been earned, the page displays remaining requirements.

---

# 65. Gold Certification Page

Purpose

Present the final institutional credential.

Displays:

- Gold status
- completed modules
- Capstone completion
- competencies achieved
- issue date
- certificate ID
- verification URL
- QR Code
- LinkedIn integration
- Download PDF

Gold represents completion of the full learning journey.

---

# 66. Public Verification Page

Public users access this page without authentication.

Displayed information:

- Student Name
- Certification
- Institution
- Program
- Certificate ID
- Issue Date
- Verification Status

The page should emphasize authenticity while protecting personal information.

---

# 67. Certificate Preview

Certificate Preview displays:

- certificate image;
- verification QR Code;
- institutional signature;
- official seal;
- credential metadata.

Preview should closely match the generated PDF.

---

# 68. Professional Sharing

Students may share credentials using:

- LinkedIn
- PDF Download
- Verification URL
- QR Code

Professional sharing should require minimal effort.

---

# 69. Certification UX Principles

CERT-001

Institutional appearance.

CERT-002

Professional credibility.

CERT-003

Simple verification.

CERT-004

Career-oriented presentation.

CERT-005

Accessible credential information.

CERT-006

Clear progression from Silver to Gold.

---

# 70. Certification Completion Criteria

Certification Pages are complete when students can:

- monitor certification progress;
- understand eligibility;
- access certificates;
- verify credentials;
- share achievements professionally.

Certification should become a valuable professional asset beyond the classroom.

---

# End of Part 07/10
---

# 71. Teacher Portal

The Teacher Portal is the operational center for professors.

It provides complete visibility into cohort progress, learning analytics and certification readiness.

The interface should enable instructional decisions with minimal navigation.

---

# 72. Teacher Dashboard Layout

```text
Teaching Summary

↓

Cohort Cards

↓

Student Progress

↓

Learning Analytics

↓

Certification Status

↓

Recommended Interventions
```

The dashboard should immediately identify students requiring attention.

---

# 73. Cohort Management

Professors may:

- view active cohorts;
- create cohorts;
- archive completed cohorts;
- monitor enrollment;
- review participation.

Each cohort displays:

- number of students;
- average progress;
- certification statistics;
- current module.

---

# 74. Student Progress Page

Displays:

- student profile;
- completed modules;
- Business Mission status;
- competency progression;
- average score;
- certification status;
- AI learning observations.

The page should support individualized academic guidance.

---

# 75. Mission Review

Professors can review every completed Business Mission.

Information includes:

- submitted decision;
- score;
- KPI impact;
- reflection;
- AI feedback;
- validation status.

Mission review should reinforce instructional quality.

---

# 76. Learning Analytics

Learning Analytics displays:

- module averages;
- competency heatmaps;
- common errors;
- completion trends;
- engagement indicators.

Analytics should help professors adjust classroom instruction.

---

# 77. Intervention Center

The Intervention Center recommends actions such as:

- contact student;
- review module;
- assign additional practice;
- schedule coaching;
- revisit classroom concepts.

Recommendations remain advisory.

The professor makes the final decision.

---

# 78. Teacher UX Principles

TEACHER-001

Classroom management first.

TEACHER-002

Minimal navigation.

TEACHER-003

Actionable analytics.

TEACHER-004

Evidence-based recommendations.

TEACHER-005

Consistent workflow.

TEACHER-006

Institutional appearance.

---

# 79. Teacher Portal Completion Criteria

The Teacher Portal is complete when professors can:

- manage cohorts;
- monitor students;
- review Business Missions;
- analyse competencies;
- validate certifications;
- support student success efficiently.

The portal should become the professor's primary operational workspace.

---

# End of Part 08/10
---

# 80. Administrator Portal

The Administrator Portal manages the institutional operation of TEC.ERP.

It is intended for platform administrators rather than professors.

Its objective is to configure, maintain and supervise the platform.

---

# 81. Administrator Dashboard

The Administrator Dashboard provides a global overview.

Sections:

Platform Status

↓

Users

↓

Cohorts

↓

System Health

↓

Certification Registry

↓

Audit Logs

↓

Configuration

The dashboard should present operational information rather than educational details.

---

# 82. User Management

Administrators manage:

- students;
- professors;
- administrators;
- roles;
- permissions;
- account status.

Each user profile displays:

- name;
- role;
- institution;
- cohort;
- account status;
- last access.

---

# 83. Cohort Administration

Administrators may:

- create cohorts;
- archive cohorts;
- duplicate cohorts;
- assign professors;
- configure module availability;
- define academic periods.

Cohort management should remain independent from learning records.

---

# 84. Certification Registry

The Certification Registry contains:

- Silver certificates;
- Gold certificates;
- certificate IDs;
- verification status;
- issue dates;
- public verification links.

Administrators may regenerate certificates when institutionally required.

Certification history must remain immutable.

---

# 85. Audit Center

The Audit Center records:

- authentication events;
- administrative actions;
- certification generation;
- professor validations;
- configuration changes;
- deployment history.

Audit information supports institutional governance.

---

# 86. System Configuration

Configuration areas include:

- academic calendar;
- grading thresholds;
- certification rules;
- AI configuration;
- notification settings;
- platform branding.

Configuration changes should require administrator authorization.

---

# 87. Administrator UX Principles

ADMIN-001

Operational efficiency.

ADMIN-002

Clear system visibility.

ADMIN-003

Safe configuration.

ADMIN-004

Traceable actions.

ADMIN-005

Minimal operational risk.

ADMIN-006

Institutional consistency.

---

# 88. Administrator Portal Completion Criteria

The Administrator Portal is complete when administrators can:

- manage users;
- manage cohorts;
- supervise certifications;
- configure the platform;
- review audits;
- maintain institutional operations.

The portal should support long-term platform administration.

---

# End of Part 09/10
---

# 89. Design System

TEC.ERP follows a unified enterprise Design System.

Every screen should reuse the same visual language.

The Design System promotes:

- consistency;
- maintainability;
- accessibility;
- scalability;
- institutional identity.

No module should introduce a different interface style.

---

# 90. Visual Hierarchy

Every page follows the same hierarchy.

Page Title

↓

Business Context

↓

Primary Workspace

↓

Decision Area

↓

Feedback

↓

Progress

Users should immediately recognize the importance of each section.

---

# 91. Component Library

Reusable components include:

Navigation

- Top Navigation Bar
- Sidebar
- Breadcrumb
- Tabs

Business Components

- Mission Card
- KPI Card
- Dashboard Card
- Competency Card
- Certification Card
- Process Card

Data Components

- Table
- Data Grid
- Timeline
- Heatmap
- Progress Bar
- Status Badge

Interaction Components

- Modal
- Drawer
- Toast
- Confirmation Dialog
- AI Coach Panel

The component library should minimize duplicated UI development.

---

# 92. Responsive Design

Primary target:

Desktop and Laptop.

Secondary target:

Tablet.

Mobile devices support:

- dashboards;
- certificate verification;
- AI Coach consultation;
- progress review.

Business Mission execution remains desktop-first.

---

# 93. Accessibility Standards

TEC.ERP should follow WCAG-aligned accessibility principles.

Requirements include:

- keyboard navigation;
- visible focus states;
- screen reader compatibility;
- sufficient color contrast;
- scalable typography;
- meaningful icons.

Accessibility should be considered from the first implementation.

---

# 94. Visual Identity

The platform should communicate professionalism.

Primary characteristics:

- clean layouts;
- generous spacing;
- subtle elevation;
- restrained color palette;
- institutional typography;
- enterprise iconography.

Visual simplicity should reinforce confidence.

---

# 95. UI Consistency Rules

UI-CONS-001

Every page follows the same layout structure.

UI-CONS-002

Every Business Mission uses the same navigation logic.

UI-CONS-003

Buttons remain consistent.

UI-CONS-004

Cards remain reusable.

UI-CONS-005

Terminology remains identical across modules.

UI-CONS-006

Feedback always appears in the same location.

UI-CONS-007

Progress indicators remain consistent.

---

# 96. UX Success Criteria

The interface succeeds when users can immediately answer:

- Where am I?
- What should I do?
- Why am I doing this?
- What happens next?
- How am I progressing?

These five questions guide every screen.

---

# 97. UI Blueprint Governance

Future UI evolution should remain aligned with:

- Product Vision;
- Learning Philosophy;
- Learning Blueprint;
- ERP Functional Specification.

No visual redesign should compromise educational clarity.

---

# 98. Official UI Declaration

This UI Blueprint defines the official user experience for TEC.ERP Version 1.

Every implementation in React, Tailwind CSS and future frontend technologies should follow this document.

It serves as the primary UX reference for:

- Product Design;
- UX Design;
- Frontend Development;
- Quality Assurance;
- Educational Validation.

---

# 99. Closing Statement

TEC.ERP is designed to make ERP learning intuitive, professional and engaging.

The interface should never distract from business thinking.

Instead, it should help students understand how organizations operate, collaborate and make informed decisions.

The UI exists to make complex enterprise concepts simple without making them simplistic.

---

**Document Status:** UI Blueprint Complete

**Version:** 1.0

**Approval Status:** Foundation UX Complete

**Next Official Document:** 17_DATABASE_SCHEMA.md

---

# End of UI Blueprint
