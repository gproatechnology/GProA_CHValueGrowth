"""SQLAlchemy Product repository implementation."""
import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from neumatiq_next.domain.repositories.product_repository import IProductRepository
from neumatiq_next.infrastructure.persistence.sqlalchemy import Product


class SQLAlchemyProductRepository:
    """Product repository implementation using SQLAlchemy."""
    
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
    
    async def get(self, id: uuid.UUID) -> Product | None:
        """Get product by ID."""
        result = await self._session.execute(
            select(Product).where(Product.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_fingerprint(self, fingerprint: str) -> Product | None:
        """Get product by fingerprint (canonical key)."""
        result = await self._session.execute(
            select(Product).where(Product.fingerprint == fingerprint)
        )
        return result.scalar_one_or_none()
    
    async def search_by_fingerprint(self, fingerprint: str, limit: int = 1) -> Sequence[Product]:
        """Search products by fingerprint pattern."""
        result = await self._session.execute(
            select(Product)
            .where(Product.fingerprint == fingerprint)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_by_sku(self, sku: str) -> Product | None:
        """Get product by SKU."""
        result = await self._session.execute(
            select(Product).where(Product.sku == sku)
        )
        return result.scalar_one_or_none()
    
    async def search_by_name(self, name: str, limit: int = 50) -> Sequence[Product]:
        """Search products by name pattern."""
        result = await self._session.execute(
            select(Product)
            .where(Product.name.ilike(f"%{name}%"))
            .limit(limit)
        )
        return result.scalars().all()
    
    async def list_by_brand(self, brand_id: uuid.UUID, limit: int = 100) -> Sequence[Product]:
        """List products for a brand."""
        result = await self._session.execute(
            select(Product).where(Product.brand_id == brand_id).limit(limit)
        )
        return result.scalars().all()
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence[Product]:
        """List products with pagination."""
        result = await self._session.execute(
            select(Product).offset(offset).limit(limit)
        )
        return result.scalars().all()
    
    async def add(self, product: Product) -> None:
        """Add a new product."""
        self._session.add(product)
    
    async def remove(self, product: Product) -> None:
        """Remove a product."""
        await self._session.delete(product)