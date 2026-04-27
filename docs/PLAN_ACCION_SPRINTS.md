# 🎯 PLAN DE ACCIÓN DETALLADO - NeumatiQ
**Proyecto:** CHValueGrowth - Sistema de Inteligencia de Mercado  
**Creado:** 26/04/2026  
**Última actualización:** 27/04/2026  
**Estado actual:** Sprint 0 COMPLETADO - Integración frontend-backend funcionando  
**Objetivo:** Producción listo en 1-2 semanas (Sprint 1)  
**Metodología:** Sprints 1-week (ajustados por urgencia)

---

## 📊 RESUMEN EJECUTIVO

### Problemas Críticos Identificados (Actualizado):

| # | Problema | Impacto | Prioridad | Estimación | Estado |
|---|----------|---------|-----------|------------|--------|
| 1 | **Frontend NO consume API** (datos MOCK) | 🔴 Bloquea producción | P0 | 2-3 días | ✅ **COMPLETADO (Sprint 0)** |
| 2 | **Usuarios en MOCK_USERS** (no BD) | 🔴 Auth no funciona real | P0 | 2-3 días | ✅ **COMPLETADO (Sprint 0)** |
| 3 | **Scraping MercadoLibre sin API oficial** | 🟡 Riesgo legal | P1 | 1-7 días | ⏳ Pendiente (Sprint 1) |
| 4 | **Sin tests unitarios** (0% cobertura) | 🟡 Calidad | P2 | 3-5 días | ⏳ Pendiente (Sprint 1) |
| 5 | **Sin migraciones (Alembic)** | 🟡 DB changes imposibles | P2 | 1 día | ⏳ Pendiente (Sprint 1) |
| 6 | **Sin índices en BD** | 🟢 Performance | P3 | 2 horas | ⏳ Pendiente (Sprint 1) |

### 🎯 Objetivo del Sprint 0:
**✅ COMPLETADO** - Integración completa frontend ↔ backend + usuarios reales en BD

---

## ✅ SPRINT 0: INTEGRACIÓN CRÍTICA - **COMPLETADO** ✅

**Fecha:** 26-27/04/2026  
**Duración:** 1 día (acelerado)  
**Commit:** `e6a17190` - "feat: Sprint 0 - Integración frontend-backend y usuarios reales en BD"

### Tareas Completadas:

#### Frontend (3 tareas P0):

✅ **Tarea P0-1: Products.jsx - API real**
- Eliminada función `generateProductsData()` MOCK
- Ahora consume `getProducts({ limit: 1000 })` de `api.js`
- Transforma respuesta API a formato UI con `transformApiProduct()`
- Campos simulados: rating, demand, stock, certification (desde analytics en Sprint 2)
- Fallback a MOCK solo en desarrollo si API falla
- **Testing:** Manual, dev server Products page muestra datos reales

✅ **Tarea P0-2: Dashboard.jsx - Endpoints reales**
- Simplificado (eliminadas constantes hardcodeadas BRANDS, TIRE_SIZES, etc.)
- Consume `getProductStats()` y `getGroupedProducts({ group_by: 'brand' })`
- Estado: `stats`, `groupedByBrand`, `loading`, `error`
- Muestra KPI cards: Total Productos, Precio Promedio, Valor Inventario, Marcas
- Tabla de últimos productos (`allProducts` cargados con `getProducts()`)
- **Nota:** Dashboard versión minimalista (gráficos enriquecidos en Sprint 2)

✅ **Tarea P0-3: App.jsx Login real**
- Reemplazado `setTimeout` fake por llamada `login(username, password)`
- Inputs convertidos a componentes controlados (`useState`)
- Guarda token en `localStorage.getItem('chvalue_token')`
- Layout verifica token al montar (`useEffect` check auth)
- `handleLogout` limpia storage y redirige
- Token storage: `chvalue_token` (cambio desde `neumatiq_token` para consistencia)

#### Backend (3 tareas P0):

✅ **Tarea P0-4: Modelo User en BD**
- Archivo: `database/models.py`
- Campos: `id, username, email, password_hash, full_name, role, is_active, is_verified, timestamps`
- Constraints: `CheckConstraint("role IN ('admin', 'user', 'manager')")`
- Métodos: `set_password()` (bcrypt), `verify_password()`, `to_dict()`
- **Tabla creada:** `users` en SQLite

✅ **Tarea P0-5: UserRepository**
- Archivo: `database/repository.py` (clase nueva)
- CRUD completo: `get_by_username/email/id`, `get_all`, `create_user`, `update_last_login`, `update_password`, `deactivate/activate`, `change_role`
- Manejo de sesión automático (`_get_session()`)
- Commit/rollback en create/update

