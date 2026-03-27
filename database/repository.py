"""
Repositorio de productos - CHValueGrowth
Operaciones CRUD para la tabla products.
"""

import logging
from datetime import datetime
from typing import List, Optional
from sqlalchemy.exc import IntegrityError
from database.config import get_session
from database.models import Product

logger = logging.getLogger(__name__)


class ProductRepository:
    """Repositorio para operaciones de productos en base de datos."""
    
    def __init__(self):
        self.session = None
    
    def _get_session(self):
        """Obtiene una sesión de base de datos."""
        if self.session is None:
            self.session = get_session()
        return self.session
    
    def create_product(self, product_data: dict) -> Optional[Product]:
        """
        Crea un nuevo producto en la base de datos.
        
        Args:
            product_data: Diccionario con los datos del producto
            
        Returns:
            Producto creado o None si falla
        """
        try:
            session = self._get_session()
            
            # Verificar si ya existe (mismo title + price + source + scraped_at相近)
            existing = session.query(Product).filter(
                Product.title == product_data['title'],
                Product.price == product_data['price'],
                Product.source == product_data.get('source', 'mercadolibre')
            ).first()
            
            if existing:
                logger.debug(f"Producto ya existe: {product_data['title'][:30]}...")
                return None
            
            # Crear nuevo producto
            product = Product.from_dict(product_data)
            session.add(product)
            session.commit()
            session.refresh(product)
            
            logger.info(f"Producto creado: ID={product.id}, {product.title[:30]}...")
            return product
            
        except IntegrityError as e:
            session.rollback()
            logger.warning(f"Producto duplicado (IntegrityError): {product_data['title'][:30]}...")
            return None
        except Exception as e:
            session.rollback()
            logger.error(f"Error creando producto: {e}")
            return None
    
    def create_many(self, products_data: List[dict]) -> tuple:
        """
        Crea múltiples productos.
        
        Args:
            products_data: Lista de diccionarios con datos de productos
            
        Returns:
            Tupla (exitosos, fallidos)
        """
        successful = 0
        failed = 0
        
        for product_data in products_data:
            result = self.create_product(product_data)
            if result:
                successful += 1
            else:
                failed += 1
        
        logger.info(f"Bulk insert: {successful} exitosos, {failed} fallidos")
        return successful, failed
    
    def get_all(self, limit: int = 100) -> List[Product]:
        """Obtiene todos los productos."""
        session = self._get_session()
        return session.query(Product).order_by(Product.scraped_at.desc()).limit(limit).all()
    
    def get_by_id(self, product_id: int) -> Optional[Product]:
        """Obtiene un producto por ID."""
        session = self._get_session()
        return session.query(Product).filter(Product.id == product_id).first()
    
    def get_by_brand(self, brand: str, limit: int = 50) -> List[Product]:
        """Obtiene productos por marca."""
        session = self._get_session()
        return session.query(Product).filter(
            Product.brand.ilike(f"%{brand}%")
        ).order_by(Product.price.asc()).limit(limit).all()
    
    def get_by_size(self, size: str, limit: int = 50) -> List[Product]:
        """Obtiene productos por tamaño."""
        session = self._get_session()
        return session.query(Product).filter(
            Product.size == size
        ).order_by(Product.price.asc()).limit(limit).all()
    
    def count(self) -> int:
        """Cuenta el total de productos."""
        session = self._get_session()
        return session.query(Product).count()
    
    def delete_all(self) -> int:
        """Elimina todos los productos. Retorna el número de eliminados."""
        session = self._get_session()
        count = session.query(Product).delete()
        session.commit()
        logger.warning(f"Eliminados {count} productos")
        return count
    
    def close(self):
        """Cierra la sesión."""
        if self.session:
            self.session.close()
            self.session = None