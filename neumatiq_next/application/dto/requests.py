"""Request DTOs for use cases."""
import uuid
from typing import Optional

from pydantic import BaseModel, Field


class SeedCountriesRequest(BaseModel):
    """Request to seed initial countries."""
    
    countries: list[dict[str, str | bool]] = Field(
        default_factory=list,
        description="List of country data with code, name, locale"
    )


class SearchProductsRequest(BaseModel):
    """Request to search products with filters."""
    
    brand: Optional[str] = None
    width: Optional[int] = None
    aspect_ratio: Optional[int] = None
    rim_diameter: Optional[int] = None
    limit: int = Field(default=50, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class RecordPriceObservationRequest(BaseModel):
    """Request to record a price observation."""
    
    supplier_id: uuid.UUID
    product_id: uuid.UUID
    price_total: float = Field(gt=0)
    currency_code: str
    source_url: Optional[str] = None
    observed_at: Optional[str] = None


class GetOrCreateProductRequest(BaseModel):
    """Request to get or create a product."""
    
    brand_name: str
    tire_width: int = Field(gt=0)
    tire_aspect_ratio: int = Field(gt=0)
    tire_rim_diameter: int = Field(gt=0)
    normalized_name: str
    sku: Optional[str] = None