
# Desafio Técnico (Python) — Submissions API

API em FastAPI para receber submissões de texto, persistir metadados no Postgres, armazenar o conteúdo no S3 (via LocalStack) e enfileirar o processamento via SQS (via LocalStack). Um worker consome a fila, lê o texto no S3 e calcula um `score` determinístico, atualizando o registro.

## Arquitetura

1. **POST /submissions**
	 - Salva o texto no **S3** (`submissions/{id}.txt`)
	 - Insere a submissão no **Postgres** com `status=PENDING`
	 - Envia uma mensagem no **SQS** com o `submission_id`
2. **Worker**
	 - Faz long polling no **SQS**
	 - Marca `status=PROCESSING`
	 - Lê o texto do **S3**
	 - Calcula `score`
	 - Atualiza `status=DONE` e `score`

## Como isso seria na AWS

Na AWS, uma forma direta de montar esse mesmo fluxo seria:

1. **API Gateway** recebe o `POST /submissions` e chama uma **Lambda**.
2. Essa Lambda valida os dados, gera um `submission_id`, salva o texto no **S3** e envia uma mensagem no **SQS** com esse `submission_id`.
3. Uma segunda **Lambda** (worker) consome o SQS, lê o texto no S3, calcula o `score` e atualiza o resultado no banco (por exemplo **RDS Postgres**).

O principal ganho aqui é que a API responde rápido (com `PENDING`) e o trabalho pesado acontece depois. A fila (SQS) ajuda a lidar com picos e a “nivelar” o processamento.

## Escalabilidade e observabilidade (visão prática)

- **Escalabilidade**: API/worker escalam automaticamente; a fila funciona como “buffer” em momentos de pico.
- **Retries**: se o worker falhar, a mensagem pode ser processada novamente; por isso o processamento deve ser seguro para repetição (idempotente).
- **DLQ**: mensagens que falham várias vezes vão para uma *dead-letter queue* para análise, sem travar a fila principal.
- **Observabilidade**: logs com `submission_id`, métricas de erro/latência e alertas quando a fila acumula mensagens ou quando a DLQ recebe itens.

## Stack

- Python 3.11
- FastAPI + Uvicorn
- SQLAlchemy + psycopg2
- Postgres 16
- LocalStack (S3 e SQS)
- Docker Compose (ambiente local)

## Como rodar (Docker)

Pré-requisitos: **Docker Desktop** com suporte a Linux containers.

### Subir tudo

Opção A (a partir da raiz do repositório):

```bash
docker compose -f app/docker-compose.yml up -d --build
```

Opção B (dentro da pasta `app/`):

```bash
docker compose up -d --build
```

Serviços:

- `api`: http://localhost:8000
- `db`: Postgres em `localhost:5432`
- `localstack`: http://localhost:4566
- `worker`: consumidor da fila

O schema inicial é aplicado via [app/db/init/01_schema.sql](db/init/01_schema.sql).


### Ver logs

```bash
docker compose -f app/docker-compose.yml logs -f api
docker compose -f app/docker-compose.yml logs -f worker
docker compose -f app/docker-compose.yml logs -f db
docker compose -f app/docker-compose.yml logs -f localstack
```

## Variáveis de ambiente

Definidas no Compose (com defaults em `app/config.py`):

- `DATABASE_URL` (ex: `postgresql+psycopg2://app:app@db:5432/app`)
- `AWS_ENDPOINT_URL` (ex: `http://localstack:4566`)
- `AWS_REGION` (ex: `us-east-1`)
- `S3_BUCKET` (ex: `submissions-bucket`)
- `SQS_QUEUE_NAME` (ex: `submissions-queue`)

## Endpoints

### Healthcheck

- `GET /health`
	- Response: `{"status":"ok"}`

### Criar submissão

- `POST /submissions`
	- Body:
		- `student_id` (string, obrigatório)
		- `text` (string, obrigatório)
	- Response (201):
		- `id` (UUID)
		- `status` (string, ex: `PENDING`)

Exemplo (curl):

```bash
curl -X POST http://localhost:8000/submissions \
	-H "Content-Type: application/json" \
	-d '{"student_id":"abc123","text":"hello world"}'
```

### Consultar submissão por ID

- `GET /submissions/{submission_id}`
	- Response (200):
		- `id`, `student_id`, `s3_key`, `status`, `score`, `created_at`, `updated_at`

### Listar submissões por aluno

- `GET /submissions?student_id=...&limit=...`
	- `limit`: default 50, min 1, max 200
	- Response (200): lista com `id`, `status`, `score`, `created_at`

## Worker e fila

O worker faz long polling no SQS com `WaitTimeSeconds=10`. Isso faz o LocalStack receber uma chamada de `ReceiveMessage` periodicamente mesmo quando não há mensagens (comportamento esperado).

O cálculo de score atual é determinístico e simples (ver `compute_score` em `app/worker.py`): baseado no tamanho do texto e limitado a 100.

## Estrutura do projeto

- `app/main.py`: FastAPI app
- `app/routes/submissions.py`: rotas de submissões
- `app/models.py`: modelos SQLAlchemy
- `app/db.py`: engine e sessão
- `app/services/`: clientes AWS (LocalStack), S3 e SQS
- `app/worker.py`: consumidor SQS e processamento
- `app/db/init/01_schema.sql`: criação da tabela `submissions`

## Frontend (React) — Single Page Application

Interface moderna e amigável desenvolvida em React para interagir com a API de submissões. Permite criar, listar e visualizar detalhes de submissões através de uma navegação fluida (SPA).

### Stack Frontend

- **React 19** com **TypeScript**
- **Vite** (Rolldown) para build e desenvolvimento
- **React Router DOM** para navegação SPA
- **Lucide React** para ícones
- CSS Modules para estilização

### Estrutura do projeto frontend

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Button.tsx      # Botão com variantes e loading
│   │   ├── Card.tsx        # Cards para organizar conteúdo
│   │   ├── Input.tsx       # Inputs e textareas
│   │   ├── Layout.tsx      # Layout principal com navbar
│   │   └── StatusBadge.tsx # Badge de status colorido
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.tsx        # Página inicial
│   │   ├── CreateSubmission.tsx   # Criar submissão
│   │   ├── SubmissionsList.tsx    # Listar submissões
│   │   └── SubmissionDetail.tsx   # Detalhes da submissão
│   ├── services/           # Serviços e API client
│   │   └── api.ts          # Cliente HTTP para backend
│   ├── types/              # Tipos TypeScript
│   │   └── index.ts        # Interfaces e types
│   ├── App.tsx             # Configuração de rotas
│   └── main.tsx            # Entry point
├── package.json
└── vite.config.ts
```

### Como rodar o frontend

1. **Instalar dependências:**

```bash
cd frontend
npm install
```

2. **Iniciar servidor de desenvolvimento:**

```bash
npm run dev
```

3. **Acessar a aplicação:**

Abra `http://localhost:5173` no navegador.

### Configuração

Por padrão o frontend chama o backend em `http://localhost:8000`.

Para alterar a URL da API, crie `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Rotas disponíveis

- `/` — Página inicial com apresentação do sistema
- `/create` — Formulário para criar nova submissão
- `/submissions` — Lista de submissões por ID do aluno
- `/submissions/:id` — Detalhes completos de uma submissão
