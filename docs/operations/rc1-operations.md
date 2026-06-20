# RC1 Operations Guide

## Backup Procedure
```bash
pg_dump -h postgres -U postgres -Fc neumatiq > backup_$(date +%Y%m%d).dump
```

## Restore Procedure
```bash
pg_restore -h postgres -U postgres -d neumatiq -c backup.dump
```

## Health Verification
- Endpoint: `/health` - Returns `{"status": "ok"}`
- Endpoint: `/health/database` - Returns DB connectivity status

## Metrics Verification
- Endpoint: `/metrics` - Prometheus format
- Counters: products_reused, observations_created, scraping_requests

## Incident Response
1. Check logs: `docker logs neumatiq-api`
2. Verify DB connectivity
3. Check `/health` endpoints
4. Review recent observations in DB
5. Alert if >5% error rate