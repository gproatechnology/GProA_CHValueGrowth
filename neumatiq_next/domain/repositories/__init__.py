"""Repository contracts package."""
from neumatiq_next.domain.repositories.country_repository import ICountryRepository
from neumatiq_next.domain.repositories.brand_repository import IBrandRepository
from neumatiq_next.domain.repositories.supplier_repository import ISupplierRepository
from neumatiq_next.domain.repositories.product_repository import IProductRepository
from neumatiq_next.domain.repositories.price_observation_repository import IPriceObservationRepository

__all__ = [
    "ICountryRepository",
    "IBrandRepository", 
    "ISupplierRepository",
    "IProductRepository",
    "IPriceObservationRepository",
]