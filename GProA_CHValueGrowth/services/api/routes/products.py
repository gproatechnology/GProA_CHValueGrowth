"""
Rutas de productos - NeumatiQ API v1
Sistema de Gestión Integral para el Comercio de Neumáticos
Desarrollado por GProA Technology - Comercializado por CH ValueGrowth
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from pydantic import BaseModel, Field
from database.config import init_db, get_session
from database.models import Product
from database.repository import ProductRepository
from services.processor.metrics import get_pipeline_metrics, reset_metrics, _pipeline_metrics

# Router
router = APIRouter(prefix="/api/v1", tags=["products"])

# Inicializar DB
init_db()


@router.get("/products")
def get_products(
    brand: Optional[str] = Query(None, description="Filtrar por marca"),
    size: Optional[str] = Query(None, description="Filtrar por tamaño"),
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(20, ge=1, le=100, description="Resultados por página")
) -> dict:
    """
    Obtiene lista de productos con paginación.
    
    Args:
        brand: Filtrar por marca (opcional)
        size: Filtrar por tamaño (opcional)
        page: Número de página (default 1)
        limit: Resultados por página (default 20)
    
    Returns:
        JSON con paginación y lista de productos
    """
    try:
        repo = ProductRepository()
        
        # Obtener todos los productos según filtro
        if brand:
            all_products = repo.get_by_brand(brand, limit=1000)
        elif size:
            all_products = repo.get_by_size(size, limit=1000)
        else:
            all_products = repo.get_all(limit=1000)
        
        repo.close()
        
        # Calcular paginación
        total = len(all_products)
        total_pages = (total + limit - 1) // limit  # Redondeo hacia arriba
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        
        # Obtener página actual
        page_products = all_products[start_idx:end_idx]
        
        return {
            "success": True,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1
            },
            "count": len(page_products),
            "data": [p.to_dict() for p in page_products]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/products/stats")
def get_stats(
    brand: Optional[str] = Query(None, description="Filtrar por marca"),
    size: Optional[str] = Query(None, description="Filtrar por tamaño")
) -> dict:
    """
    Obtiene estadísticas de precios con filtros opcionales.
    
    Args:
        brand: Filtrar por marca (opcional)
        size: Filtrar por tamaño (opcional)
    
    Returns:
        JSON con estadísticas: precio promedio, min, max, total productos
    """
    try:
        repo = ProductRepository()
        
        # Obtener productos según filtro
        if brand:
            products = repo.get_by_brand(brand, limit=1000)
        elif size:
            products = repo.get_by_size(size, limit=1000)
        else:
            products = repo.get_all(limit=1000)
        
        repo.close()
        
        if not products:
            return {
                "success": True,
                "filters": {"brand": brand, "size": size},
                "total_products": 0,
                "stats": {
                    "min_price": 0,
                    "max_price": 0,
                    "avg_price": 0
                }
            }
        
        prices = [p.price for p in products if p.price]
        
        return {
            "success": True,
            "filters": {"brand": brand, "size": size},
            "total_products": len(products),
            "stats": {
                "min_price": min(prices) if prices else 0,
                "max_price": max(prices) if prices else 0,
                "avg_price": round(sum(prices) / len(prices), 2) if prices else 0
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/products/grouped")
def get_grouped_products(
    group_by: str = Query("brand", description="Agrupar por: brand, size, o brand_size"),
    limit: int = Query(50, ge=1, le=100, description="Resultados por grupo")
) -> dict:
    """
    Obtiene productos agrupados con estadísticas por grupo.
    
    Args:
        group_by: Tipo de agrupacion (brand, size, brand_size)
        limit: Límite de resultados por grupo
    
    Returns:
        JSON con grupos y sus estadísticas
    """
    try:
        repo = ProductRepository()
        products = repo.get_all(limit=1000)
        repo.close()
        
        if not products:
            return {
                "success": True,
                "group_by": group_by,
                "total_groups": 0,
                "data": []
            }
        
        # Agrupar productos
        groups = {}
        
        for p in products:
            if group_by == "brand":
                key = p.brand or "Unknown"
            elif group_by == "size":
                key = p.size or "Unknown"
            elif group_by == "brand_size":
                key = f"{p.brand or 'Unknown'}/{p.size or 'Unknown'}"
            else:
                key = "All"
            
            if key not in groups:
                groups[key] = {
                    "name": key,
                    "products": [],
                    "prices": []
                }
            
            groups[key]["products"].append(p)
            if p.price:
                groups[key]["prices"].append(p.price)
        
        # Calcular estadísticas por grupo
        result = []
        for name, data in sorted(groups.items()):
            prices = data["prices"]
            count = len(data["products"])
            
            result.append({
                "name": name,
                "count": count,
                "stats": {
                    "min_price": min(prices) if prices else 0,
                    "max_price": max(prices) if prices else 0,
                    "avg_price": round(sum(prices) / len(prices), 2) if prices else 0
                },
                "sample": [p.to_dict() for p in data["products"][:3]]  # Primeros 3
            })
        
        return {
            "success": True,
            "group_by": group_by,
            "total_groups": len(result),
            "data": result[:limit]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/products/{product_id}")
def get_product(product_id: int) -> dict:
    """
    Obtiene un producto por ID.
    
    Args:
        product_id: ID del producto
    
    Returns:
        JSON con datos del producto
    """
    try:
        repo = ProductRepository()
        product = repo.get_by_id(product_id)
        repo.close()
        
        if not product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        return {
            "success": True,
            "data": product.to_dict()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/metrics")
def get_metrics() -> dict:
    """
    Obtiene métricas del pipeline de datos.
    
    Returns:
        JSON con métricas de calidad y confiabilidad
    """
    try:
        # Obtener métricas del pipeline
        pipeline_metrics = get_pipeline_metrics()
        
        # Obtener estadísticas de la base de datos
        repo = ProductRepository()
        total_db = repo.count()
        repo.close()
        
        # Construir respuesta
        return {
            "success": True,
            "pipeline": pipeline_metrics,
            "database": {
                "total_products": total_db
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.post("/metrics/reset")
def reset_metrics_endpoint() -> dict:
    """
    Resetea las métricas del pipeline.
    
    Returns:
        JSON confirmando el reset
    """
    try:
        reset_metrics()
        return {
            "success": True,
            "message": "Métricas reseteadas"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# --- Pydantic Schemas for Products ---
class ProductCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    brand: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    price: float = Field(..., ge=0)
    currency: str = Field(default="MXN", max_length=10)
    source: str = Field(default="mercadolibre", max_length=50)
    url: Optional[str] = Field(None, max_length=1000)


class ProductUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    brand: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    price: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=10)
    url: Optional[str] = Field(None, max_length=1000)


# --- CRUD Endpoints for Products ---
@router.post("/products", status_code=201)
def create_product(product: ProductCreate) -> dict:
    """Crea un nuevo producto."""
    try:
        session = get_session()
        new_product = Product(
            title=product.title,
            brand=product.brand,
            size=product.size,
            price=product.price,
            currency=product.currency,
            source=product.source,
            url=product.url
        )
        session.add(new_product)
        session.commit()
        session.refresh(new_product)
        session.close()
        
        return {"success": True, "data": new_product.to_dict()}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/products/{product_id}")
def update_product(product_id: int, product: ProductUpdate) -> dict:
    """Actualiza un producto."""
    try:
        session = get_session()
        db_product = session.query(Product).filter(Product.id == product_id).first()
        
        if not db_product:
            session.close()
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        if product.title is not None:
            db_product.title = product.title
        if product.brand is not None:
            db_product.brand = product.brand
        if product.size is not None:
            db_product.size = product.size
        if product.price is not None:
            db_product.price = product.price
        if product.currency is not None:
            db_product.currency = product.currency
        if product.url is not None:
            db_product.url = product.url
        
        session.commit()
        session.refresh(db_product)
        session.close()
        
        return {"success": True, "data": db_product.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/products/{product_id}")
def delete_product(product_id: int) -> dict:
    """Elimina un producto."""
    try:
        session = get_session()
        product = session.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            session.close()
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        session.delete(product)
        session.commit()
        session.close()
        
        return {"success": True, "message": "Producto eliminado"}
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))