# Phase 2C Readiness Assessment

## Current Architecture

```
neumatiq_next/
├── core/
│   ├── config.py          # Settings (Pydantic)
│   ├── database.py        # Async engine + sessionmaker (AsyncSession)
│   └── logging.py         # Structlog configuration
├── infrastructure/
│   └── persistence/
│       └── sqlalchemy/
│           ├── base.py
│           ├── country.py, currency.py, brand.py, ... (9 ORM models)
│           └── __init__.py
└── interfaces/
    └── http/
        └── routes/        # FastAPI endpoints (health, version)
```

## Domain Audit

### Structure Actual
**PROBLEM: NO DOMAIN LAYER EXISTS**

- `packages/domain/entities/` contains legacy SQLAlchemy models (not domain entities)
- `neumatiq_next` has ORM models directly in infrastructure layer
- No separation between domain entities and persistence models

### Entidades Existentes
```
packages/domain/entities/:
  - country.py (legacy, differs from canonical - String(3) vs String(2))
  - product.py (legacy, has category_id not in canonical)
  - supplier.py (legacy)
  - brand.py (legacy, missing normalized_name, metadata)
  - currency.py (legacy)
  - price_observation.py (legacy)
```

### Dependencias Incorrectas
- `packages/domain/entities/*.py` import `Base` from SQLAlchemy - acoplamiento directo al ORM
- `apps/backend/src/core/database.py` declares its own `Base` - conflicto potencial

### Acoplamiento con SQLAlchemy
- **ALTO**: Entidades heredan directamente de `Base(DeclarativeBase)`
- No hay abstracción de dominio - los modelos son entidades de BD mapeadas directamente

## Persistence Audit

### Modelos ORM
- **OK**: 9 modelos en `neumatiq_next/infrastructure/persistence/sqlalchemy/`
- Modelos coinciden con canonical-model.md

### Metadata
- **OK**: `Base.metadata` registrada correctamente
- Alembic detecta todas las tablas

### Session Management
- **OK**: `async_sessionmaker` configurado con `AsyncSession`
- `expire_on_commit=False` para patrones UoW

### Transaction Boundaries
- **PENDIENTE**: No existen - necesario para Phase 2C

## Repository Strategy

### Repositorios Necesarios para MVP

| Priority | Repository | Entity | Operaciones Clave |
|----------|------------|--------|-----------------|
| P0 | CountryRepository | Country | get_by_code, list_active, list_all |
| P0 | CurrencyRepository | Currency | get_by_code, get_by_country |
| P0 | BrandRepository | Brand | get_by_name, get_by_normalized_name |
| P0 | SupplierRepository | Supplier | get_by_name, search_by_country |
| P1 | ProductRepository | Product | get_by_fingerprint, search_by_sku |
| P1 | PriceObservationRepository | PriceObservation | get_recent_by_product, get_by_supplier |
| P2 | ProductMatchRepository | ProductMatch | get_pending_matches |

### Repositorios NO Necesarios (aún)
- ScrapingSourceRepository (futuro scraper)
- TireSpecificationRepository (datos estáticos)

### Interfaces Recomendadas
```python
class IRepository(Protocol[T]):
    async def get(self, id: UUID) -> Optional[T]
    async def list(self, limit: int, offset: int) -> Sequence[T]
    async def add(self, entity: T) -> None
    async def remove(self, entity: T) -> None
```

## Unit Of Work Design

### Interfaz Recomendada
```python
class IUnitOfWork(Protocol):
    async def __aenter__(self) -> "IUnitOfWork"
    async def __aexit__(self, exc_type, exc_val, exc_tb):
    async def commit(self) -> None
    async def rollback(self) -> None
```

### Implementación SQLAlchemy Recomendada
```python
class SQLAlchemyUnitOfWork:
    def __init__(self, session_factory):
        self._session_factory = session_factory
        
    async def __aenter__(self):
        self._session = self._session_factory()
        return self
        
    async def commit(self):
        await self._session.commit()
        
    async def rollback(self):
        await self._session.rollback()
```

### Manejo commit/rollback
- Transaction por UoW scope
- Rollback automático en `__aexit__` si excepción
- Commit explícito requerido

## Risks

### Architectural Risks
1. **NO DOMAIN ENTITIES** - ORM models actúan como entities. Violación de Clean Architecture.
2. **Legacy entities** en `packages/domain/entities/` difieren del canonical model.
3. **Duplicación de Base** - existen dos clases `Base` posibles.

### Over-engineering Risks
- **BAJO**: El scope actual está bien delimitado
- **MEDIO**: Repositories con generics pueden ser complejos sin dominio previo

## Missing Pieces

| Piece | Status |
|-------|--------|
| Domain entities (sin acoplamiento SQLAlchemy) | MISSING |
| Repository interfaces | MISSING |
| Repository implementations | MISSING |
| UnitOfWork interface | MISSING |
| UnitOfWork SQLAlchemy implementation | MISSING |
| Dependency injection setup | MISSING |
| Repository registry | MISSING |

## Recommended Next Tasks

### Priority 1 (Pre-requisito)
1. Crear `neumatiq_next/domain/entities/` con entidades puras (sin SQLAlchemy)
2. Mapear entidades de dominio a modelos ORM (patrón Repository)

### Priority 2 (Core)
3. Definir `IRepository[T]` protocol en `neumatiq_next/domain/repository.py`
4. Implementar `SQLAlchemyUnitOfWork` en `neumatiq_next/infrastructure/database/uow.py`
5. Crear repositories P0: Country, Currency, Brand, Supplier

### Priority 3 (MVP)
6. Añadir `get_db_session` dependency para endpoints
7. Implementar ProductRepository con búsqueda por fingerprint
8. Implementar PriceObservationRepository con filtros

## Final Verdict

**NO-GO**

### Razones
1. **Architecture Violation**: Domain layer inexistente - los modelos ORM son entidades
2. **Legacy Entity Conflict**: `packages/domain/entities/` tiene esquema distinto al canonical
3. **Missing Abstractions**: Sin interfaces de Repository ni UnitOfWork no se puede construir capa de persistencia limpia
4. **SRP Violation**: Los modelos SQLAlchemy son propiedad de infraestructura, no dominio

### Próxima acción requerida
Crear capa de dominio antes de Repository/UoW - refactorizar entities sin acoplamiento SQLAlchemy.