"""
Caching decorators and utilities - NeumatiQ
Cache layer para repository methods con TTL configurable
"""

import functools
import hashlib
import json
import os
from typing import Any, Callable, Optional
from datetime import datetime

from services.api.cache import cache_get, cache_set

# TTL defaults por tipo de operación
CACHE_TTL_DEFAULTS = {
    'get_all': 300,        # 5 minutos
    'get_by_id': 600,      # 10 minutos
    'get_by_brand': 600,   # 10 minutos
    'get_by_size': 600,    # 10 minutos
    'count': 60,           # 1 minuto (stats cambian rápido)
    'stats': 60,           # 1 minuto
}


def make_cache_key(prefix: str, args: tuple, kwargs: dict) -> str:
    """
    Genera una clave de cache determinística basada en función + argumentos.
    
    Args:
        prefix: Nombre de la función/método
        args: Argumentos posicionales (incluye self)
        kwargs: Argumentos nombrados
    
    Returns:
        String clave única para Redis
    """
    # Filtrar 'self' de args (asumiendo que es primer argumento)
    filtered_args = [arg for i, arg in enumerate(args) if i != 0]
    
    # Serializar args y kwargs
    key_data = {
        'args': filtered_args,
        'kwargs': kwargs
    }
    
    key_str = json.dumps(key_data, sort_keys=True, default=str)
    key_hash = hashlib.md5(key_str.encode()).hexdigest()[:16]
    
    return f"repo:{prefix}:{key_hash}"


def cached(ttl: Optional[int] = None, ttl_by_method: bool = True):
    """
    Decorador para cachear resultados de métodos de repository.
    
    Args:
        ttl: TTL en segundos (si None, usa TTL por defecto según nombre método)
        ttl_by_method: Si True, usa CACHE_TTL_DEFAULTS por nombre de función
    
    Ejemplo:
        @cached()
        def get_all(self, limit=100): ...
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(self, *args, **kwargs):
            # Determinar TTL
            if ttl is not None:
                cache_ttl = ttl
            elif ttl_by_method:
                func_name = func.__name__
                cache_ttl = CACHE_TTL_DEFAULTS.get(func_name, 300)
            else:
                cache_ttl = 300
            
            # Generar clave de cache
            cache_key = make_cache_key(func.__name__, args, kwargs)
            
            # Intentar obtener de cache
            cached_value = cache_get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # Ejecutar función original
            result = func(self, *args, **kwargs)
            
            # Convertir a diccionarios si es necesario (SQLAlchemy objects)
            if result is not None:
                try:
                    from database.models import Product, User
                    # Si es lista de objetos ORM, convertir a dict
                    if isinstance(result, list) and result and hasattr(result[0], 'to_dict'):
                        result = [item.to_dict() for item in result]
                    # Si es un objeto ORM único
                    elif hasattr(result, 'to_dict'):
                        result = result.to_dict()
                    # Si es int (count), dejar como está
                    
                    # Guardar en cache
                    cache_set(cache_key, result, cache_ttl)
                except (TypeError, ValueError, AttributeError) as e:
                    logger.debug(f"No se pudo cachear resultado: {e}")
                    pass
            
            return result
        
        @functools.wraps(func)
        async def async_wrapper(self, *args, **kwargs):
            # Determinar TTL
            if ttl is not None:
                cache_ttl = ttl
            elif ttl_by_method:
                func_name = func.__name__
                cache_ttl = CACHE_TTL_DEFAULTS.get(func_name, 300)
            else:
                cache_ttl = 300
            
            # Generar clave de cache
            cache_key = make_cache_key(func.__name__, args, kwargs)
            
            # Intentar obtener de cache
            cached_value = cache_get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # Ejecutar función original (async)
            result = await func(self, *args, **kwargs)
            
            # Convertir a diccionarios si es necesario
            if result is not None:
                try:
                    from database.models import Product, User
                    if isinstance(result, list) and result and hasattr(result[0], 'to_dict'):
                        result = [item.to_dict() for item in result]
                    elif hasattr(result, 'to_dict'):
                        result = result.to_dict()
                    
                    cache_set(cache_key, result, cache_ttl)
                except (TypeError, ValueError, AttributeError) as e:
                    logger.debug(f"No se pudo cachear resultado: {e}")
                    pass
            
            return result
        
        # Retornar wrapper apropiado
        import inspect
        if inspect.iscoroutinefunction(func):
            return async_wrapper
        return wrapper
    
    return decorator


def invalidate_cache(prefix: str, *args, **kwargs) -> bool:
    """
    Invalida entradas de cache que coincidan con prefijo.
    Útil cuando se hace write (create/update/delete).
    
    Args:
        prefix: Prefijo de clave (ej: 'get_all', 'get_by_brand')
        *args, **kwargs: Si se proporcionan, se usa patrón específico
    
    Returns:
        True si se invalidó algo, False si no
    """
    from services.api.cache import cache_delete_pattern
    
    pattern = f"repo:{prefix}:*"
    return cache_delete_pattern(pattern)


def clear_all_repo_cache() -> bool:
    """Limpia todo el cache del repository."""
    from services.api.cache import cache_delete_pattern
    return cache_delete_pattern("repo:*")
