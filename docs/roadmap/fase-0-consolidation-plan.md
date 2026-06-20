# Fase 0: Repository Consolidation Plan — NeumatiQ Next

> **Objetivo:** Eliminar deuda técnica legacy y dejar una estructura canónica vacía lista para Fase 1.
> **Alcance:** Solo reestructuración. No se implementan entidades, scrapers ni endpoints.

---

## 1. Archivos a eliminar

| # | Ruta | Razón |
|---|------|-------|
| 1 | `requirements.txt` | Duplicado de `pyproject.toml` |
| 2 | `apps/api/config.py` | Legacy Pydantic v1. Se reescribe en Fase 1. |
| 3 | `apps/api/main.py` | CORS abierto, rutas hardcodeadas. Se reescribe en Fase 1. |
| 4 | `apps/api/routes/products.py` | Stub legacy. Se reescribe en Fase 1. |
| 5 | `apps/api/routes/suppliers.py` | Stub legacy. Se reescribe en Fase 1. |
| 6 | `apps/api/routes/observations.py` | Stub legacy. Se reescribe en Fase 1. |
| 7 | `apps/api/routes/analytics.py` | Stub. No entra en MVP. |
| 8 | `apps/api/routes/exports.py` | Stub. No entra en MVP. |
| 9 | `apps/api/routes/__init__.py` | Paquete legacy. |
| 10 | `apps/api/__init__.py` | Paquete legacy. |
| 11 | `packages/domain/entities/brand.py` | Mezcla dominio con SQLAlchemy. Se reescribe en Fase 2. |
| 12 | `packages/domain/entities/product.py` | Mezcla dominio con SQLAlchemy. Se reescribe en Fase 2. |
| 13 | `packages/domain/entities/supplier.py` | Mezcla dominio con SQLAlchemy. Se reescribe en Fase 2. |
| 14 | `packages/domain/entities/country.py` | Mezcla dominio con SQLAlchemy. Se reescribe en Fase 2. |
| 15 | `packages/domain/entities/currency.py` | Mezcla dominio con SQLAlchemy. Se reescribe en Fase 2. |
| 16 | `packages/domain/entities/price_observation.py` | Mezcla dominio con SQLAlchemy. Se reescribe en Fase 2. |
| 17 | `packages/domain/entities/__init__.py` | Paquete legacy. |
| 18 | `packages/domain/__init__.py` | Paquete legacy. |
| 19 | `packages/infrastructure/database/connection.py` | Mezcla Settings + engine. Se reescribe en Fase 1. |
| 20 | `packages/infrastructure/database/__init__.py` | Paquete legacy. |
| 21 | `packages/infrastructure/__init__.py` | Paquete legacy. |
| 22 | `packages/infrastructure/database/__init__.py` | Paquete legacy. |
| 23 | `frontend/src/pages/Analytics.tsx` | No entra en MVP. |
| 24 | `frontend/src/pages/Exports.tsx` | No entra en MVP. |

**Total: 24 archivos.**

---

## 2. Archivos a mover

| # | Origen | Destino | Acción | Notas |
|---|--------|---------|--------|-------|
| 1 | `infrastructure/docker/Dockerfile` | `infrastructure/docker/backend.Dockerfile` | Renombrar | Consistencia con `frontend.Dockerfile` |
| 2 | `packages/infrastructure/database/connection.py` | `apps/backend/src/core/database.py` | Mover (solo engine) | Extraer solo la configuración de engine. El archivo legacy se combina con config en Fase 1. |

---

## 3. Archivos a conservar

