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

# URL do site para add middleware CORS e permitir os métodos HTTP e cabeçalhos
ENV NEXT_URL_SITE=https://UrlDoSiteQueFazAsRequisicoes.com

# String de conexão com o banco de dados
ENV DATABASE_URL=banco://usuario:senha@localnarede:porta/nome_banco

# Comando para iniciar a aplicação FastAPI
CMD ["python3", "main.py"]
