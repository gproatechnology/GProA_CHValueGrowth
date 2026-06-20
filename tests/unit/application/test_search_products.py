"""Unit tests for SearchProductsUseCase."""
import uuid
from unittest.mock import MagicMock, AsyncMock

import pytest

from neumatiq_next.application.use_cases.search_products import SearchProductsUseCase
from neumatiq_next.application.dto.requests import SearchProductsRequest


def make_uuid(s):
    """Convert string to UUID consistently."""
    return uuid.UUID(s) if len(s) == 36 else uuid.UUID(f"{s:0>32}")


def make_product(idx, name):
    """Create mock product with proper UUID."""
    p = MagicMock()
    p.id = uuid.uuid4()
    p.fingerprint = f"fp-{idx}"
    p.sku = f"SKU-{idx}"
    p.name = name
    p.normalized_name = name.lower().replace(" ", "_")
    p.brand_id = uuid.uuid4()
    p.tire_specification_id = uuid.uuid4()
    p.product_type = "tire"
    p.status = "active"
    return p


class MockUnitOfWork:
    """Mock UnitOfWork for testing."""
    
    def __init__(self, products=None):
        self._session = MagicMock()
        self.products = MagicMock()
        self.products.list = AsyncMock(return_value=products or [])
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, *args):
        pass


class TestSearchProductsUseCase:
    """Tests for SearchProductsUseCase."""
    
    @pytest.mark.asyncio
    async def test_search_products_with_pagination(self) -> None:
        """Test search with limit/offset."""
        products = [make_product(i, f"Product {i}") for i in range(3)]
        
        use_case = SearchProductsUseCase(lambda: MockUnitOfWork(products))
        request = SearchProductsRequest(limit=10, offset=0)
        results = await use_case.execute(request)
        
        assert len(results) == 3