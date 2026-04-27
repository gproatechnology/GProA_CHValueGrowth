"""
Exportación de datos - NeumatiQ API
Formatos soportados: CSV, Excel (XLSX), JSON
"""

import io
import csv
import json
from datetime import datetime
from typing import List, Dict, Any
import pandas as pd

from database.repository import ProductRepository

class DataExporter:
    """Exportador de datos en múltiples formatos."""
    
    @staticmethod
    def to_csv(products: List[Dict[str, Any]]) -> str:
        """
        Convierte lista de productos a CSV.
        
        Returns:
            String CSV (UTF-8)
        """
        if not products:
            return ""
        
        output = io.StringIO()
        # Determinamos columnas basadas en keys del primer producto
        fieldnames = ['id', 'source', 'title', 'brand', 'size', 'price', 'currency', 'url', 'scraped_at', 'created_at']
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        
        for product in products:
            row = {
                'id': product.get('id', ''),
                'source': product.get('source', ''),
                'title': product.get('title', ''),
                'brand': product.get('brand', ''),
                'size': product.get('size', ''),
                'price': product.get('price', ''),
                'currency': product.get('currency', 'MXN'),
                'url': product.get('url', ''),
                'scraped_at': product.get('scraped_at', ''),
                'created_at': product.get('created_at', ''),
            }
            writer.writerow(row)
        
        return output.getvalue()
    
    @staticmethod
    def to_excel(products: List[Dict[str, Any]]) -> bytes:
        """
        Convierte lista de productos a Excel (XLSX).
        
        Returns:
            Bytes del archivo Excel
        """
        if not products:
            return b""
        
        # Convertir a DataFrame
        df = pd.DataFrame(products)
        
        # Reordenar columnas
        column_order = ['id', 'source', 'title', 'brand', 'size', 'price', 'currency', 'url', 'scraped_at', 'created_at']
        existing_cols = [col for col in column_order if col in df.columns]
        df = df[existing_cols]
        
        # Exportar a Excel en memoria
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Productos', index=False)
        
        return output.getvalue()
    
    @staticmethod
    def to_json(products: List[Dict[str, Any]], indent: int = 2) -> str:
        """Exporta a JSON (ya es nativo)."""
        return json.dumps(products, indent=indent, default=str, ensure_ascii=False)
    
    @staticmethod
    def to_dict(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Retorna lista de diccionarios (ya está en ese formato)."""
        return products
