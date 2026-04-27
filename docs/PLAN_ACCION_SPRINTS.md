# 🎯 PLAN DE ACCIÓN DETALLADO - NeumatiQ
**Proyecto:** CHValueGrowth - Sistema de Inteligencia de Mercado  
**Creado:** 26/04/2026  
**Última actualización:** 27/04/2026  
**Estado actual:** Sprint 2 EN PROGRESO — Scraper mejorado y exportación implementados  
**Objetivo:** Escalabilidad & features avanzadas en 10 días  
**Metodología:** Sprints 1-week (ajustados por urgencia)

---

## 📊 RESUMEN EJECUTIVO

### Problemas Críticos — Estado:

| # | Problema | Impacto | Prioridad | Estimación | Estado |
|---|----------|---------|-----------|------------|--------|
| 1 | Frontend NO consume API | 🔴 Bloqueo producción | P0 | 2-3 días | ✅ Sprint 0 |
| 2 | Usuarios en MOCK_USERS | 🔴 Auth no real | P0 | 2-3 días | ✅ Sprint 0 |
| 3 | Sin tests unitarios | 🟡 Calidad | P2 | 3-5 días | ✅ Sprint 1 |
| 4 | Sin migraciones / índices | 🟡 Performance | P2 | 1 día | ✅ Sprint 1 |
| 5 | Sin Redis / CORS / HTTPS | 🟡 Deploy seguro | P1 | 2-3 días | ✅ Sprint 1 |
| 6 | Sin disclaimer legal | 🟢 Cumplimiento | P2 | 1 día | ✅ Sprint 1 |
| 7 | Sin monitoreo (Sentry) | 🟢 Ops | P2 | 1 día | ✅ Sprint 1 |
| 8 | Scraper frágil sin retry/paginación | 🟡 Confiabilidad | P2 | 2 días | ✅ Sprint 2 |
| 9 | Sin exportación de datos | 🟢 Feature | P3 | 2 días | ✅ Sprint 2 |
| 10 | Sin filtros avanzados UI | 🟢 UX | P3 | 2 días | ✅ Sprint 2 |

---

## ✅ SPRINT 0: INTEGRACIÓN CRÍTICA — COMPLETADO

**Fecha:** 26-27/04/2026  
**Commit:** `e6a17190` - "feat: Sprint 0 - Integración frontend-backend y usuarios reales en BD"

### Frontend:
- [x] Products.jsx consume API real
- [x] Dashboard.jsx endpoints reales
- [x] App.jsx login JWT funcional

### Backend:
- [x] Modelo User en BD
- [x] UserRepository CRUD
- [x] auth.py sin MOCK_USERS

---

## ✅ SPRINT 1: PRODUCTION HARDENING — COMPLETADO

**Fecha:** 27/04/2026  
**Commit:** `45c78239` - "feat: Sprint 1 - Production hardening con Redis cache, HTTPS/CORS estricto, disclaimer legal y tests"

### DB & Migrations:
- [x] Migración SQL con 7 índices
- [x] Script UTF-8 Windows

### Testing:
- [x] 16 tests unitarios (pytest) — todos pasan

### Deployment & Security:
- [x] Redis en Render + cache layer en API endpoints
- [x] HTTPS enforcement + CORS estricto
- [x] Sentry SDK + disclaimer legal
- [x] SQLAlchemy >=2.0.38 compatibilidad

---

## 🚀 SPRINT 2: ESCALABILIDAD & FEATURES — EN PROGRESO

**Inicio:** 27/04/2026  
**Objetivo:** Features avanzados, escalabilidad y UX mejorada

### Tareas Completadas (hasta ahora):

#### ✅ T2-1: Scraper Mejorado
**Commit:** `18ef45d6`
- [x] Retry exponencial con `tenacity` (3 intentos, backoff 2-10s)
- [x] Proxy rotation soportado (`SCRAPER_PROXY` env var)
- [x] Paginación automática (hasta `SCRAPER_MAX_PAGES` páginas, default 3)
- [x] Selectores CSS robustos (múltiples alternativas)
- [x] Extracción mejorada: marcas (35+), tamaños (formatos variados)
- [x] Fallback graceful: si real falla → mock data
- [x] Timeout configurable (30s default)
- [x] Delays aleatorios entre requests (2-5s)

#### ✅ T2-3: Exportación de Datos
**Archivo:** `services/api/export.py` + endpoint `/api/v1/products/export`
- [x] Export a CSV (text/csv; charset=utf-8)
- [x] Export a Excel (.xlsx con openpyxl)
- [x] Export a JSON (pretty-print)
- [x] Filtros aplicados (brand, size) en exportación
- [x] Headers `Content-Disposition` con nombre timestamped
- [x] Disclaimer legal incluido en response headers
- [x] Streaming no requerido (datos <10k filas)

