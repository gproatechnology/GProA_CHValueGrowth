# Forensic Inventory

| Componente | Cantidad Real |
|------------|---------------|
| Módulos Python | 88 |
| Endpoints | 7 (2 POST protegidos) |
| Modelos ORM | 9 |
| Migraciones | 3 archivos, 1 aplicada (head) |
| Tests | 53 pasando |
| Workflows CI/CD | 2 (.github/workflows/ci.yml, docker-build.yml) |
| Tablas DB | 8 |

## Evidence Commands
- `Get-ChildItem -Filter "*.py" -File | Measure-Object` → 136 files total, 88 in neumatiq_next/
- `Select-String -Pattern "@router\.(get|post)" neumatiq_next/interfaces/http/routes/*.py` → 7 endpoints
- `alembic current` → 29962aedcfe3 (head)
- `docker exec neumatiq-db psql -c "\dt"` → 8 tablas