"""Products API routes."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["products"])


class ProductResponse(BaseModel):
    """Product response model."""

    id: str
    name: str
    size: str | None = None
    model: str | None = None


@router.get("/products")
async def list_products():
    """List all products."""
    return {"items": [], "total": 0}


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get product by ID."""
    raise HTTPException(status_code=404, detail="Product not found")