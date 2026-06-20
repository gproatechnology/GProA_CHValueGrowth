# ADR-008: Fingerprint v2 - Model-aware Matching

## Status
Proposed

## Context

El fingerprint v1 puede generar falsos positivos:
- "MICHELIN PRIMACY 4 205/55 R16"
- "MICHELIN PILOT SPORT 4 205/55 R16"

Ambos tienen el mismo fingerprint v1: `MICHELIN|205|55|16`

## Decision

Extender fingerprint a 5 componentes:
`BRAND|MODEL|WIDTH|ASPECT_RATIO|RIM_DIAMETER`

Ejemplo: `MICHELIN|PRIMACY4|205|55|16`

## Model Normalization

- Elimina espacios, guiones, caracteres especiales
- "Primacy 4" → "PRIMACY4"
- "Primacy-4" → "PRIMACY4"

## Migration Strategy

1. Nuevos productos usan v2
2. Productos existentes con v1 seguirán funcionando
3. Parsing soporta ambos formatos