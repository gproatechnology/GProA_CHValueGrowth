# ADR-006: Scraping Persistence Pipeline

## Status
Proposed

## Context
Scraping results need to be persisted to the database for price tracking.

## Decision
Create `ScrapingIngestionService` that:
1. Receives `ScrapingResult`
2. Uses `SQLAlchemyUnitOfWork` for transactions
3. Creates or reuses products
4. Creates price observations

## Flow

```
ScrapingResult → IngestionService → UnitOfWork → Repositories
```

## Benefits
- Reuse existing UnitOfWork pattern
- Consistent transaction boundaries
- Stats tracking for observability