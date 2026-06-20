"""Unit tests for SeedCountriesUseCase."""
import uuid
from unittest.mock import MagicMock, AsyncMock
from datetime import datetime

import pytest

from neumatiq_next.application.use_cases.seed_countries import SeedCountriesUseCase
from neumatiq_next.application.dto.requests import SeedCountriesRequest


class MockUnitOfWork:
    """Mock UnitOfWork for testing."""
    
    def __init__(self):
        self.countries = MagicMock()
        self.countries.get_by_code = AsyncMock(return_value=None)
        self.countries.add = AsyncMock()
        self.commit = AsyncMock()
        self.rollback = AsyncMock()
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, *args):
        pass


class MockUnitOfWorkWithExisting(MockUnitOfWork):
    """Mock UoW with existing country."""
    
    def __init__(self, existing_country):
        super().__init__()
        self.countries.get_by_code = AsyncMock(return_value=existing_country)


class TestSeedCountriesUseCase:
    """Tests for SeedCountriesUseCase."""
    
    @pytest.mark.asyncio
    async def test_seed_new_countries(self) -> None:
        """Test seeding new countries."""
        use_case = SeedCountriesUseCase(MockUnitOfWork)
        
        request = SeedCountriesRequest(countries=[
            {"code": "MX", "name": "México", "locale": "es-MX"},
            {"code": "US", "name": "United States", "locale": "en-US"},
        ])
        
        results = await use_case.execute(request)
        
        assert len(results) == 2
    
    @pytest.mark.asyncio
    async def test_skip_duplicate_countries(self) -> None:
        """Test that duplicate countries are skipped."""
        existing = MagicMock()
        existing.code = "MX"
        existing.name = "México"
        existing.locale = "es-MX"
        existing.active = True
        
        use_case = SeedCountriesUseCase(lambda: MockUnitOfWorkWithExisting(existing))
        
        request = SeedCountriesRequest(countries=[
            {"code": "MX", "name": "México", "locale": "es-MX"},
        ])
        
        results = await use_case.execute(request)
        
        assert len(results) == 0