"""Futuramatires scraper implementation."""
from urllib.parse import quote_plus

from bs4 import BeautifulSoup

from neumatiq_next.infrastructure.scraping.base.scraper import BaseScraper
from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapedPrice, ScrapingResult
from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title, normalize_brand
from neumatiq_next.infrastructure.scraping.base.exceptions import ParseError, ProviderUnavailable


class FuturamatiresScraper(BaseScraper):
    """Scraper for Futuramatires tire listings."""

    def __init__(self):
        super().__init__("futuramatires", "https://futuramatiresmx.com")
        self.search_path = "/search"

    async def fetch(self, url: str) -> str:
        """Fetch HTML content from URL."""
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    raise ProviderUnavailable("futuramatires", url)
                return await response.text()

    def _parse_price(self, card) -> tuple[float, float]:
        """Extract sale and regular price from product card."""
        sale_price_elem = card.select_one("span.price-item.price-item--sale.price-item--last")
        regular_price_elem = card.select_one("span.price-item.price-item--regular")
        
        sale_price = 0.0
        regular_price = 0.0
        
        if sale_price_elem:
            price_text = sale_price_elem.get_text(strip=True)
            price_text = price_text.replace("$", "").replace(",", "").replace("MXN", "").strip()
            try:
                sale_price = float(price_text)
            except ValueError:
                pass
        
        if regular_price_elem:
            price_text = regular_price_elem.get_text(strip=True)
            price_text = price_text.replace("$", "").replace(",", "").replace("MXN", "").strip()
            try:
                regular_price = float(price_text)
            except ValueError:
                pass
        
        return sale_price, regular_price

    def _parse_card(self, card) -> ScrapedProduct | None:
        """Parse a single product card."""
        title_elem = card.select_one("a.full-unstyled-link")
        if not title_elem:
            return None

        title = title_elem.get_text(strip=True)
        if not title:
            return None

        url = title_elem.get("href")
        if url and isinstance(url, str):
            url = url if url.startswith("http") else f"{self.base_url}{url.split('?')[0]}"
        else:
            url = None

        image_elem = card.select_one("img[alt]")
        image_url = None
        if image_elem:
            src = image_elem.get("src")
            alt = image_elem.get("alt", "")
            if src and isinstance(src, str):
                image_url = src if src.startswith("http") else f"{self.base_url}{src}"
            brand = alt.split()[0] if alt and alt.split() else None
        else:
            brand = None

        sale_price, regular_price = self._parse_price(card)
        price = sale_price if sale_price > 0 else regular_price

        return ScrapedProduct(
            title=title,
            url=url,
            image_url=image_url,
            raw_brand=brand,
            price=price,
        )

    def parse(self, html: str) -> list[ScrapedProduct]:
        """Parse HTML for tire products."""
        soup = BeautifulSoup(html, "html.parser")
        products = []

        cards = soup.select("li.grid__item")
        if not cards:
            cards = soup.select("div.card-wrapper.product-card-wrapper")

        for card in cards:
            product = self._parse_card(card)
            if product:
                products.append(product)

        return products

    def normalize(self, product: ScrapedProduct) -> ScrapingResult:
        """Normalize product using base normalization."""
        title_for_normalize = product.title
        if product.raw_brand and product.raw_brand.lower() not in title_for_normalize.lower():
            title_for_normalize = f"{product.raw_brand} {title_for_normalize}"

        normalized = normalize_title(title_for_normalize)
        if not normalized["brand"]:
            brand_source = product.raw_brand or ""
            normalized = normalize_title(f"{brand_source} {product.title}")

        price = ScrapedPrice(
            price=product.price or 0.0,
            currency="MXN",
            source_url=product.url,
        )

        return ScrapingResult(
            product=product,
            price=price,
            normalized_brand=normalize_brand(normalized["brand"]) if normalized["brand"] else None,
        )

    def build_search_url(self, width: int, aspect_ratio: int, rim_diameter: int) -> str:
        """Build Futuramatires search URL for tire size."""
        query = f"{width}/{aspect_ratio}R{rim_diameter}"
        return f"{self.base_url}{self.search_path}?q={quote_plus(query)}"
