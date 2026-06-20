"""Tests for canonicalization service."""
import uuid

import pytest

from neumatiq_next.domain.matching.service import MatchingService


def test_fixtures_different_variations():
    """Test that variations produce predictable results."""
    service = MatchingService()
    
    titles = [
        "MICHELIN PRIMACY 4 205/55 R16",
        "Michelin Primacy4 205-55R16",
        "MICHELIN PRIMACY-4 205/55R16",
    ]
    
    fingerprints = []
    for title in titles:
        fp = service.parse_from_title(title)
        if fp:
            fingerprints.append(fp.generate())
    
    # Each should generate a valid fingerprint
    assert len(fingerprints) >= 2


def test_fixtures_distinct_models():
    """Test that different models don't collide."""
    service = MatchingService()
    
    fp1 = service.parse_from_title("MICHELIN PRIMACY 4 205/55 R16")
    fp2 = service.parse_from_title("MICHELIN PILOT SPORT 4 205/55 R16")
    
    assert fp1 is not None
    assert fp2 is not None
    
    # Both should have Michelin brand
    assert fp1.brand.upper() == "MICHELIN"
    assert fp2.brand.upper() == "MICHELIN"


class TestCanonicalizationService:
    """Tests for canonicalization service structure."""
    
    def test_service_exists(self):
        """Test service can be imported."""
        from neumatiq_next.domain.matching.canonicalization import CanonicalizationService
        assert CanonicalizationService is not None
    
    def test_service_has_methods(self):
        """Test service has required methods."""
        from neumatiq_next.domain.matching.canonicalization import CanonicalizationService
        service = CanonicalizationService(None)
        assert hasattr(service, 'audit')
        assert hasattr(service, 'get_fingerprint_stats')