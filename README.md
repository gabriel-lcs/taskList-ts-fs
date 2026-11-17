# Task List Full Stack

Lista de tarefas full stack com **React + TypeScript** no front-end e **Fastify + TypeScript + PostgreSQL** no back-end, com testes automatizados e execução completa via **Docker Compose**.

É a evolução de um CRUD antigo meu feito em Node com JavaScript: desta vez com tipagem, validação de dados, banco relacional, testes e containers.

<!-- > 📸 **Adicione aqui um print ou GIF da tela** (ex.: `docs/screenshot.png`) com `![Task List](docs/screenshot.png)` -->

## O que o projeto faz

- Cria, lista, edita e exclui tarefas (CRUD completo)
- Cada tarefa tem um status: **Pendente**, **Em andamento** ou **Concluido** (cada um com uma cor na tela)
- Toda tarefa nova nasce como **Pendente**
- A API valida tudo que recebe (nome com no mínimo 3 letras, status só entre os três válidos, id precisa ser um UUID) e responde com o código HTTP correto

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Front-end | React 19, TypeScript, Vite, Tailwind CSS |
| Back-end | Node.js, TypeScript, Fastify, Zod (validação), postgres.js |
| Banco de dados | PostgreSQL 16 |
| Testes | `node:test` (test runner nativo do Node) + `app.inject` do Fastify |
| Infraestrutura | Docker, Docker Compose, Nginx (serve o front) |

## Como o projeto está organizado

```
taskList-ts-fs/
├── backend/
│   ├── sql/schema.sql          # criação da tabela tasks
│   └── src/
│       ├── index.ts            # sobe o servidor
│       ├── app.ts              # cria o Fastify, CORS, rotas e tratamento central de erros
│       ├── routes/             # rotas /tasks
│       ├── schemas/            # schemas Zod (validação) e tipos
│       ├── database/           # conexão com o Postgres
│       ├── errors/             # erros próprios (NotFoundError)
│       └── tests/              # testes da API
├── frontend/
│   └── src/
│       ├── App.tsx             # dono do estado das tarefas
│       ├── components/         # Input, TaskList, TaskItem
│       ├── enums/, types/      # status e tipo Task
│       └── config.ts           # URL da API (VITE_API_URL)
├── docker/db/                  # script que cria o banco de testes
└── docker-compose.yml          # db + backend + frontend
```

### Decisões de projeto

- **Validação com Zod** nas entradas da API, com um tratador de erros central: `ZodError` vira **400**, "não encontrado" vira **404** e qualquer erro inesperado vira **500** genérico (o detalhe vai só para o log).
- **Ordenação explícita** (`ORDER BY created_at`) no `GET /tasks`: sem ela, o Postgres não garante a ordem e uma tarefa editada poderia "pular" de posição.
- **Testes com banco separado** (`tasklist_test`), para nunca apagar os dados de quem usa o app.
- **CORS e URL da API configuráveis por variável de ambiente**, para o mesmo código rodar localmente e em containers.

## Rodando com Docker (recomendado)

Pré-requisito: [Docker](https://docs.docker.com/get-docker/) com o Compose.

```bash
# 1. clone o repositório
git clone <URL-DO-REPOSITORIO>
cd taskList-ts-fs

# 2. crie o arquivo de variáveis e troque a senha
cp .env.example .env

# 3. suba tudo (banco, back e front)
docker compose up --build
```

Depois é só abrir:

- **Aplicação:** http://localhost:5173
- **API:** http://localhost:8080/tasks

Comandos úteis:

```bash
docker compose up -d --build   # sobe em segundo plano
docker compose logs -f backend # acompanha os logs do back
docker compose down            # para os containers (mantém os dados)
docker compose down -v         # para e APAGA o banco (recomeça do zero)
```

> O `schema.sql` só é aplicado na **primeira** subida (quando o volume do banco está vazio). Se alterar o schema, rode `docker compose down -v` e suba de novo.

## Rodando sem Docker

Pré-requisitos: Node.js 22+ e PostgreSQL instalado.

**Back-end**

```bash
cd backend
cp .env.example .env        # ajuste usuário, senha e nome do banco
createdb tasklist           # ou crie o banco pelo seu cliente favorito
psql -d tasklist -f sql/schema.sql
npm install
npm run dev                 # http://localhost:8080
```

**Front-end** (em outro terminal)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

## Rodando os testes

Os testes **apagam a tabela `tasks`** do banco que estiverem usando, por isso usam um banco próprio (`tasklist_test`), que o Docker Compose já cria junto com o principal.

```bash
# com o banco do docker compose no ar (docker compose up -d db)
cd backend
cp .env.test.example .env.test   # coloque a mesma senha do .env da raiz
npm install
npm test
```

Sem Docker: crie o banco `tasklist_test`, aplique o `sql/schema.sql` nele e aponte o `.env.test` para ele.

São 16 testes que cobrem todas as rotas, incluindo os casos de erro (400 e 404).

## Variáveis de ambiente

| Variável | Onde | Para que serve |
| --- | --- | --- |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | `.env` da raiz | Credenciais do Postgres no Docker Compose |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | `backend/.env` | Conexão do back com o banco |
| `PORT` | `backend/.env` | Porta da API (padrão 8080) |
| `CORS_ORIGIN` | `backend/.env` | Origem do front liberada no CORS |
| `VITE_API_URL` | `frontend/.env` | Endereço da API usado pelo front |

## API

| Método | Rota | Descrição | Respostas |
| --- | --- | --- | --- |
| GET | `/tasks` | Lista as tarefas por ordem de criação | 200 |
| GET | `/tasks/:id` | Busca uma tarefa | 200, 400 (id inválido), 404 |
| POST | `/tasks` | Cria uma tarefa (`{ "name": "..." }`, mínimo 3 letras) | 201, 400 |
| PATCH | `/tasks/:id` | Altera `name` e/ou `status` (ao menos um) | 200, 400, 404 |
| DELETE | `/tasks/:id` | Exclui e devolve a tarefa excluída | 200, 400, 404 |

Exemplo:

```bash
curl -X POST http://localhost:8080/tasks \
  -H "Content-Type: application/json" \
  -d '{"name": "Estudar testes"}'
```

## Próximos passos

- Validar as variáveis de ambiente com Zod na inicialização
- Estados de tela: carregando, erro visível e "nenhuma tarefa ainda"
- Tema claro/escuro
- GitHub Actions rodando os testes a cada push
