# ADR-005: MercadoLibre Provider Implementation

## Status
Proposed

## Context
MercadoLibre es el primer proveedor a integrar para scraping de precios de llantas en México.

## Decision
Implementar `MercadoLibreScraper(BaseScraper)` con:

1. **scraper.py** - Clase principal extendiendo BaseScraper
2. **parser.py** - BeautifulSoup parsing de HTML
3. **mapper.py** - Transforma a ScrapingResult

## Implementation

### Search URL
- Formato: `/search?q=width/aspect_ratio+Rrim`
- Ejemplo: `205/55+R16`

### HTML Selectors
- Productos: `li.ui-search-layout__item`
- Título: `h3.ui-search-item__title`
- Precio: `span.andes-money-amount`
- URL: `a.ui-search-item__group__element`

### Dependencies
- `beautifulsoup4` - HTML parsing
- `aiohttp` - async HTTP client

## Consequences

### Positive
- Primer proveedor funcional
- Reutiliza framework Phase 6A
- Tests con fixtures estáticos

### Negative
- Requiere red para producción
- Selectores pueden cambiar