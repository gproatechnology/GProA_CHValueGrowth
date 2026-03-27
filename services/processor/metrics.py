"""
Métricas del Pipeline - CHValueGrowth
Seguimiento de calidad y confiabilidad del pipeline de datos.
"""

import logging
from datetime import datetime
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class PipelineMetrics:
    """Métricas de calidad del pipeline de datos."""
    
    def __init__(self):
        self.scraped_count = 0
        self.normalized_count = 0
        self.saved_count = 0
        self.duplicates_count = 0
        self.errors_count = 0
        self.start_time: Optional[datetime] = None
        self.end_time: Optional[datetime] = None
        self.mode = "MOCK"  # MOCK o REAL
        self.data_source = "unknown"
    
    def start(self, mode: str = "MOCK", source: str = "unknown"):
        """Inicia el tracking del pipeline."""
        self.start_time = datetime.utcnow()
        self.mode = mode
        self.data_source = source
        self.scraped_count = 0
        self.normalized_count = 0
        self.saved_count = 0
        self.duplicates_count = 0
        self.errors_count = 0
        logger.info(f"[METRICS] Pipeline started - Mode: {mode}, Source: {source}")
    
    def record_scraped(self, count: int):
        """Registra productos scrapeados."""
        self.scraped_count = count
    
    def record_normalized(self, count: int):
        """Registra productos normalizados."""
        self.normalized_count = count
    
    def record_saved(self, count: int):
        """Registra productos guardados."""
        self.saved_count = count
    
    def record_duplicates(self, count: int):
        """Registra duplicados detectados."""
        self.duplicates_count = count
    
    def record_errors(self, count: int):
        """Registra errores."""
        self.errors_count = count
    
    def finish(self):
        """Finaliza el tracking y calcula métricas."""
        self.end_time = datetime.utcnow()
        
        duration = 0
        if self.start_time and self.end_time:
            duration = (self.end_time - self.start_time).total_seconds()
        
        logger.info(f"[METRICS] Pipeline finished in {duration:.2f}s")
        logger.info(f"[METRICS] Scraped: {self.scraped_count}, Normalized: {self.normalized_count}, Saved: {self.saved_count}, Duplicates: {self.duplicates_count}, Errors: {self.errors_count}")
    
    def to_dict(self) -> dict:
        """Convierte métricas a diccionario."""
        duration = 0
        if self.start_time and self.end_time:
            duration = (self.end_time - self.start_time).total_seconds()
        
        return {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "mode": self.mode,
            "data_source": self.data_source,
            "duration_seconds": round(duration, 2),
            "scraped_count": self.scraped_count,
            "normalized_count": self.normalized_count,
            "saved_count": self.saved_count,
            "duplicates_count": self.duplicates_count,
            "errors_count": self.errors_count,
            "success_rate": round((self.saved_count / self.scraped_count * 100), 2) if self.scraped_count > 0 else 0,
            "quality_score": self._calculate_quality_score()
        }
    
    def _calculate_quality_score(self) -> float:
        """Calcula score de calidad (0-100)."""
        if self.scraped_count == 0:
            return 0
        
        # Factores:
        # - Success rate (40%)
        # - Baja tasa de errores (30%)
        # - Baja tasa de duplicados (30%)
        
        success_rate = (self.saved_count / self.scraped_count) * 100 if self.scraped_count > 0 else 0
        error_rate = (self.errors_count / self.scraped_count) * 100 if self.scraped_count > 0 else 0
        dup_rate = (self.duplicates_count / self.scraped_count) * 100 if self.scraped_count > 0 else 0
        
        score = (
            (success_rate * 0.4) +
            ((100 - error_rate) * 0.3) +
            ((100 - dup_rate) * 0.3)
        )
        
        return round(score, 2)


# Instancia global de métricas
_pipeline_metrics = PipelineMetrics()


def get_pipeline_metrics() -> dict:
    """Obtiene las métricas actuales del pipeline."""
    return _pipeline_metrics.to_dict()


def reset_metrics():
    """Resetea las métricas."""
    global _pipeline_metrics
    _pipeline_metrics = PipelineMetrics()