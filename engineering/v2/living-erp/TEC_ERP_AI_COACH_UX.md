# TEC.ERP AI Coach UX

## Surface

`/workspace/apps/coach-ia` → `AiCoachPage`.

## Five modes

| Mode id | Label (FR catalog) | Framing intent |
|---------|--------------------|----------------|
| `understand` | Comprendre | Explain concept/document without giving the expected answer |
| `diagnose` | Diagnostiquer | Symptom vs cause; no answer key |
| `decide` | Préparer une décision | Structure evidence, risks, recommendation |
| `review` | Réviser | Assessment prep / learning summary without answer leakage |
| `reflect` | Réfléchir | Lessons learned and alternatives |

UI: tablist of mode buttons; each chat entry tagged with mode chip.

## Safeguards (on-page + product rules)

Rendered list (`ai-coach-safeguards`) and disclaimer (`ai.disclaimer`):

1. **No score modification**
2. **No final employment decision**
3. **No answer-key exposure**
4. **No sensitive trait inference**
5. **Deterministic fallback + human responsibility** reminded

Ask path prefixes the learner question with `MODE_PROMPTS[mode]` before `askAiCoach`. Optional module filter M1–M10.

## Professor oversight

Command Center **IA** section lists interactions (employee, mode/category, module, time) — supervision without system prompts or keys. Usage ≠ fault.

## Partial areas

- Mode is a **client framing prefix**, not yet a first-class persisted API enum on every backend path (oversight may show category fallbacks).
- Conversation history is session-local in the page state.
- Backend pedagogical guardrails remain authoritative; UI reinforces them.
