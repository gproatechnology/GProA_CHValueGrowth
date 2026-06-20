"""Canonicalization service for consolidating products."""
import uuid
import logging
from collections import defaultdict

from neumatiq_next.domain.matching.service import MatchingService
from neumatiq_next.infrastructure.persistence.unit_of_work import SQLAlchemyUnitOfWork


logger = logging.getLogger(__name__)


class CanonicalizationService:
    """Service to detect and consolidate duplicate products."""
    
    def __init__(self, uow_factory=None):
        self.uow_factory = uow_factory or SQLAlchemyUnitOfWork
        self.matching = MatchingService(uow_factory)
        self.stats = {
            "total_products": 0,
            "unique_fingerprints": 0,
            "duplicated_fingerprints": 0,
            "collision_candidates": 0,
            "orphan_products": 0,
        }
    
    async def audit(self) -> dict[str, int | float]:
        """Audit current product catalog for duplicates."""
        async with self.uow_factory() as uow:
            products = await uow.products.list(limit=10000)
        
        self.stats["total_products"] = len(products)
        
        fingerprint_counts: dict[str, list[uuid.UUID]] = defaultdict(list)
        
        for product in products:
            if product.fingerprint:
                fingerprint_counts[product.fingerprint].append(product.id)
            else:
                self.stats["orphan_products"] += 1
        
        unique = 0
        duplicated = 0
        collision_candidates = 0
        
        for fingerprint, ids in fingerprint_counts.items():
            if len(ids) == 1:
                unique += 1
            elif len(ids) > 1:
                duplicated += len(ids)
                collision_candidates += 1
        
        self.stats["unique_fingerprints"] = unique
        self.stats["duplicated_fingerprints"] = duplicated
        self.stats["collision_candidates"] = collision_candidates
        
        return dict(self.stats)
    
    async def get_fingerprint_stats(self) -> dict:
        """Get fingerprint statistics."""
        await self.audit()
        
        total = self.stats["total_products"] or 1
        stats = {
            **self.stats,
            "duplication_rate": self.stats["duplicated_fingerprints"] / total,
            "collision_rate": self.stats["collision_candidates"] / total,
            "orphan_rate": self.stats["orphan_products"] / total,
        }
        
        return stats


class ConsolidationService:
    """Service to consolidate observations to canonical products."""
    
    def __init__(self, uow_factory=None):
        self.uow_factory = uow_factory or SQLAlchemyUnitOfWork
        self.matching = MatchingService(uow_factory)
        self.stats = {
            "consolidated": 0,
            "reused_products": 0,
            "average_observations_per_product": 0.0,
        }
    
    async def consolidate(self, title: str, supplier_id: uuid.UUID, price: float) -> dict:
        """Consolidate product using v2 fingerprint."""
        fp = self.matching.parse_from_title(title)
        
        if not fp:
            return {"error": "Could not parse product"}
        
        fingerprint = fp.generate()
        
        async with self.uow_factory() as uow:
            match_result = await self.matching.match(
                fp.brand, fp.width, fp.aspect_ratio, fp.rim_diameter, fp.model
            )
            
            if match_result.matched and match_result.product_id:
                # Reuse existing product
                self.stats["reused_products"] += 1
                product_id = match_result.product_id
            else:
                # Create new product
                from neumatiq_next.infrastructure.persistence.sqlalchemy import Product
                product = Product(
                    id=uuid.uuid4(),
                    fingerprint=fingerprint,
                    sku=f"SCRAPED-{uuid.uuid4().hex[:8]}",
                    name=title,
                    normalized_name=title.lower().replace(" ", "_"),
                    brand_id=uuid.uuid4(),
                    tire_specification_id=uuid.uuid4(),
                    product_type="tire",
                    status="active",
                )
                await uow.products.add(product)
                self.stats["consolidated"] += 1
                product_id = product.id
        
        return {"product_id": str(product_id), "fingerprint": fingerprint}