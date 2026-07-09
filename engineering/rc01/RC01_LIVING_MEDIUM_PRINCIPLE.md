# RC01 — The Living Medium Principle
## Principe du Milieu Vivant

> Engineering Note · Foundational Design Metaphor
> Status: Draft · Scope: Product · UI · Scenario Design · AI Behavior
> Applies to: TEC.ERP Enterprise Workspace (NordHabitat experience)

---

## 1. Core Statement

**The student-employee does not operate the software. They influence a living medium, and the medium responds.**

TEC.ERP is not a set of screens to be filled. It is a contained, water-like world in which people, data, time, and consequences move with their own weight and their own delay. The new employee acts *through* the medium — by deciding, communicating, executing ERP actions, and analyzing — and the enterprise reacts on its own terms.

Mastery is reached not by pressing the right button, but by **understanding how the medium behaves**.

---

## 2. The Metaphor

Recall the small water-filled toy of the 1980s and 1990s: a sealed plastic world, filled with water, with a few buttons on the front. You press a button, a jet of air rises, and small rings or objects drift upward. You never touch the rings directly. You never place them where you want. You learn the rhythm of the water, the arc of the bubbles, the slowed fall under gravity — and then you *guide* the rings onto their pegs.

Its defining properties:

- **A contained world** — the boundary is fixed and known.
- **Filled with water** — every motion happens inside a medium with resistance and inertia.
- **Activated by buttons** — the player's only inputs are indirect.
- **Air creates motion** — inputs become forces, not placements.
- **Gravity is slowed by water** — consequences arrive, but with delay.
- **Objects move indirectly** — you influence trajectories, you do not set positions.
- **The player influences, but does not control** — outcomes emerge from behavior, not command.
- **The goal is reached by understanding the medium** — skill is knowledge of the system's response.

---

## 3. Translation into TEC.ERP

| Toy | TEC.ERP |
|---|---|
| The plastic container | **TEC.ERP** — the platform and its fixed boundary |
| The water | **The Enterprise Workspace** — the living medium |
| The drifting objects | **People, messages, data, tasks, documents, time, AI, consequences** |
| The buttons | **The student-employee's decisions, communication, ERP actions, and analysis** |
| The rising air | **The influence of each action propagating through the company** |
| Slowed gravity | **Delayed, indirect consequences that must be anticipated** |
| Landing a ring on its peg | **Achieving a business outcome by understanding company behavior** |

- **TEC.ERP is the container.** It defines the edges of the world and never pretends to be the world itself.
- **The Enterprise Workspace is the living medium.** NordHabitat is not a backdrop; it is the fluid the participant is suspended in.
- **The water is everything that moves:** narrative, colleagues, inboxes, records, deadlines, filings, the AI coach, and the ripple of every choice.
- **The student-employee acts indirectly.** No decision drops an object onto a peg. Every decision is a jet of air.
- **The company responds** — with its own inertia, its own delay, and its own logic.

---

## 4. RC01 Application

RC01 is the **first, foundational** design constraint of the experience. All later principles inherit from it. When a product, UI, scenario, or AI decision is in question, this principle is consulted first during RC01 experience review.

RC01 requires that every part of TEC.ERP express three truths:

1. **Boundedness** — the world is contained and legible. The new employee always knows they are inside NordHabitat, and the edges of the simulation are honest, not hidden.
2. **Mediation** — the participant never manipulates outcomes directly. Every effect passes *through* people, process, and time. Actions are inputs to a system, never assignments of results.
3. **Responsiveness** — the medium reacts. Nothing the student-employee does is inert. But the reaction obeys the medium's physics: delayed, indirect, sometimes surprising, always explainable in hindsight.

A feature satisfies this principle when a student-employee could say: *"I understood how NordHabitat behaves, so I knew what my action would set in motion."*

---

## 5. Scenario Design Rule

**Design forces, not switches.**

