# 🎯 PLAN DE ACCIÓN DETALLADO - NeumatiQ
**Proyecto:** CHValueGrowth - Sistema de Inteligencia de Mercado  
**Creado:** 26/04/2026  
**Última actualización:** 27/04/2026  
**Estado actual:** Sprint 1 COMPLETADO - Production hardening implementado  
**Objetivo:** Producción listo en Render con monitoreo y tests  
**Metodología:** Sprints 1-week (ajustados por urgencia)

---

## 📊 RESUMEN EJECUTIVO

### Problemas Críticos — Estado Actual:

| # | Problema | Impacto | Prioridad | Estimación | Estado |
|---|----------|---------|-----------|------------|--------|
| 1 | Frontend NO consume API (datos MOCK) | 🔴 Bloquea producción | P0 | 2-3 días | ✅ **COMPLETADO (Sprint 0)** |
| 2 | Usuarios en MOCK_USERS (no BD) | 🔴 Auth no funciona real | P0 | 2-3 días | ✅ **COMPLETADO (Sprint 0)** |
| 3 | Sin tests unitarios (0% cobertura) | 🟡 Calidad | P2 | 3-5 días | ✅ **COMPLETADO (Sprint 1)** |
| 4 | Sin migraciones / índices en BD | 🟡 Performance | P2 | 1 día | ✅ **COMPLETADO (Sprint 1)** |
| 5 | Sin Redis / CORS estricto / HTTPS | 🟡 Deploy seguro | P1 | 2-3 días | ✅ **COMPLETADO (Sprint 1)** |
| 6 | Sin disclaimer legal | 🟢 Cumplimiento | P2 | 1 día | ✅ **COMPLETADO (Sprint 1)** |
| 7 | Sin monitoreo (Sentry) | 🟢 Ops | P2 | 1 día | ✅ **COMPLETADO (Sprint 1)** |
| 8 | Scraping MercadoLibre sin API oficial | 🟡 Riesgo legal | P1 | 1-7 días | ⏳ **Pendiente (Sprint 2)** |

---

## ✅ SPRINT 0: INTEGRACIÓN CRÍTICA — COMPLETADO

**Fecha:** 26-27/04/2026  
**Duración:** 1 día (acelerado)  
**Commit:** `e6a17190` - "feat: Sprint 0 - Integración frontend-backend y usuarios reales en BD"

### Frontend:
- [x] Products.jsx consume API real (eliminado MOCK)
- [x] Dashboard.jsx endpoints reales (stats, grouped)
- [x] App.jsx login JWT funcional con token storage

### Backend:
- [x] Modelo User en BD (SQLAlchemy)
- [x] UserRepository CRUD completo
- [x] auth.py migrado sin MOCK_USERS
- [x] Admin user creado vía script

---

## ✅ SPRINT 1: PRODUCTION HARDENING — COMPLETADO

**Fecha:** 27/04/2026  
**Duración:** 1 día (implementación acelerada)  
**Commit:** `45c78239` - "feat: Sprint 1 - Production hardening con Redis cache, HTTPS/CORS estricto, disclaimer legal y tests"

### Database & Migrations:
- [x] Migración SQL inicial con índices (`scripts/migrations/001_initial_schema.sql`)
- [x] Script ejecutable `scripts/run_migration.py` (UTF-8 Windows safe)
- [x] Índices: products (brand, size, scraped_at), users (username, email, role, is_active)

### Testing:
- [x] Suite de tests unitarios: 16 tests (auth 4, products 5, users 7)
- [x] Todos pasan (16/16) con pytest
- [x] Dependencias agregadas: `pytest`, `pytest-asyncio`, `alembic`

### Deployment & Security:
- [x] Redis service en `render.yaml` + `REDIS_URL` configurado
- [x] Cache layer (`services/api/cache.py`) en endpoints GET:
  - `/api/v1/products`
  - `/api/v1/products/stats`
  - `/api/v1/products/grouped`
  - `/api/v1/products/{product_id}`
- [x] CORS estricto condicional (development: localhost, production: dominios configurados)
- [x] HTTPS enforcement middleware (redirect HTTP→HTTPS en producción)
- [x] TrustedHostMiddleware (solo producción)
- [x] Sentry SDK integrado (condicional a `SENTRY_DSN`)
- [x] Disclaimer legal en `README.md` y headers API (`X-Legal-Disclaimer`, `X-Data-Source`)
- [x] SQLAlchemy >=2.0.38 (Python 3.14 compatible)

