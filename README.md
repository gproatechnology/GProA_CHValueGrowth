# NeumatiQ Next

> Tire price monitoring and comparison platform for Latin America.

## Overview

NeumatiQ is a platform for tracking, normalizing, and comparing tire prices from multiple suppliers across Latin American countries. The system scrapes price sources, normalizes products to eliminate duplicates using fingerprinting, and stores observation history for trend analysis.

## Core Features

- **Price Scraping**: Automated data collection from multiple tire suppliers
- **Product Normalization**: Fingerprint-based deduplication and matching
- **Price History**: Time-series storage of price observations
- **Multi-country Support**: Regional pricing across Latin America
- **REST API**: FastAPI-based backend for data access
- **React Frontend**: Modern web interface with React + TypeScript

## Architecture

```mermaid
flowchart LR
    subgraph Frontend["Frontend"]
        UI[React UI]
        Store[Zustand]
        API[React Query]
    end
    
    subgraph Backend["Backend"]
        Routes[FastAPI Routes]
        UseCases[Use Cases]
        Domain[Domain]
        Infra[Infrastructure]
    end
    
    subgraph Data["Data Layer"]
        SQLAlch[SQLAlchemy]
        DB[(PostgreSQL)]
    end
    
    UI --> API
    API --> Routes
    Routes --> UseCases
    UseCases --> Domain
    Domain --> Infra
    Infra --> SQLAlch
    SQLAlch --> DB
```

## Project Structure

```
NeumatiQ/
├── apps/              # Application code
│   ├── api/         # Legacy API (deprecated)
│   ├── backend/     # New backend structure
│   ├── scraper/    # Scraping framework
│   └── worker/     # Background tasks
├── frontend/        # React application
├── alembic/         # Database migrations
├── infrastructure/ # Docker & deployment
├── docs/           # Documentation
├── packages/       # Shared packages
└── tests/          # Test suites
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.12, FastAPI |
| ORM | SQLAlchemy 2.x |
| Migrations | Alembic |
| Database | PostgreSQL 16 |
| Frontend | React 18, TypeScript 5 |
| Build | Vite |
| State (Client) | Zustand |
| State (Server) | React Query |
| Styles | Tailwind CSS 3.4 |
| Charts | Recharts |
| Containers | Docker |

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL 16+ (or Docker)
- Docker & Docker Compose

### Backend Setup

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate  # Windows

# Install dependencies (when pyproject.toml is available)
pip install -e .
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Using Docker

```bash
cd infrastructure/docker
docker-compose up -d
```

Services available:
- **API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **PostgreSQL**: localhost:5432

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection | postgresql+asyncpg://postgres:postgres@localhost:5432/neumatiq |
| ENVIRONMENT | Runtime environment | development |
| DEBUG | Debug mode | true |
| VITE_API_URL | Frontend API URL | http://localhost:8000 |

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/neumatiq
ENVIRONMENT=development
DEBUG=true
```

## Database

The database schema is documented in `docs/database-design-v1.md`. Core tables:

- `countries` - Regional countries
- `currencies` - Local currencies
- `brands` - Tire brands
- `tire_specifications` - Technical specifications
- `suppliers` - Tire suppliers
- `products` - Canonical products
- `price_observations` - Price history
- `product_matches` - Product matches

Run migrations:

```bash
alembic upgrade head
```

**Note**: The alembic configuration references `neumatiq_next` module which needs to be set up.

## API Endpoints

The API runs on port 8000. Documentation available at `/docs` when running.

## Frontend Development

```bash
cd frontend
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview build
```

## Documentation

- [Database Design](docs/database-design-v1.md)
- [Implementation Blueprint](docs/implementation-blueprint.md)

## License

MIT

## Bootstrap Development Database

Seed the database with reference data:

```bash
# Direct Python
python -m neumatiq_next.bootstrap.seed_all

# With Docker
docker compose exec api python -m neumatiq_next.bootstrap.seed_all
```

This seeds:
- Countries: MX, AR, CL, CO, PE, BR
- Currencies: MXN, ARS, CLP, COP, PEN, BRL
- Brands: Michelin, Pirelli, Bridgestone, Goodyear, Continental, Firestone, Yokohama, Hankook
- Suppliers: MercadoLibre MX, AR, CL, CO