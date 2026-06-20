"""Price observation repository contract."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Sequence, Protocol

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy import PriceObservation


class IPriceObservationRepository(Protocol):
    """Price observation repository interface."""
    
    async def get(self, id: uuid.UUID) -> "PriceObservation | None":
        """Get price observation by ID."""
        ...
    
    async def get_recent_by_product(
        self, 
        product_id: uuid.UUID, 
        limit: int = 10
    ) -> Sequence["PriceObservation"]:
        """Get most recent observations for a product."""
        ...
    
    async def get_by_supplier(
        self, 
        supplier_id: uuid.UUID, 
        limit: int = 100
    ) -> Sequence["PriceObservation"]:
        """Get observations for a supplier."""
        ...
    
    async def get_by_product_and_supplier(
        self, 
        product_id: uuid.UUID, 
        supplier_id: uuid.UUID,
        limit: int = 10
    ) -> Sequence["PriceObservation"]:
        """Get observations for product-supplier pair."""
        ...
    
    async def list_by_date_range(
        self, 
        start: datetime, 
        end: datetime, 
        limit: int = 100
    ) -> Sequence["PriceObservation"]:
        """List observations within date range."""
        ...
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence["PriceObservation"]:
        """List price observations with pagination."""
        ...
    
    async def add(self, observation: "PriceObservation") -> None:
        """Add a new price observation."""
        ...
    
    async def remove(self, observation: "PriceObservation") -> None:
        """Remove a price observation."""
        ...