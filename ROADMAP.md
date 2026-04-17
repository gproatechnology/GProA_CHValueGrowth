# Roadmap de Desarrollo - NeumatiQ CHValueGrowth

**Proyecto:** Sistema de Gestión Integral para Neumáticos  
**Última actualización:** 2026-04-16

---

## Fase 1: Base Sólida (Sprint 1-2)

### Sprint 1: Dependencias y Build

| Tarea | Estado | Prioridad | Estimación |
|-------|--------|----------|-------------|
| Agregar `leaflet` a package.json | ✅ Completado | Alta | 1h |
| Agregar `@tanstack/react-query` | ✅ Completado | Alta | 1h |
| Verificar build local | ✅ Completado | Alta | 30min |
| Push a repo | ✅ Completado | Alta | 15min |

**Objetivo:** Build sin errores.

**Criteria de Done:**
- ✅ `npm run build` ejecuta sin errores
- ✅ Archivos en `dist/` generados correctamente

---

### Sprint 2: React Query Integration

| Tarea | Estado | Prioridad | Estimación |
|-------|--------|----------|-------------|
| Configurar React Query Provider | ✅ Completado | Alta | 1h |
| Refactorizar API service | ✅ Completado | Alta | 2h |
| Implementar hooks para products | ✅ Completado | Alta | 2h |
| Implementar hooks para orders | ✅ Completado | Media | 2h |
| Implementar loading states | ✅ Completado | Media | 1h |
| Implementar error handling | ✅ Completado | Media | 1h |

**Objetivo:** Data fetching robusto con caché.

**Criteria de Done:**
- ✅ Queries con caché automático
- ✅ Loading spinners en todas las páginas
- ✅ Manejo de errores centralizado

**Archivos creados:**
- `src/hooks/useApi.js` - Hooks de React Query
- `src/components/LoadingSpinner.jsx` - Componentes UI

---

## Fase 2: Integración Backend (Sprint 3-4)

### Sprint 3: Endpoints API

| Tarea | Estado | Prioridad | Estimación |
|-------|--------|----------|-------------|
| Completar CRUD Products | ✅ Completado | Alta | 4h |
| Completar CRUD Orders | ✅ Completado | Alta | 4h |
| Completar CRUD Customers | ✅ Completado | Alta | 4h |
| Agregar validación Pydantic | ✅ Completado | Media | 2h |
| Swagger documentation | ⏳ Pendiente | Media | 2h |

**Objetivo:** API completa con CRUD.

**Criteria de Done:**
- ✅ Endpoints CRUD Products: GET, POST, PUT, DELETE
- ✅ Endpoints CRUD Orders: GET, POST, PUT, DELETE
- ✅ Endpoints CRUD Customers: GET, POST, PUT, DELETE
- ✅ Validación Pydantic (schemas)
- ⏳ Swagger documentación (auto-generado por FastAPI)

**Archivos creados/modificados:**
- `services/api/routes/orders.py` - Nuevos endpoints
- `services/api/routes/products.py` - CRUD
- `database/models.py` - Modelos Order, Customer
- `services/api/main.py` - Router registration

---

### Sprint 4: Integración Frontend

| Tarea | Estado | Prioridad | Estimación |
|-------|--------|----------|-------------|
| Conectar Dashboard con API | 🔴 Pendiente | Alta | 2h |
| Conectar Products con API | ✅ Completado | Alta | 2h |
| Conectar Orders con API | ✅ Completado | Alta | 2h |
| Conectar Customers con API | ✅ Completado | Alta | 2h |
| Conectar Settings con API | 🔴 Pendiente | Media | 1h |

**Objetivo:** Frontend consume API real.

**Criteria de Done:**
- ✅ Hooks de React Query disponibles
- ✅ Componentes de tabla con API (ProductsTable, OrdersTable, CustomersTable)
- ✅ Loading states y error handling
- ✅ Refresco automático después de mutaciones

**Archivos creados:**
- `src/pages/ProductsTable.jsx` - Tabla de productos con API
- `src/pages/OrdersTable.jsx` - Tabla de órdenes con API
- `src/pages/CustomersTable.jsx` - Tabla de clientes con API

