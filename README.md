# NeumatiQ Next

> Tire price monitoring and comparison platform for Latin America.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.14-blue" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.104-green" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-18-cyan" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Docker_Compose-blue" alt="Docker">
</p>

---

## Overview

NeumatiQ is a platform for **tracking, normalizing, and comparing tire prices** from multiple suppliers across Latin American countries. The system scrapes tire price sources, normalizes products to eliminate duplicates using fingerprinting, and stores price observation history for trend analysis.

---

## Architecture

```mermaid
flowchart TB
    subgraph Frontend["🎨 Frontend (React + Vite)"]
        direction LR
        UI[React UI]
        Store[Zustand State]
        Query[React Query]
        UI --> Store
        UI --> Query
    end

    subgraph Backend["⚙️ Backend (FastAPI)"]
        direction LR
        Routes[HTTP Routes]
        UseCases[Use Cases]
        Domain[Domain Layer]
        Infra[Infrastructure]
        Routes --> UseCases
        UseCases --> Domain
        Domain --> Infra
    end

    subgraph Data["🗄️ Data Layer"]
        SQLAlch[SQLAlchemy 2.x]
        DB[(PostgreSQL 16)]
        SQLAlch --> DB
    end

    subgraph Scraping["🕷️ Scraping"]
        Providers[Providers]
        Parser[HTML Parsers]
        Normalize[Normalization]
        Providers --> Parser
        Parser --> Normalize
    end

    Query -->|HTTP/REST| Routes
    Infra --> SQLAlch
    Scraping --> Infra

    style Frontend fill:#61dafb,color:#000
    style Backend fill:#00a86b,color:#fff
    style Data fill:#336791,color:#fff
    style Scraping fill:#ff6b6b,color:#fff
```

---

## Core Features

| Feature | Description |
|---------|-------------|
| **Price Scraping** | Automated data collection from tire suppliers |
| **Product Normalization** | Fingerprint-based deduplication and matching |
| **Price History** | Time-series storage of price observations |
| **Multi-country Support** | Regional pricing across Latin America |
| **REST API** | FastAPI-based backend with Swagger docs |
| **Modern Frontend** | React + TypeScript + Vite + Tailwind |
| **Docker Ready** | One-command local development |

---

## Project Structure

```
NeumatiQ/
├── neumatiq_next/                 # Backend principal (FastAPI)
│   ├── application/               # Use cases y DTOs
│   ├── bootstrap/                 # Seed de datos iniciales
│   ├── core/                      # Config, DB, logging, middleware
│   ├── domain/                    # Entidades, repositorios, matching
│   │   └── matching/              # Fingerprint, canonicalización, auditoría
│   ├── infrastructure/            # SQLAlchemy, scraping, providers
│   │   └── scraping/              # Framework de scraping
│   │       └── providers/mercadolibre/  # Provider ML
│   └── interfaces/                # HTTP routes, schemas
│       └── http/routes/           # Endpoints REST
├── frontend/                      # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/            # Layout y componentes shared
│   │   ├── pages/                 # Dashboard, Products, Suppliers, Analytics
│   │   ├── hooks/                 # React Query hooks
│   │   ├── services/              # Cliente HTTP
│   │   └── stores/                # Zustand global state
│   └── dist/                      # Build output
├── infrastructure/
│   └── docker/                    # Dockerfiles + docker-compose
├── alembic/                       # Migraciones de BD
├── docs/                          # ADRs, API, arquitectura, BD
├── scripts/
│   ├── dev.ps1                    # Orquestador local (Windows)
│   └── git-helper.ps1             # Helper de Git
└── tests/
    ├── unit/                      # Tests unitarios
    └── integration/api/           # Tests de integración
```

---

## Technology Stack

| Component | Stack |
|-----------|-------|
| **Backend** | Python 3.14, FastAPI, Uvicorn |
| **ORM** | SQLAlchemy 2.x (async) |
| **Migrations** | Alembic |
| **Database** | PostgreSQL 16 |
| **Scraping** | aiohttp, BeautifulSoup4 |
| **Frontend** | React 18, TypeScript 5 |
| **Build** | Vite 5 |
| **State** | Zustand (client), React Query (server) |
| **Styles** | Tailwind CSS 3.4 |
| **Charts** | Recharts |
| **Containers** | Docker, Docker Compose |

---

## Quick Start

### Prerequisites

- **Python 3.14+**
- **Node.js 18+**
- **Docker & Docker Compose** (para PostgreSQL)
- **PowerShell 5.1** (Windows)

### 1. Levantar todo

```powershell
# Clonar el repositorio
git clone https://github.com/gproatechnology/GProA_CHValueGrowth.git
cd GProA_CHValueGrowth
git checkout NeumatiQ

# Levantar servicios completos
.\scripts\dev.ps1 -Action up
```

Esto levanta automáticamente:
- PostgreSQL en `localhost:5432`
- Migraciones de Alembic
- Backend FastAPI en `http://localhost:8000`
- Frontend React en `http://localhost:5173`

### 2. Ver estado

```powershell
.\scripts\dev.ps1 -Action status
```

### 3. Cargar datos iniciales

```powershell
.\scripts\dev.ps1 -Action seed
```

