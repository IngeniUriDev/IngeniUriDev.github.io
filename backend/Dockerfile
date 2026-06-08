FROM python:3.11-slim
RUN apt-get update && apt-get install -y --no-install-recommends 
    build-essential gcc libpq-dev && 
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Código fuente
COPY . .
# Render expone el puerto 10000 por defecto
EXPOSE 10000
# Inicia FastAPI con Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
