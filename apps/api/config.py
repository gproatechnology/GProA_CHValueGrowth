"""Application configuration."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    app_name: str = "NeumatiQ"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = True

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/neumatiq"
    database_pool_size: int = 5
    database_max_overflow: int = 10

    # Scraping
    scraper_concurrency: int = 3
    scraper_timeout: int = 30
    scraper_retry_attempts: int = 3
    scraper_retry_delay: int = 5

    # Logging
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()