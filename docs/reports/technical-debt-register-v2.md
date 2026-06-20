# Technical Debt Register v2

## Critical (Must Fix)
| Item | Location | Impact |
|------|----------|--------|
| No authentication | API endpoints | Security breach potential |
| No rate limiting | Scraper/production | IP blocking risk |

## High (Should Fix)
| Item | Location | Impact |
|------|----------|--------|
| Frontend Dockerfile paths | infrastructure/docker/Dockerfile.frontend | Cannot build |
| No CI secrets management | .github/workflows | Hardcoded values risk |
| No environment example | project root | Setup friction |

## Medium (Can Defer)
| Item | Location | Impact |
|------|----------|--------|
| No pagination limits | API endpoints | Large dataset risk |
| No search index | PostgreSQL | Query performance |
| No circuit breaker | Scraper | Resilience |

## Low (Nice to Have)
| Item | Location | Impact |
|------|----------|--------|
| Frontend styling | React components | UX polish |
| Better error messages | API | Developer experience