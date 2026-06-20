# NeumatiQ Next - Backend Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir -e ".[dev]" && pip install mypy

# Copy application code
COPY neumatiq_next/ ./neumatiq_next/
COPY alembic/ ./alembic/
COPY alembic.ini .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "neumatiq_next.main:app", "--host", "0.0.0.0", "--port", "8000"]