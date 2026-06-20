"""Tests for scraping exceptions."""
import pytest

from neumatiq_next.infrastructure.scraping.base.exceptions import (
    ScrapingError,
    ProviderUnavailable,
    ParseError,
)


class TestScrapingError:
    """Test ScrapingError exception."""
    
    def test_base_error(self):
        """Test base error message."""
        error = ScrapingError("Test error")
        assert str(error) == "Test error"
        assert error.provider is None
    
    def test_error_with_provider(self):
        """Test error with provider."""
        error = ScrapingError("Test error", provider="test-provider")
        assert error.provider == "test-provider"


class TestProviderUnavailable:
    """Test ProviderUnavailable exception."""
    
    def test_unavailable_error(self):
        """Test provider unavailable message."""
        error = ProviderUnavailable("mercadolibre", "https://example.com")
        assert "mercadolibre" in str(error)
        assert "https://example.com" in str(error)


class TestParseError:
    """Test ParseError exception."""
    
    def test_parse_error(self):
        """Test parse error with raw data."""
        error = ParseError("Parse failed", raw_data="<html>")
        assert str(error) == "Parse failed"
        assert error.raw_data == "<html>"