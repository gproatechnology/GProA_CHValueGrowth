# Canonical Products Architecture

## Overview

Consolidación de productos usando fingerprint v2 para evitar duplicados.

## Strategy

### Deduplication Flow

```
Scraped Title
    ↓
extract_model() + normalize_title()
    ↓
ProductFingerprint (v2)
BRAND|MODEL|WIDTH|ASPECT|RIM
MICHELIN|PRIMACY4|205|55|16
    ↓
MatchingService.match()
    ↓
MATCH / NO_MATCH
```

## Services

### CanonicalizationService
- `audit()` - Detecta productos con mismos fingerprints
- `get_fingerprint_stats()` - Estadísticas de calidad

### ConsolidationService
- `consolidate(title, supplier_id, price)` - Une productos equivalentes

## Metrics

| Métrica | Fórmula |
|---------|---------|
| deduplication_rate | unique_fingerprints / total_products |
| reuse_rate | reused_products / total_products |
| avg_observations | total_observations / total_products |