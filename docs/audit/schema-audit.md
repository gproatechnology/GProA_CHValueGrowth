# Schema Audit

## Tablas Reales (PostgreSQL)
1. brands
2. countries
3. currencies
4. price_observations
5. product_matches
6. products
7. scraping_sources
8. suppliers
9. tire_specifications

## Constraints Identificados
- Foreign key: products.brand_id → brands.id
- Foreign key: products.tire_specification_id → tire_specifications.id
- Foreign key: price_observations.product_id → products.id
- Foreign key: price_observations.supplier_id → suppliers.id

## Indices
- No se verificaron índices específicos (requiere psql detallado)