"""Radial Llantas scraper implementation."""
from urllib.parse import quote_plus

from neumatiq_next.infrastructure.scraping.base.scraper import BaseScraper
from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapedPrice, ScrapingResult
from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title, normalize_brand
from neumatiq_next.infrastructure.scraping.base.exceptions import ParseError, ProviderUnavailable


class RadialLlantasScraper(BaseScraper):
    """Scraper for Radial Llantas tire listings."""

    def __init__(self):
        super().__init__("radialllantas", "https://www.radialllantas.com")
        self.search_path = "/search"

    async def fetch(self, url: str) -> str:
        """Fetch HTML content from URL."""
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    raise ProviderUnavailable("radialllantas", url)
                return await response.text()

    def _parse_card(self, card) -> ScrapedProduct | None:
        """Parse a single product card."""
        title_elem = card.select_one("p")
        if not title_elem:
            return None

        title = title_elem.get_text(strip=True)
        if not title:
            return None

        price = 0.0
        price_elem = card.select_one("small > div")
        if price_elem:
            price_text = price_elem.get_text(strip=True)
            price_text = price_text.replace("MX$", "").replace(",", "").strip()
            try:
                price = float(price_text)
            except ValueError:
                pass

        link_elem = card.select_one("a[href]")
        url = None
        if link_elem:
            href = link_elem.get("href")
            if href and isinstance(href, str):
                url = href if href.startswith("http") else f"{self.base_url}{href}"

        img_elem = card.select_one("img")
        image_url = None
        if img_elem:
            src = img_elem.get("src")
            if src and isinstance(src, str):
                image_url = src if src.startswith("http") else f"{self.base_url}{src}"

        brand = None
        if img_elem:
            alt = img_elem.get("alt", "")
            if alt and isinstance(alt, str):
                brand = alt.split()[0] if alt.split() else None

        return ScrapedProduct(
            title=title,
            url=url,
            image_url=image_url,
            raw_brand=brand,
            price=price,
        )

    def parse(self, html: str) -> list[ScrapedProduct]:
        """Parse HTML for tire products."""
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        products = []

        cards = soup.select("div.search-results-item")
        if not cards:
            cards = soup.select("a[href*='/collections/auto/products/']")

        for card in cards:
            product = self._parse_card(card)
            if product:
                products.append(product)

        return products

    def normalize(self, product: ScrapedProduct) -> ScrapingResult:
        """Normalize product using base normalization."""
        normalized = normalize_title(product.title)
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
        """Build Radial Llantas search URL for tire size."""
        query = f"{width}/{aspect_ratio}R{rim_diameter}"
        return f"{self.base_url}{self.search_path}?q={quote_plus(query)}"
