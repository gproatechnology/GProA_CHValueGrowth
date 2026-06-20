"""Brand repository contract."""
import uuid
from typing import TYPE_CHECKING, Sequence, Protocol

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy import Brand


class IBrandRepository(Protocol):
    """Brand repository interface."""
    
    async def get(self, id: uuid.UUID) -> "Brand | None":
        """Get brand by ID."""
        ...
    
    async def get_by_name(self, name: str) -> "Brand | None":
        """Get brand by exact name."""
        ...
    
    async def get_by_normalized_name(self, normalized_name: str) -> "Brand | None":
        """Get brand by normalized name."""
        ...
    
    async def create_from_name(self, name: str) -> "Brand":
        """Create a brand from name if not exists."""
        ...
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence["Brand"]:
        """List brands with pagination."""
        ...
    
    async def add(self, brand: "Brand") -> None:
        """Add a new brand."""
        ...
    
    async def remove(self, brand: "Brand") -> None:
        """Remove a brand."""
        ...