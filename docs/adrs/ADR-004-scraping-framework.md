# ADR-004: Scraping Framework

## Status
Proposed

## Context
NeumatiQ necesita scrapers para múltiples fuentes de datos de precios de llantas. El framework debe ser extensible para soportar:
- Proveedores e-commerce (MercadoLibre, Amazon)
- APIs de proveedores
- Plugins de navegador

## Decision
Crear un framework de scraping basado en abstracciones concretas:

1. **BaseScraper abstracta** - Contrato común con fetch/parse/normalize/scrape
2. **Models Pydantic** - ScrapedProduct, ScrapedPrice, ScrapingResult
3. **Normalization layer** - Parsing de títulos de llantas estándar
4. **Exception hierarchy** - ScrapingError, ProviderUnavailable, ParseError

## Consequences

### Positive
- Extensible para nuevos proveedores
- Tipado con Pydantic
- Testing unitario posible
- Separación de concerns

### Negative
- No async real hasta implementación de providers
- Normalization regex puede necesitar ajustes

## Future Work (Phase 6B)
- MercadoLibre scraper implementation
- Rate limiting
- Session caching
- Retry logic