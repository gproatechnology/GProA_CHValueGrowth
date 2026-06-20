# CI/CD Operations Guide

## GitHub Actions

### CI Workflow
Runs on every push and PR to main.

**Steps:**
1. Checkout code
2. Setup Python 3.12
3. Install dependencies
4. Run mypy
5. Run pytest (unit + integration)

### Docker Build Workflow
Runs on push to main or tag creation.

**Steps:**
1. Setup Docker Buildx
2. Build backend Docker image
3. Validate image runs

## Local Commands

```bash
# Run tests
pytest tests/ -v

# Type check
python -m mypy neumatiq_next/

# Build Docker image
docker build -t neumatiq-next -f infrastructure/docker/Dockerfile .
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| JWT_SECRET_KEY | Yes | For JWT signing |

## Branch Protection

- main: requires CI pass
- develop: for development

## Release Process

1. Merge PR to develop
2. CI validates
3. Merge to main
4. Docker image built
5. Manual deployment to production