# MVP Architecture Decision

## Option A: ORM Models = Domain Models

### Arquitectura
```
neumatiq_next/
├── core/
├── infrastructure/
│   └── persistence/
│       └── sqlalchemy/
│           └── models/       # Domain models aquí
└── interfaces/
```

### Ventajas
- ✅ **Simplicidad**: Sin capas intermedias
- ✅ **Velocidad**: 0 refactoring, código funcional inmediatamente
- ✅ **Menos archivos**: 9 modelos vs 18+ (model + entity + mapper)
- ✅ **Menor complejidad**: Sin mappers, sin interfaces complejas
- ✅ **Equipo pequeño**: Menos abstracciones para mantener

### Desventajas
- ❌ **Acoplamiento fuerte**: SQLAlchemy en toda la aplicación
- ❌ **Testing**: Tests requieren DB real o complejo mocking
- ❌ **Futuro**: Refactoring costoso cuando se necesiten mappers
- ❌ **Violación Clean Architecture**: Domain layer inexistente

## Option B: ORM Models + Domain Entities + Mappers

### Arquitectura
```
neumatiq_next/
├── domain/
│   ├── entities/          # Entidades puras
│   └── repositories/      # Interfaces
├── infrastructure/
│   └── persistence/
│       ├── sqlalchemy/  # Models + Repositories impl
│       └── mappers/     # ORM <-> Entity
└── application/
    └── use_cases/       # Casos de uso
```

### Ventajas
- ✅ **Clean Architecture**: Aislamiento completo
- ✅ **Testability**: Entities sin dependencias externas
- ✅ **Flexibilidad**: Cambiar ORM sin tocar dominio
- ✅ **Corrección**: Entities definen el negocio

### Desventajas
- ❌ **Overhead**: ~2x archivos y código para mapear
- ❌ **Complejidad**: Necesario entender mappers
- ❌ **Retraso**: 2-3 días de refactoring inicial
- ❌ **Equipo pequeño**: Más superficie de mantenimiento

## Cost Analysis

| Aspecto | Opción A | Opción B |
|---------|----------|----------|
| Implementación | 0 días (listo) | 2-3 días |
| Líneas de código | ~700 LOC existentes | ~1500 LOC estimado |
| Curva aprendizaje | Baja | Media-Alta |
| Testing unitario | Complejo (SQLAlchemy) | Simple (puras) |
| Futuro cambio ORM | Alto costo | Cero costo |
| MVP timeline | Hoy mismo | +3 días |

### Impacto en componentes

| Componente | Opción A | Opción B |
|------------|----------|----------|
| Repositories | Direct SQLAlchemySession | Repository interface + impl |
| Use Cases | Dependen de ORM | Dependen de interfaces |
| API | Direct ORM queries | Via repositories |
| Scraping | Direct saves | Via repositories |
| Matching Engine | Direct ORM | Via repositories |

## Recommendation

**Option A es la decisión correcta para MVP.**

Razones:
1. Equipo pequeño (actualmente 1 desarrollador)
2. Time-to-market prioritario
3. Domain lógica simple (muy CRUD-heavy)
4. Los modelos ya generados cumplen funciones de dominio
5. Clean Architecture puede implementarse después con migración incremental

## ADR Draft

```markdown
# ADR-003: MVP Thin Architecture - ORM Models as Domain

## Status
Proposed

## Context
Phase 2B completada con modelos SQLAlchemy funcionales. Phase 2C requiere Repositories/UoW. Equipo pequeño y time-to-market prioritario.

## Decision
Usar ORM Models como Domain Models durante MVP (Phase 2 - 5). Post-MVP (Fase 6) puede refactorizarse si es necesario.

## Consequences

### Positive
- MVP entregable en días
- Menos abstracciones complejas
- Testing con SQLite/PostgreSQL test containers
- Equipo enfocado en funcionalidad

### Negative
- Acoplamiento con SQLAlchemy
- Futuro refactoring inevitable
- Tests de integración más que unitarios

## Migration Path
Antes de Fase 6 o cuando añadamos lógica de dominio compleja, extraer entities puras.
```

## Final Verdict

**GO - Option A** (ORM Models = Domain Models)

### Rationale
- MVP no necesita complejidad arquitectónica innecesaria
- Los modelos son esencialmente entidades de datos, no lógica compleja
- Clean Architecture puede aplicarse después (no bloquea MVP)
- Riesgo de sobreingeniería si implementamos Option B ahora

### Próximos pasos
1. Aprobar ADR-003
2. Continuar a Phase 2C con Repositories directos a SQLAlchemy
3. Añadir UnitOfWork wrapper al `async_sessionmaker` existente