| Ruta | Razón |
|------|-------|
| `pyproject.toml` | Fuente de verdad de dependencias |
| `.env.example` | Variables de entorno |
| `instrucciones.md` | Especificaciones originales |
| `readme.md` | README del proyecto |
| `docs/database-design-v1.md` | Diseño de BD aprobado |
| `docs/implementation-blueprint.md` | Blueprint aprobado |
| `design/neumatiq-next-architecture.md` | Diseño arquitectura |
| `infrastructure/docker/docker-compose.yml` | Orquestación local — **actualizar rutas antes de eliminar legacy** |
| `infrastructure/docker/Dockerfile.frontend` | Frontend image |
| `infrastructure/docker/Dockerfile` → `backend.Dockerfile` | Renombrado |
| `frontend/package.json` | Dependencias frontend |
| `frontend/vite.config.ts` | Vite config |
| `frontend/tsconfig.json` | TS config |
| `frontend/tsconfig.node.json` | TS config node |
| `frontend/postcss.config.js` | PostCSS config |
| `frontend/tailwind.config.js` | Tailwind config |
| `frontend/index.html` | Entry HTML |
| `frontend/src/main.tsx` | Entry React |
| `frontend/src/App.tsx` | App principal |
| `frontend/src/index.css` | Estilos globales |
| `frontend/src/components/Layout.tsx` | Layout |
| `frontend/src/pages/Dashboard.tsx` | Dashboard MVP |
| `frontend/src/pages/Products.tsx` | Products MVP |
| `frontend/src/pages/Suppliers.tsx` | Suppliers MVP |
| `frontend/src/store/` | Estado global |
| `frontend/src/services/` | Servicios API |
| `frontend/src/styles/` | Estilos |

---

## 4. Archivos nuevos a crear

| # | Ruta | Propósito |
|---|------|-----------|
| 1 | `apps/backend/src/core/__init__.py` | Paquete core |
| 2 | `apps/backend/src/domain/__init__.py` | Paquete dominio |
| 3 | `apps/backend/src/domain/entities/__init__.py` | Paquete entidades |
| 4 | `apps/backend/src/domain/value_objects/__init__.py` | Paquete VOs |
| 5 | `apps/backend/src/domain/repositories/__init__.py` | Paquete repositorios |
| 6 | `apps/backend/src/domain/exceptions.py` | Excepciones de dominio |
| 7 | `apps/backend/src/application/__init__.py` | Paquete aplicación |
| 8 | `apps/backend/src/application/use_cases/__init__.py` | Paquete use cases |
| 9 | `apps/backend/src/application/dtos/__init__.py` | Paquete DTOs |
| 10 | `apps/backend/src/infrastructure/__init__.py` | Paquete infra |
| 11 | `apps/backend/src/infrastructure/persistence/__init__.py` | Paquete persistencia |
| 12 | `apps/backend/src/infrastructure/persistence/sqlalchemy/__init__.py` | Paquete modelos SQLA |
| 13 | `apps/backend/src/infrastructure/persistence/repositories/__init__.py` | Paquete repos impls |
| 14 | `apps/backend/src/infrastructure/scraping/__init__.py` | Paquete scraping |
| 15 | `apps/backend/src/infrastructure/scraping/base/__init__.py` | Paquete scraping base |
| 16 | `apps/backend/src/infrastructure/scraping/providers/mercadolibre/__init__.py` | Placeholder MVP |
| 17 | `apps/backend/src/interfaces/__init__.py` | Paquete interfaces |
| 18 | `apps/backend/src/interfaces/http/__init__.py` | Paquete HTTP |
| 19 | `apps/backend/src/interfaces/http/routes/__init__.py` | Paquete rutas |
| 20 | `apps/backend/src/interfaces/http/routes/health.py` | Health endpoint placeholder |
| 21 | `apps/backend/src/interfaces/http/routes/version.py` | Version endpoint placeholder |
| 22 | `apps/backend/src/interfaces/schemas/__init__.py` | Paquete schemas |
| 23 | `alembic.ini` | Configuración Alembic |
| 24 | `alembic/env.py` | Entorno Alembic |
| 25 | `alembic/script.py.mako` | Template de migraciones |
| 26 | `tests/__init__.py` | Paquete tests |
| 27 | `docs/adrs/ADR-005-multi-tenant-future.md` | ADR postergación multi-tenant |

**Total: 27 archivos nuevos.**

---

## 5. Árbol final del repositorio

