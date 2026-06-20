# API Endpoints Documentation

## Endpoints

### GET /health

**Description:** Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "service": "NeumatiQ Next",
  "version": "0.1.0",
  "timestamp": "2026-06-12T..."
}
```

**Status Codes:**
- 200: OK

### GET /version

**Description:** Application version info

**Response:**
```json
{
  "name": "NeumatiQ Next",
  "version": "0.1.0"
}
```

**Status Codes:**
- 200: OK

### GET /suppliers

**Description:** List active suppliers

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Supplier Name",
    "country_code": "MX"
  }
]
```

**Status Codes:**
- 200: OK
- 500: Database error

### GET /products

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| brand | string | No | Filter by brand name |
| width | int | No | Filter by tire width |
| aspect_ratio | int | No | Filter by aspect ratio |
| rim_diameter | int | No | Filter by rim diameter |
| page | int | No | Page number (default: 1) |
| page_size | int | No | Items per page (default: 50, max: 100) |

**Response:**
```json
[
  {
    "id": "uuid",
    "fingerprint": "...",
    "sku": "...",
    "name": "...",
    "normalized_name": "...",
    "brand_id": "uuid",
    "tire_specification_id": "uuid",
    "product_type": "tire",
    "status": "active"
  }
]
```

**Status Codes:**
- 200: OK
- 500: Database error

### POST /products/get-or-create

**Body:**
```json
{
  "brand": "Michelin",
  "width": 205,
  "aspect_ratio": 55,
  "rim_diameter": 16,
  "normalized_name": "michelin_205_55_r16"
}
```

**Response:**
```json
{
  "id": "uuid",
  "created": true
}
```

**Status Codes:**
- 200: OK
- 500: Database error

### POST /observations

**Description:** Record a price observation

**Body:**
```json
{
  "supplier_id": "uuid",
  "product_id": "uuid",
  "currency_code": "MXN",
  "price_total": 1234.50,
  "source_url": "https://..."
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "created"
}
```

**Status Codes:**
- 200: OK
- 400: Validation error (missing product/supplier)
- 500: Database error