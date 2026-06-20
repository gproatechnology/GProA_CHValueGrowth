"""Tire title normalization."""
import re
from typing import Optional


SIZE_PATTERN = re.compile(
    r"(?P<width>\d{3})\/"
    r"(?P<aspect_ratio>\d{2,3})\s*"
    r"[Rr](?P<rim>\d{2})"
)


def normalize_title(title: str) -> dict:
    """Extract tire information from title.
    
    Examples:
        "Michelin Primacy 4 205/55 R16"
        "Pirelli Cinturato 205/55R16"
        "Continental 205/55 r16"
    """
    size_match = SIZE_PATTERN.search(title)
    if not size_match:
        return {"brand": None, "width": None, "aspect_ratio": None, "rim_diameter": None}
    
    # Extract brand - first word that is uppercase or known brand
    words = title.split()
    brand = None
    for word in words:
        if word.upper() in ["MICHELIN", "PIRELLI", "BRIDGESTONE", "GOODYEAR", 
                            "CONTINENTAL", "FIRESTONE", "YOKOHAMA", "HANKOOK"]:
            brand = word.upper()
            break
    
    # If no known brand, use first word
    if not brand:
        brand = words[0].upper() if words else None
    
    return {
        "brand": brand,
        "width": int(size_match.group("width")),
        "aspect_ratio": int(size_match.group("aspect_ratio")),
        "rim_diameter": int(size_match.group("rim")),
    }


def normalize_brand(brand: str) -> str:
    """Normalize brand name to canonical form."""
    BRAND_ALIASES = {
        "MICHELIN": "Michelin",
        "PIRELLI": "Pirelli",
        "BRIDGESTONE": "Bridgestone",
        "GOODYEAR": "Goodyear",
        "CONTINENTAL": "Continental",
        "FIRESTONE": "Firestone",
        "YOKOHAMA": "Yokohama",
        "HANKOOK": "Hankook",
    }
    return BRAND_ALIASES.get(brand.upper(), brand.title())