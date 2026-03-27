# CHValueGrowth Dockerfile
# Imagen Docker para producción en Render.com

# Usar imagen oficial de Python
FROM python:3.14-slim

# Evitar messages de apt-get
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements primero para aprovechar caché de Docker
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código de la aplicación
COPY . .

# Crear directorio para la base de datos
RUN mkdir -p /app/data

# Exponer puerto (Render usará la variable de entorno PORT)
EXPOSE 8000

# Comando para iniciar la aplicación
# Usar gunicorn con workers para producción
CMD ["uvicorn", "services.api.main:app", "--host", "0.0.0.0", "--port", "8000"]