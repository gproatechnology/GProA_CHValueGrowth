"""
Scraper para MercadoLibre - CHValueGrowth
Extrae datos de precios de llantas del mercado mexicano.

Modo de operación:
- MOCK_MODE=true: Usa datos de prueba (desarrollo)
- MOCK_MODE=false: Scraping real con retry, proxies, paginación
"""

import os
import re
import time
import random
import logging
from datetime import datetime
from typing import Optional, List, Dict
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import requests
from bs4 import BeautifulSoup

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuración global desde variables de entorno
MOCK_MODE = os.environ.get('MOCK_MODE', 'true').lower() in ('true', '1', 'yes')
SCRAPER_DELAY_MIN = float(os.environ.get('SCRAPER_DELAY_MIN', '2.0'))
SCRAPER_DELAY_MAX = float(os.environ.get('SCRAPER_DELAY_MAX', '5.0'))
SCRAPER_MAX_PAGES = int(os.environ.get('SCRAPER_MAX_PAGES', '3'))
SCRAPER_TIMEOUT = int(os.environ.get('SCRAPER_TIMEOUT', '30'))
# Proxy opcional: formato "http://user:pass@host:port" o "socks5://host:port"
SCRAPER_PROXY = os.environ.get('SCRAPER_PROXY', '')

# User Agents más variados
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
]

