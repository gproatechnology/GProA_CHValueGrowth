"""
Rutas de exportación - NeumatiQ API v1
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from database.config import init_db
from database.repository import ProductRepository

router = APIRouter(prefix="/api/v1", tags=["export"])

init_db()


@router.get("/export/products")
def export_products(
    format: str = Query("json", regex="^(json|csv)$")
) -> dict:
    """Exportar productos."""
    try:
        repo = ProductRepository()
        products = repo.get_all(limit=10000)
        
        if format == "csv":
            if not products:
                return {"data": "", "format": "csv"}
            headers = ["id", "title", "brand", "size", "price", "currency"]
            rows = [[getattr(p, h, "") for h in headers] for p in products]
            csv_lines = [",".join(headers)] + [",".join(map(str, r)) for r in rows]
            return {"data": "\n".join(csv_lines), "format": "csv"}
        
        return {"data": products, "format": "json"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))