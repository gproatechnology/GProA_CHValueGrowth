# MercadoLibre Provider Implementation

## Overview

Implementación del scraper para MercadoLibre México como primer proveedor del framework.

## Architecture

```
providers/mercadolibre/
├── scraper.py      # MercadoLibreScraper(BaseScraper)
├── parser.py       # HTML parsing
├── mapper.py       # To ScrapingResult
└── fixtures/       # HTML test fixtures
```

## Search URL Format

```
https://www.mercadolibre.com.mx/search?q={width}/{aspect_ratio}+R{rim_diameter}
```

Ejemplo:
```
https://www.mercadolibre.com.mx/search?q=205/55+R16
```

## Data Extraction

| Campo | Fuente |
|-------|--------|
| title | h3.ui-search-item__title |
| url | a.ui-search-item__group__element href |
| price | span.andes-money-amount |

## Normalization

Usa `normalize_title()` de Phase 6A:
- "Michelin Primacy 4 205/55 R16" → brand=Michelin, width=205, aspect_ratio=55, rim_diameter=16

## Tests

```
tests/unit/scraping/test_mercadolibre.py
- 5 tests passing
- Usa fixtures/mercadolibre_search.html
```