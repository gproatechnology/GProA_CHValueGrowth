"""MercadoLibre parser for product data extraction."""
from bs4 import BeautifulSoup

from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct, ScrapedPrice


def parse_products(html: str) -> list[ScrapedProduct]:
    """Parse HTML for product listings."""
    soup = BeautifulSoup(html, 'html.parser')
    products = []
    
    for item in soup.select('li.ui-search-layout__item'):
        title_elem = item.select_one('h3.ui-search-item__title')
        price_elem = item.select_one('span.andes-money-amount')
        link_elem = item.select_one('a.ui-search-item__group__element')
        image_elem = item.select_one('img')
        
        if not title_elem:
            continue
        
        url_val = link_elem.get('href') if link_elem else None
        if url_val is not None and not isinstance(url_val, str):
            url_val = str(url_val)
        
        image_val = None
        if image_elem:
            src = image_elem.get('src')
            data_src = image_elem.get('data-src')
            if src and isinstance(src, str):
                image_val = src
            elif data_src and isinstance(data_src, str):
                image_val = data_src
        
        products.append(ScrapedProduct(
            title=title_elem.get_text(strip=True),
            url=url_val,
            image_url=image_val,
        ))
    
    return products


def extract_price(product_elem) -> ScrapedPrice:
    """Extract price from product element."""
    price_text = product_elem.select_one('span.andes-money-amount')
    if price_text:
        price = float(price_text.get_text(strip=True).replace('$', '').replace(',', ''))
    else:
        price = 0.0
    
    return ScrapedPrice(
        price=price,
        currency="MXN",
    )