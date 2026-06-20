# ADR-007: Product Matching

## Status
Proposed

## Context
El scraping genera productos con variaciones en formato:
- "MICHELIN PRIMACY 4 205/55 R16"
- "Michelin Primacy4 205-55R16"

El sistema debe identificar estos como el mismo producto.

## Decision
Fingeprint canónico basado en:
- brand (uppercase)
- width
- aspect_ratio  
- rim_diameter

Formato: `BRAND|WIDTH|ASPECT_RATIO|RIM_DIAMETER`

Ejemplo: `MICHELIN|205|55|16`

## MVP Strategy
- Exact match solamente
- No fuzzy, no IA

## Integration
MatchingService integrado en ScrapingIngestionService antes de crear productos.