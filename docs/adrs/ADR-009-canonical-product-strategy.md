# ADR-009: Canonical Product Strategy

## Status
Proposed

## Context

El fingerprint v1 puede colisionar:
- "MICHELIN PRIMACY 4 205/55 R16"
- "MICHELIN PILOT SPORT 4 205/55 R16"

Ambos generan: `MICHELIN|205|55|16`

## Decision

Usar fingerprint v2 con modelo incluido:
`BRAND|MODEL|WIDTH|ASPECT_RATIO|RIM_DIAMETER`

Esto permite identificar productos idénticos vs distintos.

## Services

- **CanonicalizationService** - Audita catálogo
- **ConsolidationService** - Une observaciones

## Benefits
- Eliminación de duplicados
- Tracking de observaciones únicas
- Catálogo canónico limpio