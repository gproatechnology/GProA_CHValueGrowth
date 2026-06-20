"""SQLAlchemy Country repository implementation."""
import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from neumatiq_next.domain.repositories.country_repository import ICountryRepository
from neumatiq_next.infrastructure.persistence.sqlalchemy import Country


class SQLAlchemyCountryRepository:
    """Country repository implementation using SQLAlchemy."""
    
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
    
    async def get(self, id: uuid.UUID) -> Country | None:
        """Get country by ID."""
        result = await self._session.execute(
            select(Country).where(Country.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_code(self, code: str) -> Country | None:
        """Get country by ISO code."""
        result = await self._session.execute(
            select(Country).where(Country.code == code.upper())
        )
        return result.scalar_one_or_none()
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence[Country]:
        """List countries with pagination."""
        result = await self._session.execute(
            select(Country).offset(offset).limit(limit)
        )
        return result.scalars().all()
    
    async def list_active(self) -> Sequence[Country]:
        """List all active countries."""
        result = await self._session.execute(
            select(Country).where(Country.active == True)  # noqa: E712
        )
        return result.scalars().all()
    
    async def add(self, country: Country) -> None:
        """Add a new country."""
        self._session.add(country)
    
    async def remove(self, country: Country) -> None:
        """Remove a country."""
        await self._session.delete(country)