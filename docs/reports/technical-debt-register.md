# Technical Debt Register

## Critical (Blocking MVP)

| ID | Debt | Impact | Resolution |
|----|------|--------|------------|
| TDC-001 | Docker daemon no disponible | No testing e2e | Recuperar Docker Desktop |
| TDC-002 | PostgreSQL no conectado | No persistencia real | Levantar DB en Docker |

## High

| ID | Debt | Impact | Resolution |
|----|------|--------|------------|
| TDH-001 | Domain layer inexistente | Acoplamiento ORM | Factor repository abstraction |
| TDH-002 | Analytics endpoints faltantes | Dashboard sin datos reales | Crear endpoints de analytics |

## Medium

| ID | Debt | Impact | Resolution |
|----|------|--------|------------|
| TDM-001 | CurrencyRepository no implementado | Relaciones currencies | Implementar |
| TDM-002 | ScrapingSource entity | Workers scraping | Phase futura |
| TDM-003 | ProductMatch entity | Matching engine | Phase futura |

## Low

| ID | Debt | Impact | Resolution |
|----|------|--------|------------|
| TDL-001 | Índices explícitos no creados | Queries lentas | Añadir en migration |
| TDL-002 | Logging estructurado | Debugging difícil | Mejorar handlers |
| TDL-003 | Tests de integración scraping | Confianza limitada | Añadir tests reales |

---

## Debt Metrics

- Critical: 2
- High: 2
- Medium: 3
- Low: 3
- **Total: 10 items**

---

## ROI Prioritization

1. **TDC-001/002** (Critical) - Habilita todo el MVP
2. **TDH-001** (High) - Mejora arquitectura
3. **TDM-001** (Medium) - Completar referencial