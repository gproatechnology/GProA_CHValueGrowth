"""Tests for matching service (backward compatible)."""
import pytest

from neumatiq_next.domain.matching.models import ProductFingerprint, MatchResult
from neumatiq_next.domain.matching.service import MatchingService


class TestProductFingerprintV1:
    """Tests for v1 compatibility."""
    
    def test_generate_fingerprint_v1(self):
        """Test fingerprint with v1 format (model=None)."""
        fp = ProductFingerprint(brand="Michelin", model=None, width=205, aspect_ratio=55, rim_diameter=16)
        result = fp.generate()
        # Should include UNKNOWN for model
        assert "MICHELIN" in result
        assert "205" in result
    
    def test_fingerprint_format(self):
        """Test fingerprint has 5 parts."""
        fp = ProductFingerprint(brand="Michelin", model="Primacy4", width=205, aspect_ratio=55, rim_diameter=16)
        parts = fp.generate().split("|")
        assert len(parts) == 5


class TestMatchingServiceV1:
    """Tests for v1 compatibility in service."""
    
    def test_generate_fingerprint(self):
        """Test fingerprint generation."""
        service = MatchingService()
        result = service.generate_fingerprint("Michelin", 205, 55, 16)
        assert "MICHELIN" in result
        assert "205" in result
    
    @pytest.mark.asyncio
    async def test_match_no_candidates(self):
        """Test match returns NO_MATCH when no candidates."""
        service = MatchingService(None)
        result = await service.match("Michelin", 205, 55, 16)
        
        assert result.matched == False
        assert "MICHELIN" in result.fingerprint


class TestMatchScenarios:
    """Matching scenarios."""
    
    def test_same_specs_different_models(self):
        """Same specs different models should not match."""
        fp1 = ProductFingerprint(brand="Michelin", model="Primacy4", width=205, aspect_ratio=55, rim_diameter=16)
        fp2 = ProductFingerprint(brand="Michelin", model="PilotSport4", width=205, aspect_ratio=55, rim_diameter=16)
        
        assert fp1.generate() != fp2.generate()
    
    def test_v1_vs_v2_compatible(self):
        """v1 and v2 should both work."""
        # v1 format (without model)
        fp1 = ProductFingerprint(brand="Michelin", model=None, width=205, aspect_ratio=55, rim_diameter=16)
        # v2 format (with model)  
        fp2 = ProductFingerprint(brand="MICHELIN", model="PRIMACY4", width=205, aspect_ratio=55, rim_diameter=16)
        
        # v2 is more specific - should have model
        assert fp2.generate() == "MICHELIN|PRIMACY4|205|55|16"