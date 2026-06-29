# TEC.ERP — Data Model

**Document:** Data Model  
**Version:** 1.0  
**Status:** Draft  
**Project:** TEC.ERP — Analyste ERP et Processus d'Affaires  

---

# Purpose

This document defines the core business objects required to support the TEC.ERP learning platform.

The objective is not to design the final database schema yet.

The objective is to define the business entities that must exist in the system so the Business Missions, simulations, dashboards and certifications can operate consistently.

---

# Data Model Philosophy

TEC.ERP data must support learning.

Every object must exist because it helps the student understand a business process, execute a mission, analyse a consequence or receive certification feedback.

The data model must remain simple, modular and extensible.

---

# Core Entity Groups

The TEC.ERP data model is organized into nine groups:

1. Organization
2. People and Access
3. Master Data
4. Procurement
5. Sales
6. Supply Chain and Inventory
7. Finance
8. Learning and Assessment
9. Certification and Cohorts

---

# 1. Organization

## Company

Represents the simulated enterprise used throughout the course.

Core fields:

- company_id
- company_name
- industry
- description
- status

## Business Unit

Represents a major operational division inside the company.

Core fields:

- business_unit_id
- company_id
- name
- function
- status

## Department

Represents a department involved in ERP processes.

Core fields:

- department_id
- company_id
- business_unit_id
- name
- responsibility
- status

## Location

Represents physical or operational company locations.

Core fields:

- location_id
- company_id
- name
- type
- address
- status

---

# 2. People and Access

## User

Represents a student, professor, administrator or simulated employee.

Core fields:

- user_id
- name
- email
- role
- cohort_id
- status

## ERP Role

Represents a business role inside the ERP environment.

Core fields:

- erp_role_id
- name
- description
- access_level
- status

## Permission

Represents what a role can access or execute.

Core fields:

- permission_id
- erp_role_id
- module
- action
- status

## Approval Rule

Represents approval logic used in governance and business processes.

Core fields:

- approval_rule_id
- process
- threshold
- approver_role
- status

---

# 3. Master Data

## Product

Represents goods or services used in ERP processes.

Core fields:

- product_id
- sku
- name
- category
- unit_of_measure
- standard_cost
- sales_price
- status

## Customer

Represents a customer record.

Core fields:

- customer_id
- name
- customer_type
- payment_terms
- credit_limit
- status

## Supplier

Represents a supplier record.

Core fields:

- supplier_id
- name
- supplier_type
- lead_time_days
- payment_terms
- reliability_score
- status

## Unit of Measure

Represents measurement units used for products and inventory.

Core fields:

- uom_id
- code
- description
- status

## Price List

Represents sales pricing information.

Core fields:

- price_list_id
- product_id
- customer_type
- price
- effective_date
- status

---

# 4. Procurement

## Purchase Request

Represents an internal request to purchase goods or services.

Core fields:

- purchase_request_id
- requested_by
- department_id
- product_id
- quantity
- reason
- status

## Purchase Order

Represents a formal purchasing commitment to a supplier.

Core fields:

- purchase_order_id
- supplier_id
- product_id
- quantity
- unit_price
- expected_delivery_date
- status

## Goods Receipt

Represents receipt of goods from a supplier.

Core fields:

- goods_receipt_id
- purchase_order_id
- product_id
- expected_quantity
- received_quantity
- receipt_date
- discrepancy_status

## Supplier Invoice

Represents the supplier invoice linked to procurement.

Core fields:

- supplier_invoice_id
- supplier_id
- purchase_order_id
- amount
- invoice_date
- payment_status
- status

---

# 5. Sales

## Sales Request

Represents a customer request before a confirmed order.

Core fields:

- sales_request_id
- customer_id
- product_id
- requested_quantity
- requested_date
- status

## Sales Order

Represents a confirmed customer order.

Core fields:

- sales_order_id
- customer_id
- product_id
- quantity
- unit_price
- promised_date
- status

## Delivery

Represents the delivery of goods to the customer.

Core fields:

- delivery_id
- sales_order_id
- product_id
- ordered_quantity
- delivered_quantity
- delivery_date
- status

## Customer Invoice

Represents invoicing after sales delivery.

Core fields:

- customer_invoice_id
- customer_id
- sales_order_id
- amount
- invoice_date
- payment_status
- status

