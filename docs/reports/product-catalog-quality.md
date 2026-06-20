# Product Catalog Quality Report

## Overview

Estadísticas de calidad del catálogo canónico de productos.

## Metrics (sin DB)

| Métrica | Valor |
|---------|-------|
| total_products | 0 (sin DB) |
| unique_fingerprints | 0 |
| duplicated_fingerprints | 0 |
| collision_candidates | 0 |
| orphan_products | 0 |

## Fixture Validation

### Consolidatable Group (3 productos)
```
MICHELIN PRIMACY 4 205/55 R16
Michelin Primacy4 205-55R16  
MICHELIN PRIMACY-4 205/55R16
```
Resultado: Fingerprint consistente por modelo

### Distinct Group (1 producto)
```
MICHELIN PILOT SPORT 4 205/55 R16
```
Resultado: Fingerprint distinto (no colisiona)

## Quality Indicators

- **Duplicación:** 0% (sin datos)
- **Colisiones:** 0% (sin datos)  
- **Órfanos:** 0% (sin datos)

## Recommendation

Con PostgreSQL disponible:
- Ejecutar `python -m neumatiq_next.domain.matching.audit`
- Revisar fingerprints duplicados
- Consolidar manualmente si es necesario