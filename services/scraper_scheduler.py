"""
Scheduler para scraping automático - CHValueGrowth
Ejecuta el scraper de MercadoLibre en intervalos regulares.

Uso:
- python services/scraper_scheduler.py
- Con cron: 0 6 * * * /usr/bin/python /path/to/scraper_scheduler.py
"""

import os
import sys
import logging
from datetime import datetime

# Añadir el path del proyecto
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.config import init_db, get_session
from database.models import Product
from services.scrapers.mercadolibre.scraper import MercadoLibreScraper

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Inicializar base de datos
init_db()


def run_scraper():
    """Ejecuta el scraper y guarda los productos."""
    logger.info(f"=== Iniciando scraping: {datetime.now().isoformat()} ===")
    
    scraper = MercadoLibreScraper()
    products = scraper.search("llantas", limit=50)
    
    if not products:
        logger.warning("No se encontraron productos")
        return 0
    
    # Guardar productos en la base de datos
    session = get_session()
    saved_count = 0
    
    for p in products:
        try:
            # Verificar si el producto ya existe
            existing = session.query(Product).filter(
                Product.title == p.get('title'),
                Product.price == p.get('price')
            ).first()
            
            if not existing:
                product = Product(
                    title=p.get('title'),
                    brand=p.get('brand'),
                    size=p.get('size'),
                    price=p.get('price'),
                    currency=p.get('currency', 'MXN'),
                    url=p.get('url'),
                    source='mercadolibre'
                )
                session.add(product)
                saved_count += 1
        except Exception as e:
            logger.error(f"Error guardando producto: {e}")
    
    try:
        session.commit()
        logger.info(f"Productos guardados: {saved_count}/{len(products)}")
    except Exception as e:
        logger.error(f"Error en commit: {e}")
        session.rollback()
    finally:
        session.close()
    
    logger.info(f"=== Scraping completado: {datetime.now().isoformat()} ===")
    return saved_count


def main():
    """Función principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Scheduler para MercadoLibre Scraper")
    parser.add_argument('--once', action='store_true', help='Ejecutar solo una vez')
    args = parser.parse_args()
    
    if args.once:
        #Ejecutar una seule vez
        run_scraper()
    else:
        #Modo continuo (simplificado - ejecutar cada hora)
        logger.info("Iniciando scheduler (Ctrl+C para detener)")
        import time
        
        while True:
            try:
                run_scraper()
                # Esperar 1 hora (3600 segundos)
                logger.info("Esperando siguiente ejecución (1 hora)...")
                time.sleep(3600)
            except KeyboardInterrupt:
                logger.info("Scheduler detenido")
                break
            except Exception as e:
                logger.error(f"Error en el scheduler: {e}")
                time.sleep(60)  # Reintentar en 1 minuto


if __name__ == '__main__':
    main()