---

# 6. Supply Chain and Inventory

## Warehouse

Represents an inventory storage location.

Core fields:

- warehouse_id
- location_id
- name
- capacity
- status

## Inventory Balance

Represents current stock by product and warehouse.

Core fields:

- inventory_balance_id
- product_id
- warehouse_id
- quantity_on_hand
- quantity_reserved
- quantity_available
- inventory_value

## Inventory Movement

Represents stock movement caused by business activity.

Core fields:

- inventory_movement_id
- product_id
- warehouse_id
- movement_type
- quantity
- source_document
- movement_date

## Replenishment Recommendation

Represents a suggested supply chain action.

Core fields:

- recommendation_id
- product_id
- current_stock
- reorder_point
- recommended_quantity
- priority
- status

---

# 7. Finance

## Journal Entry

Represents financial impact generated by ERP activity.

Core fields:

- journal_entry_id
- source_document
- account
- debit
- credit
- entry_date
- status

## Account Payable

Represents money owed to suppliers.

Core fields:

- ap_id
- supplier_invoice_id
- supplier_id
- amount
- due_date
- payment_status

## Account Receivable

Represents money owed by customers.

Core fields:

- ar_id
- customer_invoice_id
- customer_id
- amount
- due_date
- payment_status

## Financial Indicator

Represents simple financial KPIs used for learning.

Core fields:

- financial_indicator_id
- name
- value
- period
- source_module
- status

---

# 8. Learning and Assessment

## Module

Represents one course module.

Core fields:

- module_id
- module_code
- title
- sequence
- certification_track
- status

## Business Mission

Represents one learning mission.

Core fields:

- mission_id
- module_id
- mission_code
- title
- objective
- estimated_duration
- difficulty
- status

## Mission Attempt

Represents a student attempt at a mission.

Core fields:

- mission_attempt_id
- mission_id
- user_id
- cohort_id
- started_at
- completed_at
- score
- status

## Student Decision

Represents an important decision made during a mission.

Core fields:

- decision_id
- mission_attempt_id
- decision_type
- selected_option
- expected_option
- is_correct
- feedback

## Quiz Result

Represents quiz performance.

Core fields:

- quiz_result_id
- user_id
- module_id
- score
- passed
- completed_at

## Feedback Record

Represents system or AI-generated feedback.

Core fields:

- feedback_id
- mission_attempt_id
- feedback_type
- message
- recommendation
- created_at

---

# 9. Certification and Cohorts

## Cohort

Represents a student group.

Core fields:

- cohort_id
- cohort_name
- start_date
- end_date
- access_end_date
- status

## Certification Rule

Represents rules for Silver and Gold certifications.

Core fields:

- certification_rule_id
- certification_level
- required_modules
- minimum_score
- prerequisite
- status

## Certification Award

Represents a certification earned by a student.

Core fields:

- certification_award_id
- user_id
- cohort_id
- certification_level
- certificate_id
- awarded_at
- verification_url
- status

---

# Data Model Design Rules

## Rule 1 — Business Objects First

The data model must be based on business objects before technical tables.

## Rule 2 — Learning Traceability

Every mission attempt, decision, score and feedback must be traceable.

## Rule 3 — Certification Integrity

Certification data must be auditable and verifiable.

## Rule 4 — Cohort Separation

Each cohort must remain logically separated.

## Rule 5 — Reusability

The same business objects must support multiple modules and future cohorts.

## Rule 6 — Progressive Expansion

The first version must remain simple, but the model must allow future modules and advanced scenarios.

---

# Data Model Scope for Version 1

Version 1 should prioritize the objects required for:

- M1 ERP Foundations
- M2 Master Data
- M3 Procure-to-Pay
- M4 Order-to-Cash
- M5 Supply Chain & Inventory
- M6 Finance & Accounting
- Certification Silver
- Certification Gold
- Cohort tracking
- Student mission attempts
- Teacher dashboard

Advanced features such as complex accounting, advanced HR, production planning or multi-company consolidation are out of scope for Version 1.

---

# Final Data Model Statement

The TEC.ERP data model exists to support learning, not to reproduce the full complexity of a commercial ERP.

It must be simple enough for students to understand, structured enough for realistic business processes, and extensible enough to support future cohorts and program evolution.