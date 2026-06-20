# Application Use Cases

## Overview

Use cases implement business logic orchestration using the Repository pattern.

## Flow Diagram

```
Controller/Worker
      │
      ▼
  Use Case
      │
      ▼
UnitOfWork (transaction boundary)
      │
      ▼
  Repository (data access)
      │
      ▼
   ORM Models
```

## Use Cases

### SeedCountriesUseCase
- **Purpose**: Seed initial reference countries
- **Dependencies**: `IUnitOfWork.countries`
- **Key Logic**: Skip duplicates by ISO code

### ListSuppliersUseCase
- **Purpose**: List all active suppliers
- **Dependencies**: `IUnitOfWork.suppliers`
- **Key Logic**: Filter `.active == True`

### SearchProductsUseCase
- **Purpose**: Search products with filters
- **Dependencies**: `IUnitOfWork.products`
- **Key Logic**: Pagination support

### RecordPriceObservationUseCase
- **Purpose**: Record price observation with validation
- **Dependencies**: `IUnitOfWork.products`, `suppliers`, `countries`, `price_observations`
- **Key Logic**: Validate entities exist before record

### GetOrCreateProductUseCase
- **Purpose**: Get existing product or create new
- **Dependencies**: `IUnitOfWork.products`, `brands`
- **Key Logic**: Search by normalized_name, create if not found

## DTOs

### Requests
- `SeedCountriesRequest`: List of countries with code/name/locale
- `SearchProductsRequest`: Filter by brand, width, aspect_ratio, rim_diameter
- `RecordPriceObservationRequest`: supplier_id, product_id, price, currency_code
- `GetOrCreateProductRequest`: Brand name, tire dimensions, normalized_name

### Responses
- `CountryResponse`: id, code, name, locale, active
- `SupplierResponse`: id, name, normalized_name, country_id, website, active
- `ProductResponse`: id, fingerprint, sku, name, normalized_name, brand_id, status
- `PriceObservationResponse`: id, product_id, supplier_id, prices, source_url

## Usage Example

```python
from neumatiq_next.infrastructure.persistence import SQLAlchemyUnitOfWork
from neumatiq_next.application.use_cases import SeedCountriesUseCase

async with SQLAlchemyUnitOfWork() as uow:
    use_case = SeedCountriesUseCase(lambda: uow)
    result = await use_case.execute(SeedCountriesRequest(countries=[...]))
```