---

## Fase 3: Features de Negocio (Sprint 5-6)

### Sprint 5: Scraper Real

| Tarea | Estado | Prioridad | Estimación |
|-------|--------|----------|-------------|
| Configurar MOCK_MODE=false | 🔴 Pendiente | Alta | 30min |
| Implementar scraper MercadoLibre | 🔴 Pendiente | Alta | 8h |
| Normalización de datos | 🔴 Pendiente | Alta | 4h |
| Scheduler (cron) | 🔴 Pendiente | Alta | 4h |
| Alertas de precio | 🔴 Pendiente | Media | 2h |

**Objetivo:** Scraping automático.

**Criteria de Done:**
- Datos se scrapean automáticamente
- Base de datos se actualiza
- Alertas configurables

---

### Sprint 6: Analytics y Reporting

| Tarea | Estado | Prioridad | Estimación |
|-------|--------|----------|-------------|
| Métricas en tiempo real | 🔴 Pendiente | Alta | 4h |
| Gráficos interactivos | 🔴 Pendiente | Alta | 4h |
| Exportar PDF | 🔴 Pendiente | Media | 2h |
| Exportar Excel | 🔴 Pendiente | Media | 2h |
| Dashboard KPIs | 🔴 Pendiente | Alta | 4h |

**Objetivo:** Reporting completo.

**Criteria de Done:**
- Dashboard con métricas reales
- Exportación funcional
- Gráficos actualizados

---

## Fase 4: Producción (Sprint 7-8)

### Sprint 7: Testing y Calidad

| Tarea | Estado | Prioridad | Estimación |
|-------|--------|----------|-------------|
| Configurar Jest | 🔴 Pendiente | Alta | 2h |
| Tests unitarios (backend) | 🔴 Pendiente | Alta | 8h |
| Tests unitarios (frontend) | 🔴 Pendiente | Alta | 8h |
| Tests de integración | 🔴 Pendiente | Media | 8h |

**Objetivo:** Cobertura de测试 > 70%.

**Criteria de Done:**
- Tests pasan automáticamente
- Coverage报告显示

---

### Sprint 8: Deployment y Optimización

| Tarea | Estado | Prioridad | Estimación |
|-------|--------|----------|-------------|
| PostgreSQL en Render | 🔴 Pendiente | Alta | 2h |
| Optimizar bundle size | 🔴 Pendiente | Media | 4h |
| PWA offline support | 🔴 Pendiente | Media | 4h |
| Performance monitoring | 🔴 Pendiente | Media | 2h |

**Objetivo:** Production ready.

**Criteria de Done:**
- App funciona en producción
- Tiempos de carga < 3s
- Modo offline funcional

---

## Resumen de Sprints

| Sprint | Nombre | Estimación | Estado |
|--------|--------|------------|--------|
| 1 | Dependencias y Build | 2.5h | 🔴 Pendiente |
| 2 | React Query | 10h | 🔴 Pendiente |
| 3 | Endpoints API | 16h | 🔴 Pendiente |
| 4 | Integración Frontend | 9h | 🔴 Pendiente |
| 5 | Scraper Real | 20h | 🔴 Pendiente |
| 6 | Analytics y Reporting | 16h | 🔴 Pendiente |
| 7 | Testing y Calidad | 26h | 🔴 Pendiente |
| 8 | Deployment y Optimización | 14h | 🔴 Pendiente |

**Total estimado:** ~114 horas (~3-4 semanas a 30h/semana)

---

## Cómo Usar Este Roadmap

1. **Seleccionar Sprint:** Elegir el sprint actual
2. **Revisar tareas:** Verificar cada tarea
3. **Completar tarea:** Marcar ✅ al finalizar
4. **Criteria of Done:** Verificar que se cumple
5. **Pasar al siguiente:** Avanzar al próximo sprint

---

## Notas

- Este roadmap se actualiza conforme avanza el desarrollo
- Las estimaciones son aproximadas y pueden variar
-_prioridad puede ajustarse según necesidades del negocio