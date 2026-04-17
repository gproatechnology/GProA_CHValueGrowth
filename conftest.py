"""
 pytest configuration for CHValueGrowth
"""

import os
import sys

# Añadir el path del proyecto
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import pytest


@pytest.fixture
def app():
    """Fixture para la aplicación FastAPI."""
    from services.api.main import app
    return app


@pytest.fixture
def client(app):
    """Fixture para el cliente de testing."""
    from fastapi.testclient import TestClient
    return TestClient(app)


@pytest.fixture
def db_session():
    """Fixture para la sesión de base de datos."""
    from database.config import get_session
    session = get_session()
    yield session
    session.close()


@pytest.fixture
def sample_product():
    """Producto de ejemplo para tests."""
    return {
        'title': 'Llanta Michelin 205/55 R16',
        'brand': 'Michelin',
        'size': '205/55 R16',
        'price': 2500.00,
        'currency': 'MXN'
    }