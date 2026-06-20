"""Tests for matching service v2."""
import pytest

from neumatiq_next.domain.matching.models import ProductFingerprint, MatchResult
from neumatiq_next.domain.matching.service import MatchingService
from neumatiq_next.domain.matching.normalization import extract_model, normalize_model


class TestProductFingerprintV2:
    """Tests for v2 fingerprint generation."""
    
    def test_generate_fingerprint_v2(self):
        """Test v2 fingerprint with model."""
        fp = ProductFingerprint(brand="Michelin", model="Primacy4", width=205, aspect_ratio=55, rim_diameter=16)
        result = fp.generate()
        assert result == "MICHELIN|PRIMACY4|205|55|16"
    
    def test_generate_fingerprint_v1_fallback(self):
        """Test v1 fingerprint when model is None."""
        fp = ProductFingerprint(brand="Michelin", model=None, width=205, aspect_ratio=55, rim_diameter=16)
        result = fp.generate()
        assert result == "MICHELIN|UNKNOWN|205|55|16"
    
    def test_parse_v1_format(self):
        """Test parsing v1 format."""
        fp = ProductFingerprint.from_string("MICHELIN|205|55|16")
        assert fp.brand == "MICHELIN"
        assert fp.model is None
        assert fp.width == 205
    
    def test_parse_v2_format(self):
        """Test parsing v2 format."""
        fp = ProductFingerprint.from_string("MICHELIN|PRIMACY4|205|55|16")
        assert fp.brand == "MICHELIN"
        assert fp.model == "PRIMACY4"


class TestModelExtraction:
    """Tests for model extraction."""
    
    def test_extract_model_with_space(self):
        """Test model extraction with space."""
        model = extract_model("Michelin Primacy 4 205/55 R16", "Michelin")
        assert model is not None
        assert model.upper() in ["PRIMACY4", "PRIMACY"]
    
    def test_normalize_model(self):
        """Test model normalization."""
        assert normalize_model("Primacy 4") == "PRIMACY4"
        assert normalize_model("Primacy-4") == "PRIMACY4"
        assert normalize_model("Pilot Sport 4") == "PILOTSPORT4"


class TestMatchingV2:
    """Tests for v2 matching."""
    
    def test_generate_fingerprint_with_model(self):
        """Test fingerprint generation with model."""
        service = MatchingService()
        result = service.generate_fingerprint("Michelin", 205, 55, 16, "Primacy4")
        assert result == "MICHELIN|PRIMACY4|205|55|16"
    
    def test_parse_from_title_with_model(self):
        """Test parsing title extracts model."""
        service = MatchingService()
        fp = service.parse_from_title("Michelin Primacy 4 205/55 R16")
        assert fp is not None
        assert fp.brand.upper() == "MICHELIN"
        assert fp.width == 205


class TestMatchScenariosV2:
    """Matching scenarios v2."""
    
    def test_different_models_dont_match(self):
        """Different models should not match."""
        fp1 = ProductFingerprint(brand="Michelin", model="Primacy4", width=205, aspect_ratio=55, rim_diameter=16)
        fp2 = ProductFingerprint(brand="Michelin", model="PilotSport4", width=205, aspect_ratio=55, rim_diameter=16)
        
        assert fp1.generate() != fp2.generate()
    
    def test_same_model_matches(self):
        """Same model should match."""
        fp1 = ProductFingerprint(brand="Michelin", model="Primacy4", width=205, aspect_ratio=55, rim_diameter=16)
        fp2 = ProductFingerprint(brand="MICHELIN", model="primacy-4", width=205, aspect_ratio=55, rim_diameter=16)
        
        assert fp1.generate().upper() == fp2.generate().upper()