# Scraping Persistence Architecture

## Overview

Persist scraping results to database using existing UnitOfWork pattern.

## Pipeline Flow

```
MercadoLibreScraper
    ↓
ScrapingResult
    ↓
ScrapingIngestionService
    ↓
SQLAlchemyUnitOfWork
    ↓
repositories: products, price_observations
```

## ScrapingIngestionService

### Methods

- `ingest(result, supplier_id)` - Main entry point
- `_get_or_create_product(uow, result)` - Create or reuse product
- `_create_observation(uow, result, product_id, supplier_id)` - Create price observation

### Stats Tracking

```python
stats = {
    "new_products": int,
    "reused_products": int,
    "observations_created": int,
    "errors": int,
}
```

## Idempotency

- Products searched by `normalized_name`
- New product created if not found
- Observation always created (price history)