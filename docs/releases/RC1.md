# Release Candidate 1 (RC1)

## Features Implemented

### Core Features
- Product catalog with 9-database schema
- Tire specification matching (fingerprint v1/v2)
- Price observation tracking
- MercadoLibre scraper integration

### Infrastructure
- Docker containerization (backend/frontend)
- GitHub Actions CI/CD pipelines
- PostgreSQL persistence
- Structured logging
- Prometheus metrics

### Security
- API Key authentication (X-API-Key header)
- Protected write endpoints

## Architecture Summary

Clean architecture with 4 layers:
```
Frontend (React) → FastAPI → Use Cases → SQLAlchemy → PostgreSQL
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | ❌ | Health check |
| GET | /health/database | ❌ | Database health |
| GET | /metrics | ❌ | Prometheus metrics |
| GET | /suppliers | ❌ | List suppliers |
| GET | /products | ❌ | Search products |
| POST | /products/get-or-create | ✅ | Create product |
| POST | /observations | ✅ | Record price |

## Known Limitations

1. No HTTPS/TLS (requires reverse proxy)
2. No rate limiting on public APIs
3. No frontend auth integration
4. Single-region PostgreSQL only
5. Manual migrations (no Alembic)

## Future Roadmap

Phase 10: JWT Authentication
Phase 11: Rate Limiting & Pagination
Phase 12: Multi-region Support
Phase 13: Alembic Migrations
Phase 14: Frontend Auth Integration