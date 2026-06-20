"""Run scraper CLI command."""
import asyncio
import uuid
import logging
import os

from neumatiq_next.infrastructure.scraping.providers.mercadolibre.scraper import MercadoLibreScraper
from neumatiq_next.infrastructure.scraping.services import ScrapingIngestionService
from neumatiq_next.infrastructure.persistence.unit_of_work import SQLAlchemyUnitOfWork

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def run_scraper(width: int = 205, aspect_ratio: int = 55, rim_diameter: int = 16):
    """Run MercadoLibre scraper and persist results."""
    scraper = MercadoLibreScraper()
    ingestion = ScrapingIngestionService()
    
    # Build URL
    url = scraper.build_search_url(width, aspect_ratio, rim_diameter)
    logger.info(f"Scraping URL: {url}")
    
    # Scrape (using fixture for testing)
    # In production, this would call the real API
    fixture_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'tests', 'unit', 'scraping', 'fixtures', 'mercadolibre_search.html')
    
    try:
        with open(fixture_path, 'r') as f:
            html = f.read()
    except FileNotFoundError:
        logger.info("Fixture not found, skipping real scrape")
        return
    
    products = scraper.parse(html)
    logger.info(f"Found {len(products)} products")
    
    # Get real supplier ID from database
    async with SQLAlchemyUnitOfWork() as uow:
        supplier = await uow.suppliers.get_by_normalized_name("mercadolibre_mx")
        supplier_id = supplier.id if supplier else None
    
    if not supplier_id:
        logger.error("MercadoLibre supplier not found in database")
        return
    
    # Ingest each product
    for product in products:
        try:
            result = scraper.normalize(product)
            await ingestion.ingest(result, supplier_id)
        except Exception as e:
            logger.error(f"Error ingesting product: {e}")
    
    logger.info(f"Stats: {ingestion.stats}")


if __name__ == "__main__":
    asyncio.run(run_scraper())