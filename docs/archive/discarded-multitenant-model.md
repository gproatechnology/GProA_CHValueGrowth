> ⚠️ ARCHIVED - This document is no longer the source of truth.
>
> **Reason:** This document describes a multi-tenant model that was discarded in favor of a simpler single-tenant architecture.
>
> **Current Source of Truth:** [docs/database/database-design-v1.md](../database/database-design-v1.md)
>
> **Archived Date:** June 2026

# Parte 2: Core Domain Model y Schema PostgreSQL V1

## Core Domain Model

### Entidades principales

| Entidad | Atributos clave | Relaciones |
|---|---|---|
| **Product** | id, sku, normalized_name, brand, dimensions, speed_rating, load_index, product_type | Pertenece a Supplier, tiene múltiples PriceObservation y PriceHistory |
| **Supplier** | id, name, country_code, website, scraping_source_id, active | Tiene muchos Product, genera muchas PriceObservation |
| **PriceObservation** | id, product_id, supplier_id, country_code, currency_code, price, observed_at, raw_data | Pertenece a Product y Supplier, deriva en PriceHistory |
| **PriceHistory** | id, product_id, supplier_id, date, min_price, max_price, avg_price, currency_code | Agregación diaria de PriceObservation por producto/supplier |
| **Brand** | id, name, normalized_name, country_of_origin, active | Relación 1:N con Product |
| **Country** | code, name, currency_code, locale, active | Referenciada por Supplier y PriceObservation |
| **Currency** | code, iso_numeric, name, symbol, decimals | Referenciada por PriceObservation y PriceHistory |

### Reglas de negocio del dominio

- Un Product tiene un SKU único por tenant y se normaliza contra catálogos estándar (ISO 4000-1)
- PriceObservation es inmutable una vez persistida; se derivan agregaciones en PriceHistory
- PriceHistory se recalcula nightly por batch job para rendimiento de consultas
- Supplier puede estar activo/inactivo sin eliminar historial de precios
- Brand permite mapeo de variantes de nombre a entidad canónica

---

## PostgreSQL Schema V1

### Extensiones y configuración base

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Tablas

#### `tenants`

```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tenants_plan ON tenants (plan);
```

#### `countries`

```sql
CREATE TABLE countries (
    code CHAR(2) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    currency_code CHAR(3) NOT NULL,
    locale VARCHAR(10) NOT NULL DEFAULT 'es-AR',
    active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_countries_active ON countries (active) WHERE active = TRUE;
```

#### `currencies`

```sql
CREATE TABLE currencies (
    code CHAR(3) PRIMARY KEY,
    iso_numeric SMALLINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(10),
    decimals SMALLINT DEFAULT 2,
    active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_currencies_active ON currencies (active) WHERE active = TRUE;
```

#### `brands`

```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    country_of_origin CHAR(2),
    active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_brands_unique ON brands (tenant_id, normalized_name) WHERE active = TRUE;
CREATE INDEX idx_brands_tenant ON brands (tenant_id);
CREATE INDEX idx_brands_search ON brands USING GIN (to_tsvector('spanish', name));
```

#### `suppliers`

```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    country_code CHAR(2) NOT NULL REFERENCES countries(code),
    website VARCHAR(500),
    scraping_source_id UUID,
    active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_suppliers_unique ON suppliers (tenant_id, normalized_name) WHERE active = TRUE;
CREATE INDEX idx_suppliers_tenant ON suppliers (tenant_id);
CREATE INDEX idx_suppliers_country ON suppliers (country_code);
```

#### `scraping_sources`

```sql
CREATE TABLE scraping_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('browser_plugin', 'api', 'feed', 'manual')),
    config JSONB NOT NULL DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scraping_sources_tenant ON scraping_sources (tenant_id);
CREATE INDEX idx_scraping_sources_type ON scraping_sources (type);
```

#### `categories`

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES categories(id),
    path LTREE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_tenant ON categories (tenant_id);
