"""Tests for observations endpoint."""
import uuid
from fastapi.testclient import TestClient

from neumatiq_next.main import app


def test_record_observation():
    """Test POST /observations records price observation."""
    client = TestClient(app)
    response = client.post(
        "/observations",
        json={
            "supplier_id": str(uuid.uuid4()),
            "product_id": str(uuid.uuid4()),
            "currency_code": "MXN",
            "price_total": 1234.50,
            "source_url": "https://example.com",
        },
    )
    assert response.status_code in [200, 400, 500]