"""
Rutas de pedidos - NeumatiQ API v1
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from pydantic import BaseModel
from database.config import init_db, get_session
from database.models import Order
from database.repository import OrderRepository

router = APIRouter(prefix="/api/v1", tags=["orders"])

init_db()


class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int
    total: float


@router.get("/orders")
def get_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> dict:
    """Obtener lista de pedidos."""
    try:
        repo = OrderRepository()
        orders = repo.get_all(limit=limit, offset=(page-1)*limit)
        total = repo.count()
        return {
            "data": orders,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/orders")
def create_order(order: OrderCreate) -> dict:
    """Crear nuevo pedido."""
    try:
        repo = OrderRepository()
        new_order = repo.create(order.dict())
        return {"data": new_order}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/orders/{order_id}")
def get_order(order_id: int) -> dict:
    """Obtener pedido por ID."""
    try:
        repo = OrderRepository()
        order = repo.get_by_id(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        return {"data": order}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))