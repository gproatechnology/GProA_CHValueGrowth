# Matching Engine Architecture

## Overview

Detección de productos duplicados usando fingerprints canónicos.

## Flow

```
Scraped Product
    ↓
MatchingService.generate_fingerprint()
MICHELIN|205|55|16
    ↓
MatchingService.match()
    ↓
MATCH / NO_MATCH
```

## Fingerprint Format

`BRAND|WIDTH|ASPECT_RATIO|RIM_DIAMETER`

Ejemplos:
- `MICHELIN|205|55|16`
- `PIRELLI|225|45|17`

## Matching Strategies

### MVP (Exact Match Only)
- Si fingerprint coincide → MATCH
- Si no → NO_MATCH

### Future (Phase 7B)
- Fuzzy matching (difflib)
- Embeddings semánticos
- IA matching

## Integration Points

- ScrapingIngestionService usa MatchingService
- Product.fingerprint campo existe
- Índice único en PostgreSQL