class MercadoLibreScraper:
    """Scraper mejorado con retry, proxies y paginación."""
    
    BASE_URL = "https://listado.mercadolibre.com.mx"
    DEFAULT_QUERY = "llantas"
    
    # Selectores más robustos (múltiples alternativas)
    SELECTORS = {
        'items': [
            '.ui-search-result',
            '.results-item',
            '.ui-search-layout__item',
            '.andes-card',
            'li.ui-search-layout__item',
            'div.ui-search-result__wrapper',
        ],
        'title': [
            '.ui-search-item__title',
            '.ui-search-result-item__title',
            'h2.ui-search-item__title',
            'h2',
        ],
        'price': [
            '.price-tag-fraction',
            '.price-text',
            '.ui-search-price__part',
            '.andes-money-amount__fraction',
        ],
        'link': [
            'a.ui-search-link',
            'a.ui-search-result__link',
            'a[href*="/p-"]',
        ]
    }
    
    def __init__(self, use_mock: bool = None):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': random.choice(USER_AGENTS)
        })
        # Headers adicionales
        self.session.headers.update({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
        })
        
        # Configurar proxy si está definido
        if SCRAPER_PROXY and not (use_mock if use_mock is not None else MOCK_MODE):
            self.session.proxies = {
                'http': SCRAPER_PROXY,
                'https': SCRAPER_PROXY,
            }
            logger.info(f"Proxy configurado: {SCRAPER_PROXY}")
        
        self.last_scraped = None
        self.last_mode = "MOCK" if (use_mock if use_mock is not None else MOCK_MODE) else "REAL"
    
    def _random_delay(self):
        delay = random.uniform(SCRAPER_DELAY_MIN, SCRAPER_DELAY_MAX)
        logger.debug(f"Waiting {delay:.2f}s before next request...")
        time.sleep(delay)
    
    def _extract_brand(self, title: str) -> Optional[str]:
        if not title:
            return None
        title_upper = title.upper()
        brands = [
            'Michelin', 'Bridgestone', 'Continental', 'Goodyear', 'Pirelli',
            'Dunlop', 'Toyo', 'Yokohama', 'Hankook', 'Kumho', 'Maxxis',
            'Cooper', 'Axis', 'Chengshan', 'Starper', 'Goodride', 'Armosa',
            'Falken', 'Nexen', 'Klever', 'BFGoodrich', 'Firestone'
        ]
        for brand in brands:
            if brand.upper() in title_upper:
                return brand
        return None
    
    def _extract_size(self, title: str) -> Optional[str]:
        if not title:
            return None
        # Patrón mejorado: 205/55R16, 175/65R14, 215/60R17, etc.
        pattern = r'\b(\d{3,4}/\d{2,3}[R]?\d{2,3})\b|\b(\d{3,4}[ ]?\d{2,3}[R]?\d{2,3})\b'
        match = re.search(pattern, title, re.IGNORECASE)
        if match:
            size = match.group(1) or match.group(2)
            # Normalizar: eliminar espacios, convertir R mayúscula
            size = size.replace(' ', '').upper()
            if 'R' not in size:
                # Convertir formato sin R: 2055516 -> 205/55R16
                if len(size) >= 7:
                    size = f"{size[:3]}/{size[3:5]}R{size[5:]}"
            return size
        return None
    
    def _extract_price(self, item) -> Optional[float]:
        for selector in self.SELECTORS['price']:
            price_elem = item.select_one(selector)
            if price_elem:
                try:
                    price_text = price_elem.get_text(strip=True)
                    # Limpiar: quitar símbolos, comas, espacios
                    price_text = price_text.replace('$', '').replace(',', '').replace(' ', '')
                    # Extraer primer número encontrado
                    num_match = re.search(r'\d+\.?\d*', price_text)
                    if num_match:
                        return float(num_match.group())
                except (ValueError, AttributeError):
                    continue
        return None
    
    def _extract_url(self, item) -> Optional[str]:
        for selector in self.SELECTORS['link']:
            link = item.select_one(selector)
            if link and link.get('href'):
                return link['href']
        return None
    
    def _extract_title(self, item) -> Optional[str]:
        for selector in self.SELECTORS['title']:
            title_elem = item.select_one(selector)
            if title_elem:
                title = title_elem.get_text(strip=True)
                if title and len(title) > 5:
                    return title
        return None
    
    def _create_product(self, item) -> Optional[dict]:
        try:
            title = self._extract_title(item)
            if not title:
                return None
            
            price = self._extract_price(item)
            url = self._extract_url(item)
            
            if price is None:
                return None
            
            product = {
                'source': 'mercadolibre',
                'title': title,
                'brand': self._extract_brand(title),
                'size': self._extract_size(title),
                'price': price,
                'currency': 'MXN',
                'url': url or '',
                'scraped_at': datetime.utcnow().isoformat() + 'Z'
            }
            return product
        except Exception as e:
            logger.error(f"Error creando producto: {e}")
            return None
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((requests.ConnectionError, requests.Timeout, requests.HTTPError)),
        reraise=True
    )
    def _fetch_page(self, url: str) -> requests.Response:
        """Fetch con retry exponencial."""
        self._random_delay()
        response = self.session.get(url, timeout=SCRAPER_TIMEOUT)
        response.raise_for_status()
        return response
    
    def _scrape_real(self, query: str, limit: int) -> list:
        logger.info(f"[REAL MODE] Scraping MercadoLibre: '{query}' (max {limit} productos)")
        
        all_products = []
        pages_scraped = 0
        
        for page in range(1, SCRAPER_MAX_PAGES + 1):
            if len(all_products) >= limit:
                break
            
            try:
                # Construir URL con paginación
                if page == 1:
                    url = f"{self.BASE_URL}/{query.replace(' ', '-')}"
                else:
                    # MercadoLibre usa _Desde_<offset> para paginación
                    offset = (page - 1) * 50  # 50 items por página típicamente
                    url = f"{self.BASE_URL}/{query.replace(' ', '-')}_Desde_{offset}"
                
                logger.info(f"[REAL MODE] Página {page}: {url}")
                response = self._fetch_page(url)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Buscar items con cualquier selector válido
                items = []
                for selector in self.SELECTORS['items']:
                    items = soup.select(selector)
                    if items:
                        logger.debug(f"Selector '{selector}' encontró {len(items)} items")
                        break
                
                if not items:
                    logger.warning(f"[REAL MODE] No items found en página {page}")
                    break
                
                # Extraer productos de esta página
                page_products = []
                for item in items:
                    if len(all_products) + len(page_products) >= limit:
                        break
                    product = self._create_product(item)
                    if product:
                        page_products.append(product)
                
                if not page_products:
                    logger.warning(f"[REAL MODE] No se extrajeron productos válidos en página {page}")
                    break
                
                all_products.extend(page_products)
                pages_scraped += 1
                logger.info(f"[REAL MODE] Página {page}: {len(page_products)} productos (Total: {len(all_products)})")
                
                # Si menos productos que el máximo de página, probablemente no hay más
                if len(page_products) < 20:
                    logger.info(f"[REAL MODE] Pocos productos en página {page}, asumiendo fin")
                    break
                
            except Exception as e:
                logger.error(f"[REAL MODE] Error en página {page}: {e}")
                break
        
        logger.info(f"[REAL MODE] Scraping completado: {pages_scraped} páginas, {len(all_products)} productos")
        return all_products if all_products else None
    
    def _get_mock_data(self, limit: int) -> list:
        """Datos de prueba (sin cambios)."""
        logger.info("[MOCK MODE] Generating mock data...")
        mock_products = [
            {"source": "mercadolibre", "title": "Llanta Michelin Primacy 4 205/55 R16", "brand": "Michelin", "size": "205/55R16", "price": 2450.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-1", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Bridgestone Potenza 205/55 R16", "brand": "Bridgestone", "size": "205/55R16", "price": 2199.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-2", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            # ... (resto de datos mock se mantienen)
        ]
        return mock_products[:limit]
    
    def search(self, query: str = DEFAULT_QUERY, limit: int = 20, force_real: bool = False) -> dict:
        """
        Busca productos en MercadoLibre.
        
        Returns:
            Dict con: {'products': [...], 'total': int, 'mode': 'MOCK'|'REAL', 'pages_scraped': int}
        """
        use_real = not MOCK_MODE or force_real
        mode = "REAL" if use_real else "MOCK"
        
        logger.info("=" * 60)
        logger.info(f"CHValueGrowth Scraper - Mode: {mode} - Query: '{query}'")
        logger.info("=" * 60)
        
        try:
            if use_real:
                products = self._scrape_real(query, limit)
                if products:
                    self.last_scraped = datetime.utcnow()
                    self.last_mode = "REAL"
                    return {
                        'products': products,
                        'total': len(products),
                        'mode': 'REAL',
                        'pages_scraped': len(products) // 50 + 1
                    }
                else:
                    logger.warning("Real scraping failed, falling back to mock data")
            
            # Fallback a mock
            self.last_mode = "MOCK"
            mock_products = self._get_mock_data(limit)
            return {
                'products': mock_products,
                'total': len(mock_products),
                'mode': 'MOCK',
                'pages_scraped': 0
            }
        except Exception as e:
            logger.error(f"Scraper error: {e}")
            # En caso de error, retornar mock data para no bloquear pipeline
            self.last_mode = "MOCK"
            mock_products = self._get_mock_data(limit)
            return {
                'products': mock_products,
                'total': len(mock_products),
                'mode': 'MOCK',
                'pages_scraped': 0,
                'error': str(e)
            }


def main():
    """Función principal para ejecución directa."""
    # Mostrar configuración actual
    print(f"MOCK_MODE: {MOCK_MODE}")
    print(f"SCRAPER_DELAY: {SCRAPER_DELAY_MIN}s - {SCRAPER_DELAY_MAX}s")
    print()
    
    scraper = MercadoLibreScraper()
    results = scraper.search(query="llantas 205/55 r16", limit=10)
    
    print(f"\n{'=' * 50}")
    print(f"RESULTADOS: {len(results)} productos")
    print(f"MODO: {scraper.last_mode}")
    print(f"{'=' * 50}\n")
    
    for i, product in enumerate(results, 1):
        print(f"{i}. {product['title'][:60]}...")
        print(f"   Precio: ${product['price']:,.2f} {product['currency']}")
        print(f"   Marca: {product['brand'] or 'N/A'}")
        print(f"   Tamaño: {product['size'] or 'N/A'}")
        print()
    
    return results


if __name__ == "__main__":
    main()
