# Usa uma imagem base do Python
FROM python:3.10-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de requisitos e instala as dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY . .

# Expõe a porta em que o FastAPI vai rodar
EXPOSE 8000
ENV NEXT_PUBLIC_API_URL=https://projetosite-modelfarma.onrender.com

# Comando para iniciar a aplicação FastAPI
CMD ["python3", "main.py"]
