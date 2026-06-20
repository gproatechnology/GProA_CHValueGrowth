"""Advanced fingerprint normalization."""
import re

MODEL_CLEANUP_PATTERN = re.compile(r'[\s\-_.]+')


def extract_model(title: str, brand: str) -> str | None:
    """Extract model name from tire title.
    
    Examples:
        "Michelin Primacy 4 205/55 R16" → "PRIMACY4"
        "Michelin Pilot Sport 4 205/55 R16" → "PILOTSPORT4"
    """
    if not title or not brand:
        return None
    
    # Remove brand and size portions
    text = title.upper()
    brand_patterns = [
        brand.upper(),
        brand.upper() + " ",
    ]
    
    for bp in brand_patterns:
        text = text.replace(bp, "", 1)
    
    # Remove size patterns (e.g., "205/55 R16", "205-55R16")
    size_pattern = re.compile(r'\d{3}[\/\\-]\d{2,3}\s*[Rr]\d{2}')
    text = size_pattern.sub("", text)
    
    # Clean up remaining text
    model = MODEL_CLEANUP_PATTERN.sub("", text).strip()
    
    return model if model else None


def normalize_model(model: str) -> str:
    """Normalize model name.
    
    Examples:
        "Primacy 4" → "PRIMACY4"
        "Primacy-4" → "PRIMACY4"
    """
    return MODEL_CLEANUP_PATTERN.sub("", model.upper())