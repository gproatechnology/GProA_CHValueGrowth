"""SQLAlchemy PriceObservation repository implementation."""
import uuid
from datetime import datetime
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from neumatiq_next.domain.repositories.price_observation_repository import IPriceObservationRepository
from neumatiq_next.infrastructure.persistence.sqlalchemy import PriceObservation


class SQLAlchemyPriceObservationRepository:
    """Price observation repository implementation using SQLAlchemy."""
    
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
    
    async def get(self, id: uuid.UUID) -> PriceObservation | None:
        """Get price observation by ID."""
        result = await self._session.execute(
            select(PriceObservation).where(PriceObservation.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_recent_by_product(
        self, 
        product_id: uuid.UUID, 
        limit: int = 10
    ) -> Sequence[PriceObservation]:
        """Get most recent observations for a product."""
        result = await self._session.execute(
            select(PriceObservation)
            .where(PriceObservation.product_id == product_id)
            .order_by(PriceObservation.observed_at.desc())
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_by_supplier(
        self, 
        supplier_id: uuid.UUID, 
        limit: int = 100
    ) -> Sequence[PriceObservation]:
        """Get observations for a supplier."""
        result = await self._session.execute(
            select(PriceObservation)
            .where(PriceObservation.supplier_id == supplier_id)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_by_product_and_supplier(
        self, 
        product_id: uuid.UUID, 
        supplier_id: uuid.UUID,
        limit: int = 10
    ) -> Sequence[PriceObservation]:
        """Get observations for product-supplier pair."""
        result = await self._session.execute(
            select(PriceObservation)
            .where(
                PriceObservation.product_id == product_id,
                PriceObservation.supplier_id == supplier_id
            )
            .limit(limit)
        )
        return result.scalars().all()
    
    async def list_by_date_range(
        self, 
        start: datetime, 
        end: datetime, 
        limit: int = 100
    ) -> Sequence[PriceObservation]:
        """List observations within date range."""
        result = await self._session.execute(
            select(PriceObservation)
            .where(
                PriceObservation.observed_at >= start,
                PriceObservation.observed_at <= end
            )
            .limit(limit)
        )
        return result.scalars().all()
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence[PriceObservation]:
        """List price observations with pagination."""
        result = await self._session.execute(
            select(PriceObservation).offset(offset).limit(limit)
        )
        return result.scalars().all()
    
    async def add(self, observation: PriceObservation) -> None:
        """Add a new price observation."""
        self._session.add(observation)
    
    async def remove(self, observation: PriceObservation) -> None:
        """Remove a price observation."""
        await self._session.delete(observation)