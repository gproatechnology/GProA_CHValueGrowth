"""Supplier repository contract."""
import uuid
from typing import TYPE_CHECKING, Sequence, Protocol

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy import Supplier


class ISupplierRepository(Protocol):
    """Supplier repository interface."""
    
    async def get(self, id: uuid.UUID) -> "Supplier | None":
        """Get supplier by ID."""
        ...
    
    async def get_by_name(self, name: str) -> "Supplier | None":
        """Get supplier by exact name."""
        ...
    
    async def get_by_normalized_name(self, normalized_name: str) -> "Supplier | None":
        """Get supplier by normalized name."""
        ...
    
    async def get_by_country(self, country_id: uuid.UUID) -> Sequence["Supplier"]:
        """Get all suppliers for a country."""
        ...
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence["Supplier"]:
        """List suppliers with pagination."""
        ...
    
    async def add(self, supplier: "Supplier") -> None:
        """Add a new supplier."""
        ...
    
    async def remove(self, supplier: "Supplier") -> None:
        """Remove a supplier."""
        ...