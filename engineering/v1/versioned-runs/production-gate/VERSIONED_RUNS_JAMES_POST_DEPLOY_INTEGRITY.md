# Versioned Runs — James Post-Deploy Integrity

## Legacy-content integrity hash

| Stage | Hash |
|-------|------|
| Pre-deploy | `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4` |
| Post-migrate | `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4` |
| Post-deploy + QA cleanup | `83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4` |

**Exact match — James learning content unchanged.**

## Versioned-run integrity hash (new)

`203e1cfd0c89ec78f2bf4c060d7298d848e6b164b7b9c93179c3918005a618f0`

Payload includes Run 1 code/status/linkage counts (see `evidence/post-deploy/james-versioned-integrity.json`).

## Run 1 association

| Field | Value |
|-------|-------|
| runCode | TECERP-PILOT-001-RUN1 |
| sequence | 1 |
| type | AUTONOMOUS |
| status | COMPLETED |
| completion | 100% |
| reflectionsEnabled | false |
| professorId | null |
| mission attempts | 30 / 30 completed |
| certificates linked | 3 |
| AI linked | 1 |
| Run 2 | **absent** |

## Comparison

Identity, role, company, cohort, professor count (0), scores, assessments, Silver/Gold history, Capstone, AI count — all preserved vs pre-deploy.
