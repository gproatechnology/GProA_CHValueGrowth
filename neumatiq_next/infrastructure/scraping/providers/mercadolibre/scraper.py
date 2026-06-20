"""MercadoLibre scraper implementation."""
from urllib.parse import quote_plus

from neumatiq_next.infrastructure.scraping.base.scraper import BaseScraper
from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapedPrice, ScrapingResult
from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title, normalize_brand
from neumatiq_next.infrastructure.scraping.base.exceptions import ParseError


class MercadoLibreScraper(BaseScraper):
    """Scraper for MercadoLibre Mexico tire listings."""
    
    def __init__(self):
        super().__init__("mercadolibre", "https://www.mercadolibre.com.mx")
        self.search_path = "/search"
    
    async def fetch(self, url: str) -> str:
        """Fetch HTML content from URL."""
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    from neumatiq_next.infrastructure.scraping.base.exceptions import ProviderUnavailable
                    raise ProviderUnavailable("mercadolibre", url)
                return await response.text()
    
    def parse(self, html: str) -> list[ScrapedProduct]:
        """Parse HTML for tire products."""
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, 'html.parser')
        products = []
        
        for item in soup.select('li.ui-search-layout__item'):
            title_elem = item.select_one('h3.ui-search-item__title')
            price_elem = item.select_one('span.andes-money-amount')
            link_elem = item.select_one('a.ui-search-item__group__element')
            
            if not title_elem:
                continue
            
            url_val = link_elem.get('href') if link_elem else None
            if url_val is not None and not isinstance(url_val, str):
                url_val = str(url_val)
            
            price_val = 0.0
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                price_text = price_text.replace('$', '').replace(',', '')
                try:
                    price_val = float(price_text)
                except ValueError:
                    pass
            
            products.append(ScrapedProduct(
                title=title_elem.get_text(strip=True),
                url=url_val,
                raw_size=title_elem.get_text(strip=True),
                price=price_val,
            ))
        
        return products
    
    def normalize(self, product: ScrapedProduct) -> ScrapingResult:
        """Normalize product using base normalization."""
        from neumatiq_next.infrastructure.scraping.base.models import ScrapingResult
        result = super().normalize(product)
        result.supplier_name = 'MercadoLibre MX'
        if hasattr(product, 'price') and product.price:
            result.price = ScrapedPrice(
                price=product.price or 0.0,
                currency="MXN",
                source_url=product.url,
            )
        return result

    def build_search_url(self, width: int, aspect_ratio: int, rim_diameter: int) -> str:
        """Build MercadoLibre search URL for tire size."""
        size = f"{width}/{aspect_ratio} R{rim_diameter}"
        query = quote_plus(f"neumáticos {size}")
        return f"{self.base_url}{self.search_path}?q={query}"