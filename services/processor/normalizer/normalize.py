"""
Normalizador de productos - CHValueGrowth
Procesa y limpia datos de productos antes de guardarlos.
"""

import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class ProductNormalizer:
    """Normaliza datos de productos de scrape."""
    
    # Mapeo de marcas (para consistencia)
    BRAND_MAP = {
        'michelin': 'Michelin',
        'bridgestone': 'Bridgestone',
        'continental': 'Continental',
        'goodyear': 'Goodyear',
        'pirelli': 'Pirelli',
        'dunlop': 'Dunlop',
        'toyo': 'Toyo',
        'yokohama': 'Yokohama',
        'hankook': 'Hankook',
        'kumho': 'Kumho',
        'maxxis': 'Maxxis',
        'cooper': 'Cooper',
        'axis': 'Axis',
        'chengshan': 'Chengshan',
        'starper': 'Starper',
        'goodride': 'Goodride',
    }
    
    # Patrones para limpiar títulos
    CLEANUP_PATTERNS = [
        r'\s+',  # Múltiples espacios
        r'[^\w\s\-()/]+',  # Caracteres especiales (excepto los necesarios)
    ]
    
    def normalize(self, product: dict) -> dict:
        """
        Normaliza un producto.
        
        Args:
            product: Diccionario con datos del producto
            
        Returns:
            Producto normalizado
        """
        try:
            normalized = {
                'source': product.get('source', 'mercadolibre'),
                'title': self._clean_title(product.get('title', '')),
                'brand': self._normalize_brand(product.get('brand')),
                'size': self._normalize_size(product.get('size')),
                'price': self._normalize_price(product.get('price')),
                'currency': product.get('currency', 'MXN'),
                'url': product.get('url', ''),
                'scraped_at': product.get('scraped_at'),
            }
            
            return normalized
            
        except Exception as e:
            logger.error(f"Error normalizando producto: {e}")
            return product
    
    def normalize_many(self, products: list) -> list:
        """Normaliza una lista de productos."""
        return [self.normalize(p) for p in products]
    
    def _clean_title(self, title: str) -> str:
        """Limpia el título del producto."""
        if not title:
            return ""
        
        # Strip de espacios
        title = title.strip()
        
        # Eliminar caracteres especiales problemáticos
        title = re.sub(r'[^\w\s\-()./áéíóúñÁÉÍÓÚÑ]', '', title, flags=re.IGNORECASE)
        
        # Normalizar espacios
        title = re.sub(r'\s+', ' ', title)
        
        return title.strip()
    
    def _normalize_brand(self, brand: Optional[str]) -> Optional[str]:
        """Normaliza el nombre de la marca."""
        if not brand:
            return None
        
        brand_lower = brand.lower().strip()
        
        # Buscar en el mapeo
        return self.BRAND_MAP.get(brand_lower, brand.title())
    
    def _normalize_size(self, size: Optional[str]) -> Optional[str]:
        """Normaliza el tamaño del neumático."""
        if not size:
            return None
        
        size = size.strip().upper()
        
        # Normalizar formato (205/55R16)
        # Asegurar que tenga el formato correcto
        match = re.match(r'^(\d{3})/(\d{2})R(\d{2})$', size)
        if match:
            return f"{match.group(1)}/{match.group(2)}R{match.group(3)}"
        
        # Si ya tiene el formato, devolverlo
        if re.match(r'^\d{3}/\d{2}R\d{2}$', size):
            return size
        
        return None
    
    def _normalize_price(self, price) -> float:
        """Normaliza el precio."""
        if price is None:
            return 0.0
        
        try:
            if isinstance(price, str):
                # Eliminar comas y símbolos de moneda
                price = re.sub(r'[^\d.]', '', price)
            
            return float(price)
        except (ValueError, TypeError):
            logger.warning(f"Precio inválido: {price}")
            return 0.0


def main():
    """Demo del normalizador."""
    normalizer = ProductNormalizer()
    
    # Producto de ejemplo (antes de normalizar)
    raw_product = {
        'source': 'mercadolibre',
        'title': '  Llanta!!! Michelin Primacy 4 205/55 R16 $2,450.00  ',
        'brand': 'michelin',
        'size': '205/55r16',
        'price': '2,450.00',
        'currency': 'MXN',
        'url': 'https://articulo.mercadolibre.com.mx/MLA-1',
        'scraped_at': '2026-03-27T10:00:00Z'
    }
    
    print("=" * 50)
    print("ANTES (datos crudos):")
    print("=" * 50)
    for k, v in raw_product.items():
        print(f"  {k}: {v}")
    
    print("\n" + "=" * 50)
    print("DESPUÉS (datos normalizados):")
    print("=" * 50)
    
    normalized = normalizer.normalize(raw_product)
    for k, v in normalized.items():
        print(f"  {k}: {v}")
    
    print("\n" + "=" * 50)
    print("Normalización de lista:")
    print("=" * 50)
    
    products = [
        {'title': 'Llanta BRIDGESTONE 205/55R16', 'brand': 'bridgestone', 'price': 2200, 'scraped_at': '2026-03-27T10:00:00Z'},
        {'title': 'Llanta goodyear 175/65 R14', 'brand': 'goodyear', 'price': 1500, 'scraped_at': '2026-03-27T10:00:00Z'},
        {'title': 'Llanta INVALID@#$ 205/55R16', 'brand': None, 'price': '1,900', 'scraped_at': '2026-03-27T10:00:00Z'},
    ]
    
    for i, p in enumerate(products, 1):
        print(f"\nProducto {i}:")
        result = normalizer.normalize(p)
        print(f"  title: {result['title']}")
        print(f"  brand: {result['brand']}")
        print(f"  price: {result['price']}")


if __name__ == "__main__":
    main()
