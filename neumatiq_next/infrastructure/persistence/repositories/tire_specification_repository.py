"""SQLAlchemy Tire Specification repository implementation."""
import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from neumatiq_next.domain.repositories.tire_specification_repository import ITireSpecificationRepository
from neumatiq_next.infrastructure.persistence.sqlalchemy import TireSpecification


class SQLAlchemyTireSpecificationRepository:
    """Tire specification repository implementation using SQLAlchemy."""
    
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
    
    async def get(self, id: uuid.UUID) -> TireSpecification | None:
        """Get tire specification by ID."""
        result = await self._session.execute(
            select(TireSpecification).where(TireSpecification.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_or_create(
        self, width: int, aspect_ratio: int, rim_diameter: int
    ) -> TireSpecification:
        """Get existing or create new tire specification."""
        fingerprint = f"{width}|{aspect_ratio}|{rim_diameter}"
        result = await self._session.execute(
            select(TireSpecification).where(TireSpecification.fingerprint == fingerprint)
        )
        spec = result.scalar_one_or_none()
        
        if not spec:
            spec = TireSpecification(
                id=uuid.uuid4(),
                fingerprint=fingerprint,
                width=width,
                aspect_ratio=aspect_ratio,
                rim_diameter=rim_diameter,
            )
            await self.add(spec)
        
        return spec
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence[TireSpecification]:
        """List tire specifications with pagination."""
        result = await self._session.execute(
            select(TireSpecification).offset(offset).limit(limit)
        )
        return result.scalars().all()
    
    async def add(self, spec: TireSpecification) -> None:
        """Add a new tire specification."""
        self._session.add(spec)
    
    async def remove(self, spec: TireSpecification) -> None:
        """Remove a tire specification."""
        await self._session.delete(spec)