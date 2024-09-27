# Projeto ModelFarma

**Projeto ModelFarma** é um projeto de site para farmácias, composto por dois serviços principais: uma API para gerenciar operações farmacêuticas (reconstruida usando SQLlchemy e padrões de projeto, [versão antiga](https://github.com/DiegoHVP/Projeto-ApiFarmacia)) e um site para interação com o usuário . O projeto é executado usando Docker para facilitar a implementação e o gerenciamento de ambientes.

## Estrutura do Projeto

- **API-Farmacia**: Backend desenvolvido com FastAPI e SQLAlchemy, responsável pela lógica de negócio, gerenciamento de medicamentos, farmacêuticos, fornecedores, clientes e transações.
- **Projeto-ModelFarma**: Frontend desenvolvido com Next.js e Bootstrap, que consome os dados da API e exibe uma interface amigável para o usuário final.

## Tecnologias Utilizadas

### Backend (API-Farmacia):
- **FastAPI**: Framework para construção de APIs rápidas e eficientes.
- **SQLAlchemy**: ORM para gerenciar o banco de dados relacional.
- **PostgreSQL** (ou qualquer outro banco de dados compatível via SQLAlchemy).
- **Docker**: Containerização para facilitar o desenvolvimento e a implementação.
  
### Frontend (Projeto-ModelFarma):
- **Next.js**: Framework React para renderização do lado do servidor e rotas dinâmicas.
- **Bootstrap**: Framework CSS para design responsivo.

## Requisitos

Certifique-se de ter as seguintes ferramentas instaladas no seu sistema:

- **Docker** e **Docker Compose**
- **Node.js** (para desenvolvimento frontend local)

## Como rodar o projeto

### Clonando o repositório

```bash
git clone https://github.com/DiegoHVP/Projeto-ModelFarma.git
cd Projeto-ModelFarma
```

Antes de usar, ajustes as variaveis de ambiente a seu uso. Elas estão presentes no Dockerfile de cada projeto.

### Usando Docker

1. **Build dos containers**:

   Execute o seguinte comando para construir os containers do backend e frontend:
   
   ```bash
   docker-compose up --build
   ```

2. **Acessando a API**:

   A API estará disponível em: `http://localhost:8000/docs` (Documentação interativa Swagger).

3. **Acessando o site ModelFarma**:

   O frontend estará disponível em: `http://localhost:3000`.

### Estrutura dos Diretórios

```
/Projeto-ModelFarma
│
├── /api-farmacia        # Diretório do backend (FastAPI)
│   ├── api/
|   |    ├── endpoints/
|   |    |       └── ...
|   |    └── api.py
│   ├── core/
|   |    └── ...
│   ├── models/
|   |    └── ...
│   ├── schemas/
|   |    └── ...
│   ├── cria_tabelas.py
│   ├── main.py
│   ├── requeriments.txt
│   └── Dockerfile
│
├── /projeto-modelfarma  # Diretório do frontend (Next.js)
│   ├── types/
|   ├── public/
│   ├── src/
|   |   ├── app/
|   |   |    └── ... 
|   |   └── component/
|   |        └── ...
│   ├── .gitignore
│   ├── Dockerfile
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── package-lock.json
|   └── package.json
│
└── docker-compose.yml   # Arquivo para orquestração dos serviços
```

## Variáveis de Ambiente

- **API-Farmacia**:
  - `DATABASE_URL`: URL de conexão com o banco de dados.
  - `NEXT_URL_SITE`: URL do site do frontend para dar permissões dos métodos HTTP e cabeçalhos

- **Projeto-ModelFarma**:
  - `NEXT_PUBLIC_API_URL`: URL da API-Farmacia.



## Documentação da API

A API-Farmacia expõe as seguintes rotas principais:

- **Medicamentos**: Gerenciamento de medicamentos (criação, listagem, atualização, exclusão).
- **Farmacêuticos**: Cadastro e listagem de farmacêuticos.
- **Fornecedores**: Cadastro e controle de fornecedores.
- **Clientes**: Gestão de clientes e seus pedidos.
- **Farmacias**: Referente a sede fisica da farmacia.
- **Compras**: Registro de transações de compra de medicamentos.

Acesse a documentação completa em `http://localhost:8000/docs`.