#### ✅ T2-4: Filtros Avanzados Frontend
**Archivo:** `frontend/src/pages/Products.jsx`
- [x] Range slider para precio (con inputs numéricos)
- [x] Multi-select para marcas (hasta 8 visibles, scroll)
- [x] Date picker para rango de fecha de captura (`scraped_at`)
- [x] Panel collapsible "Filtros Avanzados"
- [x] Botón "Limpiar filtros" resetea todos
- [x] Estilos CSS personalizados (range input, scrollbar)
- [x] Botón "Exportar" con dropdown (CSV, Excel, JSON)
- [x] Integración con API de exportación (descarga en nueva pestaña)

---

### Tareas Pendientes Sprint 2:

#### 🔜 T2-2: Caché de Consultas Expandido
- [ ] Decorador `@cached` para repository methods
- [ ] Cache por query con TTL diferenciado (stats: 60s, products: 300s)
- [ ] Invalidación selectiva por entidad

#### 🔜 T2-5: PWA Enhancements
- [ ] Service Worker mejorado (caching offline de assets)
- [ ] Push notifications para alerts de stock/precio
- [ ] Manifest actualizado (icons, splash screen)

#### 🔜 T2-6: PostgreSQL en Render
- [ ] Evaluar costo/benefit (PostgreSQL $7/mes vs SQLite free)
- [ ] Migración de datos SQLite → PostgreSQL
- [ ] Actualizar `render.yaml` para usar PostgreSQL
- [ ] Tests de compatibilidad

---

## 📅 SPRINT 3: PRODUCTION LAUNCH (PENDIENTE)

**Inicio estimado:** 24/05/2026  

### Tareas:
- [ ] Security audit (OWASP ZAP, Bandit)
- [ ] Load testing (Locust 100 concurrent)
- [ ] Monitoreo 24/7 (Sentry + UptimeRobot config)
- [ ] Go-live: DNS, SSL, anuncio beta
- [ ] Documentación de operación

---

## 📊 MÉTRICAS DE ÉXITO (KPIs)

| Métrica | Target | Actual | Deadline |
|---------|--------|--------|----------|
| Frontend consume API | 100% | ✅ 100% | Sprint 0 |
| Usuarios en BD | 100% | ✅ 100% | Sprint 0 |
| Test coverage | > 60% | ~40% | Sprint 2 fin |
| Scraper confiabilidad | > 90% éxito | ✅ Mejorado | Sprint 2 |
| Response time (p50) | < 200ms | ~120ms (cache) | Sprint 2 |
| Export formats | 3 | ✅ 3 (CSV/Excel/JSON) | Sprint 2 |

---

## 💰 COSTO ESTIMADO PRODUCCIÓN

| Servicio | Costo/mes | Status |
|----------|-----------|--------|
| Render Web (API) | $7 | Activo |
| Render PostgreSQL | $7 | Sprint 2 (opcional) |
| Render Redis | $7 | Activo |
| Sentry | $0 | Integrado |
| UptimeRobot | $0 | Pendiente |
| **Total** | **$21/mes** | Mínimo viable |

---

## 🚨 RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Estado |
|--------|--------------|---------|--------|
| Frontend no integrado | Baja | Alto | ✅ Resuelto |
| Usuarios BD migration | Baja | Alto | ✅ Resuelto |
| Scraper bloqueado ML | Media | Medio | ⚠️ Mitigado: retry + proxies |
| Render free hiberna | Alta | Medio | ✅ Upgrade $7 |
| Performance DB | Media | Medio | ✅ Índices + PG opcional |

---

## ✅ LOGROS SPRINT 2 — PROGRESO

### Scraper Mejorado:
- [x] Retry exponencial (tenacity)
- [x] Proxy rotation (SCRAPER_PROXY)
- [x] Paginación multi-page (max 3 páginas)
- [x] Selectores robustos (múltiples CSS selectors)
- [x] Extracción mejorada de marcas y tamaños

### Exportación de Datos:
- [x] DataExporter module (CSV, Excel, JSON)
- [x] Endpoint REST `/api/v1/products/export`
- [x] Filtros aplicados a exportación
- [x] Headers de descarga apropiados

### Frontend Avanzado:
- [x] Filtros avanzados UI (precio rango, multi-select marcas, date picker)
- [x] Panel collapsible diseño responsive
- [x] Botón Exportar con dropdown (3 formatos)
- [x] Estilos personalizados CSS (range slider, scrollbar)

---

*Plan actualizado: 27/04/2026*  
*Sprint 0: ✅ COMPLETADO*  
*Sprint 1: ✅ COMPLETADO*  
*Sprint 2: 🚀 EN PROGRESO (50% completado)*  
*Próxima revisión: fin Sprint 2*
