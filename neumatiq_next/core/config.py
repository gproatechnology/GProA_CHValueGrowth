from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "NeumatiQ Next"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = False

    database_url: str = "postgresql+asyncpg://neumatiq:password@localhost:5432/neumatiq_dev"
    database_pool_size: int = 5
    database_max_overflow: int = 10

    log_level: str = "INFO"
    log_format: str = "json"

    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    scraping_default_delay: float = 1.0
    scraping_max_retries: int = 3
    scraping_timeout: int = 30

    # API Key for basic authentication
    api_key: str = ""


settings = Settings()