# TEC.ERP Certificate UX

## Surfaces

| Surface | Route | Component |
|---------|-------|-----------|
| Learner certificates | `/workspace/apps/certificats` | `CertificatesPage` |
| Public verify | `/verify/:token` | `CertificateVerifyPage` |
| Home milestone | `/workspace` Or card | links to certificates |
| Capstone | gold status panel | eligibility bridge |

## Learner page behaviors

- Lists Silver/Gold certificates with verification URL/token helpers
- Copy verify link to clipboard
- Refresh on window focus / visibility change
- Sort: non-revoked first, then newest
- **Gold eligibility panel**: missions 30/30, gold assessment, optional HCM (V2) checklist, Capstone submission/approval readiness, next-step hint
- Explicit link to Capstone app
- Public verify reveals verification facts **without grades or email**

## Principles

1. Certification is institutional evidence, not a vanity badge.
2. Or requires professor issue after student readiness — UI must not imply self-issue.
3. Revoked certificates remain visible but deprioritized.
4. Curriculum-aware HCM checklist appears when API provides it.

## Partial areas

- Visual Living restyle of certificate cards is lighter than home/hubs.
- Some status text remains page-local French rather than full i18n catalog keys.
