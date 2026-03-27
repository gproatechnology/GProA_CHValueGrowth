"""
Script de ejecución del scraper - CHValueGrowth
Ejecuta el scraper de MercadoLibre, guarda en DB y muestra los resultados.
"""

import sys
import os
import logging
import json

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.scrapers.mercadolibre.scraper import MercadoLibreScraper
from services.processor.normalizer.normalize import ProductNormalizer
from services.processor.metrics import _pipeline_metrics
from database.config import init_db
from database.repository import ProductRepository

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Ejecuta el scraper, guarda en BD y muestra los resultados."""
    import os
    
    # Mostrar configuración actual
    mock_mode = os.environ.get('MOCK_MODE', 'true').lower() in ('true', '1', 'yes')
    db_url = os.environ.get('DATABASE_URL', 'sqlite:///chvaluegrowth.db')
    
    print(f"=" * 50)
    print(f"CHValueGrowth - Configuración")
    print(f"=" * 50)
    print(f"MOCK_MODE: {mock_mode}")
    print(f"MODO ACTIVO: {'MOCK (datos de prueba)' if mock_mode else 'REAL (scraping online)'}")
    print(f"DATABASE_URL: {db_url}")
    print()
    
    # Inicializar base de datos
    print("[DB] Inicializando base de datos...")
    init_db()
    print("[DB] Base de datos lista")
    print()
    
    # Crear instancia del scraper
    scraper = MercadoLibreScraper()
    
    # Iniciar tracking de métricas
    _pipeline_metrics.start(mode="MOCK" if mock_mode else "REAL", source="mercadolibre")
    
    # Ejecutar búsqueda
    query = "llantas 205/55 r16"
    logger.info(f"Buscando: {query}")
    
    results = scraper.search(query=query, limit=10)
    _pipeline_metrics.record_scraped(len(results))
    
    # Normalizar productos antes de guardar
    print("\n" + "=" * 50)
    print("[NORMALIZER] Normalizando productos...")
    print("=" * 50 + "\n")
    
    normalizer = ProductNormalizer()
    results = normalizer.normalize_many(results)
    
    print(f"[NORMALIZER] {len(results)} productos normalizados")
    print()
    
    # Mostrar resultados
    print(f"{'=' * 50}")
    print(f"RESULTADOS: {len(results)} productos")
    print(f"MODO DE DATOS: {scraper.last_mode}")
    print(f"{'=' * 50}\n")
    
    if not results:
        print("No se encontraron productos.")
        return
    
    # Mostrar cada producto
    for i, product in enumerate(results, 1):
        print(f"{i}. {product['title'][:60]}...")
        print(f"   Precio: ${product['price']:,.2f} {product['currency']}")
        print(f"   Marca: {product['brand'] or 'N/A'}")
        print(f"   Tamaño: {product['size'] or 'N/A'}")
        print(f"   URL: {product['url'][:50]}..." if product['url'] else "   URL: N/A")
        print()
    
    # Guardar en base de datos
    print(f"\n{'=' * 50}")
    print("[DB] Guardando productos en base de datos...")
    print(f"{'=' * 50}\n")
    
    repo = ProductRepository()
    successful, failed = repo.create_many(results)
    
    # Registrar métricas
    _pipeline_metrics.record_normalized(len(results))
    _pipeline_metrics.record_saved(successful)
    _pipeline_metrics.record_duplicates(failed)
    
    print(f"[DB] Resumen de guardado:")
    print(f"   - Exitosos: {successful}")
    print(f"   - Duplicados/Fallidos: {failed}")
    print(f"   - Total en BD: {repo.count()}")
    print()
    
    # Cerrar conexión
    repo.close()
    
    # Finalizar métricas
    _pipeline_metrics.finish()
    print(f"[METRICS] Quality Score: {_pipeline_metrics.to_dict()['quality_score']}")
    print()
    
    # Guardar resultado en JSON para referencia
    output_file = "scraper_output.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    logger.info(f"Resultados guardados en {output_file}")
    
    return results


if __name__ == "__main__":
    main()
