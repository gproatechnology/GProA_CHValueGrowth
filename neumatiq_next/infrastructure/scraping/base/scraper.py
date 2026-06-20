"""Base scraper abstract class."""
import asyncio
import random
from abc import ABC, abstractmethod
from typing import Optional

from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapedPrice, ScrapingResult
from neumatiq_next.infrastructure.scraping.base.exceptions import ParseError, ScrapingError
from neumatiq_next.core.config import settings


class BaseScraper(ABC):
    """Abstract base class for tire scrapers."""
    
    def __init__(self, name: str, base_url: str):
        self.name = name
        self.base_url = base_url
        self._delay = settings.scraping_default_delay
        self._max_retries = settings.scraping_max_retries
    
    async def _random_delay(self) -> None:
        """Apply random delay to avoid rate limiting."""
        delay = self._delay + random.uniform(0, 1)
        await asyncio.sleep(delay)
    
    async def _fetch_with_retry(self, url: str) -> str:
        """Fetch with retry logic."""
        last_error: Optional[Exception] = None
        for attempt in range(self._max_retries):
            try:
                await self._random_delay()
                return await self.fetch(url)
            except Exception as e:
                last_error = e
                if attempt < self._max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
        raise last_error if last_error else ScrapingError(f"Max retries exceeded for {url}")
    
    @abstractmethod
    async def fetch(self, url: str) -> str:
        """Fetch page content."""
        ...
    
    @abstractmethod
    def parse(self, html: str) -> list[ScrapedProduct]:
        """Parse HTML for products."""
        ...
    
    def normalize(self, product: ScrapedProduct) -> ScrapingResult:
        """Normalize product to standard format."""
        from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title, normalize_brand
        
        normalized = normalize_title(product.title)
        if not normalized["brand"]:
            raise ParseError(f"Could not parse tire info from: {product.title}")
        
        price = ScrapedPrice(
            price=0.0,
            currency="USD",
            source_url=product.url,
        )
        
        return ScrapingResult(
            product=product,
            price=price,
            normalized_brand=normalize_brand(normalized["brand"]),
        )
    
    async def scrape(self, url: str) -> list[ScrapingResult]:
        """Full scraping pipeline with rate limiting."""
        html = await self._fetch_with_retry(url)
        products = self.parse(html)
        return [self.normalize(p) for p in products]