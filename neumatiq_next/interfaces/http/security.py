"""Security module for API authentication."""
from typing import Optional
from fastapi import Depends, HTTPException, Security
from fastapi.security import APIKeyHeader

from neumatiq_next.core.config import settings

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def get_api_key(api_key: Optional[str] = Security(api_key_header)) -> str:
    """Validate API key and return it."""
    if not settings.api_key:
        # No auth configured - allow in development
        return "dev-mode"
    
    if not api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    if api_key != settings.api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    return api_key


def require_auth(api_key: str = Depends(get_api_key)) -> str:
    """Dependency for protected endpoints."""
    return api_key