```
NeumatiQ/
├── pyproject.toml
├── .env.example
├── readme.md
├── instrucciones.md
├── design/
│   └── neumatiq-next-architecture.md
├── docs/
│   ├── database-design-v1.md
│   ├── implementation-blueprint.md
│   ├── fase-0-consolidation-plan.md
│   └── adrs/
│       └── ADR-005-multi-tenant-future.md
├── apps/
│   └── backend/
│       └── src/
│           ├── __init__.py
│           ├── core/
│           │   ├── __init__.py
│           │   ├── config.py            # Vacío — se llena Fase 1
│           │   ├── logging.py           # Vacío — se llena Fase 1
│           │   ├── database.py          # Vacío — se llena Fase 1
│           │   └── dependencies.py      # Vacío — se llena Fase 1
│           ├── domain/
│           │   ├── __init__.py
│           │   ├── entities/
│           │   │   ├── __init__.py
│           │   │   ├── brand.py         # Vacío — se llena Fase 2
│           │   │   ├── tire_specification.py  # Vacío — se llena Fase 2
│           │   │   ├── product.py       # Vacío — se llena Fase 2
│           │   │   ├── supplier.py      # Vacío — se llena Fase 2
│           │   │   ├── scraping_source.py     # Vacío — se llena Fase 2
│           │   │   ├── price_observation.py   # Vacío — se llena Fase 2
│           │   │   ├── country.py       # Vacío — se llena Fase 2
│           │   │   ├── currency.py      # Vacío — se llena Fase 2
│           │   │   └── product_match.py # Vacío — se llena Fase 2
│           │   ├── value_objects/
│           │   │   └── __init__.py
│           │   ├── repositories/
│           │   │   └── __init__.py
│           │   └── exceptions.py         # Vacío — se llena Fase 2
│           ├── application/
│           │   ├── __init__.py
│           │   ├── use_cases/
│           │   │   └── __init__.py
│           │   └── dtos/
│           │       └── __init__.py
│           ├── infrastructure/
│           │   ├── __init__.py
│           │   ├── persistence/
│           │   │   ├── __init__.py
│           │   │   ├── sqlalchemy/
│           │   │   │   ├── __init__.py
│           │   │   │   └── (vacío — se llena Fase 2)
│           │   │   └── repositories/
│           │   │       ├── __init__.py
│           │   │       └── (vacío — se llena Fase 3)
│           │   └── scraping/
│           │       ├── __init__.py
│           │       ├── base/
│           │       │   ├── __init__.py
│           │       │   ├── base_scraper.py      # Vacío — se llena Fase 6
│           │       │   ├── scraper_registry.py  # Vacío — se llena Fase 6
│           │       │   ├── price_observation_dto.py  # Vacío — se llena Fase 6
│           │       │   ├── normalizer.py        # Vacío — se llena Fase 6
│           │       │   └── price_normalizer.py  # Vacío — se llena Fase 6
│           │       └── providers/
│           │           └── mercadolibre/
│           │               └── __init__.py      # Placeholder MVP
│           └── interfaces/
│               ├── __init__.py
│               ├── http/
│               │   ├── __init__.py
│               │   ├── routes/
│               │   │   ├── __init__.py
│               │   │   ├── health.py      # Vacío — se llena Fase 1
│               │   │   ├── version.py     # Vacío — se llena Fase 1
│               │   │   ├── products.py    # Vacío — se llena Fase 4
│               │   │   ├── suppliers.py   # Vacío — se llena Fase 4
│               │   │   └── price_observations.py  # Vacío — se llena Fase 4
│               │   └── middleware.py      # Vacío — se llena Fase 1
│               └── schemas/
│                   ├── __init__.py
│                   ├── brand.py              # Vacío — se llena Fase 4
│                   ├── tire_specification.py # Vacío — se llena Fase 4
│                   ├── product.py            # Vacío — se llena Fase 4
│                   ├── supplier.py           # Vacío — se llena Fase 4
│                   ├── scraping_source.py    # Vacío — se llena Fase 4
│                   ├── price_observation.py  # Vacío — se llena Fase 4
│                   ├── country.py            # Vacío — se llena Fase 4
│                   ├── currency.py           # Vacío — se llena Fase 4
│                   ├── product_match.py      # Vacío — se llena Fase 4
│                   ├── health.py             # Vacío — se llena Fase 1
│                   └── version.py            # Vacío — se llena Fase 1
├── infrastructure/
│   ├── docker/
│   │   ├── backend.Dockerfile
│   │   ├── frontend.Dockerfile
│   │   └── postgres/
│   │       └── init.sql
│   ├── github/
│   │   └── workflows/
│   │       ├── ci.yml
│   │       └── deploy.yml
│   └── scripts/
│       ├── seed_countries.py
│       └── create_admin.py
├── packages/
│   └── shared/
│       └── src/
│           ├── types/
│           ├── constants/
│           └── utils/
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   └── SuppliersPage.tsx
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── store/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.ts
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
└── scripts/
    ├── seed_countries.py
    └── create_admin.py
```

