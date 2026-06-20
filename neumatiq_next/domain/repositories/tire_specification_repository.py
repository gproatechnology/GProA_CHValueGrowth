"""Tire Specification repository contract."""
import uuid
from typing import TYPE_CHECKING, Sequence, Protocol

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy import TireSpecification


class ITireSpecificationRepository(Protocol):
    """Tire specification repository interface."""
    
    async def get(self, id: uuid.UUID) -> "TireSpecification | None":
        """Get tire specification by ID."""
        ...
    
    async def get_or_create(
        self, width: int, aspect_ratio: int, rim_diameter: int
    ) -> "TireSpecification":
        """Get existing or create new tire specification."""
        ...
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence["TireSpecification"]:
        """List tire specifications with pagination."""
        ...
    
    async def add(self, spec: "TireSpecification") -> None:
        """Add a new tire specification."""
        ...
    
    async def remove(self, spec: "TireSpecification") -> None:
        """Remove a tire specification."""
        ...