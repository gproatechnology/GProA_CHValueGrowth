"""Scraped data models."""
import uuid
from typing import Optional

from pydantic import BaseModel, Field


class ScrapedProduct(BaseModel):
    """Product data extracted from source."""
    
    title: str = Field(..., description="Raw product title")
    raw_brand: Optional[str] = None
    raw_size: Optional[str] = None
    sku: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    price: float = Field(default=0.0, ge=0, description="Price from scraping")


class ScrapedPrice(BaseModel):
    """Price observation from scraping."""
    
    price: float = Field(default=0.0, ge=0, description="Price amount")
    currency: str = Field(default="USD", description="Currency code")
    available: bool = Field(default=True, description="Availability status")
    source_url: Optional[str] = None
    scraped_at: Optional[str] = None


class ScrapingResult(BaseModel):
    """Result of a scraping operation."""
    
    product: ScrapedProduct
    price: ScrapedPrice
    confidence: float = Field(default=1.0, ge=0, le=1, description="Match confidence")
    normalized_brand: Optional[str] = None
    normalized_name: Optional[str] = None
    supplier_name: Optional[str] = None