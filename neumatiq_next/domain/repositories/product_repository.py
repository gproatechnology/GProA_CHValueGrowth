"""Product repository contract."""
import uuid
from typing import TYPE_CHECKING, Sequence, Protocol

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy import Product


class IProductRepository(Protocol):
    """Product repository interface."""
    
    async def get(self, id: uuid.UUID) -> "Product | None":
        """Get product by ID."""
        ...
    
    async def get_by_fingerprint(self, fingerprint: str) -> "Product | None":
        """Get product by fingerprint (canonical key)."""
        ...
    
    async def search_by_fingerprint(self, fingerprint: str, limit: int = 1) -> Sequence["Product"]:
        """Search products by fingerprint pattern."""
        ...
    
    async def get_by_sku(self, sku: str) -> "Product | None":
        """Get product by SKU."""
        ...
    
    async def search_by_name(self, name: str, limit: int = 50) -> Sequence["Product"]:
        """Search products by name pattern."""
        ...
    
    async def list_by_brand(self, brand_id: uuid.UUID, limit: int = 100) -> Sequence["Product"]:
        """List products for a brand."""
        ...
    
    async def list(self, limit: int = 100, offset: int = 0) -> Sequence["Product"]:
        """List products with pagination."""
        ...
    
    async def add(self, product: "Product") -> None:
        """Add a new product."""
        ...
    
    async def remove(self, product: "Product") -> None:
        """Remove a product."""
        ...