CREATE INDEX idx_categories_parent ON categories (parent_id);
CREATE INDEX idx_categories_path ON categories USING GIST (path);
```

#### `products`

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sku VARCHAR(255) NOT NULL,
    name VARCHAR(500) NOT NULL,
    normalized_name VARCHAR(500) NOT NULL,
    brand_id UUID NOT NULL REFERENCES brands(id),
    category_id UUID REFERENCES categories(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    specifications JSONB DEFAULT '{}',
    product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('tire', 'wheel', 'accessory')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'discontinued')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_products_sku_unique ON products (tenant_id, sku) WHERE status != 'archived';
CREATE INDEX idx_products_tenant ON products (tenant_id);
CREATE INDEX idx_products_brand ON products (brand_id);
CREATE INDEX idx_products_supplier ON products (supplier_id);
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('spanish', name || ' ' || normalized_name));
```

#### `price_observations`

```sql
CREATE TABLE price_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    country_code CHAR(2) NOT NULL REFERENCES countries(code),
    currency_code CHAR(3) NOT NULL REFERENCES currencies(code),
    price_base DECIMAL(12,4) NOT NULL,
    price_tax DECIMAL(12,4) DEFAULT 0,
    price_total DECIMAL(12,4) NOT NULL,
    observed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    source_url TEXT,
    raw_data JSONB DEFAULT '{}',
    scraping_run_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_price_observations_unique 
    ON price_observations (product_id, supplier_id, country_code, observed_at);
CREATE INDEX idx_price_observations_tenant ON price_observations (tenant_id);
CREATE INDEX idx_price_observations_product ON price_observations (product_id);
CREATE INDEX idx_price_observations_supplier ON price_observations (supplier_id);
CREATE INDEX idx_price_observations_observed ON price_observations (observed_at DESC);
CREATE INDEX idx_price_observations_composite 
    ON price_observations (tenant_id, product_id, country_code, observed_at DESC);
```

#### `price_history`

```sql
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    country_code CHAR(2) NOT NULL REFERENCES countries(code),
    currency_code CHAR(3) NOT NULL REFERENCES currencies(code),
    date DATE NOT NULL,
    min_price DECIMAL(12,4) NOT NULL,
    max_price DECIMAL(12,4) NOT NULL,
    avg_price DECIMAL(12,4) NOT NULL,
    price_open DECIMAL(12,4),
    price_close DECIMAL(12,4),
    observation_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_price_history_unique 
    ON price_history (tenant_id, product_id, supplier_id, country_code, date);
CREATE INDEX idx_price_history_product ON price_history (product_id, date DESC);
CREATE INDEX idx_price_history_tenant ON price_history (tenant_id);
CREATE INDEX idx_price_history_date ON price_history (date DESC);
```

#### `price_alerts`

```sql
CREATE TABLE price_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    supplier_id UUID REFERENCES suppliers(id),
    country_code CHAR(2) NOT NULL REFERENCES countries(code),
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('price_drop', 'price_increase', 'availability', 'custom')),
    threshold_value DECIMAL(12,4),
    threshold_type VARCHAR(20) NOT NULL CHECK (threshold_type IN ('absolute', 'percentage')),
    condition VARCHAR(10) NOT NULL CHECK (condition IN ('lt', 'lte', 'gt', 'gte', 'eq')),
    active BOOLEAN DEFAULT TRUE,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    notification_channel JSONB DEFAULT '{"email": true}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_price_alerts_tenant ON price_alerts (tenant_id);
CREATE INDEX idx_price_alerts_product ON price_alerts (product_id);
CREATE INDEX idx_price_alerts_active ON price_alerts (active) WHERE active = TRUE;
```

#### `export_jobs`

```sql
CREATE TABLE export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    format VARCHAR(20) NOT NULL CHECK (format IN ('csv', 'xlsx', 'json', 'pdf')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    filters JSONB DEFAULT '{}',
    result_url TEXT,
    error_message TEXT,
    initiated_by UUID,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_export_jobs_tenant ON export_jobs (tenant_id);
CREATE INDEX idx_export_jobs_status ON export_jobs (status);
CREATE INDEX idx_export_jobs_created ON export_jobs (created_at DESC);
```

### Constraints y reglas de integridad

