"""Allow running bootstrap as module."""
import asyncio

from neumatiq_next.bootstrap.seed_all import seed_all

if __name__ == "__main__":
    asyncio.run(seed_all())