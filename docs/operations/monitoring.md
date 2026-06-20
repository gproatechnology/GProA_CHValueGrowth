# Monitoring Guide

## Metrics Endpoint

`GET /metrics` returns Prometheus-compatible metrics.

## Available Metrics

| Metric | Type | Description |
|--------|------|-------------|
| products_created | Counter | Products created via scraping |
| products_reused | Counter | Products matched and reused |
| observations_created | Counter | Price observations recorded |
| scraping_errors | Counter | Scraping errors encountered |

## Health Endpoints

| Endpoint | Description |
|----------|-------------|
| GET /health | Basic application health |
| GET /health/database | Database connectivity check |

## Alerting Recommendations

| Metric | Threshold | Severity |
|--------|-----------|----------|
| scraping_errors | >10/min | warning |
| health check failing | >3 consecutive | critical |

## Dashboard Queries

```
# Products per hour
rate(neumatiq_products_created[1h])

# Error rate
rate(neumatiq_scraping_errors[5m])
```