"""Aguila Azteca scraper implementation."""
import json

from bs4 import BeautifulSoup

from neumatiq_next.infrastructure.scraping.base.scraper import BaseScraper
from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapedPrice, ScrapingResult
from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title, normalize_brand
from neumatiq_next.infrastructure.scraping.base.exceptions import ParseError, ProviderUnavailable


class AguilaAztecaScraper(BaseScraper):
    """Scraper for Aguila Azteca tire listings."""

    def __init__(self):
        super().__init__("aguilaazteca", "https://www.aguilaazteca.com")
        self.search_path = "/tienda/resultados"

    async def fetch(self, url: str) -> str:
        """Fetch HTML content from URL."""
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    raise ProviderUnavailable("aguilaazteca", url)
                return await response.text()

    def _parse_wire_snapshot(self, card) -> ScrapedProduct | None:
        """Parse product data from Livewire wire:snapshot JSON."""
        snapshot = card.get("wire:snapshot", "")
        if not snapshot:
            return None

        try:
            data = json.loads(snapshot)
            product_list = data.get("data", {}).get("product", [])
            if not product_list or not isinstance(product_list, list):
                return None

            product = product_list[0]
            if not isinstance(product, dict):
                return None

            description = product.get("description", "")
            make = product.get("make", "")
            price = product.get("price", 0)
            slug = product.get("slug", "")

            if not description:
                return None

            url = None
            if slug:
                url = f"{self.base_url}/producto/{slug}"

            return ScrapedProduct(
                title=description,
                url=url,
                raw_size=description,
                price=float(price) if price else 0.0,
            )
        except (json.JSONDecodeError, KeyError, IndexError, TypeError):
            return None

    def _parse_fallback(self, card) -> ScrapedProduct | None:
        """Fallback parser using CSS selectors."""
        brand_elem = card.select_one("p.text-\\[12px\\].text-\\[var\\(--color-gray-2\\)\\].uppercase")
        title_elem = card.select_one("a.text-lg.font-bold.text-blue-900.font-\\[paralucent\\]")
        price_elem = card.select_one(
            "div.w-full.col-span-3.lg\\:col-span-1 > div > p.text-lg"
        )

        if not title_elem:
            return None

        title = title_elem.get_text(strip=True)
        url = title_elem.get("href")
        if url and not isinstance(url, str):
            url = str(url)

        price = 0.0
        if price_elem:
            price_text = price_elem.get_text(strip=True)
            price_text = price_text.replace("$", "").replace(",", "").strip()
            try:
                price = float(price_text)
            except ValueError:
                pass

        return ScrapedProduct(
            title=title,
            url=url,
            raw_size=title,
            price=price,
        )

    def parse(self, html: str) -> list[ScrapedProduct]:
        """Parse HTML for tire products."""
        soup = BeautifulSoup(html, "html.parser")
        products = []

        cards = soup.find_all("div", attrs={"wire:snapshot": True})
        for card in cards:
            snapshot = card.get("wire:snapshot", "")
            if "store.listing-product-card" not in snapshot:
                continue

            product = self._parse_wire_snapshot(card)
            if product is None:
                product = self._parse_fallback(card)

            if product:
                products.append(product)

        return products

    def normalize(self, product: ScrapedProduct) -> ScrapingResult:
        """Normalize product using base normalization."""
        normalized = normalize_title(product.title)
        if not normalized["brand"]:
            raise ParseError(f"Could not parse tire info from: {product.title}")

        price = ScrapedPrice(
            price=product.price or 0.0,
            currency="MXN",
            source_url=product.url,
        )

        return ScrapingResult(
            product=product,
            price=price,
            normalized_brand=normalize_brand(normalized["brand"]),
        )

    def build_search_url(self, width: int, aspect_ratio: int, rim_diameter: int) -> str:
        """Build Aguila Azteca search URL for tire size."""
        return (
            f"{self.base_url}{self.search_path}"
            f"?ancho={width}&serie={aspect_ratio}&diametro=R{rim_diameter}&per_page=50"
        )
