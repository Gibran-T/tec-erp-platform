# James Run 2 — i18n Readiness

**Status:** Audit notes only — full FR/EN not implemented in this wave.

| Area | Finding |
|------|---------|
| UI language | FR-primary surface |
| Hardcoded English status fragments | Certificates / Capstone dossier status |
| Catalog | Mostly FR; accent gaps remain |
| Technical identifiers | Must stay ASCII (routes, JSON keys, enums, mission/module codes) |
| Persisted language preference | Not validated as multi-locale switch |

Never translate: route paths · JSON keys · enum values · DB identifiers · migration names · mission/module/certificate codes · raw technical status values (map in presentation layer only).
