# Usa uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Compila o projeto Next.js
RUN npm run build

# Expõe a porta em que o Next.js vai rodar
EXPOSE 3000
ENV NEXT_PUBLIC_API_URL=https://projeto-modelfarma.onrender.com


# Comando para iniciar a aplicação Next.js
CMD ["npm", "run", "start"]
