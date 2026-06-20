"""Unit tests for ListSuppliersUseCase."""
import uuid
from unittest.mock import MagicMock, AsyncMock

import pytest

from neumatiq_next.application.use_cases.list_suppliers import ListSuppliersUseCase


def make_supplier(id_val, name, active=True):
    """Create mock supplier with proper UUID."""
    s = MagicMock()
    s.id = uuid.UUID(id_val) if isinstance(id_val, str) else id_val
    s.name = name
    s.normalized_name = name.lower().replace(" ", "_")
    s.country_id = uuid.UUID("00000000-0000-0000-0000-000000000001")
    s.website = "https://example.com"
    s.active = active
    return s


class MockUnitOfWork:
    """Mock UnitOfWork for testing."""
    
    def __init__(self, suppliers=None):
        self.suppliers = MagicMock()
        self.suppliers.list = AsyncMock(return_value=suppliers or [])
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, *args):
        pass


class TestListSuppliersUseCase:
    """Tests for ListSuppliersUseCase."""
    
    @pytest.mark.asyncio
    async def test_list_active_suppliers(self) -> None:
        """Test listing suppliers returns all."""
        suppliers = [
            make_supplier("00000000-0000-0000-0000-000000000001", "Supplier A"),
            make_supplier("00000000-0000-0000-0000-000000000002", "Supplier B", active=True),
        ]
        
        use_case = ListSuppliersUseCase(lambda: MockUnitOfWork(suppliers))
        results = await use_case.execute()
        
        assert len(results) == 2
    
    @pytest.mark.asyncio
    async def test_filter_active_only(self) -> None:
        """Test that only active suppliers are returned."""
        suppliers = [
            make_supplier("00000000-0000-0000-0000-000000000001", "Supplier A", active=True),
            make_supplier("00000000-0000-0000-0000-000000000002", "Supplier B", active=False),
        ]
        
        use_case = ListSuppliersUseCase(lambda: MockUnitOfWork(suppliers))
        results = await use_case.execute()
        
        assert len(results) == 1
        assert results[0].active == True