- **Multi-tenancy**: Todas las tablas contienen `tenant_id` con CASCADE DELETE
- **Precios**: `price_total = price_base + price_tax`, validar en aplicación
- **ISO codes**: `country_code` debe ser código ISO 3166-1 alpha-2; `currency_code` ISO 4217
- **Inmutabilidad**: `price_observations` no se actualiza ni elimina después de insertado
- **Agregación diaria**: `price_history` se calcula una vez por día por batch; únicos por (product, supplier, country, date)

## Repository Structure

`
neumatiq/
├── backend/                    # Backend API (NestJS)
│   ├── src/
│   │   ├── application/       # Casos de uso y servicios de aplicación
│   │   │   ├── use-cases/
│   │   │   ├── dto/
│   │   │   └── services/
│   │   ├── domain/            # Entidades y reglas de negocio puras
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   ├── repositories/
│   │   │   └── services/
│   │   ├── infrastructure/    # Implementaciones concretas
│   │   │   ├── database/
│   │   │   ├── scraping/
│   │   │   ├── email/
│   │   │   └── cache/
│   │   ├── interfaces/        # Controladores y presenters
│   │   │   ├── http/
│   │   │   ├── websocket/
│   │   │   └── events/
│   │   └── shared/            # Código compartido
│   ├── test/
│   └── package.json
├── frontend/                  # Frontend (Next.js + React)
│   ├── src/
│   │   ├── app/               # App router (Next.js 14+)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── packages/                  # Paquetes compartidos (monorepo)
│   ├── ui/                   # Componentes UI reutilizables
│   ├── types/                # Tipos TypeScript compartidos
│   ├── utils/                # Utilidades comunes
│   └── config/               # Configuraciones compartidas
├── infrastructure/            # Infraestructura como código (Terraform)
│   ├── terraform/
│   │   ├── modules/
│   │   ├── environments/
│   │   └── main.tf
│   ├── docker/
│   └── scripts/
└── docs/
    ├── architecture/
    ├── api/
    └── guides/
`

## Backend Architecture

### Clean Architecture Layers

`
Interfaces (Controllers) → Application (Use Cases) → Domain (Entities) ← Infrastructure (Repositories)
`

### Casos de uso (Application Layer)

- CreateProductUseCase - Crear producto con validación de SKU único
- UpdateProductUseCase - Actualizar producto existente
- GetProductUseCase - Obtener producto por ID/SKU
- SearchProductsUseCase - Búsqueda con filtros y paginación
- TrackPriceUseCase - Registrar nueva observación de precio
- GeneratePriceHistoryUseCase - Calcular agregaciones diarias
- CreatePriceAlertUseCase - Configurar alerta de precio
- EvaluatePriceAlertsUseCase - Evaluar condiciones y disparar notificaciones
- RunScrapingUseCase - Ejecutar scraping de fuente externa
- ExportDataUseCase - Generar reporte exportable

### Servicios (Domain Layer)

- ProductNormalizationService - Normalización según ISO 4000-1
- PriceCalculationService - Cálculos de precios con impuestos
- AlertEvaluationService - Lógica de evaluación de alertas
- CurrencyConversionService - Conversión de monedas

### Repositorios (Domain Interfaces)

- ProductRepository - CRUD de productos
- SupplierRepository - CRUD de proveedores
- PriceObservationRepository - Persistencia de observaciones
- PriceHistoryRepository - Agregaciones históricas
- BrandRepository - Gestión de marcas
- AlertRepository - Configuración y estado de alertas

### Dependencias (Infrastructure Layer)

- **ORM**: Prisma con PostgreSQL
- **Cache**: Redis para alertas y datos frecuentes
- **Queue**: BullMQ para scraping y export jobs
- **Scraping**: Playwright/Puppeteer con proxy rotation
- **Events**: NATS o RabbitMQ para eventos internos
- **Storage**: S3 compatible para archivos exportados

### Controladores (Interfaces Layer)

- ProductsController - /api/products/*
- SuppliersController - /api/suppliers/*
- ObservationsController - /api/observations/*
- AlertsController - /api/alerts/*
- ExportsController - /api/exports/*
- ScrapingController - /api/scraping/* (admin)
