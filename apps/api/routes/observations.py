"""Price Observations API routes."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["observations"])


class ObservationResponse(BaseModel):
    """Observation response model."""

    id: str
    product_id: str
    supplier_id: str
    price: float
    availability: str


@router.get("/observations")
async def list_observations():
    """List price observations."""
    return {"items": [], "total": 0}


@router.get("/observations/latest")
async def get_latest_prices():
    """Get latest prices."""
    return {"items": [], "total": 0}