---

## 📋 SPRINT 2: ESCALABILIDAD & FEATURES

**Inicio estimado:** 10/05/2026  
**Duración:** 10 días hábiles  
**Objetivo:** Features avanzados, escalabilidad y mejoras UX

### Tareas Pendientes:

#### P1 - Scraping & Datos:
- [ ] Scraper mejorado (API oficial MercadoLibre o proxy rotation)
- [ ] rate limiting robusto (Redis-backed)
- [ ] Backup automático de BD (script existente ajustar)

#### P2 - Features:
- [ ] Exportación de datos (CSV/Excel/PDF)
- [ ] Filtros avanzados frontend (range slider, multi-select, date picker)
- [ ] PWA enhancements (Service Worker, push notifications)
- [ ] Dashboard con gráficos enriquecidos (Chart.js / Recharts)

#### P3 - Infra:
- [ ] Migrar SQLite → PostgreSQL en Render (reemplazar `render.yaml` DB)
- [ ] Cache de consultas frecuentes expandido (patrón Repository con decorators)
- [ ] Performance: bundle analyzer frontend, gzip middleware backend
- [ ] Load testing con Locust (100 concurrent)

---

## 📅 SPRINT 3: PRODUCTION LAUNCH

**Inicio estimado:** 24/05/2026  
**Duración:** 5 días hábiles

### Tareas:
- [ ] Security audit (OWASP ZAP, Bandit)
- [ ] Monitoreo 24/7 (Sentry + UptimeRobot)
- [ ] Go-live: DNS, SSL, anuncio beta
- [ ] Documentación de despliegue y operación

---

## 📊 MÉTRICAS DE ÉXITO (KPIs)

| Métrica | Target | Actual | Deadline |
|---------|--------|--------|----------|
| Frontend consume API | 100% | ✅ 100% | Sprint 0 |
| Usuarios en BD | 100% | ✅ 100% | Sprint 0 |
| Test coverage | > 60% | ~40% | Sprint 2 |
| Response time (p50) | < 200ms | N/A | Sprint 2 |
| Uptime | > 99.5% | N/A | Sprint 3 |
| Error rate | < 0.1% | N/A | Sprint 3 |

---

## 💰 COSTO ESTIMADO PRODUCCIÓN

| Servicio | Costo/mes | Status |
|----------|-----------|--------|
| Render Web (API) | $7 | Starter plan (activo) |
| Render PostgreSQL | $7 | Sprint 2 |
| Render Redis | $7 | Sprint 1 (configurado) |
| Sentry | $0 | Free tier (integrado) |
| UptimeRobot | $0 | Free tier (pendiente) |
| **Total** | **$21/mes** | Mínimo viable |

---

## 🚨 RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Estado |
|--------|--------------|---------|--------|
| Frontend no integrado | Baja | Alto | ✅ Resuelto Sprint 0 |
| Usuarios BD migration | Baja | Alto | ✅ Resuelto Sprint 0 |
| Scraper bloqueado ML | Alta | Medio | ⏳ Sprint 2 |
| Render free hiberna | Alta | Medio | ✅ Upgrade $7/mes |
| Performance DB lenta | Media | Medio | ✅ Índices agregados |

---

## ✅ LOGROS SPRINT 0 — DETALLE

### Frontend integrado:
- Products.jsx → API real
- Dashboard.jsx → stats + grouped
- Login JWT → BD usuarios

### Backend real:
- User model + repository
- Auth sin MOCK
- Admin user creado

---

## ✅ LOGROS SPRINT 1 — DETALLE

### DB & Migrations:
- Migración SQL completa con 7 índices
- Script cross-platform (UTF-8)

### Tests:
- 16 tests unitarios implementados
- Cobertura funcional aprobada

### Infra & Security:
- Redis configurado en Render
- Caching en productos endpoints (TTL 300s)
- HTTPS + CORS estricto
- Sentry listo para producción
- Disclaimer legal/documentado

---

*Plan actualizado: 27/04/2026*  
*Sprint 0: ✅ COMPLETADO*  
*Sprint 1: ✅ COMPLETADO*  
*Próxima revisión: inicio Sprint 2*
