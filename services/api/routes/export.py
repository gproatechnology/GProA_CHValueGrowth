"""
Rutas de export - NeumatiQ API v1
Endpoints para exportar datos.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from services.api.utils.export_data import DataExporter
from database.config import init_db, get_session
from database.models import Product, Order, Customer

router = APIRouter(prefix="/api/v1", tags=["export"])
init_db()


@router.get("/export/products")
def export_products(format: str = Query("json", description="Formato: json, csv, html")):
    """Exporta productos."""
    try:
        session = get_session()
        products = session.query(Product).all()
        data = [p.to_dict() for p in products]
        session.close()
        
        exporter = DataExporter(data)
        
        if format == "csv":
            filename = exporter.to_csv()
        elif format == "html":
            filename = exporter.to_html_report()
        else:
            filename = exporter.to_json()
        
        return {"success": True, "filename": filename, "count": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/export/orders")
def export_orders(format: str = Query("json")):
    """Exporta órdenes."""
    try:
        session = get_session()
        orders = session.query(Order).all()
        data = [o.to_dict() for o in orders]
        session.close()
        
        exporter = DataExporter(data)
        
        if format == "csv":
            filename = exporter.to_csv()
        elif format == "html":
            filename = exporter.to_html_report()
        else:
            filename = exporter.to_json()
        
        return {"success": True, "filename": filename, "count": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/export/customers")
def export_customers(format: str = Query("json")):
    """Exporta clientes."""
    try:
        session = get_session()
        customers = session.query(Customer).all()
        data = [c.to_dict() for c in customers]
        session.close()
        
        exporter = DataExporter(data)
        
        if format == "csv":
            filename = exporter.to_csv()
        elif format == "html":
            filename = exporter.to_html_report()
        else:
            filename = exporter.to_json()
        
        return {"success": True, "filename": filename, "count": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))