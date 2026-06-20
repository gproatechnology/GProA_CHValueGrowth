"""API request schemas."""
import uuid

from pydantic import BaseModel, Field


class ProductsGetOrCreateRequest(BaseModel):
    """Request to get or create a product."""
    
    brand: str = Field(..., description="Brand name")
    width: int = Field(..., gt=0, description="Tire width")
    aspect_ratio: int = Field(..., gt=0, description="Tire aspect ratio")
    rim_diameter: int = Field(..., gt=0, description="Tire rim diameter")
    normalized_name: str = Field(..., description="Normalized product name")


class ProductsSearchRequest(BaseModel):
    """Request to search products."""
    
    brand: str | None = Field(None, description="Filter by brand name")
    width: int | None = Field(None, gt=0, description="Filter by width")
    aspect_ratio: int | None = Field(None, gt=0, description="Filter by aspect ratio")
    rim_diameter: int | None = Field(None, gt=0, description="Filter by rim diameter")
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(50, ge=1, le=100, description="Items per page")


class ObservationsRecordRequest(BaseModel):
    """Request to record a price observation."""
    
    supplier_id: uuid.UUID = Field(..., description="Supplier UUID")
    product_id: uuid.UUID = Field(..., description="Product UUID")
    currency_code: str = Field(..., description="Currency code (e.g., MXN)")
    price_total: float = Field(..., gt=0, description="Price total")
    source_url: str | None = Field(None, description="Source URL")