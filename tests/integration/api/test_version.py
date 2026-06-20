"""Tests for version endpoint."""
from fastapi.testclient import TestClient

from neumatiq_next.main import app


def test_version():
    """Test GET /version returns app info."""
    client = TestClient(app)
    response = client.get("/version/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data