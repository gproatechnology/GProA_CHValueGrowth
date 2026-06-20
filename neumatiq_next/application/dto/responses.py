"""Response DTOs for use cases."""
import uuid
from typing import Optional

from pydantic import BaseModel, Field


class CountryResponse(BaseModel):
    """Country response DTO."""
    
    id: uuid.UUID
    code: str
    name: str
    locale: str
    active: bool


class SupplierResponse(BaseModel):
    """Supplier response DTO."""
    
    id: uuid.UUID
    name: str
    normalized_name: str
    country_id: uuid.UUID
    website: Optional[str] = None
    active: bool


class ProductResponse(BaseModel):
    """Product response DTO."""
    
    id: uuid.UUID
    fingerprint: str
    sku: str
    name: str
    normalized_name: str
    brand_id: uuid.UUID
    tire_specification_id: uuid.UUID
    product_type: str
    status: str


class PriceObservationResponse(BaseModel):
    """Price observation response DTO."""
    
    id: uuid.UUID
    product_id: uuid.UUID
    supplier_id: uuid.UUID
    country_code: str
    currency_code: str
    price_total: float
    observed_at: str
    source_url: Optional[str] = None