FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação para o contêiner
COPY . .

# Compila o projeto Next.js
RUN npm run build

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=https://projeto-modelfarma.onrender.com

# Comando para iniciar a aplicação Next.js
CMD ["npm", "run", "start"]
