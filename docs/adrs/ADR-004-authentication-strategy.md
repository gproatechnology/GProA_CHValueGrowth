# ADR-004: Authentication Strategy

## Status
Proposed

## Context
El MVP requiere autenticación para proteger endpoints y gestionar permisos de usuarios.

## Decision

### Strategy: JWT (JSON Web Tokens)

### Roles
| Role | Description |
|------|-------------|
| admin | Full access to all endpoints |
| user | Read access + limited write |
| viewer | Read-only access |

### Protected Endpoints
| Endpoint | Required Role |
|----------|---------------|
| POST /products | admin, user |
| POST /observations | admin, user |
| POST /suppliers | admin |
| DELETE /* | admin |
| GET /* | viewer, user, admin |

### Implementation Plan

1. **Dependencies:**
   - `python-jose[cryptography]` - JWT handling
   - `passlib[bcrypt]` - Password hashing

2. **Middleware:**
   - FastAPI dependency injection for `get_current_user`
   - Role checking in endpoint dependencies

3. **Configuration:**
   ```python
   # settings.py
   jwt_secret_key: str = "CHANGE_ME"
   jwt_algorithm: str = "HS256"
   jwt_expiration_hours: int = 24
   ```

4. **User Model:**
   - email (unique)
   - hashed_password
   - role (enum: admin, user, viewer)
   - is_active

5. **Endpoints:**
   - POST /auth/login
   - POST /auth/refresh

## Consequences

### Positive
- Stateless authentication
- Scalable across workers
- Industry standard

### Negative
- Additional complexity in MVP
- Token revocation requires additional handling
- Password reset flow not included

## Implementation Priority
Phase 9A - Observability