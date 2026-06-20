# CI/CD Strategy Document

## Overview
GitHub Actions workflows for automated testing and deployment.

## Workflows

### CI Workflow (.github/workflows/ci.yml)
- **Triggers:** push, pull_request
- **Steps:**
  1. Checkout code
  2. Setup Python 3.12
  3. Install dependencies
  4. Run mypy type checking
  5. Run pytest suite
  6. Fail on any error

### Docker Build Workflow (.github/workflows/docker-build.yml)
- **Triggers:** push to main, tag creation
- **Steps:**
  1. Login to registry
  2. Build backend image
  3. Build frontend image
  4. Push images

## Configuration Files

### pyproject.toml
- Python 3.12+
- Dependencies defined
- Dev dependencies: pytest, pytest-asyncio

### pytest Configuration (pyproject.toml)
- asyncio_mode = "auto"
- testpaths = tests

## Quality Gates
- All tests must pass (50/50)
- Mypy must be clean (0 errors)
- Linting not required (no ruff installed)

## Deployment Strategy
- Docker images on ghcr.io
- Environment variables for secrets
- Database migrations on deploy