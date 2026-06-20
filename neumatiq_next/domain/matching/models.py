"""Matching domain models."""
import uuid

from pydantic import BaseModel


class ProductFingerprint(BaseModel):
    """Product fingerprint for matching."""
    
    brand: str
    model: str | None = None
    width: int
    aspect_ratio: int
    rim_diameter: int
    
    def generate_v1(self) -> str:
        """Generate fingerprint v1 (MVP)."""
        return f"{self.brand.upper()}|{self.width}|{self.aspect_ratio}|{self.rim_diameter}"
    
    def generate(self) -> str:
        """Generate fingerprint v2 (brand|model|width|aspect|rim)."""
        model = self.model.upper().replace(" ", "").replace("-", "") if self.model else "UNKNOWN"
        return f"{self.brand.upper()}|{model}|{self.width}|{self.aspect_ratio}|{self.rim_diameter}"
    
    @classmethod
    def from_string(cls, fingerprint: str) -> "ProductFingerprint":
        """Parse fingerprint string (v2 format)."""
        parts = fingerprint.split("|")
        if len(parts) == 4:
            # v1 format
            return cls(
                brand=parts[0],
                model=None,
                width=int(parts[1]),
                aspect_ratio=int(parts[2]),
                rim_diameter=int(parts[3]),
            )
        if len(parts) == 5:
            # v2 format
            return cls(
                brand=parts[0],
                model=parts[1],
                width=int(parts[2]),
                aspect_ratio=int(parts[3]),
                rim_diameter=int(parts[4]),
            )
        raise ValueError(f"Invalid fingerprint format: {fingerprint}")


class MatchingCandidate(BaseModel):
    """Candidate for matching."""
    
    product_id: uuid.UUID
    existing_fingerprint: str
    confidence: float = 1.0


class MatchResult(BaseModel):
    """Result of a matching operation."""
    
    matched: bool
    product_id: uuid.UUID | None = None
    fingerprint: str
    confidence: float = 1.0
    candidate: MatchingCandidate | None = None