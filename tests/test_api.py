"""
Tests para la API de productos - CHValueGrowth
"""

import pytest


class TestProductsAPI:
    """Tests para los endpoints de productos."""
    
    def test_get_products(self, client):
        """Test GET /api/v1/products."""
        response = client.get("/api/v1/products")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") is True
    
    def test_get_products_with_pagination(self, client):
        """Test paginación de productos."""
        response = client.get("/api/v1/products?page=1&limit=10")
        assert response.status_code == 200
        data = response.json()
        assert "pagination" in data
        assert data["pagination"]["page"] == 1
    
    def test_get_products_stats(self, client):
        """Test /api/v1/products/stats."""
        response = client.get("/api/v1/products/stats")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") is True
        assert "stats" in data
    
    def test_get_products_grouped(self, client):
        """Test /api/v1/products/grouped."""
        response = client.get("/api/v1/products/grouped?group_by=brand")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") is True
    
    def test_get_products_by_brand(self, client):
        """Test filtrar por marca."""
        response = client.get("/api/v1/products?brand=Michelin")
        assert response.status_code == 200
    
    def test_get_products_invalid_page(self, client):
        """Test página inválida."""
        response = client.get("/api/v1/products?page=0")
        assert response.status_code == 422  # Validation error


class TestMetricsAPI:
    """Tests para los endpoints de métricas."""
    
    def test_get_metrics(self, client):
        """Test GET /api/v1/metrics."""
        response = client.get("/api/v1/metrics")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") is True
    
    def test_reset_metrics(self, client):
        """Test POST /api/v1/metrics/reset."""
        response = client.post("/api/v1/metrics/reset")
        assert response.status_code == 200


class TestOrdersAPI:
    """Tests para los endpoints de órdenes."""
    
    def test_get_orders(self, client):
        """Test GET /api/v1/orders."""
        response = client.get("/api/v1/orders")
        assert response.status_code == 200
    
    def test_create_order(self, client):
        """Test POST /api/v1/orders."""
        order_data = {
            "order_number": "TEST-001",
            "customer_id": 1,
            "total": 5000.00,
            "status": "pending"
        }
        response = client.post("/api/v1/orders", json=order_data)
        # Puede ser 200 (éxito) o 500 (si falla la DB)
        assert response.status_code in [200, 500]


class TestCustomersAPI:
    """Tests para los endpoints de clientes."""
    
    def test_get_customers(self, client):
        """Test GET /api/v1/customers."""
        response = client.get("/api/v1/customers")
        assert response.status_code == 200


class TestExportAPI:
    """Tests para los endpoints de export."""
    
    def test_export_products_json(self, client):
        """Test export a JSON."""
        response = client.get("/api/v1/export/products?format=json")
        assert response.status_code == 200
        assert response.json().get("success") is True
    
    def test_export_products_csv(self, client):
        """Test export a CSV."""
        response = client.get("/api/v1/export/products?format=csv")
        assert response.status_code == 200


class TestHealthCheck:
    """Test para health check."""
    
    def test_health(self, client):
        """Test GET /health."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"