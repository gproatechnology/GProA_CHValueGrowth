"""Serna 1 scraper implementation."""
from urllib.parse import urlencode

from neumatiq_next.infrastructure.scraping.base.scraper import BaseScraper
from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapedPrice, ScrapingResult
from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title, normalize_brand
from neumatiq_next.infrastructure.scraping.base.exceptions import ParseError, ProviderUnavailable


class Serna1Scraper(BaseScraper):
    """Scraper for Serna 1 tire listings."""

    def __init__(self):
        super().__init__("serna1", "https://www.serna1.com")
        self.search_path = "/busquedaAvanzada"

    async def fetch(self, url: str) -> str:
        """Fetch HTML content from URL."""
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    raise ProviderUnavailable("serna1", url)
                return await response.text()

    def parse(self, html: str) -> list[ScrapedProduct]:
        """Parse HTML for tire products."""
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        products = []

        for card in soup.select("div.card.tire-card-custom"):
            title_elem = card.select_one("h5.fw-bold.text-dark.mt-1.mb-1")
            price_elem = card.select_one("div.mt-auto span.fw-bold.text-dark")
            original_price_elem = card.select_one("del.text-muted.d-block")
            link_elem = card.select_one('a[href*="/llanta-"]')
            brand_img = card.select_one('img[alt][src*="brands"]')

            if not title_elem:
                continue

            title = title_elem.get_text(strip=True)

            url = None
            if link_elem:
                href = link_elem.get("href")
                if href and isinstance(href, str):
                    url = href if href.startswith("http") else f"{self.base_url}{href}"

            brand = None
            if brand_img:
                alt = brand_img.get("alt", "")
                if alt and isinstance(alt, str) and alt.strip():
                    brand = alt.strip()

            price = 0.0
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                price_text = price_text.replace("$", "").replace(",", "").strip()
                try:
                    price = float(price_text)
                except ValueError:
                    pass

            products.append(ScrapedProduct(
                title=title,
                url=url,
                raw_brand=brand,
                price=price,
            ))

        return products

    def normalize(self, product: ScrapedProduct) -> ScrapingResult:
        """Normalize product using base normalization."""
        title_for_normalize = product.title
        if product.raw_brand and product.raw_brand.lower() not in title_for_normalize.lower():
            title_for_normalize = f"{product.raw_brand} {title_for_normalize}"

        normalized = normalize_title(title_for_normalize)
        if not normalized["brand"]:
            normalized_brand = normalize_brand(product.raw_brand) if product.raw_brand else None
        else:
            normalized_brand = normalize_brand(normalized["brand"])

        price = ScrapedPrice(
            price=product.price or 0.0,
            currency="MXN",
            source_url=product.url,
        )

        return ScrapingResult(
            product=product,
            price=price,
            normalized_brand=normalized_brand,
        )

    def build_search_url(self, width: int, aspect_ratio: int, rim_diameter: int) -> str:
        """Build Serna 1 search URL for tire size."""
        params = {
            "width": width,
            "height": aspect_ratio,
            "rim": rim_diameter,
        }
        return f"{self.base_url}{self.search_path}?{urlencode(params)}"