✅ **Tarea P0-6: Migración auth.py a BD**
- Eliminado `MOCK_USERS` dictionary completely
- `authenticate_user()` → consulta `UserRepository`, verifica bcrypt, actualiza `last_login`
- `require_role()` → consulta BD, verifica `user.role` y `is_active`
- `GET /me` → retorna `user.to_dict()` desde BD
- `GET /users` (admin) → `UserRepository.get_all()`
- `POST /change-password` → `user.set_password()`, commit BD, revoca tokens
- Import: `from database.repository import UserRepository`

#### Scripts:

✅ **Tarea P0-7: create_admin_user.py ajustado**
- Cambiado de `UserRole.ADMIN` enum → string `'admin'`
- Compatible con nuevo `User` model
- **Verificado:** Crea admin correctamente en `data/chvaluegrowth.db`

✅ **Tarea P0-8: Síntaxis verificada**
- `py_compile` todos los archivos modificados: OK
- Import backend: `from services.api.main import app` → **OK**
- `authenticate_user('admin','admin123')` → retorna dict usuario

✅ **Tarea P0-9: Commit y push**
- 3 commits realizados y subidos a GitHub
- URL: https://github.com/gproatechnology/GProA_CHValueGrowth

---

## 📋 SPRINT 1: PRODUCTION HARDENING (1-2 semanas)

**Inicio estimado:** 27/04/2026  
**Duración:** 5-10 días hábiles  
**Objetivo:** Deploy a Render staging con monitoreo y tests

### Tareas Pendientes (Orden de Prioridad):

#### 🔴 P1 - Database & Migrations (Día 1-2)

**Tarea P1-1: Alembic migraciones**
- Instalar: `pip install alembic`
- Inicializar: `alembic init alembic`
- Configurar `alembic.ini` con `sqlalchemy.url = sqlite:///data/chvaluegrowth.db`
- Generar migración inicial:
  ```bash
  alembic revision --autogenerate -m "Initial: products, users tables"
  alembic upgrade head
  ```
- **Commit:** carpeta `alembic/`
- **Nota:** En producción PostgreSQL, Alembic gestiona cambios sin perder datos

**Tarea P1-2: Índices SQL**
- Migración separada Alembic: ` alembic revision -m "Add indexes"`
- SQL:
  ```python
  op.create_index('idx_product_brand', 'products', ['brand'])
  op.create_index('idx_product_size', 'products', ['size'])
  op.create_index('idx_product_scraped_at', 'products', ['scraped_at DESC'])
  ```
- Validación: `EXPLAIN QUERY PLAN` (<100ms)

#### 🟡 P1 - Testing (Día 2-4)

**Tarea P1-3: Tests unitarios básicos** (pytest)
- Instalar: `pip install pytest pytest-cov`
- Estructura: `tests/` folder
- Archivos:
  - `tests/test_products.py` (CRUD repository)
  - `tests/test_auth.py` (login, authenticate_user)
  - `tests/test_users.py` (UserRepository)
- Ejecutar: `pytest tests/ -v --cov=services --cov=database`
- **Meta:** Cobertura > 60%

#### 🟡 P1 - Deployment Prep (Día 3-5)

**Tarea P1-4: Redis en Render**
- Agregar servicio Redis en `render.yaml`
- Actualizar env vars: `REDIS_URL` from service
- **Costo:** +$7/mes

**Tarea P1-5: HTTPS & CORS estricto**
- Modificar `services/api/main.py`: conditional `allow_origins`
- Agregar middleware redirect HTTP → HTTPS (producción)

**Tarea P1-6: Logging estructurado**
- Opcional: Implementar `structlog`
- Mínimo: asegurar timestamps en todos los logs

#### 🟢 P2 - Scraping Legalización (Día 5-7)

**Tarea P1-7: Evaluar MercadoLibre API oficial**
- Decisión CH ValueGrowth: API oficial vs disclaimer
- Si API oficial: implementar OAuth2 cliente

**Tarea P1-8: Disclaimer legal**
- Agregar en `README.md` sección "Aviso Legal"
- En API responses: campo `"disclaimer"` en `/products`

#### 🟢 P2 - Monitoreo (Día 7-10)

**Tarea P1-9: Sentry error tracking**
- Crear cuenta Sentry (gratis: 5,000 events/mes)
- Configurar en `services/api/main.py`

**Tarea P1-10: Uptime monitoring**
- Registrar en UptimeRobot (gratis: 50 monitores)
- Monitorear: `https://chvaluegrowth-api.onrender.com/health`

---

## 📅 SPRINT 2: ESCALABILIDAD & FEATURES (2 semanas)