- A scenario presents a **business situation** — a disturbance in the medium — never a task list to complete.
- The participant's move is an **input** (a decision, a message, an ERP action, an analysis), whose effect **propagates** through the company.
- Consequences arrive with **honest delay and indirection.** A late payment does not instantly show a red flag; it stresses a supplier, who later changes terms, which later constrains procurement.
- No scenario resolves by a single correct button. Scenarios resolve when the student-employee **reads the medium correctly** and applies the right influence at the right moment.
- Every consequence must be **traceable backward.** The participant, on reflection, can reconstruct the chain from action to outcome. Delay is allowed; opacity is not.
- Reward **understanding of behavior**, not memorization of steps.

---

## 6. UI Rule

**The interface is the glass of the container — clear, calm, and never the actor.**

- The UI reveals the **state of the medium** (people, messages, data, time, consequences) and lets the student-employee apply influence. It does not perform outcomes on their behalf.
- Preserve the institutional layout: top navigation, left sidebar, main content, contextual right panel (`docs/16`). The frame is stable; the medium moves within it.
- Show **motion and consequence over time.** Prefer views that expose trajectory, pending effects, and ripples — not just final values in a form.
- Buttons are **jets of air.** A control expresses *intent to influence* ("send", "decide", "post", "analyze"), never "make this outcome true instantly."
- **Never fake omnipotence.** Avoid UI that lets the participant directly set a result the medium should have produced. No god-mode toggles over the company's behavior.
- Clarity above ornament: enterprise credibility with pedagogical guidance. The glass should be so clean the new employee forgets it is there and sees only the living company.

---

## 7. AI Rule

**The AI is a current in the water, not a hand on the pegs.**

- The AI coach helps the student-employee **read the medium** — surfacing patterns, asking questions, framing consequences — but never places the ring on the peg.
- The AI **does not give final answers** to business decisions. It deepens understanding of how NordHabitat behaves, consistent with the AI Coach guardrails (`.cursor/rules/tec_erp_ai_architecture.mdc`).
- The AI models **indirection and delay** faithfully. When it explains a consequence, it explains the *chain*, honoring the slowed-gravity physics of the medium.
- The AI is **part of the water, not above it.** It is one of the moving elements the participant learns to work with, not an oracle outside the container.
- When the student-employee wants to be told what to do, the AI returns them to the medium: *"What do you expect the company to do if you act this way?"*

---

## 8. Scenario, UI, and AI in One Motion

A well-formed slice of TEC.ERP reads as a single gesture: a situation disturbs the water (scenario), the glass lets the employee-in-training see and influence it (UI), and a current helps them read what is happening without steering the outcome (AI). When these three pull in the same direction, the experience feels like NordHabitat breathing — not like three features stitched together.

---

## 9. How to Apply This Principle in Review

Use this checklist when reviewing any screen, scenario, or AI behavior against RC01:

- Does this screen create movement?
- Does the student act indirectly through the enterprise medium?
- Is the company responding?
- Is there visible context, delay, or consequence?
- Does the AI guide without deciding?
- Would this still feel like NordHabitat, not an LMS?

If any answer is "no," the slice is not yet aligned with the Living Medium Principle and stays open for revision.

---

## 10. Anti-Patterns

The following violate RC01 and must be rejected in review:

- **The Puppeteer** — UI or actions that let the participant set outcomes directly, bypassing people, process, and time.
- **Instant Gravity** — consequences that fire immediately and mechanically, destroying the sense of a medium with inertia.
- **The Checklist Company** — scenarios reduced to task lists with one correct sequence of buttons.
- **The Opaque Medium** — consequences that cannot be traced back to the student-employee's action; mystery masquerading as depth.
- **The Answer Engine** — an AI that resolves the business decision instead of building understanding of behavior.
- **The Borderless World** — hiding or faking the boundary of the simulation, so the participant cannot reason about the edges of the medium.
- **The Frozen Water** — screens where nothing responds; actions that leave the company unchanged.
- **God-Mode UI** — controls that grant direct authorship over results the medium should produce on its own.

---

## 11. Closing Principle

> TEC.ERP is a contained world filled with living water.
> The student-employee never grasps the objects directly.
> They press the buttons of decision, communication, action, and analysis,
> and they learn the physics of a company in motion.
>
> We do not build a machine that obeys.
> We build a medium that responds.
>
> The goal was never to press the right button.
> The goal was always to understand the water.
