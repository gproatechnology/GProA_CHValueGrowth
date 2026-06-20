# Scraping Framework Architecture

## Overview

El framework de scraping está diseñado para ser extensible y soportar múltiples proveedores.

## Structure

```
neumatiq_next/infrastructure/scraping/
├── base/
│   ├── scraper.py           # BaseScraper abstracta
│   ├── models.py            # ScrapedProduct, ScrapedPrice, ScrapingResult
│   ├── exceptions.py        # ScrapingError, ProviderUnavailable, ParseError
│   └── normalization.py       # Tire title parsing
└── providers/
    └── mercadolibre/        # Implementación futura
```

## BaseScraper Pipeline

```
fetch(url)    → Obtiene HTML
    ↓
parse(html)    → Extrae ScrapedProduct[]
    ↓
normalize(p)   → Convierte a ScrapingResult
    ↓
scrape(url)    → Pipeline completo
```

## Models

### ScrapedProduct
- title: string (título original)
- raw_brand: string? (marca sin normalizar)
- raw_size: string? (tamaño sin normalizar)
- sku: string?
- url: string?

### ScrapedPrice
- price: float (>0)
- currency: string (default: USD)
- available: bool
- source_url: string?

### ScrapingResult
- product: ScrapedProduct
- price: ScrapedPrice
- confidence: float (0-1)
- normalized_brand: string?
- normalized_name: string?

## Normalization

El parser extrae de títulos como:
```
"Michelin Primacy 4 205/55 R16"
```

→
```
brand = Michelin
width = 205
aspect_ratio = 55
rim_diameter = 16
```

## Extensibility

Nuevos proveedores extienden `BaseScraper`:

```python
class MyScraper(BaseScraper):
    def __init__(self):
        super().__init__("myparser", "https://...")
    
    async def fetch(self, url):
        # HTTP implementation
    
    def parse(self, html):
        # Custom parsing
```