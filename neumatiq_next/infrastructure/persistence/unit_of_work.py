"""SQLAlchemy Unit of Work implementation."""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from neumatiq_next.application.unit_of_work import IUnitOfWork
from neumatiq_next.core.database import async_session_maker
from neumatiq_next.infrastructure.persistence.repositories import (
    SQLAlchemyCountryRepository,
    SQLAlchemyBrandRepository,
    SQLAlchemySupplierRepository,
    SQLAlchemyProductRepository,
    SQLAlchemyPriceObservationRepository,
    SQLAlchemyTireSpecificationRepository,
)


class SQLAlchemyUnitOfWork(IUnitOfWork):
    """Unit of Work implementation using SQLAlchemy async session."""
    
    _session: Optional[AsyncSession]
    
    def __init__(self) -> None:
        self._session = None
    
    async def __aenter__(self) -> "SQLAlchemyUnitOfWork":
        self._session = async_session_maker()
        await self._session.__aenter__()
        
        self.countries = SQLAlchemyCountryRepository(self._session)
        self.brands = SQLAlchemyBrandRepository(self._session)
        self.suppliers = SQLAlchemySupplierRepository(self._session)
        self.products = SQLAlchemyProductRepository(self._session)
        self.price_observations = SQLAlchemyPriceObservationRepository(self._session)
        self.tire_specifications = SQLAlchemyTireSpecificationRepository(self._session)
        
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        if self._session is not None:
            if exc_type is not None:
                await self.rollback()
            else:
                await self.commit()
            await self._session.__aexit__(exc_type, exc_val, exc_tb)
    
    async def commit(self) -> None:
        """Commit all changes."""
        if self._session is not None:
            await self._session.commit()
    
    async def rollback(self) -> None:
        """Rollback all changes."""
        if self._session is not None:
            await self._session.rollback()