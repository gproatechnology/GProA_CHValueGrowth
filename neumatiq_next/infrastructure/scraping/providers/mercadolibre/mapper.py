"""MercadoLibre mapper - converts ScrapedProduct to canonical format."""
from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapingResult, ScrapedPrice
from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title, normalize_brand


def map_to_scraping_result(product: ScrapedProduct) -> ScrapingResult:
    """Map scraped product to ScrapingResult."""
    normalized = normalize_title(product.title)
    
    return ScrapingResult(
        product=product,
        price=ScrapedPrice(
            price=product.price if product.price else 0.0,
            currency="MXN",
            source_url=product.url,
        ),
        normalized_brand=normalize_brand(normalized["brand"]) if normalized["brand"] else None,
        normalized_name=product.title.lower().replace(" ", "_") if product.title else None,
    )