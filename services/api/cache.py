"""
Redis Cache Module - NeumatiQ API
Cache de productos y respuestas de endpoints GET
"""

import os
import json
from typing import Optional, Any
from datetime import timedelta

import redis
from redis.exceptions import RedisError

# Redis connection pool (singleton)
_redis_client: Optional[redis.Redis] = None


def get_redis_client() -> Optional[redis.Redis]:
    """
    Obtiene cliente Redis singleton.
    Returns None si Redis no está disponible.
    """
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    
    redis_url = os.getenv("REDIS_URL")
    if not redis_url:
        return None
    
    try:
        _redis_client = redis.from_url(
            redis_url,
            decode_responses=True,
            socket_timeout=5,
            socket_connect_timeout=5,
        )
        # Test connection
        _redis_client.ping()
        return _redis_client
    except (RedisError, Exception):
        _redis_client = None
        return None


def cache_get(key: str) -> Optional[Any]:
    """
    Obtiene un valor de cache.
    Returns None si no existe o Redis no disponible.
    """
    client = get_redis_client()
    if not client:
        return None
    
    try:
        data = client.get(key)
        if data:
            return json.loads(data)
    except (RedisError, json.JSONDecodeError):
        pass
    return None


def cache_set(key: str, value: Any, ttl_seconds: int = 300) -> bool:
    """
    Almacena un valor en cache.
    Returns True si se guardó exitosamente.
    """
    client = get_redis_client()
    if not client:
        return False
    
    try:
        client.setex(
            key,
            timedelta(seconds=ttl_seconds),
            json.dumps(value, default=str)
        )
        return True
    except (RedisError, TypeError):
        return False


def cache_delete(key: str) -> bool:
    """
    Elimina una clave de cache.
    """
    client = get_redis_client()
    if not client:
        return False
    
    try:
        client.delete(key)
        return True
    except RedisError:
        return False


def cache_delete_pattern(pattern: str) -> bool:
    """
    Elimina todas las claves que coinciden con el patrón.
    Example pattern: "products:*"
    """
    client = get_redis_client()
    if not client:
        return False
    
    try:
        keys = client.keys(pattern)
        if keys:
            client.delete(*keys)
        return True
    except RedisError:
        return False
