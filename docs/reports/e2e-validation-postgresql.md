# End-to-End Validation (PostgreSQL Required)

## Required Commands

```bash
# 1. Start infrastructure
docker compose up -d

# 2. Apply migrations
alembic upgrade head

# 3. Seed data
python -m neumatiq_next.bootstrap.seed_all

# 4. Validate tables
# Execute in psql:
\dt
-- Should show 9 tables

# 5. Run scraper with fixtures
python -m neumatiq_next.infrastructure.scraping.run

# 6. Validate data
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM price_observations;
SELECT COUNT(*) FROM suppliers;

# 7. Start frontend
npm run dev
```

## Expected Results

### After Migration
- ✅ countries
- ✅ currencies
- ✅ brands
- ✅ tire_specifications
- ✅ suppliers
- ✅ scraping_sources
- ✅ products
- ✅ price_observations
- ✅ product_matches

### After Seed
- ✅ countries = 6
- ✅ currencies = 6
- ✅ brands = 8
- ✅ suppliers = 4

### After Scraper Run
- ✅ Observations persisted
- ✅ Products consolidated by fingerprint

## Metrics To Capture

```sql
-- Deduplication rate
SELECT 
    COUNT(DISTINCT fingerprint) * 1.0 / COUNT(*) as dedup_rate
FROM products;

-- Average observations per product
SELECT 
    COUNT(*)*1.0 / COUNT(DISTINCT product_id) as avg_observations
FROM price_observations;
```

## Status

⏳ **PENDING** - Esperando Docker daemon y PostgreSQL