---

## 6. Checklist de ejecución

### 6.1 Pre-requisitos

- [ ] Backup de base de datos (si existe)
- [ ] Tag Git: `git tag pre-consolidation-YYYYMMDD`
- [ ] Working tree limpio: `git status` sin cambios
- [ ] `docker-compose.yml` actualizado con nueva ruta de `main.py`

### 6.2 Pasos de ejecución

1. **Eliminar archivos legacy del backend**
   ```bash
   git rm -r apps/api/
   git rm requirements.txt
   ```

2. **Eliminar entidades legacy del dominio**
   ```bash
   git rm -r packages/domain/entities/
   git rm -r packages/domain/
   git rm -r packages/infrastructure/database/
   git rm -r packages/infrastructure/
   git rm -r packages/
   ```

3. **Eliminar páginas frontend no-MVP**
   ```bash
   git rm frontend/src/pages/Analytics.tsx
   git rm frontend/src/pages/Exports.tsx
   ```

4. **Renombrar Dockerfile**
   ```bash
   git mv infrastructure/docker/Dockerfile infrastructure/docker/backend.Dockerfile
   ```

5. **Actualizar docker-compose.yml**
   - Cambiar referencia de `apps.api.main:app` a `apps.backend.src.main:app`
   - Cambiar context build a `apps/backend/src`

6. **Crear estructura de carpetas vacía**
   ```bash
   # Crear todos los __init__.py y archivos placeholder listados en sección 4
   ```

7. **Mover solo engine de base de datos**
   ```bash
   # Extraer create_async_engine de connection.py legacy
   # Colocar en apps/backend/src/core/database.py (limpio, sin Settings mezclado)
   ```

8. **Commit de consolidación**
   ```bash
   git add .
   git commit -m "chore: repository consolidation - Fase 0

   - Eliminar apps/api/ (legacy)
   - Eliminar packages/ (dominio e infra legacy)
   - Eliminar requirements.txt (duplicado)
   - Eliminar páginas frontend no-MVP (Analytics, Exports)
   - Renombrar Dockerfile a backend.Dockerfile
   - Actualizar docker-compose.yml con nueva estructura
   - Crear estructura canónica vacía bajo apps/backend/src/
   - Extraer engine de base de datos a core/database.py

   Ref: docs/fase-0-consolidation-plan.md"
   ```

---

## 7. Checklist de validación post-consolidación

### 7.1 Estructura

- [ ] No existe carpeta `apps/api/`
- [ ] No existe carpeta `packages/`
- [ ] No existe archivo `requirements.txt`
- [ ] No existe `frontend/src/pages/Analytics.tsx`
- [ ] No existe `frontend/src/pages/Exports.tsx`
- [ ] `infrastructure/docker/backend.Dockerfile` existe
- [ ] Todos los `__init__.py` de nueva estructura existen

### 7.2 Imports

- [ ] No hay imports rotos hacia `apps.api`
- [ ] No hay imports rotos hacia `packages.domain`
- [ ] No hay imports rotos hacia `packages.infrastructure`
- [ ] `python -c "import apps.backend.src"` sin errores

### 7.3 Docker

- [ ] `docker-compose config` válido
- [ ] Referencia a `apps.backend.src.main:app` en docker-compose
- [ ] `infrastructure/docker/backend.Dockerfile` builda correctamente

### 7.4 Git

- [ ] `git status` sin archivos duplicados
- [ ] Commit único de consolidación
- [ ] Tag `pre-consolidation-YYYYMMDD` existe

### 7.5 Contaminación legacy

