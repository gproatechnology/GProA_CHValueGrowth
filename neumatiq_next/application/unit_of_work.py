"""Unit of Work interface."""
from typing import Any


class IUnitOfWork:
    """Unit of Work interface for transaction management."""
    
    countries: Any
    brands: Any
    suppliers: Any
    products: Any
    price_observations: Any
    tire_specifications: Any
    
    async def __aenter__(self) -> "IUnitOfWork":
        """Enter unit of work context."""
        raise NotImplementedError
    
    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        """Exit unit of work context."""
        ...
    
    async def commit(self) -> None:
        """Commit all changes."""
        ...
    
    async def rollback(self) -> None:
        """Rollback all changes."""
        ...