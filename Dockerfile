FROM python:3.13-slim

LABEL maintainer="GProA Technology"
LABEL description="NeumatiQ - CHValueGrowth API"

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/ ./services/
COPY database/ ./database/
COPY frontend/dist/ ./frontend/dist/

ENV PYTHONUNBUFFERED=1
ENV PYTHON_VERSION=3.13
ENV DATABASE_URL=sqlite:///chvaluegrowth.db
ENV JWT_SECRET=chvalue2026_secret_key_change_in_production
ENV MOCK_MODE=true
ENV RENDER=true

EXPOSE 10000

CMD ["python", "-m", "uvicorn", "services.api.main:app", "--host", "0.0.0.0", "--port", "10000"]