"""API schemas package."""
from neumatiq_next.interfaces.schemas.requests import (
    ProductsGetOrCreateRequest,
    ProductsSearchRequest,
    ObservationsRecordRequest,
)
from neumatiq_next.interfaces.schemas.responses import (
    HealthResponse,
    VersionResponse,
    SupplierResponse,
    ProductResponse,
    ProductCreatedResponse,
    ObservationResponse,
    PaginatedProductsResponse,
)

__all__ = [
    "HealthResponse",
    "VersionResponse",
    "SupplierResponse",
    "ProductResponse",
    "ProductCreatedResponse",
    "ObservationResponse",
    "PaginatedProductsResponse",
    "ProductsGetOrCreateRequest",
    "ProductsSearchRequest",
    "ObservationsRecordRequest",
]