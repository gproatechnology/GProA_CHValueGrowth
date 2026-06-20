from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timezone
from sqlalchemy import text
from neumatiq_next.core.config import settings
from neumatiq_next.core.database import engine


router = APIRouter()
database_router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str


@router.get("/", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service=settings.app_name,
        version=settings.app_version,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@database_router.get("/database")
async def database_health():
    """Check database connectivity."""
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "error", "error": str(e)}