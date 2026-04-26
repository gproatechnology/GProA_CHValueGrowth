#!/usr/bin/env python3
"""
Script de ejecución del scraper - NeumatiQ
Sistema de Gestión Integral para el Comercio de Neumáticos
Desarrollado por GProA Technology - Comercializado por CH ValueGrowth

Uso:
    python scripts/run_scraper.py [--query "llantas 205/55 r16"] [--limit 10] [--mock] [--real]
    
Ejemplos:
    python scripts/run_scraper.py
    python scripts/run_scraper.py --query "neumaticos 195/65 r15" --limit 20
    python scripts/run_scraper.py --real --query "baterias auto" --limit 5
"""

import sys
import os
import logging
import json
import argparse
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Asegurar que existan directorios necesarios
Path('logs').mkdir(exist_ok=True)
Path('data').mkdir(exist_ok=True)

from services.scrapers.mercadolibre.scraper import MercadoLibreScraper
from services.processor.normalizer.normalize import ProductNormalizer
from services.processor.metrics import _pipeline_metrics
from database.config import init_db
from database.repository import ProductRepository

# Configuración de logging mejorada
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('logs/scraper.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)


def parse_arguments() -> argparse.Namespace:
    """Parsear argumentos de línea de comandos."""
    parser = argparse.ArgumentParser(
        description='Ejecuta el scraper de MercadoLibre para CHValueGrowth',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  %(prog)s
  %(prog)s --query "neumaticos 195/65 r15" --limit 20
  %(prog)s --real --query "baterias auto" --limit 5
  %(prog)s --output resultados.json
  %(prog)s --no-save --verbose
        """
    )
    
    parser.add_argument(
        '--query', '-q',
        type=str,
        default='llantas 205/55 r16',
        help='Término de búsqueda (default: "llantas 205/55 r16")'
    )
    
    parser.add_argument(
        '--limit', '-l',
        type=int,
        default=10,
        help='Número máximo de productos a extraer (default: 10)'
    )
    
    parser.add_argument(
        '--mock', '-m',
        action='store_true',
        help='Forzar modo MOCK (datos de prueba)'
    )
    
    parser.add_argument(
        '--real', '-r',
        action='store_true',
        help='Forzar modo REAL (scraping online)'
    )
    
    parser.add_argument(
        '--output', '-o',
        type=str,
        default='data/scraper_output.json',
        help='Archivo de salida JSON (default: data/scraper_output.json)'
    )
    
    parser.add_argument(
        '--no-save',
        action='store_true',
        help='No guardar en base de datos'
    )
    
    parser.add_argument(
        '--no-json',
        action='store_true',
        help='No guardar archivo JSON'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Mostrar información detallada'
    )
    
    parser.add_argument(
        '--category', '-c',
        type=str,
        default='llantas',
        help='Categoría del producto (default: llantas)'
    )
    
    return parser.parse_args()


def get_mode_from_args(args: argparse.Namespace) -> tuple[bool, str]:
    """Determinar el modo de ejecución basado en argumentos y variables de entorno."""
    # Prioridad: argumentos > variables de entorno > default
    if args.real:
        mock_mode = False
        mode_source = "argumento --real"
    elif args.mock:
        mock_mode = True
        mode_source = "argumento --mock"
    else:
        env_mock = os.environ.get('MOCK_MODE', 'true').lower()
        mock_mode = env_mock in ('true', '1', 'yes')
        mode_source = f"variable MOCK_MODE={env_mock}"
    
    mode_str = "MOCK (datos de prueba)" if mock_mode else "REAL (scraping online)"
    return mock_mode, f"{mode_str} [{mode_source}]"


def display_configuration(mock_mode: bool, mode_info: str, db_url: str, args: argparse.Namespace) -> None:
    """Mostrar configuración actual."""
    print()
    print("=" * 60)
    print("CHValueGrowth - Scraper de MercadoLibre")
    print("=" * 60)
    print(f"📋 Búsqueda:     {args.query}")
    print(f"🔢 Límite:       {args.limit} productos")
    print(f"📂 Categoría:    {args.category}")
    print(f"🎭 Modo:         {mode_info}")
    print(f"💾 Guardar DB:   {'No' if args.no_save else 'Sí'}")
    print(f"📄 Guardar JSON: {'No' if args.no_json else f'Sí → {args.output}'}")
    print(f"🗄️  Database:     {db_url}")
    print(f"📝 Verbose:      {'Sí' if args.verbose else 'No'}")
    print("=" * 60)
    print()


def setup_output_directory() -> Path:
    """Crear directorio de salida si no existe."""
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)
    return output_dir


def save_results_to_json(results: List[Dict[str, Any]], output_file: str) -> None:
    """Guardar resultados en archivo JSON con metadatos."""
    output_dir = setup_output_directory()
    filepath = output_dir / output_file
    
    # Agregar metadatos
    output_data = {
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "total_products": len(results),
            "version": "1.0.0"
        },
        "products": results
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    logger.info(f"📄 Resultados guardados en {filepath}")
    return filepath


def display_results(results: List[Dict[str, Any]], verbose: bool = False) -> None:
    """Mostrar resultados de forma formateada."""
    if not results:
        print("\n⚠️  No se encontraron productos.")
        return
    
    print(f"\n{'=' * 60}")
    print(f"📊 RESULTADOS: {len(results)} productos encontrados")
    print(f"{'=' * 60}\n")
    
    # Estadísticas rápidas
    if verbose:
        prices = [p['price'] for p in results if p.get('price')]
        brands = [p['brand'] for p in results if p.get('brand')]
        
        print("📈 Estadísticas:")
        print(f"   Precio mínimo: ${min(prices):,.2f}" if prices else "   Precio mínimo: N/A")
        print(f"   Precio máximo: ${max(prices):,.2f}" if prices else "   Precio máximo: N/A")
        print(f"   Precio promedio: ${sum(prices)/len(prices):,.2f}" if prices else "   Precio promedio: N/A")
        print(f"   Marcas únicas: {len(set(b for b in brands if b))}")
        print()
    
    # Mostrar productos
    for i, product in enumerate(results, 1):
        print(f"{i}. {product.get('title', 'Sin título')[:70]}...")
        print(f"   💰 Precio: ${product.get('price', 0):,.2f} {product.get('currency', 'ARS')}")
        
        if verbose:
            print(f"   🏷️  Marca: {product.get('brand', 'N/A')}")
            print(f"   📏 Tamaño: {product.get('size', 'N/A')}")
            print(f"   🔗 URL: {product.get('url', 'N/A')[:60]}..." if product.get('url') else "   🔗 URL: N/A")
            if product.get('condition'):
                print(f"   📦 Condición: {product.get('condition')}")
        else:
            # Versión compacta
            if product.get('brand'):
                print(f"   🏷️  Marca: {product.get('brand')}")
        
        print()
        
        # Pausa entre productos si hay muchos
        if i % 20 == 0 and i < len(results):
            input("Presiona Enter para continuar...")


def save_to_database(results: List[Dict[str, Any]]) -> tuple[int, int]:
    """Guardar productos en base de datos y retornar (exitosos, fallidos)."""
    print(f"\n{'=' * 60}")
    print("💾 Guardando productos en base de datos...")
    print(f"{'=' * 60}\n")
    
    repo = ProductRepository()
    
    try:
        successful, failed = repo.create_many(results)
        
        # Registrar métricas
        _pipeline_metrics.record_normalized(len(results))
        _pipeline_metrics.record_saved(successful)
        _pipeline_metrics.record_duplicates(failed)
        
        print(f"✅ Resumen de guardado:")
        print(f"   - Exitosos: {successful}")
        print(f"   - Duplicados/Fallidos: {failed}")
        print(f"   - Total en BD: {repo.count()}")
        
        return successful, failed
        
    except Exception as e:
        logger.error(f"Error al guardar en BD: {e}")
        return 0, len(results)
    finally:
        repo.close()


def main() -> Optional[List[Dict[str, Any]]]:
    """Ejecuta el scraper, guarda en BD y muestra los resultados."""
    # Parsear argumentos
    args = parse_arguments()
    
    # Configurar nivel de logging según verbose
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Determinar modo
    mock_mode, mode_info = get_mode_from_args(args)
    db_url = os.environ.get('DATABASE_URL', 'sqlite:///data/chvaluegrowth.db')
    
    # Mostrar configuración
    display_configuration(mock_mode, mode_info, db_url, args)
    
    # Inicializar base de datos
    print("[DB] Inicializando base de datos...")
    try:
        init_db()
        print("[DB] ✅ Base de datos lista")
    except Exception as e:
        logger.error(f"Error al inicializar BD: {e}")
        return None
    
    print()
    
    # Crear instancia del scraper
    scraper = MercadoLibreScraper()
    
    # Iniciar tracking de métricas
    _pipeline_metrics.start(mode="MOCK" if mock_mode else "REAL", source="mercadolibre")
    
    # Ejecutar búsqueda
    logger.info(f"🔍 Buscando: {args.query} (límite: {args.limit})")
    
    try:
        results = scraper.search(query=args.query, limit=args.limit)
        _pipeline_metrics.record_scraped(len(results))
        
        if not results:
            print("\n⚠️  No se encontraron productos.")
            return None
        
        # Normalizar productos
        print("\n" + "=" * 60)
        print("🔄 Normalizando productos...")
        print("=" * 60)
        
        normalizer = ProductNormalizer()
        results = normalizer.normalize_many(results)
        
        # Agregar metadatos adicionales
        for product in results:
            product['scraped_at'] = datetime.now().isoformat()
            product['category'] = args.category
            product['query'] = args.query
        
        print(f"✅ {len(results)} productos normalizados")
        
        # Mostrar resultados
        display_results(results, verbose=args.verbose)
        
        # Guardar en base de datos (si no está desactivado)
        if not args.no_save:
            successful, failed = save_to_database(results)
        else:
            print("\n⏭️  Omitiendo guardado en BD (--no-save activado)")
            successful, failed = len(results), 0
        
        # Guardar en JSON (si no está desactivado)
        if not args.no_json:
            filepath = save_results_to_json(results, args.output)
            print(f"📄 Resultados guardados en {filepath}")
        
        # Finalizar métricas
        _pipeline_metrics.finish()
        metrics_dict = _pipeline_metrics.to_dict()
        
        print()
        print("=" * 60)
        print("📊 MÉTRICAS FINALES")
        print("=" * 60)
        print(f"🎯 Quality Score: {metrics_dict.get('quality_score', 0):.2f}/100")
        print(f"📈 Productos scrapeados: {metrics_dict.get('scraped_count', 0)}")
        print(f"✅ Productos guardados: {successful}")
        print(f"⚠️  Duplicados/errores: {failed}")
        
        return results
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Ejecución interrumpida por el usuario")
        return None
    except Exception as e:
        logger.error(f"Error durante la ejecución: {e}", exc_info=args.verbose)
        return None
    finally:
        print("\n" + "=" * 60)
        print("🏁 Script finalizado")
        print("=" * 60)


if __name__ == "__main__":
    results = main()
    sys.exit(0 if results is not None else 1)