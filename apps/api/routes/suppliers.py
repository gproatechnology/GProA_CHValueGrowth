"""Suppliers API routes."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["suppliers"])


class SupplierResponse(BaseModel):
    """Supplier response model."""

    id: str
    name: str
    source_key: str
    is_active: bool = True


@router.get("/suppliers")
async def list_suppliers():
    """List all suppliers."""
    return {"items": [], "total": 0}


@router.get("/suppliers/{supplier_id}")
async def get_supplier(supplier_id: str):
    """Get supplier by ID."""
    raise HTTPException(status_code=404, detail="Supplier not found")