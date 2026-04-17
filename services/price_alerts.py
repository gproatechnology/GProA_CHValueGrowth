"""
Sistema de alertas de precio - CHValueGrowth
Monitorea precios y'envía alertas cuando cambian.

 Uso:
  python services/price_alerts.py
"""

import os
import sys
import logging
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.config import init_db, get_session
from database.models import Product

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

init_db()


class PriceAlert:
    """Sistema de alertas de precio."""
    
    def __init__(self, threshold_percent=10):
        self.threshold_percent = threshold_percent
    
    def check_prices(self):
        """Compara precios actuales con anteriores."""
        session = get_session()
        
        # Obtener productos de las últimas 24 horas
        yesterday = datetime.utcnow() - timedelta(days=1)
        
        products = session.query(Product).filter(
            Product.created_at >= yesterday
        ).all()
        
        if not products:
            logger.info("No hay productos nuevos para analizar")
            return []
        
        # Agrupar por título
        price_history = {}
        for p in products:
            key = p.title[:50]  # Normalizar título
            if key not in price_history:
                price_history[key] = []
            price_history[key].append({'price': p.price, 'date': p.created_at})
        
        # Detectar cambios significativos
        alerts = []
        for title, prices in price_history.items():
            if len(prices) < 2:
                continue
            
            prices.sort(key=lambda x: x['date'])
            oldest = prices[0]['price']
            newest = prices[-1]['price']
            
            if oldest > 0:
                change_percent = abs((newest - oldest) / oldest) * 100
                
                if change_percent >= self.threshold_percent:
                    direction = "bajó" if newest < oldest else "subió"
                    alerts.append({
                        'title': title,
                        'old_price': oldest,
                        'new_price': newest,
                        'change_percent': change_percent,
                        'direction': direction
                    })
        
        session.close()
        return alerts
    
    def send_alert(self, alerts):
        """Envía alertas (implementar con email/push)."""
        if not alerts:
            logger.info("No hay alertas que enviar")
            return
        
        logger.info(f"=== ALERTAS DE PRECIO ({len(alerts)}) ===")
        
        for a in alerts:
            logger.info(
                f"  {a['title'][:40]}... "
                f"${a['old_price']} -> ${a['new_price']} "
                f"({a['change_percent']:.1f}% {a['direction']})"
            )
        
        # Aquí implementar integración con email/SMS/push
        # Por ejemplo: send_email(alerts)


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Alertas de precio")
    parser.add_argument('--threshold', type=float, default=10,
                      help='Umbral de cambio % (default: 10)')
    args = parser.parse_args()
    
    alert_system = PriceAlert(threshold_percent=args.threshold)
    alerts = alert_system.check_prices()
    
    if alerts:
        alert_system.send_alert(alerts)
    
    return len(alerts)


if __name__ == '__main__':
    main()