"""Tests for tire title normalization."""
import pytest

from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title, normalize_brand


class TestNormalizeTitle:
    """Test normalize_title parsing."""
    
    def test_parse_standard_format(self):
        """Test standard tire format."""
        result = normalize_title("Michelin Primacy 4 205/55 R16")
        assert result["brand"] == "MICHELIN"
        assert result["width"] == 205
        assert result["aspect_ratio"] == 55
        assert result["rim_diameter"] == 16
    
    def test_parse_without_r_space(self):
        """Test tire format without space before R."""
        result = normalize_title("Pirelli Cinturato 205/55R16")
        assert result["brand"] == "PIRELLI"
        assert result["width"] == 205
    
    def test_parse_lowercase_r(self):
        """Test lowercase R."""
        result = normalize_title("Continental 205/55 r16")
        assert result["rim_diameter"] == 16
    
    def test_parse_invalid_title(self):
        """Test invalid title returns None values."""
        result = normalize_title("Invalid product title")
        assert result["brand"] is None
        assert result["width"] is None


class TestNormalizeBrand:
    """Test brand normalization."""
    
    def test_normalize_uppercase(self):
        """Test uppercase brand."""
        assert normalize_brand("MICHELIN") == "Michelin"
    
    def test_normalize_lowercase(self):
        """Test lowercase brand."""
        assert normalize_brand("pirelli") == "Pirelli"
    
    def test_normalize_unknown_brand(self):
        """Test unknown brand returns title case."""
        assert normalize_brand("unknown") == "Unknown"