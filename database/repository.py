"""
Repositorio de productos - CHValueGrowth
Operaciones CRUD para la tabla products con cache layer.
"""

import logging
from datetime import datetime
from typing import List, Optional
from sqlalchemy.exc import IntegrityError
from database.config import get_session
from database.models import Product, User

# Importar caché y decorador
try:
    from services.api.cache_decorators import cached, invalidate_cache, clear_all_repo_cache
except ImportError:
    # Si no está disponible (ej: tests), definir stubs
    cached = lambda *args, **kwargs: lambda func: func
    invalidate_cache = lambda *args, **kwargs: False
    clear_all_repo_cache = lambda: False

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
            
            # Invalidar cache afectado (read-through cache)
            invalidate_cache('get_all')
            invalidate_cache('get_by_brand', brand=product_data.get('brand'))
            invalidate_cache('get_by_size', size=product_data.get('size'))
            invalidate_cache('count')
            
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
        
        # Invalidar cache una vez (create_product ya invalida por producto, pero aseguramos)
        if successful > 0:
            invalidate_cache('get_all')
            invalidate_cache('count')
        
        logger.info(f"Bulk insert: {successful} exitosos, {failed} fallidos")
        return successful, failed
    
    @cached()  # TTL por defecto según método (get_all: 300s)
    def get_all(self, limit: int = 100) -> List[Product]:
        """Obtiene todos los productos."""
        session = self._get_session()
        return session.query(Product).order_by(Product.scraped_at.desc()).limit(limit).all()
    
    @cached()  # TTL: get_by_id → 600s
    def get_by_id(self, product_id: int) -> Optional[Product]:
        """Obtiene un producto por ID."""
        session = self._get_session()
        return session.query(Product).filter(Product.id == product_id).first()
    
    @cached()  # TTL: get_by_brand → 600s
    def get_by_brand(self, brand: str, limit: int = 50) -> List[Product]:
        """Obtiene productos por marca."""
        session = self._get_session()
        return session.query(Product).filter(
            Product.brand.ilike(f"%{brand}%")
        ).order_by(Product.price.asc()).limit(limit).all()
    
    @cached()  # TTL: get_by_size → 600s
    def get_by_size(self, size: str, limit: int = 50) -> List[Product]:
        """Obtiene productos por tamaño."""
        session = self._get_session()
        return session.query(Product).filter(
            Product.size == size
        ).order_by(Product.price.asc()).limit(limit).all()
    
    @cached()  # TTL: count → 60s (stats cambian frecuentemente)
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
        
        # Invalidar TODO el cache del repository
        clear_all_repo_cache()
        return count
    
    def update_product(self, product_id: int, update_data: dict) -> Optional[Product]:
        """
        Actualiza un producto existente.
        
        Args:
            product_id: ID del producto
            update_data: Diccionario con campos a actualizar
            
        Returns:
            Producto actualizado o None si no existe
        """
        try:
            session = self._get_session()
            product = session.query(Product).filter(Product.id == product_id).first()
            
            if not product:
                return None
            
            # Actualizar campos permitidos
            allowed_fields = ['title', 'price', 'brand', 'size', 'url', 'currency']
            for field, value in update_data.items():
                if field in allowed_fields and hasattr(product, field):
                    setattr(product, field, value)
            
            product.updated_at = datetime.utcnow()
            session.commit()
            
            # Invalidar cache relacionado
            invalidate_cache('get_all')
            invalidate_cache('get_by_id', product_id=product_id)
            if 'brand' in update_data:
                invalidate_cache('get_by_brand', brand=update_data['brand'])
            if 'size' in update_data:
                invalidate_cache('get_by_size', size=update_data['size'])
            invalidate_cache('count')
            
            logger.info(f"Producto actualizado: ID={product_id}")
            return product
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error actualizando producto {product_id}: {e}")
            return None
    
    def close(self):
        """Cierra la sesión."""
        if self.session:
            self.session.close()
            self.session = None


class UserRepository:
    """Repositorio para operaciones de usuarios en base de datos."""
    
    def __init__(self):
        self.session = None
    
    def _get_session(self):
        """Obtiene una sesión de base de datos."""
        if self.session is None:
            self.session = get_session()
        return self.session
    
    def get_by_username(self, username: str) -> Optional[User]:
        """Obtiene un usuario por username."""
        return self._get_session().query(User).filter(User.username == username).first()
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Obtiene un usuario por email."""
        return self._get_session().query(User).filter(User.email == email).first()
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Obtiene un usuario por ID."""
        return self._get_session().query(User).filter(User.id == user_id).first()
    
    def get_all(self, active_only: bool = True) -> List[User]:
        """Obtiene todos los usuarios."""
        query = self._get_session().query(User)
        if active_only:
            query = query.filter(User.is_active == True)
        return query.all()
    
    def create_user(self, username: str, password: str, email: str = None, 
                    full_name: str = None, role: str = 'user') -> Optional[User]:
        """
        Crea un nuevo usuario.
        
        Args:
            username: Nombre de usuario único
            password: Contraseña en texto plano (se hasheará)
            email: Email (opcional)
            full_name: Nombre completo (opcional)
            role: Rol ('admin', 'user', 'manager')
            
        Returns:
            User creado o None si falla
        """
        try:
            session = self._get_session()
            
            # Verificar que no exista
            if session.query(User).filter(User.username == username).first():
                logger.warning(f"Usuario ya existe: {username}")
                return None
            
            user = User(
                username=username,
                email=email,
                full_name=full_name or username,
                role=role
            )
            user.set_password(password)
            
            session.add(user)
            session.commit()
            session.refresh(user)
            
            logger.info(f"Usuario creado: {username} (role: {role})")
            return user
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creando usuario {username}: {e}")
            return None
    
    def update_last_login(self, username: str):
        """Actualiza el último login del usuario."""
        user = self.get_by_username(username)
        if user:
            user.last_login = datetime.utcnow()
            self.session.commit()
    
    def update_password(self, user_id: int, new_password: str) -> bool:
        """Actualiza la contraseña de un usuario."""
        user = self.get_by_id(user_id)
        if not user:
            return False
        user.set_password(new_password)
        self.session.commit()
        return True
    
    def deactivate_user(self, user_id: int) -> bool:
        """Desactiva un usuario (soft delete)."""
        user = self.get_by_id(user_id)
        if not user:
            return False
        user.is_active = False
        self.session.commit()
        return True
    
    def activate_user(self, user_id: int) -> bool:
        """Activa un usuario."""
        user = self.get_by_id(user_id)
        if not user:
            return False
        user.is_active = True
        self.session.commit()
        return True
    
    def change_role(self, user_id: int, new_role: str) -> bool:
        """Cambia el rol de un usuario."""
        user = self.get_by_id(user_id)
        if not user:
            return False
        if new_role not in ('admin', 'user', 'manager'):
            return False
        user.role = new_role
        self.session.commit()
        return True
    
    def close(self):
        """Cierra la sesión."""
        if self.session:
            self.session.close()
            self.session = None