- [ ] No hay clases SQLAlchemy en `apps/backend/src/domain/`
- [ ] No hay rutas FastAPI en `apps/backend/src/interfaces/` (solo placeholders vacíos)
- [ ] No hay configuración Settings mezclada en `core/database.py`

---

## 8. Riesgos de migración

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|--------------|---------|-----------|
| R1 | Imports rotos en frontend por eliminación de páginas | Baja | Bajo | Las páginas eliminadas no eran importadas por App.tsx |
| R2 | Docker roto por ruta cambiada | Media | Alto | Actualizar `docker-compose.yml` en Paso 5 antes de eliminar legacy |
| R3 | Dominio contaminado con SQLAlchemy | Baja | Bajo | NO se mueven entidades legacy. Se crean vacías en Fase 2. |
| R4 | Configuración huérfana | Media | Medio | `apps/api/config.py` se elimina. Se reescribe en Fase 1. |
| R5 | Historial Git perdido | Baja | Bajo | Usar `git rm` para eliminaciones. No hay `git mv` de archivos con deuda. |

---

## 9. Criterio de éxito para cerrar Fase 0

| ID | Criterio | Verificación |
|----|----------|--------------|
| C1 | No existe `apps/api/` | `test -d apps/api && echo FAIL || echo PASS` |
| C2 | No existe `packages/domain/` | `test -d packages/domain && echo FAIL || echo PASS` |
| C3 | No existe `packages/infrastructure/` | `test -d packages/infrastructure && echo FAIL || echo PASS` |
| C4 | No existe `requirements.txt` | `test -f requirements.txt && echo FAIL || echo PASS` |
| C5 | No existe páginas no-MVP en frontend | `ls frontend/src/pages/` solo Dashboard, Products, Suppliers |
| C6 | Existe `infrastructure/docker/backend.Dockerfile` | `test -f && echo PASS` |
| C7 | `docker-compose.yml` apunta a `apps.backend.src.main:app` | `grep "apps.backend.src.main" infrastructure/docker/docker-compose.yml` |
| C8 | Estructura vacía creada | `find apps/backend/src -name "__init__.py" | wc -l` > 20 |
| C9 | NO hay entidades SQLAlchemy en dominio | `grep -r "declarative_base" apps/backend/src/domain/` vacío |
| C10 | Commit de consolidación existe | `git log --oneline | grep "Fase 0"` |

**Todos los criterios PASS = Fase 0 cerrada.**

---

## 10. Comandos de validación

```bash
# 1. Verificar ausencia de legacy
test ! -d apps/api && echo "PASS: apps/api eliminado" || echo "FAIL"
test ! -d packages/domain && echo "PASS: packages/domain eliminado" || echo "FAIL"
test ! -f requirements.txt && echo "PASS: requirements.txt eliminado" || echo "FAIL"

# 2. Verificar frontend limpio
ls frontend/src/pages/ | grep -v "Dashboard\|Products\|Suppliers" && echo "FAIL: páginas sobrantes" || echo "PASS"

# 3. Verificar docker actualizado
grep "apps.backend.src.main" infrastructure/docker/docker-compose.yml && echo "PASS" || echo "FAIL"

# 4. Verificar estructura vacía
find apps/backend/src -name "__init__.py" | wc -l | grep -q '^[2-9][0-9]$' && echo "PASS" || echo "FAIL"

# 5. Verificar sin contaminación SQLAlchemy en dominio
grep -r "declarative_base\|Base)" apps/backend/src/domain/ && echo "FAIL" || echo "PASS"

# 6. Verificar docker-compose
docker-compose config > /dev/null 2>&1 && echo "PASS: docker-compose válido" || echo "FAIL"
```

---

## 11. Veredicto final

**GO.**

Fase 0 es cemento. No construye funcionalidad. Solo limpia el terreno.

- No se mueve código legacy contaminado.
- No se reescribe nada en Fase 0.
- La estructura queda vacía y lista para Fase 1.
- Docker se actualiza antes de eliminar legacy.
- Frontend se limpia de stubs no-MVP.
- El dominio queda 100% libre de SQLAlchemy.

Fase 0 puede ejecutarse inmediatamente después de aprobación.

---

**Fin del plan de consolidación — versión ejecutable.**
