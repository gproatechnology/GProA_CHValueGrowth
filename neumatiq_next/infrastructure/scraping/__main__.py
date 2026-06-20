"""CLI entry point for scraper."""
import asyncio
from neumatiq_next.infrastructure.scraping.run import run_scraper

if __name__ == "__main__":
    asyncio.run(run_scraper())