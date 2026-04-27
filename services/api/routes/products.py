"""
Rutas de productos - NeumatiQ API v1
Sistema de Gestión Integral para el Comercio de Neumáticos
Desarrollado por GProA Technology - Comercializado por CH ValueGrowth
"""

import sys
import os
from datetime import datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import Response, StreamingResponse
from typing import Optional, List
from database.config import init_db
from database.repository import ProductRepository
from services.processor.metrics import get_pipeline_metrics, reset_metrics, _pipeline_metrics
from services.api.cache import cache_get, cache_set, cache_delete_pattern
from services.api.export import DataExporter

# Router
router = APIRouter(prefix="/api/v1", tags=["products"])

# Inicializar DB
init_db()

# Cache TTL desde env (default 300 segundos)
CACHE_TTL = int(os.getenv("CACHE_TTL_SECONDS", "300"))


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
        # Build cache key from query params
        cache_key = f"products:list:brand={brand}:size={size}:page={page}:limit={limit}"
        
        # Try cache first
        cached = cache_get(cache_key)
        if cached:
            return cached
        
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
        
        result = {
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
            "data": page_products  # ya son dicts (cache devuelve dicts)
        }
        
        # Store in cache (TTL configurable)
        cache_set(cache_key, result, CACHE_TTL)
        
        return result
        
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
        # Cache key
        cache_key = f"products:stats:brand={brand}:size={size}"
        
        # Try cache
        cached = cache_get(cache_key)
        if cached:
            return cached
        
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
            result = {
                "success": True,
                "filters": {"brand": brand, "size": size},
                "total_products": 0,
                "stats": {
                    "min_price": 0,
                    "max_price": 0,
                    "avg_price": 0
                }
            }
            cache_set(cache_key, result, CACHE_TTL)
            return result
        
        # Extraer precios de lista de dicts
        prices = [p.get('price') for p in products if p.get('price')]
        
        result = {
            "success": True,
            "filters": {"brand": brand, "size": size},
            "total_products": len(products),
            "stats": {
                "min_price": min(prices) if prices else 0,
                "max_price": max(prices) if prices else 0,
                "avg_price": round(sum(prices) / len(prices), 2) if prices else 0
            }
        }
        
        cache_set(cache_key, result, CACHE_TTL)
        return result
        
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
        # Cache key
        cache_key = f"products:grouped:group_by={group_by}:limit={limit}"
        
        # Try cache
        cached = cache_get(cache_key)
        if cached:
            return cached
        
        repo = ProductRepository()
        products = repo.get_all(limit=1000)
        repo.close()
        
        if not products:
            result = {
                "success": True,
                "group_by": group_by,
                "total_groups": 0,
                "data": []
            }
            cache_set(cache_key, result, CACHE_TTL)
            return result
        
        # Agrupar productos
        groups = {}
        
        for p in products:
            # p es dict
            brand = p.get('brand') or 'Unknown'
            size = p.get('size') or 'Unknown'
            
            if group_by == "brand":
                key = brand
            elif group_by == "size":
                key = size
            elif group_by == "brand_size":
                key = f"{brand}/{size}"
            else:
                key = "All"
            
            if key not in groups:
                groups[key] = {
                    "name": key,
                    "products": [],
                    "prices": []
                }
            
            groups[key]["products"].append(p)
            price = p.get('price')
            if price:
                groups[key]["prices"].append(price)
        
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
                "sample": data["products"][:3]  # Primeros 3 productos (ya son dicts)
            })
        
        final_result = {
            "success": True,
            "group_by": group_by,
            "total_groups": len(result),
            "data": result[:limit]
        }
        
        cache_set(cache_key, final_result, CACHE_TTL)
        return final_result
        
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
        cache_key = f"products:detail:{product_id}"
        
        # Try cache
        cached = cache_get(cache_key)
        if cached:
            return cached
        
        repo = ProductRepository()
        product = repo.get_by_id(product_id)
        repo.close()
        
        if not product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        result = {
            "success": True,
            "data": product  # ya es dict (cache devuelve dicts)
        }
        
        cache_set(cache_key, result, CACHE_TTL)
        return result
        
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


@router.get("/products/export")
def export_products(
    format: str = Query("csv", description="Formato: csv, excel, json"),
    brand: Optional[str] = Query(None, description="Filtrar por marca"),
    size: Optional[str] = Query(None, description="Filtrar por tamaño")
) -> Response:
    """
    Exporta productos a CSV, Excel o JSON.
    
    Args:
        format: Formato de exportación (csv|excel|json)
        brand: Filtrar por marca (opcional)
        size: Filtrar por tamaño (opcional)
    
    Returns:
        Archivo descargable con headers apropiados
    """
    try:
        # Validar formato
        format = format.lower()
        if format not in ('csv', 'excel', 'json'):
            raise HTTPException(status_code=400, detail="Formato no soportado. Usa: csv, excel, json")
        
        # Obtener productos (con filtros opcionales)
        repo = ProductRepository()
        if brand:
            products = repo.get_by_brand(brand, limit=1000)
        elif size:
            products = repo.get_by_size(size, limit=1000)
        else:
            products = repo.get_all(limit=1000)
        repo.close()
        
        if not products:
            raise HTTPException(status_code=404, detail="No hay productos para exportar")
        
        # Convertir a lista de diccionarios
        products_data = [p.to_dict() for p in products]
        
        # Exportar según formato
        if format == 'csv':
            csv_content = DataExporter.to_csv(products_data)
            filename = f"neumatiq_products_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            return Response(
                content=csv_content,
                media_type="text/csv; charset=utf-8",
                headers={
                    "Content-Disposition": f"attachment; filename={filename}",
                    "X-Legal-Disclaimer": "Datos con fines informativos. Verifica con proveedores."
                }
            )
        elif format == 'excel':
            excel_bytes = DataExporter.to_excel(products_data)
            filename = f"neumatiq_products_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            return Response(
                content=excel_bytes,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={
                    "Content-Disposition": f"attachment; filename={filename}",
                    "X-Legal-Disclaimer": "Datos con fines informativos. Verifica con proveedores."
                }
            )
        else:  # json
            json_content = DataExporter.to_json(products_data)
            filename = f"neumatiq_products_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            return Response(
                content=json_content,
                media_type="application/json; charset=utf-8",
                headers={
                    "Content-Disposition": f"attachment; filename={filename}",
                    "X-Legal-Disclaimer": "Datos con fines informativos. Verifica con proveedores."
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exportando datos: {str(e)}")


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