### 4. Uso interactivo

```powershell
.\scripts\dev.ps1
```

Menú con opciones 1-10 para instalar dependencias, levantar servicios, ver estado, etc.

---

## Development

### Backend

```bash
# Activar entorno virtual
.\.venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -e ".[dev]"

# Ejecutar migraciones
python -m alembic upgrade head

# Seed de datos iniciales
python -m neumatiq_next.bootstrap.seed_all

# Modo desarrollo (auto-reload)
uvicorn neumatiq_next.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
npm run build  # Production build
```

### Scraping

```bash
# Scraping manual de MercadoLibre
python -m neumatiq_next.infrastructure.scraping
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@localhost:5432/neumatiq` | PostgreSQL connection |
| `ENVIRONMENT` | `development` | Runtime environment |
| `DEBUG` | `true` | Debug mode |
| `VITE_API_URL` | `http://localhost:8000` | Frontend API URL |

Creado automáticamente por `dev.ps1` en `.env`.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health/` | Health check |
| `GET` | `/health/database` | Database connectivity |
| `GET` | `/version` | API version |
| `GET` | `/docs` | Swagger UI |
| `GET` | `/products` | List products |
| `POST` | `/products` | Create product |
| `GET` | `/products/search` | Search with normalization |
| `GET` | `/suppliers` | List suppliers |
| `POST` | `/observations` | Record price observation |

---

## Database Schema

```mermaid
erDiagram
    COUNTRIES {
        int id PK
        string code UK
        string name
        datetime created_at
    }

    CURRENCIES {
        int id PK
        string code UK
        string name
        string symbol
    }

    BRANDS {
        int id PK
        string name UK
        string normalized_name UK
    }

    SUPPLIERS {
        int id PK
        string name
        string country_code FK
        string base_url
        boolean is_active
    }

    TIRE_SPECIFICATIONS {
        int id PK
        string brand FK
        string model
        int width
        int aspect_ratio
        int rim_diameter
        string fingerprint UK
    }

    PRODUCTS {
        int id PK
        string name
        string normalized_name
        string fingerprint
        text description
        datetime created_at
    }

    PRODUCT_MATCHES {
        int id PK
        int product_id FK
        int specification_id FK
        float confidence
    }

    PRICE_OBSERVATIONS {
        int id PK
        int product_id FK
        int supplier_id FK
        float price
        string currency
        string source_url
        datetime observed_at
    }

    COUNTRIES ||--o{ CURRENCIES : "uses"
    COUNTRIES ||--o{ SUPPLIERS : "has"
    CURRENCIES ||--o{ PRICE_OBSERVATIONS : "priced_in"
    BRANDS ||--o{ TIRE_SPECIFICATIONS : "manufactures"
    TIRE_SPECIFICATIONS ||--o{ PRODUCT_MATCHES : "matches_to"
    PRODUCTS ||--o{ PRODUCT_MATCHES : "matched_as"
    PRODUCTS ||--o{ PRICE_OBSERVATIONS : "observed_as"
    SUPPLIERS ||--o{ PRICE_OBSERVATIONS : "reports"
```

---

## Data Flow: Scraping to Database

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant CLI as Scraper CLI
    participant Provider as MercadoLibre Provider
    participant Parser as HTML Parser
    participant Normalizer as Normalizer
    participant DB as PostgreSQL

    Dev->>CLI: python -m neumatiq_next.infrastructure.scraping
    CLI->>Provider: fetch(url)
    Provider->>Provider: HTTP GET mercadolibre.com.mx/search?q=...
    Provider-->>CLI: HTML response
    CLI->>Parser: parse(html)
    Parser->>Parser: Extract title, price, url
    Parser-->>CLI: ScrapedProduct[]
    CLI->>Normalizer: normalize(product)
    Normalizer->>Normalizer: canonicalize(title), match brand
    Normalizer-->>CLI: ScrapingResult (fingerprint, normalized_name)
    CLI->>DB: INSERT price_observation + product match
    DB-->>CLI: OK
    CLI-->>Dev: Stats: N products ingested
```

---

## Development Commands

```powershell
# Git helper (commit + push interactivo)
.\scripts\git-helper.ps1

# O directamente:
git add .
git commit -m "feat: mensaje"
git push origin NeumatiQ
```

---

## Testing

```bash
# Tests unitarios (rápidos, no requieren servicios)
pytest tests/unit/

# Todos los tests
pytest tests/

# Con coverage
pytest tests/ --cov=neumatiq_next --cov-report=html
```

---

## Documentation

- **[ADRs](docs/adrs/)** — Architecture Decision Records
- **[API](docs/api/endpoints.md)** — Endpoint specification
- **[Database](docs/database/canonical-model.md)** — Schema design
- **[Architecture](docs/architecture/scraping-framework.md)** — System design
- **[Frontend](docs/frontend/frontend-integration.md)** — Frontend integration guide

---

## Status

| Component | Status |
|-----------|--------|
| Backend API | ✅ Active |
| Scraping (MercadoLibre MX) | ✅ Active |
| Frontend | 🟡 Structure ready |
| Multi-provider | 🔜 Next |
| Price alerts | 🔜 Next |
| Authentication | 🔜 Next |

---

## License

MIT
