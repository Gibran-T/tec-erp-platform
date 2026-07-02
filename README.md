# TEC.ERP — Analyste ERP et Processus d'Affaires

Educational ERP platform — RC00 Enterprise Platform Foundation.

## Prerequisites

- Node.js 22.x (see `.node-version`)
- pnpm ≥ 9.0.0
- PostgreSQL 16+

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm env:check
pnpm dev
```

| Service | URL |
|---------|-----|
| API | http://localhost:3000 |
| Web | http://localhost:5173 |

## Validation

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm env:check
```

## Documentation

- Official specs: `docs/`
- RC00 engineering notes: `engineering/rc00/`
- Architecture: `architecture-board/platform/ADR_ENTERPRISE_PLATFORM_FOUNDATION.md`

## License

Institutional — TEC
