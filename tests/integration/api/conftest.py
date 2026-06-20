"""API integration tests."""
import uuid
from unittest.mock import MagicMock, AsyncMock

import pytest
from fastapi.testclient import TestClient

from neumatiq_next.main import app
from neumatiq_next.infrastructure.persistence.unit_of_work import SQLAlchemyUnitOfWork


class MockUnitOfWork:
    """Mock UnitOfWork for API tests."""
    
    def __init__(self):
        self.countries = MagicMock()
        self.brands = MagicMock()
        self.suppliers = MagicMock()
        self.products = MagicMock()
        self.price_observations = MagicMock()
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, *args):
        pass
    
    async def commit(self):
        pass
    
    async def rollback(self):
        pass


@pytest.fixture
def client():
    """Test client fixture."""
    return TestClient(app)