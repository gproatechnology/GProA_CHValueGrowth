"""
Scraper para MercadoLibre - CHValueGrowth
Extrae datos de precios de llantas del mercado mexicano.

Modo de operación:
- MOCK_MODE=true: Usa datos de prueba (desarrollo)
- MOCK_MODE=false: Intenta scraping real (producción)
"""

import os
import re
import time
import random
import logging
from datetime import datetime
from typing import Optional
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
SCRAPER_DELAY_MIN = float(os.environ.get('SCRAPER_DELAY_MIN', '1.0'))
SCRAPER_DELAY_MAX = float(os.environ.get('SCRAPER_DELAY_MAX', '3.0'))


class MercadoLibreScraper:
    """Scraper para extraer datos de productos de MercadoLibre México."""
    
    BASE_URL = "https://listado.mercadolibre.com.mx"
    DEFAULT_QUERY = "llantas"
    TIMEOUT = 30
    
    # Headers realistas para evitar bloqueos
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
    }
    
    # User Agents rotativos
    USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    ]
    
    # Patrones comunes de marcas de llantas
    BRAND_PATTERNS = [
        r'\b(Michelin|Bridgestone|Continental|Goodyear|Pirelli|Dunlop|Toyo|Yokohama)\b',
        r'\b(Hankook|Kumho|Maxxis|Cooper|Axis|Chengshan|Starper|Goodride)\b',
    ]
    
    # Patrón para tamaño de llanta (ej: 205/55R16, 175/65R14)
    SIZE_PATTERN = r'\b(\d{3}/\d{2}R\d{2}|\d{3}/\d{2}/\d{1,2}R\d{2}|\d{3}\d{2}R\d{2})\b'
    
    def __init__(self, use_mock: bool = None):
        """
        Inicializa el scraper.
        
        Args:
            use_mock: Override del modo mock. Si es None, usa variable de entorno.
        """
        self.session = requests.Session()
        
        # Usar un User-Agent aleatorio
        self.session.headers.update({
            'User-Agent': random.choice(self.USER_AGENTS)
        })
        self.session.headers.update({k: v for k, v in self.HEADERS.items() if k != 'User-Agent'})
        
        self.last_scraped = None
        self.last_mode = "MOCK" if (use_mock if use_mock is not None else MOCK_MODE) else "REAL"
    
    def _random_delay(self):
        """Delay aleatorio entre requests para evitar detección."""
        delay = random.uniform(SCRAPER_DELAY_MIN, SCRAPER_DELAY_MAX)
        logger.debug(f"Waiting {delay:.2f}s before next request...")
        time.sleep(delay)
    
    def _extract_brand(self, title: str) -> Optional[str]:
        """Intenta extraer la marca del título del producto."""
        if not title:
            return None
        
        title_upper = title.upper()
        for pattern in self.BRAND_PATTERNS:
            match = re.search(pattern, title_upper, re.IGNORECASE)
            if match:
                return match.group(1).title()
        return None
    
    def _extract_size(self, title: str) -> Optional[str]:
        """Intenta extraer el tamaño del neumático del título."""
        if not title:
            return None
        
        match = re.search(self.SIZE_PATTERN, title)
        if match:
            return match.group(1)
        return None
    
    def _extract_price(self, item) -> Optional[float]:
        """Extrae el precio del producto."""
        try:
            price_elem = item.select_one('.price-tag-fraction')
            if price_elem:
                price_text = price_elem.get_text(strip=True).replace(',', '')
                return float(price_text)
            
            price_elem = item.select_one('.price-text')
            if price_elem:
                price_text = price_elem.get_text(strip=True).replace(',', '')
                return float(price_text)
            
            return None
        except (ValueError, AttributeError) as e:
            logger.warning(f"Error extrayendo precio: {e}")
            return None
    
    def _extract_url(self, item) -> Optional[str]:
        """Extrae la URL del producto."""
        link = item.select_one('a.ui-search-link')
        if link:
            return link.get('href')
        return None
    
    def _create_product(self, item) -> Optional[dict]:
        """Crea un producto estructurado según el modelo de datos."""
        try:
            title_elem = item.select_one('.ui-search-item__title')
            if not title_elem:
                return None
            
            title = title_elem.get_text(strip=True)
            
            price = self._extract_price(item)
            url = self._extract_url(item)
            
            if not title or price is None:
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
    
    def _scrape_real(self, query: str, limit: int) -> list:
        """Intenta hacer scraping real de MercadoLibre."""
        logger.info(f"[REAL MODE] Attempting to scrape: '{query}'")
        
        # Delay inicial
        self._random_delay()
        
        try:
            url = f"{self.BASE_URL}/{query.replace(' ', '-')}"
            logger.info(f"[REAL MODE] URL: {url}")
            
            response = self.session.get(url, timeout=self.TIMEOUT)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            selectors = [
                '.ui-search-result',
                '.results-item',
                '.ui-search-layout__item',
                '.andes-card',
                'li.ui-search-layout__item',
            ]
            
            items = []
            for selector in selectors:
                items = soup.select(selector)
                if items:
                    logger.info(f"[REAL MODE] Found selector: {selector} ({len(items)} items)")
                    break
            
            if not items:
                logger.warning("[REAL MODE] No products found on page")
                return None
            
            products = []
            for item in items[:limit]:
                product = self._create_product(item)
                if product:
                    products.append(product)
            
            if not products:
                logger.warning("[REAL MODE] Could not extract any valid products")
                return None
            
            logger.info(f"[REAL MODE] Successfully extracted: {len(products)} products")
            return products
            
        except requests.RequestException as e:
            logger.error(f"[REAL MODE] Request error: {e}")
            return None
        except Exception as e:
            logger.error(f"[REAL MODE] Unexpected error: {e}")
            return None
    
    def _get_mock_data(self, limit: int) -> list:
        """Obtiene datos de prueba."""
        logger.info("[MOCK MODE] Generating mock data...")
        
        mock_products = [
            {"source": "mercadolibre", "title": "Llanta Michelin Primacy 4 205/55 R16", "brand": "Michelin", "size": "205/55R16", "price": 2450.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-1", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Bridgestone Potenza 205/55 R16", "brand": "Bridgestone", "size": "205/55R16", "price": 2199.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-2", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Continental ContiPremiumContact 205/55 R16", "brand": "Continental", "size": "205/55R16", "price": 2590.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-3", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Goodyear Assurance 205/55 R16", "brand": "Goodyear", "size": "205/55R16", "price": 1899.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-4", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Pirelli Cinturato P7 205/55 R16", "brand": "Pirelli", "size": "205/55R16", "price": 2290.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-5", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Toyo Proxes 205/55 R16", "brand": "Toyo", "size": "205/55R16", "price": 1799.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-6", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Yokohama BluEarth 205/55 R16", "brand": "Yokohama", "size": "205/55R16", "price": 1999.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-7", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Hankook Kinergy 205/55 R16", "brand": "Hankook", "size": "205/55R16", "price": 1699.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-8", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Kumho Solus 205/55 R16", "brand": "Kumho", "size": "205/55R16", "price": 1549.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-9", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Maxxis Bravo 205/55 R16", "brand": "Maxxis", "size": "205/55R16", "price": 1499.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-10", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Cooper Tire Discovery 205/55 R16", "brand": "Cooper", "size": "205/55R16", "price": 1890.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-11", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Dunlop Enasave 205/55 R16", "brand": "Dunlop", "size": "205/55R16", "price": 1690.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-12", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Michelin Defender 2 205/55 R16", "brand": "Michelin", "size": "205/55R16", "price": 2790.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-13", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Bridgestone Turanza 205/55 R16", "brand": "Bridgestone", "size": "205/55R16", "price": 2090.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-14", "scraped_at": datetime.utcnow().isoformat() + "Z"},
            {"source": "mercadolibre", "title": "Llanta Continental VikingContact 205/55 R16", "brand": "Continental", "size": "205/55R16", "price": 2340.00, "currency": "MXN", "url": "https://articulo.mercadolibre.com.mx/MLA-15", "scraped_at": datetime.utcnow().isoformat() + "Z"},
        ]
        
        return mock_products[:limit]
    
    def search(self, query: str = DEFAULT_QUERY, limit: int = 20, force_real: bool = False) -> list:
        """
        Busca productos en MercadoLibre.
        
        Args:
            query: Término de búsqueda
            limit: Número máximo de productos a devolver
            force_real: Forzar modo real aunque MOCK_MODE esté activo
            
        Returns:
            Lista de productos estructurados
        """
        # Determinar modo de operación
        use_real = not MOCK_MODE or force_real
        mode = "REAL" if use_real else "MOCK"
        
        logger.info(f"=" * 50)
        logger.info(f"CHValueGrowth Scraper - Mode: {mode}")
        logger.info(f"=" * 50)
        
        # Intentar modo real si está habilitado
        if use_real:
            results = self._scrape_real(query, limit)
            if results:
                self.last_scraped = datetime.utcnow()
                self.last_mode = "REAL"
                return results
            else:
                logger.warning("Real scraping failed, falling back to mock data")
        
        # Usar modo mock
        self.last_mode = "MOCK"
        return self._get_mock_data(limit)


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
