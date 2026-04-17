"""
Rutas de órdenes - NeumatiQ API v1
Sistema de Gestión Integral para el Comercio de Neumáticos
Desarrollado por GProA Technology - Comercializado por CH ValueGrowth
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from database.config import init_db, get_session
from database.models import Order, Customer

# Router
router = APIRouter(prefix="/api/v1", tags=["orders", "customers"])

# Inicializar DB
init_db()


# --- Pydantic Schemas ---
class OrderCreate(BaseModel):
    order_number: str = Field(..., description="Número de orden")
    customer_id: int = Field(..., description="ID del cliente")
    total: float = Field(..., ge=0, description="Total de la orden")
    status: str = Field(default="pending", description="Estado de la orden")
    notes: Optional[str] = Field(None, description="Notas adicionales")


class OrderUpdate(BaseModel):
    status: Optional[str] = Field(None, description="Estado de la orden")
    total: Optional[float] = Field(None, ge=0, description="Total de la orden")
    notes: Optional[str] = Field(None, description="Notas adicionales")


class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Nombre del cliente")
    email: EmailStr = Field(..., description="Email del cliente")
    phone: Optional[str] = Field(None, max_length=20, description="Teléfono")
    address: Optional[str] = Field(None, max_length=500, description="Dirección")
    rfc: Optional[str] = Field(None, max_length=20, description="RFC")


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=500)
    rfc: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = Field(None, description="Estado: active/inactive")


# --- Order Endpoints ---
@router.get("/orders")
def get_orders(
    status: Optional[str] = Query(None, description="Filtrar por estado"),
    customer_id: Optional[int] = Query(None, description="Filtrar por cliente"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> dict:
    """Obtiene lista de órdenes."""
    try:
        session = get_session()
        query = session.query(Order)
        
        if status:
            query = query.filter(Order.status == status)
        if customer_id:
            query = query.filter(Order.customer_id == customer_id)
        
        total = query.count()
        orders = query.order_by(Order.created_at.desc()).offset((page-1) * limit).limit(limit).all()
        session.close()
        
        return {
            "success": True,
            "pagination": {"page": page, "limit": limit, "total": total},
            "data": [o.to_dict() for o in orders]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/orders/{order_id}")
def get_order(order_id: int) -> dict:
    """Obtiene una orden por ID."""
    try:
        session = get_session()
        order = session.query(Order).filter(Order.id == order_id).first()
        session.close()
        
        if not order:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        
        return {"success": True, "data": order.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/orders")
def create_order(order: OrderCreate) -> dict:
    """Crea una nueva orden."""
    try:
        session = get_session()
        new_order = Order(
            order_number=order.order_number,
            customer_id=order.customer_id,
            total=order.total,
            status=order.status,
            notes=order.notes
        )
        session.add(new_order)
        session.commit()
        session.refresh(new_order)
        session.close()
        
        return {"success": True, "data": new_order.to_dict()}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/orders/{order_id}")
def update_order(order_id: int, order: OrderUpdate) -> dict:
    """Actualiza una orden."""
    try:
        session = get_session()
        db_order = session.query(Order).filter(Order.id == order_id).first()
        
        if not db_order:
            session.close()
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        
        if order.status is not None:
            db_order.status = order.status
        if order.total is not None:
            db_order.total = order.total
        if order.notes is not None:
            db_order.notes = order.notes
        
        session.commit()
        session.refresh(db_order)
        session.close()
        
        return {"success": True, "data": db_order.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/orders/{order_id}")
def delete_order(order_id: int) -> dict:
    """Elimina una orden."""
    try:
        session = get_session()
        order = session.query(Order).filter(Order.id == order_id).first()
        
        if not order:
            session.close()
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        
        session.delete(order)
        session.commit()
        session.close()
        
        return {"success": True, "message": "Orden eliminada"}
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# --- Customer Endpoints ---
@router.get("/customers")
def get_customers(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> dict:
    """Obtiene lista de clientes."""
    try:
        session = get_session()
        query = session.query(Customer)
        
        if status:
            query = query.filter(Customer.status == status)
        
        total = query.count()
        customers = query.order_by(Customer.created_at.desc()).offset((page-1) * limit).limit(limit).all()
        session.close()
        
        return {
            "success": True,
            "pagination": {"page": page, "limit": limit, "total": total},
            "data": [c.to_dict() for c in customers]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/customers/{customer_id}")
def get_customer(customer_id: int) -> dict:
    """Obtiene un cliente por ID."""
    try:
        session = get_session()
        customer = session.query(Customer).filter(Customer.id == customer_id).first()
        session.close()
        
        if not customer:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        
        return {"success": True, "data": customer.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/customers")
def create_customer(customer: CustomerCreate) -> dict:
    """Crea un nuevo cliente."""
    try:
        session = get_session()
        new_customer = Customer(
            name=customer.name,
            email=customer.email,
            phone=customer.phone,
            address=customer.address,
            rfc=customer.rfc
        )
        session.add(new_customer)
        session.commit()
        session.refresh(new_customer)
        session.close()
        
        return {"success": True, "data": new_customer.to_dict()}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/customers/{customer_id}")
def update_customer(customer_id: int, customer: CustomerUpdate) -> dict:
    """Actualiza un cliente."""
    try:
        session = get_session()
        db_customer = session.query(Customer).filter(Customer.id == customer_id).first()
        
        if not db_customer:
            session.close()
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        
        if customer.name is not None:
            db_customer.name = customer.name
        if customer.phone is not None:
            db_customer.phone = customer.phone
        if customer.address is not None:
            db_customer.address = customer.address
        if customer.rfc is not None:
            db_customer.rfc = customer.rfc
        if customer.status is not None:
            db_customer.status = customer.status
        
        session.commit()
        session.refresh(db_customer)
        session.close()
        
        return {"success": True, "data": db_customer.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/customers/{customer_id}")
def delete_customer(customer_id: int) -> dict:
    """Elimina un cliente."""
    try:
        session = get_session()
        customer = session.query(Customer).filter(Customer.id == customer_id).first()
        
        if not customer:
            session.close()
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        
        session.delete(customer)
        session.commit()
        session.close()
        
        return {"success": True, "message": "Cliente eliminado"}
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))