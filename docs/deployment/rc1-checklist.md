# RC1 Deployment Checklist

## Pre-deployment
- [ ] Verify tests pass (50/50)
- [ ] Verify mypy clean (0 errors)
- [ ] Set API_KEY environment variable
- [ ] Configure DATABASE_URL
- [ ] Verify Docker images build

## Deployment
- [ ] Deploy PostgreSQL
- [ ] Run migrations
- [ ] Deploy backend API
- [ ] Deploy frontend
- [ ] Configure reverse proxy (nginx/caddy)

## Post-deployment
- [ ] Verify /health endpoint
- [ ] Verify /health/database endpoint
- [ ] Verify /metrics endpoint
- [ ] Test protected endpoints with API key
- [ ] Verify scraper connectivity