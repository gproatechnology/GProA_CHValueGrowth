"""SQLAlchemy Brand repository implementation."""
import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from neumatiq_next.domain.repositories.brand_repository import IBrandRepository
from neumatiq_next.infrastructure.persistence.sqlalchemy import Brand


class SQLAlchemyBrandRepository:
    """Brand repository implementation using SQLAlchemy."""
    
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
    
    async def get(self, id: uuid.UUID) -> Brand | None:
        """Get brand by ID."""
        result = await self._session.execute(
            select(Brand).where(Brand.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_name(self, name: str) -> Brand | None:
        """Get brand by exact name."""
        result = await self._session.execute(
            select(Brand).where(Brand.name == name)
        )
        return result.scalar_one_or_none()
    
    async def get_by_normalized_name(self, normalized_name: str) -> Brand | None:
        """Get brand by normalized name."""
        result = await self._session.execute(
            select(Brand).where(Brand.normalized_name == normalized_name)
        )
        return result.scalar_one_or_none()
    
    async def create_from_name(self, name: str) -> Brand:
        """Create a brand from name if not exists."""
        existing = await self.get_by_normalized_name(name.lower())
        if existing:
            return existing
        
        brand = Brand(
            id=uuid.uuid4(),
            name=name,
            normalized_name=name.lower(),
        )
        await self.add(brand)
        return brand
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence[Brand]:
        """List brands with pagination."""
        result = await self._session.execute(
            select(Brand).offset(offset).limit(limit)
        )
        return result.scalars().all()
    
    async def add(self, brand: Brand) -> None:
        """Add a new brand."""
        self._session.add(brand)
    
    async def remove(self, brand: Brand) -> None:
        """Remove a brand."""
        await self._session.delete(brand)