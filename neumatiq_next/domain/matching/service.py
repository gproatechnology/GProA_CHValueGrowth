"""Matching service for product deduplication (v2)."""
import uuid

from neumatiq_next.domain.matching.models import ProductFingerprint, MatchResult, MatchingCandidate
from neumatiq_next.domain.matching.normalization import extract_model, normalize_model
from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title


class MatchingService:
    """Service for product matching based on fingerprints v2."""
    
    def __init__(self, uow_factory=None):
        self.uow_factory = uow_factory
    
    def generate_fingerprint(self, brand: str, width: int, aspect_ratio: int, rim_diameter: int, model: str | None = None) -> str:
        """Generate v2 fingerprint with optional model."""
        model_clean = normalize_model(model) if model else "UNKNOWN"
        return f"{brand.upper()}|{model_clean}|{width}|{aspect_ratio}|{rim_diameter}"
    
    async def find_candidates(self, fingerprint: str) -> list[MatchingCandidate]:
        """Find existing matching candidates."""
        if not self.uow_factory:
            return []
        
        async with self.uow_factory() as uow:
            products = await uow.products.list(limit=1000)
        
        candidates = []
        for product in products:
            if hasattr(product, 'fingerprint') and product.fingerprint:
                # Check v2 fingerprint
                if product.fingerprint.upper() == fingerprint.upper():
                    candidates.append(MatchingCandidate(
                        product_id=product.id,
                        existing_fingerprint=product.fingerprint,
                    ))
        
        return candidates
    
    async def match(self, brand: str, width: int, aspect_ratio: int, rim_diameter: int, model: str | None = None) -> MatchResult:
        """Match product by fingerprint (v2)."""
        fingerprint = self.generate_fingerprint(brand, width, aspect_ratio, rim_diameter, model)
        candidates = await self.find_candidates(fingerprint)
        
        if candidates:
            return MatchResult(
                matched=True,
                product_id=candidates[0].product_id,
                fingerprint=fingerprint,
                candidate=candidates[0],
            )
        
        return MatchResult(
            matched=False,
            fingerprint=fingerprint,
        )
    
    def parse_from_title(self, title: str) -> ProductFingerprint | None:
        """Extract fingerprint from product title with model."""
        normalized = normalize_title(title)
        if not normalized["brand"] or not normalized["width"]:
            return None
        
        model = extract_model(title, normalized["brand"])
        
        return ProductFingerprint(
            brand=normalized["brand"],
            model=model,
            width=normalized["width"],
            aspect_ratio=normalized["aspect_ratio"],
            rim_diameter=normalized["rim_diameter"],
        )