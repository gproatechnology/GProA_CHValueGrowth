"""Analytics API routes."""

from fastapi import APIRouter

router = APIRouter(tags=["analytics"])


@router.get("/analytics/overview")
async def get_overview():
    """Get analytics overview."""
    return {
        "total_products": 0,
        "total_suppliers": 0,
        "total_observations": 0,
        "avg_price": 0,
    }


@router.get("/analytics/trends")
async def get_trends():
    """Get price trends."""
    return {"items": []}


@router.get("/analytics/ranking/suppliers")
async def get_supplier_ranking():
    """Get supplier ranking."""
    return {"items": []}


@router.get("/analytics/ranking/brands")
async def get_brand_ranking():
    """Get brand ranking."""
    return {"items": []}