# Environment Matrix

| Environment | Database | Auth | Logging | Metrics | API_KEY | Notes |
|-------------|----------|------|---------|---------|---------|-------|
| Local | PostgreSQL (Docker) | Optional | JSON | Enabled | Empty (dev mode) | docker compose up |
| Development | PostgreSQL | Required | JSON | Enabled | Set via .env | CI/CD |
| Staging | PostgreSQL | Required | JSON | Enabled | Vault/secrets | Pre-production testing |
| Production | PostgreSQL (HA) | Required | JSON | Enabled | Vault/secrets | Live traffic |

## Configuration Variables
- `DATABASE_URL` - Connection string
- `API_KEY` - Auth key (empty = dev mode)
- `ENVIRONMENT` - local/development/staging/production
- `DEBUG` - true/false