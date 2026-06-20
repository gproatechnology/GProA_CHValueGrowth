# MVP Gap Analysis

## Comentario

Este análisis identifica lo que falta para completar cada fase.

---

## Para Scraping Framework

| Feature | Prioridad | Estado Actual |
|---------|-----------|---------------|
| ScrapingSource model en DB | Future | No implementado |
| ScrapingSource schema API | Future | No prioridad MVP |
| Scraper worker | Critical | Pendiente Phase 6 |
| PriceObservation ingest | Ready | Endpoint existe |
| Scraping session tracking | Future | Requiere ScrapingSource |

---

## Para Product Matching Engine

| Feature | Prioridad | Estado Actual |
|---------|-----------|---------------|
| ProductMatch model en DB | Future | No implementado (futuro) |
| Fingerprint matching | Critical | Esqueleto en Product.fingerprint |
| Confidence scoring | Future | Requiere matching engine |
| Match review UI | Future | Requiere ProductMatch |
| Batch matching jobs | Important | Requiere worker |

---

## Para MVP Core

| Feature | Prioridad | Estado Actual |
|---------|-----------|---------------|
| PostgreSQL Docker | Critical | Docker daemon no disponible |
| Alembic migration | Ready | Creado, no ejecutado |
| Seed data | Ready | Implementado, no ejecutado |
| Suppliers API | Ready | Implementado |
| Products API | Ready | Implementado |
| Observations API | Ready | Implementado |
| Frontend integration | Ready | Implementado |

---

## Missing APIs (MVP)

| Endpoint | Necesidad | Estado |
|----------|-----------|--------|
| GET /suppliers | ✅ Core | ✅ Listo |
| GET /products | ✅ Core | ✅ Listo |
| POST /products/get-or-create | ✅ Core | ✅ Listo |
| POST /observations | ✅ Core | ✅ Listo |
| GET /analytics/overview | Future | ❌ No implementado (Dashboard usa suppliers/products) |
| GET /analytics/trends | Future | ❌ No implementado (Analytics es placeholder) |

---

## Architecture Gaps

| Component | Gap | Impacto |
|-----------|-----|---------|
| CurrencyRepository | No implementado | Dashboard usa currencies indirectamente |
| ScrapingSourceRepository | No implementado | Scraping futuro |
| ProductMatchRepository | No implementado | Matching futuro |
| Analytics use cases | No implementado | Dashboard/analytics usan mock data |

---

## Recommendation

**Phase 6 Ready** cuando:

1. Docker daemon esté disponible
2. PostgreSQL levantado
3. `alembic upgrade head` ejecutado
4. `python -m neumatiq_next.bootstrap.seed_all` ejecutado

Después, Scraping Framework puede comenzar.