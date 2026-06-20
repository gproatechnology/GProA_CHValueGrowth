# Security - Authentication

## Overview
API Key authentication for protected endpoints.

## Configuration
Set `API_KEY` environment variable in `.env`:
```
API_KEY=your-secure-key-here
```

If `API_KEY` is empty, auth is disabled (development mode).

## Protected Endpoints
| Method | Path | Auth Required |
|--------|------|---------------|
| POST | /observations | ✅ |
| POST | /products/get-or-create | ✅ |

## Usage
Include header in requests:
```
X-API-Key: your-secure-key-here
```

## Auth Flow
1. Extract `X-API-Key` header
2. If no key configured → dev mode (allow)
3. If key provided → validate against `settings.api_key`
4. Return 401 if invalid/missing

## Implementation
- `interfaces/http/security.py` - Auth dependency
- `core/config.py` - API_KEY setting