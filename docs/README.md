# NeumatiQ Documentation

> Canonical documentation system for NeumatiQ Next project.

## Documentation Hierarchy

```
docs/
├── database/           # Database design (Source of Truth)
├── roadmap/           # Implementation roadmap (Source of Truth)
├── adrs/             # Architecture Decision Records
├── api/               # API documentation
└── archive/           # Deprecated/discarded documents
```

---

## Source of Truth

| Topic | Document | Location |
|-------|----------|----------|
| Database Schema | database-design-v1.md | `docs/database/` |
| Implementation Roadmap | implementation-blueprint.md | `docs/roadmap/` |
| Architecture Decisions | ADR-*.md | `docs/adrs/` |

---

## Directory Structure

### `docs/database/`

Contains the **single source of truth** for database schema design.

- `database-design-v1.md` - Current PostgreSQL schema design

### `docs/roadmap/`

Contains the **single source of truth** for implementation planning.

- `implementation-blueprint.md` - Phased implementation plan
- `fase-0-consolidation-plan.md` - Legacy code consolidation plan

### `docs/adrs/`

Architecture Decision Records (ADRs). Each ADR documents a significant architectural decision.

Naming convention: `ADR-XXX-title.md`

### `docs/api/`

API endpoint documentation. OpenAPI specs, endpoint definitions, and request/response schemas.

### `docs/archive/`

Deprecated or discarded documents that are kept for historical reference.

**Important:** Documents in this directory are NOT the source of truth. They are archived for reference only.

---

## Contributing to Documentation

### Adding New Documentation

1. Determine the appropriate directory:
   - **Database changes** → `docs/database/`
   - **Roadmap changes** → `docs/roadmap/`
   - **New architectural decision** → `docs/adrs/`
   - **API changes** → `docs/api/`

2. Create or update the document
3. Update this README if the structure changes

### Creating an ADR

Use the standard ADR format:

```markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What prompted this decision?

## Decision
What was decided?

## Consequences
What are the consequences?
```

---

## Archived Documents Policy

Documents are moved to `docs/archive/` when:

1. They describe a design that was superseded
2. They contain outdated information that conflicts with current design
3. They are kept for historical reference only

Archived documents must include a deprecation header:

```markdown
> ⚠️ ARCHIVED - This document is no longer the source of truth.
> 
> **Reason:** [brief explanation]
> 
> **Current Source of Truth:** [link to current document]
> 
> **Archived Date:** [date]
```

---

## Current Project State

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | In Progress | Repository consolidation |
| Phase 1+ | Pending | See implementation-blueprint.md |

For detailed implementation phases, see `docs/roadmap/implementation-blueprint.md`.

---

## Related Documentation

- [Database Design](database/database-design-v1.md)
- [Implementation Blueprint](roadmap/implementation-blueprint.md)
- [Consolidation Plan](roadmap/fase-0-consolidation-plan.md)