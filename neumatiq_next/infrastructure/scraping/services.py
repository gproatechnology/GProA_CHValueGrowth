"""Scraping ingestion service with matching."""
import uuid
import logging
from datetime import datetime

from neumatiq_next.domain.matching.service import MatchingService
from neumatiq_next.infrastructure.scraping.base.models import ScrapingResult
from neumatiq_next.infrastructure.persistence.unit_of_work import SQLAlchemyUnitOfWork
from neumatiq_next.infrastructure.persistence.sqlalchemy import Product, PriceObservation
from neumatiq_next.core.metrics import MetricsService
from neumatiq_next.core.logging import get_logger

logger = get_logger(__name__)


class ScrapingIngestionService:
    """Persist scraping results to database with matching."""
    
    def __init__(self, uow_factory=None):
        self.uow_factory = uow_factory or SQLAlchemyUnitOfWork
        self.matching = MatchingService(uow_factory)
        self.stats = {
            "new_products": 0,
            "reused_products": 0,
            "observations_created": 0,
            "errors": 0,
        }
    
    async def ingest(self, result: ScrapingResult, supplier_id: uuid.UUID) -> dict:
        """Ingest a scraping result into the database."""
        try:
            # First, try to match
            fingerprint = None
            if result.normalized_brand and hasattr(result, 'normalized_brand'):
                normalized = result.normalized_brand
                # Try to extract dimensions from the scraping result
                # For now, use the fingerprint field or generate from title
                from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title
                parsed = normalize_title(result.product.title)
                fingerprint = f"{parsed['brand']}|{parsed['width']}|{parsed['aspect_ratio']}|{parsed['rim_diameter']}"
            
            logger.info(
                "scraping_ingest_start",
                fingerprint=fingerprint,
                supplier_id=str(supplier_id),
            )
            
            async with self.uow_factory() as uow:
                product = await self._get_or_create_product(uow, result, fingerprint)
                observation = await self._create_observation(uow, result, product.id, supplier_id)
                await uow.commit()
                
                return {"product_id": str(product.id), "observation_id": str(observation.id)}
        
        except Exception as e:
            logger.error("scraping_ingest_error", error=str(e))
            MetricsService.increment("scraping_errors")
            self.stats["errors"] += 1
            raise
    
    async def _get_or_create_product(self, uow, result: ScrapingResult, fingerprint: str | None = None) -> Product:
        """Get existing product or create new one."""
        # Search by fingerprint if available
        if fingerprint:
            products = await uow.products.search_by_fingerprint(fingerprint, limit=1)
            if products:
                self.stats["reused_products"] += 1
                MetricsService.increment("products_reused")
                return products[0]
        
        # Get or create brand
        brand_name = result.normalized_brand or "UNKNOWN"
        brand = await uow.brands.get_by_normalized_name(brand_name)
        if not brand:
            brand = await uow.brands.create_from_name(brand_name)
        
        # Get or create tire specification
        from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title
        parsed = normalize_title(result.product.title)
        tire_spec = await uow.tire_specifications.get_or_create(
            parsed["width"], parsed["aspect_ratio"], parsed["rim_diameter"]
        )
        
        # Create new product
        product = Product(
            id=uuid.uuid4(),
            fingerprint=fingerprint or f"SCRAPED-{uuid.uuid4().hex[:8]}",
            sku=f"SCRAPED-{uuid.uuid4().hex[:8]}",
            name=result.product.title,
            normalized_name=result.normalized_name or result.product.title.lower().replace(" ", "_"),
            brand_id=brand.id,
            tire_specification_id=tire_spec.id,
            product_type="tire",
            status="scraped",
        )
        await uow.products.add(product)
        self.stats["new_products"] += 1
        MetricsService.increment("products_created")
        return product
    
    async def _create_observation(self, uow, result: ScrapingResult, product_id: uuid.UUID, supplier_id: uuid.UUID) -> PriceObservation:
        """Create price observation."""
        supplier = await uow.suppliers.get(supplier_id)
        
        observation = PriceObservation(
            id=uuid.uuid4(),
            product_id=product_id,
            supplier_id=supplier_id,
            country_code="MX",
            currency_code=result.price.currency,
            price_total=result.price.price,
            source_url=result.product.url,
            observed_at=datetime.utcnow(),
        )
        await uow.price_observations.add(observation)
        self.stats["observations_created"] += 1
        MetricsService.increment("observations_created")
        return observation