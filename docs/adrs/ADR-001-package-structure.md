# ADR-001: Package Structure Resolution

## Status
Accepted

## Context
NeumatiQ Next backend codebase suffers from a critical import mismatch: the code imports from `neumatiq_next` module while the physical structure is organized under `apps/backend/src/`. This prevents the application from running.

## Decision
Create `neumatiq_next` as a proper Python package at the project root to match the import expectations in the existing code.

## Alternatives Considered

### Option A: `neumatiq_next` package at root (Selected)
- **Changes required**: Create `neumatiq_next/` directory with core, infrastructure, interfaces subpackages
- **Benefits**: Minimal code changes, matches existing import statements, follows modern Python packaging conventions
- **Drawbacks**: Adds another top-level package alongside existing `apps/`, `packages/`, `infrastructure/`

### Option B: Update imports to `apps.backend.src`
- **Changes required**: Update all import statements across multiple files to use `apps.backend.src.*` paths
- **Benefits**: Uses existing directory structure
- **Drawbacks**: Requires changes to 10+ files with multiple imports each, creates inconsistent package naming

### Option C: Delete `apps/backend/src/` and migrate to `packages/`
- **Changes required**: Move all code to `packages/` and restructure
- **Benefits**: Follows original archived architecture
- **Drawbacks**: High effort, breaks Clean Architecture layout intention

## Consequences

### Positive
- Application imports resolve without modification
- FastAPI endpoints `/health` and `/version` become accessible
- Dockerfile can reference `neumatiq_next.main:app` cleanly
- Alembic can import `Base` from `neumatiq_next.core.database`

### Negative
- Two parallel structures exist temporarily (`apps/backend/src/` and `neumatiq_next/`)
- Legacy code in `apps/api/` and `packages/` remains unhandled

## Expected Final Directory Structure

```
NeumatiQ/
├── pyproject.toml                 # Package configuration
├── alembic.ini                    # Alembic configuration
├── .env.example                   # Environment template
├── neumatiq_next/                 # Root package
│   ├── __init__.py
│   ├── main.py                    # FastAPI application entry point
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Settings class
│   │   ├── database.py            # SQLAlchemy engine and Base
│   │   └── logging.py             # Structlog configuration
│   ├── infrastructure/
│   │   ├── __init__.py
│   │   └── persistence/
│   │       ├── __init__.py
│   │       └── sqlalchemy/
│   │           └── __init__.py    # Empty - models added in Phase 2
│   └── interfaces/
│       ├── __init__.py
│       └── http/
│           ├── __init__.py
│           └── routes/
│               ├── __init__.py
│               ├── health.py
│               └── version.py
├── apps/                          # Legacy structure (to be removed in Fase 0)
└── infrastructure/
    └── docker/
        ├── backend.Dockerfile
        └── docker-compose.yml
```

## References
- Fase 0 Consolidation Plan: `docs/roadmap/fase-0-consolidation-plan.md`
- Archived Multitenancy Architecture: `docs/archive/discarded-multitenant-model.md`