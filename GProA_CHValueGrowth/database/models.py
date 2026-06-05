"""
Modelo de datos para productos - NeumatiQ
Sistema de Gestión Integral para el Comercio de Neumáticos
Desarrollado por GProA Technology - Comercializado por CH ValueGrowth
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint
from database.config import Base


class Product(Base):
    """Modelo de producto para persistencia en base de datos."""
    
    __tablename__ = 'products'
    
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Campos del producto
    source = Column(String(50), nullable=False, default='mercadolibre')
    title = Column(String(500), nullable=False)
    brand = Column(String(100), nullable=True)
    size = Column(String(50), nullable=True)
    price = Column(Float, nullable=False)
    currency = Column(String(10), nullable=False, default='MXN')
    url = Column(String(1000), nullable=True)
    
    # Timestamps
    scraped_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('title', 'price', 'source', 'scraped_at', name='uq_product_unique'),
    )
    
    def __repr__(self):
        return f"<Product(id={self.id}, title='{self.title[:30]}...', price={self.price})>"
    
    def to_dict(self):
        """Convierte el modelo a diccionario."""
        return {
            'id': self.id,
            'source': self.source,
            'title': self.title,
            'brand': self.brand,
            'size': self.size,
            'price': self.price,
            'currency': self.currency,
            'url': self.url,
            'scraped_at': self.scraped_at.isoformat() + 'Z' if self.scraped_at else None,
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None,
            'updated_at': self.updated_at.isoformat() + 'Z' if self.updated_at else None,
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        """Crea una instancia desde un diccionario."""
        return cls(
            source=data.get('source', 'mercadolibre'),
            title=data['title'],
            brand=data.get('brand'),
            size=data.get('size'),
            price=data['price'],
            currency=data.get('currency', 'MXN'),
            url=data.get('url'),
            scraped_at=datetime.fromisoformat(data['scraped_at'].rstrip('Z')) if data.get('scraped_at') else datetime.utcnow(),
        )


class Order(Base):
    """Modelo de orden para pedidos."""
    
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    order_number = Column(String(50), unique=True, nullable=False)
    customer_id = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default='pending')
    total = Column(Float, nullable=False, default=0)
    notes = Column(String(500), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'customer_id': self.customer_id,
            'status': self.status,
            'total': self.total,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None,
            'updated_at': self.updated_at.isoformat() + 'Z' if self.updated_at else None,
        }


class Customer(Base):
    """Modelo de cliente."""
    
    __tablename__ = 'customers'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    address = Column(String(500), nullable=True)
    rfc = Column(String(20), nullable=True)
    status = Column(String(20), nullable=False, default='active')
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'rfc': self.rfc,
            'status': self.status,
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None,
            'updated_at': self.updated_at.isoformat() + 'Z' if self.updated_at else None,
        }