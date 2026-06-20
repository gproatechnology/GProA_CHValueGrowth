"""API response schemas."""
import uuid

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response."""
    
    status: str = "healthy"


class VersionResponse(BaseModel):
    """API version response."""
    
    name: str
    version: str


class SupplierResponse(BaseModel):
    """Supplier response DTO."""
    
    id: uuid.UUID
    name: str
    country_code: str


class ProductResponse(BaseModel):
    """Product response DTO."""
    
    id: uuid.UUID
    fingerprint: str
    sku: str
    name: str
    normalized_name: str
    brand: str | None = None
    width: int | None = None
    aspect_ratio: int | None = None
    rim_diameter: int | None = None
    status: str


class ProductCreatedResponse(BaseModel):
    """Product creation response."""
    
    id: uuid.UUID
    created: bool


class ObservationResponse(BaseModel):
    """Price observation response."""
    
    id: uuid.UUID
    status: str = "created"


class PaginatedProductsResponse(BaseModel):
    """Paginated products response."""
    
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int