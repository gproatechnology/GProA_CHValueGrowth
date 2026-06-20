"""SQLAlchemy Supplier repository implementation."""
import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from neumatiq_next.domain.repositories.supplier_repository import ISupplierRepository
from neumatiq_next.infrastructure.persistence.sqlalchemy import Supplier


class SQLAlchemySupplierRepository:
    """Supplier repository implementation using SQLAlchemy."""
    
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
    
    async def get(self, id: uuid.UUID) -> Supplier | None:
        """Get supplier by ID."""
        result = await self._session.execute(
            select(Supplier).where(Supplier.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_name(self, name: str) -> Supplier | None:
        """Get supplier by exact name."""
        result = await self._session.execute(
            select(Supplier).where(Supplier.name == name)
        )
        return result.scalar_one_or_none()
    
    async def get_by_normalized_name(self, normalized_name: str) -> Supplier | None:
        """Get supplier by normalized name."""
        result = await self._session.execute(
            select(Supplier).where(Supplier.normalized_name == normalized_name)
        )
        return result.scalar_one_or_none()
    
    async def get_by_country(self, country_id: uuid.UUID) -> Sequence[Supplier]:
        """Get all suppliers for a country."""
        result = await self._session.execute(
            select(Supplier).where(Supplier.country_id == country_id)
        )
        return result.scalars().all()
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence[Supplier]:
        """List suppliers with pagination."""
        result = await self._session.execute(
            select(Supplier).offset(offset).limit(limit)
        )
        return result.scalars().all()
    
    async def add(self, supplier: Supplier) -> None:
        """Add a new supplier."""
        self._session.add(supplier)
    
    async def remove(self, supplier: Supplier) -> None:
        """Remove a supplier."""
        await self._session.delete(supplier)