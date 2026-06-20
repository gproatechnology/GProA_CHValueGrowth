# Logging Operations Guide

## Overview

NeumatiQ uses structured JSON logging for operational visibility.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| LOG_LEVEL | INFO | Logging level |
| LOG_FORMAT | json | json or console |

## Correlation IDs

Each request gets a `X-Correlation-ID` header for tracing.

```python
# Access in code
from neumatiq_next.core.middleware import get_correlation_id

with get_correlation_id() as cid:
    logger.info("operation", correlation_id=cid)
```

## Log Fields

| Field | Description |
|-------|-------------|
| timestamp | ISO format timestamp |
| level | Log level (INFO, ERROR, DEBUG) |
| logger | Module name |
| event | Event type identifier |
| correlation_id | Request trace ID |

## Event Types

| Event | Location |
|-------|----------|
| starting_application | main.py startup |
| request_completed | middleware |
| scraping_ingest_start | services.py |
| scraping_ingest_error | services.py |

## Example Log Output

```json
{
  "timestamp": "2026-06-12T17:00:00Z",
  "level": "info",
  "logger": "neumatiq_next.infrastructure.scraping.services",
  "event": "scraping_ingest_start",
  "fingerprint": "MICHELIN|205|55|16",
  "supplier_id": "d6876d88-..."
}
```