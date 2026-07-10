"""ContiShop scraper implementation."""
from urllib.parse import urlencode

from neumatiq_next.infrastructure.scraping.base.scraper import BaseScraper
from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapedPrice, ScrapingResult
from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title, normalize_brand
from neumatiq_next.infrastructure.scraping.base.exceptions import ParseError, ProviderUnavailable


class ContiShopScraper(BaseScraper):
    """Scraper for ContiShop tire listings."""

    def __init__(self):
        super().__init__("contishop", "https://www.contishop.com.mx")
        self.search_path = "/llantas/medida/auto-camioneta"

    async def fetch(self, url: str) -> str:
        """Fetch HTML content from URL."""
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    raise ProviderUnavailable("contishop", url)
                return await response.text()

    def _parse_card(self, card) -> ScrapedProduct | None:
        """Parse a single product card."""
        title_elem = card.select_one("h2")
        if not title_elem:
            return None

        title = title_elem.get_text(strip=True)

        price = 0.0
        price_div = card.find("div", string=lambda t: t and "$" in t)
        if price_div:
            price_text = price_div.get_text(strip=True)
            price_text = price_text.split("$")[-1].split()[0].replace(",", "")
            try:
                price = float(price_text)
            except ValueError:
                pass

        brand_span = card.select_one("span[class^='brand-']")
        brand = None
        if brand_span:
            class_attr = brand_span.get("class", [])
            for cls in class_attr:
                if cls.startswith("brand-"):
                    brand = cls.replace("brand-", "").replace("-", " ").title()
                    break

        img_elem = card.select_one("img")
        image_url = None
        if img_elem:
            src = img_elem.get("src")
            if src and isinstance(src, str):
                image_url = src if src.startswith("http") else f"{self.base_url}{src}"

        url = card.get("href")
        if url and not isinstance(url, str):
            url = str(url)
        if url and url.startswith("/"):
            url = f"{self.base_url}{url}"

        size_text = ""
        for div in card.select("div"):
            text = div.get_text(strip=True)
            if "/" in text and "R" in text and len(text) < 15:
                size_text = text
                break

        return ScrapedProduct(
            title=title,
            url=url,
            image_url=image_url,
            raw_brand=brand,
            raw_size=size_text,
            price=price,
        )

    def parse(self, html: str) -> list[ScrapedProduct]:
        """Parse HTML for tire products."""
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        products = []

        cards = soup.select("a")
        for card in cards:
            if not card.select_one("h2"):
                continue

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
        """Build ContiShop search URL for tire size."""
        path = f"{self.search_path}/{width}/{aspect_ratio}R{rim_diameter}"
        return f"{self.base_url}{path}"
