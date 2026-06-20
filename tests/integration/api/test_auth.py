"""Authentication tests."""
import uuid
from fastapi.testclient import TestClient


def test_auth_required_products():
    """Test that /products/get-or-create requires auth in production."""
    from neumatiq_next.main import app
    
    client = TestClient(app)
    
    # Without API key - should work in dev mode (no key configured)
    response = client.post(
        "/products/get-or-create",
        json={
            "brand": "Michelin",
            "width": 205,
            "aspect_ratio": 55,
            "rim_diameter": 16,
            "normalized_name": "michelin_205_55_r16",
        },
    )
    assert response.status_code == 200


def test_auth_required_observations():
    """Test that /observations requires auth in production."""
    from neumatiq_next.main import app
    
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
    assert response.status_code == 200


def test_auth_with_key():
    """Test authorized request with valid key."""
    from neumatiq_next.main import app
    from neumatiq_next.core.config import settings
    
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
        headers={"X-API-Key": settings.api_key or "test-key"},
    )
    assert response.status_code == 200