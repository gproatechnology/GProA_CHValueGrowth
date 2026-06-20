"""Scraping exceptions."""
from typing import Optional


class ScrapingError(Exception):
    """Base scraping exception."""
    
    def __init__(self, message: str, provider: Optional[str] = None):
        self.provider = provider
        super().__init__(message)


class ProviderUnavailable(ScrapingError):
    """Provider endpoint unavailable."""
    
    def __init__(self, provider: str, url: str):
        super().__init__(f"Provider {provider} unavailable at {url}", provider)


class ParseError(ScrapingError):
    """Failed to parse product data."""
    
    def __init__(self, message: str, raw_data: Optional[str] = None):
        super().__init__(message)
        self.raw_data = raw_data