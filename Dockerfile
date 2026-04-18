# CHValueGrowth Dockerfile - Backend + Frontend
# Uses pre-built static files from repo

FROM python:3.14

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY static/ ./static
COPY services/ ./services
COPY database/ ./database
COPY configs/ ./configs

RUN mkdir -p /app/data

EXPOSE 8000

CMD ["uvicorn", "services.api.main:app", "--host", "0.0.0.0", "--port", "8000"]