"""Scraping framework package."""
from neumatiq_next.infrastructure.scraping.base.scraper import BaseScraper
from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapedPrice, ScrapingResult
from neumatiq_next.infrastructure.scraping.base.exceptions import ScrapingError, ProviderUnavailable, ParseError

__all__ = [
    "BaseScraper",
    "ScrapedProduct",
    "ScrapedPrice",
    "ScrapingResult",
    "ScrapingError",
    "ProviderUnavailable",
    "ParseError",
]