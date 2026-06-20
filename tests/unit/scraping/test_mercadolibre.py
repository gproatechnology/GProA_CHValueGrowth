"""Tests for MercadoLibre scraper."""
import os

import pytest

from neumatiq_next.infrastructure.scraping.providers.mercadolibre.parser import parse_products
from neumatiq_next.infrastructure.scraping.providers.mercadolibre.mapper import map_to_scraping_result
from neumatiq_next.infrastructure.scraping.base.models import ScrapedProduct


FIXTURES_PATH = os.path.join(os.path.dirname(__file__), 'fixtures')


class TestParser:
    """Tests for MercadoLibre parser."""
    
    def test_parse_products_from_fixture(self):
        """Test parsing products from HTML fixture."""
        with open(os.path.join(FIXTURES_PATH, 'mercadolibre_search.html'), 'r') as f:
            html = f.read()
        
        products = parse_products(html)
        assert len(products) >= 10
    
    def test_parsed_product_has_title(self):
        """Test product has title extracted."""
        with open(os.path.join(FIXTURES_PATH, 'mercadolibre_search.html'), 'r') as f:
            html = f.read()
        
        products = parse_products(html)
        assert products[0].title == "Michelin Primacy 4 205/55 R16"
    
    def test_parsed_product_has_url(self):
        """Test product has URL extracted."""
        with open(os.path.join(FIXTURES_PATH, 'mercadolibre_search.html'), 'r') as f:
            html = f.read()
        
        products = parse_products(html)
        assert products[0].url is not None


class TestMapper:
    """Tests for MercadoLibre mapper."""
    
    def test_map_to_scraping_result(self):
        """Test mapping product to ScrapingResult."""
        product = ScrapedProduct(
            title="Michelin Primacy 4 205/55 R16",
            url="https://example.com",
        )
        
        result = map_to_scraping_result(product)
        assert result.normalized_brand == "Michelin"
        assert result.normalized_name is not None


class TestScraperIntegration:
    """Integration tests for MercadoLibre scraper."""
    
    def test_scraper_build_url(self):
        """Test URL building."""
        from neumatiq_next.infrastructure.scraping.providers.mercadolibre.scraper import MercadoLibreScraper
        
        scraper = MercadoLibreScraper()
        url = scraper.build_search_url(205, 55, 16)
        
        assert "205" in url
        assert "55" in url
        assert "R16" in url
        assert "mercadolibre.com.mx" in url