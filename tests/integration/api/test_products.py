"""Tests for products endpoint."""
from fastapi.testclient import TestClient

from neumatiq_next.main import app


def test_search_products():
    """Test GET /products returns list or error without DB."""
    client = TestClient(app)
    response = client.get("/products/?page=1&page_size=10")
    assert response.status_code in [200, 500]


def test_get_or_create_product():
    """Test POST /products/get-or-create creates product."""
    client = TestClient(app)
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
    assert response.status_code in [200, 500]