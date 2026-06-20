"""Unit tests for RecordPriceObservationUseCase."""
import uuid
from unittest.mock import MagicMock, AsyncMock
from datetime import datetime, timezone

import pytest

from neumatiq_next.application.use_cases.record_price_observation import RecordPriceObservationUseCase
from neumatiq_next.application.dto.requests import RecordPriceObservationRequest


class MockUnitOfWork:
    """Mock UnitOfWork for testing."""
    
    def __init__(self):
        self.products = MagicMock()
        self.suppliers = MagicMock()
        self.countries = MagicMock()
        self.price_observations = MagicMock()
        self.commit = AsyncMock()
        self.rollback = AsyncMock()
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, *args):
        pass


def make_product():
    p = MagicMock()
    p.id = uuid.uuid4()
    return p


def make_supplier(country_id=None):
    s = MagicMock()
    s.id = uuid.uuid4()
    s.country_id = country_id or uuid.uuid4()
    return s


def make_country(code="MX"):
    c = MagicMock()
    c.id = uuid.uuid4()
    c.code = code
    return c


class TestRecordPriceObservationUseCase:
    """Tests for RecordPriceObservationUseCase."""
    
    @pytest.mark.asyncio
    async def test_record_with_valid_entities(self) -> None:
        """Test recording observation with valid product/supplier."""
        uow = MockUnitOfWork()
        uow.products.get = AsyncMock(return_value=make_product())
        uow.suppliers.get = AsyncMock(return_value=make_supplier())
        uow.countries.get = AsyncMock(return_value=make_country())
        uow.price_observations.add = AsyncMock()
        
        use_case = RecordPriceObservationUseCase(lambda: uow)
        request = RecordPriceObservationRequest(
            supplier_id=uuid.uuid4(),
            product_id=uuid.uuid4(),
            price_total=1234.56,
            currency_code="MXN",
        )
        
        result = await use_case.execute(request)
        
        assert result is not None
        assert result.price_total == 1234.56
    
    @pytest.mark.asyncio
    async def test_raises_for_missing_product(self) -> None:
        """Test that missing product raises error."""
        uow = MockUnitOfWork()
        uow.products.get = AsyncMock(return_value=None)
        uow.suppliers.get = AsyncMock(return_value=make_supplier())
        
        use_case = RecordPriceObservationUseCase(lambda: uow)
        request = RecordPriceObservationRequest(
            supplier_id=uuid.uuid4(),
            product_id=uuid.uuid4(),
            price_total=100.0,
            currency_code="MXN",
        )
        
        with pytest.raises(ValueError, match="not found"):
            await use_case.execute(request)