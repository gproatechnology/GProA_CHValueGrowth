"""Tests for health endpoint."""
import pytest
from fastapi.testclient import TestClient

from neumatiq_next.main import app


def test_health_check():
    """Test GET /health returns healthy."""
    client = TestClient(app)
    response = client.get("/health/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"