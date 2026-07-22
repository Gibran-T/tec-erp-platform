# TEC.ERP Security Model (Living ERP UX)

## Scope

Security-relevant UX and API consumption for Living Workspace + Professor Command Center. No secrets or credentials documented.

## AuthN / AuthZ

| Control | Behavior |
|---------|----------|
| Session | Authenticated employee via `AuthProvider` / `ProtectedRoute` |
| App RBAC | `appRegistry.roles` — professor portal & admin hidden from learners |
| Professor CC | Client gate + server role checks on professor APIs |
| Admin | Separate `administration` app |
| Company isolation | Professor/admin queries resolve actor company; no cross-tenant UI browse |

## Pedagogical data protection

1. **Answer keys** — never rendered in learner, professor analytics, AI oversight, or presentation mode.
2. **AI Coach** — cannot change scores, unlock missions, or act as employment decision engine (UI disclaimer + backend guardrails).
3. **Certificates verify** — public token route exposes verification facts without email/grades.
4. **Historical runs** — read-only posture; no silent writes.

## Living-specific closures

| Topic | Control |
|-------|---------|
| Unique-students | Official institutional metric endpoint; professor alias mirrors admin semantics under professor auth |
| Capstone Or | Professor issue action only after readiness; learner cannot self-issue |
| Interventions | Professor-authored, run-scoped |
| Presentation mode | Hides personal notes; no keys |

## Non-goals / HOLD

- Production deploy remains **HOLD** at SHA `76709d6`.
- No production writes from documentation smoke.
- PR #26 stays independent — do not mix security patches from unrelated branches without review.

## Partial

- Student 360 JSON may include dense progress structures — still company-scoped, but UI minimization of sensitive fields can improve.
- Client role gates are UX; server authorization remains authoritative.
