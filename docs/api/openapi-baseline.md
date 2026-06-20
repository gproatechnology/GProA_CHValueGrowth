# OpenAPI Baseline

**Generated:** 2026-06-11
**Application:** NeumatiQ Next

## Endpoints Catalog

| Path | Method | Tags | Summary | Operation ID |
|------|--------|------|---------|--------------|
| `/health/` | GET | health | Health Check | `health_check_health__get` |
| `/version/` | GET | version | Get Version | `get_version_version__get` |

## Schemas

### HealthResponse
```json
{
  "properties": {
    "status": {"type": "string", "title": "Status"},
    "service": {"type": "string", "title": "Service"},
    "version": {"type": "string", "title": "Version"},
    "timestamp": {"type": "string", "title": "Timestamp"}
  },
  "type": "object",
  "required": ["status", "service", "version", "timestamp"],
  "title": "HealthResponse"
}
```

### VersionResponse
```json
{
  "properties": {
    "name": {"type": "string", "title": "Name"},
    "version": {"type": "string", "title": "Version"},
    "api_version": {"type": "string", "title": "Api Version", "default": "v1"}
  },
  "type": "object",
  "required": ["name", "version"],
  "title": "VersionResponse"
}
```

## OpenAPI Document (Truncated)

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "NeumatiQ Next",
    "version": "0.1.0"
  },
  "paths": {
    "/health/": {
      "get": {
        "tags": ["health"],
        "summary": "Health Check",
        "operationId": "health_check_health__get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {"$ref": "#/components/schemas/HealthResponse"}
              }
            }
          }
        }
      }
    },
    "/version/": {
      "get": {
        "tags": ["version"],
        "summary": "Get Version",
        "operationId": "get_version_version__get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {"$ref": "#/components/schemas/VersionResponse"}
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "HealthResponse": { /* See schema above */ },
      "VersionResponse": { /* See schema above */ }
    }
  }
}
```

## Validation Results

| Check | Result |
|-------|--------|
| `/openapi.json` returns 200 | ✅ PASS |
| `/docs` returns 200 | ✅ PASS |
| `/redoc` returns 200 | ✅ PASS |
| health endpoint in OpenAPI | ✅ PASS |
| version endpoint in OpenAPI | ✅ PASS |
| No schema errors | ✅ PASS |

## Live Endpoints

### GET /health
```json
{
  "status": "healthy",
  "service": "NeumatiQ Next",
  "version": "0.1.0",
  "timestamp": "2026-06-11T21:05:13.123456+00:00"
}
```

### GET /version
```json
{
  "name": "NeumatiQ Next",
  "version": "0.1.0",
  "api_version": "v1"
}
```