**Inicio estimado:** 10/05/2026  
**Duración:** 10 días hábiles

### Tareas:

**Tarea P2-1: Scraper mejorado**
- API oficial ML o proxy rotation

**Tarea P2-2: Caché de consultas frecuentes**
- `@lru_cache(maxsize=128)` en repository

**Tarea P2-3: Export datos**
- CSV/Excel/PDF formats

**Tarea P2-4: Filtros avanzados frontend**
- Range slider, multi-select, date picker

**Tarea P2-5: PWA enhancements**
- Service Worker mejorado, push notifications

---

## 📅 SPRINT 3: PRODUCTION LAUNCH (1 semana)

**Inicio estimado:** 24/05/2026  
**Duración:** 5 días hábiles

### Tareas:

**Tarea P3-1: Load testing** (Locust, 100 concurrent)

**Tarea P3-2: Security audit** (OWASP ZAP, Bandit)

**Tarea P3-3: Performance optimizations**
- Frontend bundle analyzer, Gzip middleware

**Tarea P3-4: Monitoreo 24/7** (Sentry + UptimeRobot)

**Tarea P3-5: Go-live**
- DNS, SSL, anuncio beta

---

## 📊 MÉTRICAS DE ÉXITO (KPis)

| Métrica | Target | Actual | Deadline |
|---------|--------|--------|----------|
| Frontend consume API | 100% | ✅ 100% | Sprint 0 |
| Usuarios en BD | 100% | ✅ 100% | Sprint 0 |
| Test coverage | > 60% | 0% | Sprint 1 fin |
| Response time (p50) | < 200ms | N/A | Sprint 1 fin |
| Uptime | > 99.5% | N/A | Sprint 3 |
| Error rate | < 0.1% | N/A | Sprint 3 |

---

## 💰 COSTO ESTIMADO PRODUCCIÓN

| Servicio | Costo/mes | Status |
|----------|-----------|--------|
| Render Web (API) | $7 | Starter plan |
| Render PostgreSQL | $7 | Sprint 1 |
| Render Redis | $7 | Sprint 1 |
| Sentry | $0 | Free tier |
| UptimeRobot | $0 | Free tier |
| **Total** | **$21/mes** | Mínimo viable |

---

## 🚨 RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Estado |
|--------|--------------|---------|--------|
| Frontend no integrado | Baja | Alto | ✅ Resuelto Sprint 0 |
| Usuarios BD migration | Baja | Alto | ✅ Resuelto Sprint 0 |
| Scraper bloqueado ML | Alta | Medio | ⏳ Sprint 1 |
| Render free hiberna | Alta | Medio | ✅ Upgrade $7/mes |
| Performance DB lenta | Media | Medio | ⏳ Índices + PG Sprint 1 |

---

## ✅ LOGROS SPRINT 0

### Frontend:
- [x] Products.jsx consume API real
- [x] Dashboard.jsx muestra datos reales
- [x] Login JWT funcional
- [x] Auth guarda/verifica token

### Backend:
- [x] Modelo User en BD
- [x] UserRepository CRUD
- [x] auth.py sin MOCK_USERS
- [x] Admin user creado

### Commits:
- `84a9e44` docs: auditoría y plan
- `e6a17190` feat: Sprint 0 integración
- `41494589` fix: UniqueConstraint import

---

## 📋 CHECKLIST PRE-PRODUCTION

### ✅ Completados:
- [x] Frontend consume API
- [x] Usuarios en BD real
- [x] Login JWT funciona
- [x] Backend sin errores

### 🟡 Sprint 1 (Críticos):
- [ ] Alembic migraciones
- [ ] Índices SQL
- [ ] Tests unitarios (>60%)
- [ ] Redis en Render
- [ ] HTTPS enforcement
- [ ] CORS estricto
- [ ] Sentry monitoreo
- [ ] Decisión scraping legal

### 🟢 Sprint 2-3 (Features):
- [ ] Scraper mejorado
- [ ] Caché consultas
- [ ] Export datos
- [ ] Filtros avanzados
- [ ] Load testing
- [ ] Security audit

---

## 🎯 PRÓXIMO SPRINT: SPRINT 1 - PRODUCTION HARDENING

**Inicio:** 27/04/2026  
**Duración:** 5-10 días  
**Objetivo:** Deploy a Render staging

**Acciones inmediatas:**
1. Instalar Alembic, generar migración inicial
2. Crear tests básicos (pytest)
3. Configurar Redis en Render
4. Decidir scraping legalización

---

*Plan actualizado: 27/04/2026*  
*Sprint 0: ✅ COMPLETADO*  
*Próxima revisión: fin Sprint 1*
