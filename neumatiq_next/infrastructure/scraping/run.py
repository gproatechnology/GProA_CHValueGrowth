"""Run scraper CLI command."""
import asyncio
import logging
from typing import Any

import yaml

from neumatiq_next.infrastructure.scraping.services import ScrapingIngestionService
from neumatiq_next.infrastructure.persistence.unit_of_work import SQLAlchemyUnitOfWork

PROVIDERS_YAML = "C:/Users/X1/OneDrive/Documentos/Python_VS Code/GProA/NeumatiQ/infrastructure/scraping/providers.yaml"

SCRAPER_MAP: dict[str, type] = {}

def _load_scraper_map() -> None:
    global SCRAPER_MAP
    if SCRAPER_MAP:
        return
    try:
        from neumatiq_next.infrastructure.scraping.providers.mercadolibre.scraper import MercadoLibreScraper
        SCRAPER_MAP["mercadolibre-mx"] = MercadoLibreScraper
    except ImportError:
        pass
    try:
        from neumatiq_next.infrastructure.scraping.providers.serna1.scraper import Serna1Scraper
        SCRAPER_MAP["serna1"] = Serna1Scraper
    except ImportError:
        pass
    try:
        from neumatiq_next.infrastructure.scraping.providers.aguilaazteca.scraper import AguilaAztecaScraper
        SCRAPER_MAP["aguilaazteca"] = AguilaAztecaScraper
    except ImportError:
        pass
    try:
        from neumatiq_next.infrastructure.scraping.providers.contishop.scraper import ContiShopScraper
        SCRAPER_MAP["contishop"] = ContiShopScraper
    except ImportError:
        pass
    try:
        from neumatiq_next.infrastructure.scraping.providers.radialllantas.scraper import RadialLlantasScraper
        SCRAPER_MAP["radialllantas"] = RadialLlantasScraper
    except ImportError:
        pass
    try:
        from neumatiq_next.infrastructure.scraping.providers.futuramatires.scraper import FuturamatiresScraper
        SCRAPER_MAP["futuramatires"] = FuturamatiresScraper
    except ImportError:
        pass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _load_providers() -> list[dict[str, Any]]:
    with open(PROVIDERS_YAML, "r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh)
    return data.get("suppliers", [])


async def _run_single(provider: dict[str, Any], width: int = 205, aspect_ratio: int = 55, rim_diameter: int = 16) -> None:
    provider_id = provider["id"]
    scraper_cls = SCRAPER_MAP.get(provider_id)
    if scraper_cls is None:
        logger.info("Skip %s: no scraper mapped", provider_id)
        return

    scraper = scraper_cls()
    ingestion = ScrapingIngestionService()

    url = scraper.build_search_url(width, aspect_ratio, rim_diameter)
    logger.info("Scraping %s -> %s", provider_id, url)

    try:
        html = await scraper.fetch(url)
    except Exception as exc:
        logger.error("Failed to fetch %s: %s", provider_id, exc)
        return

    products = scraper.parse(html)
    logger.info("Found %d products from %s", len(products), provider_id)

    supplier_name = provider.get("name", provider_id)
    async with SQLAlchemyUnitOfWork() as uow:
        supplier = await uow.suppliers.get_by_normalized_name(supplier_name.lower().replace(" ", "_"))
        supplier_id = supplier.id if supplier else None

    if not supplier_id:
        logger.error("Supplier not found in DB for %s", supplier_name)
        return

    for product in products:
        try:
            result = scraper.normalize(product)
            await ingestion.ingest(result, supplier_id)
        except Exception as exc:
            logger.error("Error ingesting product from %s: %s", provider_id, exc)

    logger.info("Stats %s: %s", provider_id, ingestion.stats)


async def run_scraper(width: int = 205, aspect_ratio: int = 55, rim_diameter: int = 16, provider_id: str | None = None) -> None:
    """Run scrapers for providers."""
    _load_scraper_map()
    providers = _load_providers()

    targets = [p for p in providers if p["id"] == provider_id] if provider_id else providers
    if not targets:
        logger.error("No providers matched: %s", provider_id)
        return

    for provider in targets:
        await _run_single(provider, width=width, aspect_ratio=aspect_ratio, rim_diameter=rim_diameter)


if __name__ == "__main__":
    asyncio.run(run_scraper())