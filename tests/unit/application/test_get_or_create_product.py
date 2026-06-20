"""Unit tests for GetOrCreateProductUseCase."""
import uuid
from unittest.mock import MagicMock, AsyncMock

import pytest

from neumatiq_next.application.use_cases.get_or_create_product import GetOrCreateProductUseCase
from neumatiq_next.application.dto.requests import GetOrCreateProductRequest


class MockUnitOfWork:
    """Mock UnitOfWork for testing."""
    
    def __init__(self):
        self.products = MagicMock()
        self.brands = MagicMock()
        self.commit = AsyncMock()
        self.rollback = AsyncMock()
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, *args):
        pass


def make_product(normalized_name="test"):
    p = MagicMock()
    p.id = uuid.uuid4()
    p.fingerprint = f"fp-{normalized_name}"
    p.sku = f"SKU-{normalized_name}"
    p.name = "Test Product"
    p.normalized_name = normalized_name
    p.brand_id = uuid.uuid4()
    p.tire_specification_id = uuid.uuid4()
    p.product_type = "tire"
    p.status = "active"
    return p


def make_brand(name="Brand"):
    b = MagicMock()
    b.id = uuid.uuid4()
    b.name = name
    b.normalized_name = name.lower()
    b.active = True
    return b


class TestGetOrCreateProductUseCase:
    """Tests for GetOrCreateProductUseCase."""
    
    @pytest.mark.asyncio
    async def test_returns_existing_product(self) -> None:
        """Test that existing product is returned."""
        uow = MockUnitOfWork()
        existing_product = make_product("michelin_205_55_r16")
        uow.products.search_by_name = AsyncMock(return_value=[existing_product])
        
        use_case = GetOrCreateProductUseCase(lambda: uow)
        request = GetOrCreateProductRequest(
            brand_name="Michelin",
            tire_width=205,
            tire_aspect_ratio=55,
            tire_rim_diameter=16,
            normalized_name="michelin_205_55_r16",
        )
        
        result = await use_case.execute(request)
        
        assert result is not None
        assert result.normalized_name == "michelin_205_55_r16"