"""Country repository contract."""
import uuid
from typing import TYPE_CHECKING, Sequence, Protocol

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy import Country


class ICountryRepository(Protocol):
    """Country repository interface."""
    
    async def get(self, id: uuid.UUID) -> "Country | None":
        """Get country by ID."""
        ...
    
    async def get_by_code(self, code: str) -> "Country | None":
        """Get country by ISO code."""
        ...
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence["Country"]:
        """List countries with pagination."""
        ...
    
    async def list_active(self) -> Sequence["Country"]:
        """List all active countries."""
        ...
    
    async def add(self, country: "Country") -> None:
        """Add a new country."""
        ...
    
    async def remove(self, country: "Country") -> None:
        """Remove a country."""
        ...