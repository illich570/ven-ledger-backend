# Ven-ledger

Testing deployment!

## Features

- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe JavaScript with strict configuration
- **Pino** - High-performance logging with HTTP request logging
- **Zod** - Runtime schema validation for environment variables
- **Jest** - Testing framework with coverage support
- **ESLint + Prettier** - Code linting and formatting
- **Husky** - Git hooks for pre-commit checks
- **Docker** - Containerized development and production
- **GitHub Actions** - Automated CI/CD pipelines

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher, v25 recommended for production)
- [pnpm](https://pnpm.io/) v10.28.1 (package manager)

## Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration values.

3. **Run in development mode**

   ```bash
   pnpm dev
   ```

4. **Build for production**

   ```bash
   pnpm build
   ```

5. **Start production server**
   ```bash
   pnpm start
   ```

## Environment Variables

The application uses the following environment variables. Configure them in your
`.env` file for local development:

| Variable       | Description             | Example                                     |
| -------------- | ----------------------- | ------------------------------------------- |
| `NODE_ENV`     | Application environment | `development` \| `test` \| `production`     |
| `PORT`         | Server listening port   | `3000` (Railway injects this automatically) |
| `LOG_LEVEL`    | Logging verbosity level | `debug` \| `info` \| `warn` \| `error`      |
| `LOG_FILE`     | Path to log file        | `server.log`                                |
| `DB_URL`       | PostgreSQL connection   | `postgresql://user:pass@host:5432/dbname`   |
| `DATABASE_URL` | PostgreSQL connection   | `postgresql://user:pass@host:5432/dbname`   |

**Note**:

- `DATABASE_URL` and `DB_URL` are both accepted (Railway uses `DATABASE_URL` by
  default)
- Container-specific variables (`NODE_ENV`, `DB_URL` for Docker) are defined in
  `docker-compose.yml`
- `PORT` is automatically injected by Railway in production deployments

### Example `.env` file

```env
# Developer-configurable variables
PORT=3000
LOG_LEVEL=debug
LOG_FILE=server.log
```

### Database Configuration

Database migrations are handled by **Drizzle Kit**. The application
automatically runs migrations on startup in development (via Docker Compose).

## Available Scripts

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Run server in watch mode with tsx         |
| `pnpm build`        | Compile TypeScript to `dist/`             |
| `pnpm start`        | Run compiled server from `dist/server.js` |
| `pnpm test`         | Run Jest tests with coverage              |
| `pnpm lint`         | Run ESLint checks                         |
| `pnpm lint:fix`     | Fix ESLint auto-fixable issues            |
| `pnpm format`       | Format code with Prettier                 |
| `pnpm format:check` | Check code formatting                     |
| `pnpm typecheck`    | TypeScript type checking (no emit)        |
| `pnpm db:generate`  | Generate Drizzle migration files          |
| `pnpm db:migrate`   | Run pending database migrations           |
| `pnpm db:studio`    | Open Drizzle Studio (database GUI)        |

## Project Structure

```
.
├── src/
│   ├── app.ts                          # Express app configuration
│   ├── server.ts                       # Server entry point
│   ├── config.ts                       # Environment config with Zod validation
│   ├── utilities.ts                    # Shared utilities
│   ├── utilities.test.ts               # Utility tests
│   ├── infrastructure/
│   │   ├── app-error.ts                # Custom error class
│   │   ├── validation-error.ts         # Validation error class
│   │   ├── database/
│   │   │   ├── database.ts             # Database connection
│   │   │   └── schema.ts               # Drizzle ORM schema
│   │   └── logger/
│   │       └── pino-logger.ts          # Pino logger configuration
│   └── presentation/
│       ├── middleware/
│       │   ├── error-handler.ts        # Global error handler
│       │   └── validate.ts             # Request validation middleware
│       ├── routes/
│       │   └── health.routes.ts        # Health check routes
│       └── handlers/
│           └── health.handler.ts       # Health check handlers
├── drizzle/                            # Database migrations
│   ├── 0000_*.sql                      # Migration files
│   └── meta/
│       └── _journal.json               # Migration journal
├── scripts/
│   └── docker-entrypoint.sh            # Docker entrypoint with migrations
├── dist/                               # Compiled JavaScript output
├── .github/
│   └── workflows/                      # GitHub Actions CI/CD
├── Dockerfile                          # Docker container configuration
├── docker-compose.yml                  # Docker Compose for development
├── docker-compose.prod.yml             # Docker Compose for production
├── drizzle.config.ts                   # Drizzle Kit configuration
├── .env.example                        # Environment variables template
├── .env                                # Environment variables (git-ignored)
└── package.json                        # Project dependencies and scripts
```

## Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Build Docker Image

```bash
docker build -t ven-ledger-backend .
docker run -p 3000:3000 --env-file .env ven-ledger-backend
```

**Note**: The CI/CD pipeline builds and pushes images as `ven-ledger-backend` to
Docker Hub.

## API Endpoints

### Health Check

- `GET /health` - Returns server health status

**Example Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-04T12:34:56.789Z"
}
```

## Testing

Run tests with coverage:

```bash
pnpm test
```

View coverage report in `coverage/` directory.

## Code Quality

The project enforces code quality through:

- **ESLint** with TypeScript support
- **Prettier** for consistent formatting
- **Husky** pre-commit hooks for linting and formatting
- **GitHub Actions** for automated testing and deployment

## Deployment

The project includes GitHub Actions workflows for:

- **CI Build & Push** (`.github/workflows/ci-build-push.yml`) - Automated
  testing, linting, type checking, and Docker image building/pushing to Docker
  Hub
- **Railway Deployment** (`.github/workflows/deploy-railway.yml`) - Automated
  database migrations and deployment to Railway platform

### Deployment Flow

**Staging (main branch):**

1. Push to `main` triggers CI pipeline
2. CI builds and pushes Docker image
3. On success, triggers staging deployment
4. Runs database migrations against staging DB
5. Redeploys Railway staging service
6. Performs health check

**Production (version tags):**

1. Push tag `v*` triggers production deployment
2. Runs database migrations against production DB (⚠️ with warning)
3. Tags and pushes production Docker image
4. Redeploys Railway production service

### GitHub Actions Secrets

Configure these secrets in your GitHub repository (Settings → Secrets and
variables → Actions):

#### Required for CI/CD

| Secret            | Description             |
| ----------------- | ----------------------- |
| `DOCKER_USERNAME` | Docker Hub username     |
| `DOCKER_PASSWORD` | Docker Hub access token |

#### Required for Railway Deployment

| Secret                        | Description                         |
| ----------------------------- | ----------------------------------- |
| `RAILWAY_TOKEN`               | Railway API token (production)      |
| `RAILWAY_TOKEN_STAGING`       | Railway API token (staging)         |
| `RAILWAY_SERVICE`             | Railway service name/ID             |
| `RAILWAY_SERVICE_URL`         | Production service health check URL |
| `RAILWAY_SERVICE_URL_STAGING` | Staging service health check URL    |
| `DB_URL_PRODUCTION`           | Production database URL             |
| `DB_URL_STAGING`              | Staging database URL                |

**Important**: Database migrations run automatically during deployment. Ensure
your migrations are backward-compatible when deploying to production.

#### Optional Secrets

| Secret                   | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `DEPLOYMENT_WEBHOOK_URL` | Webhook URL for deployment notifications (optional) |

## Railway Setup

To deploy this application on Railway:

1. **Create a Railway project**
   - Go to [Railway](https://railway.app) and create a new project
   - Connect your GitHub repository

2. **Add PostgreSQL addon**
   - In your Railway project, click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically generates `DATABASE_URL` environment variable
   - The application accepts both `DATABASE_URL` and `DB_URL`

3. **Configure environment variables**
   - Go to your service settings → Variables
   - Add the following variables:
     - `LOG_LEVEL` (e.g., `info` for production)
     - `LOG_FILE` (e.g., `server.log`)
     - `NODE_ENV=production`
   - `PORT` is automatically injected by Railway (no need to set it)
   - `DATABASE_URL` is automatically set if you added the PostgreSQL addon

4. **Deploy**
   - Railway will automatically deploy on pushes to `main` (if configured)
   - Or trigger manual deployments from the Railway dashboard

**PostgreSQL Version**: The project uses PostgreSQL 16 (as defined in
`docker-compose.yml`). Railway's PostgreSQL addon is compatible.

## Database Migrations

Migrations are managed by **Drizzle Kit** and follow this workflow:

**Local Development:**

- Migrations run automatically on `docker-compose up` via entrypoint script
- Container waits for PostgreSQL, then runs `pnpm db:migrate`

**Schema Changes:**

1. Modify `src/infrastructure/database/schema.ts`
2. Run `pnpm db:generate` to create migration files
3. Commit migration files to Git
4. On deployment, migrations run automatically

**Manual Migration (if needed):**

```bash
# Staging
DB_URL="your-staging-db-url" pnpm db:migrate

# Production (⚠️ use with caution)
DB_URL="your-production-db-url" NODE_ENV=production pnpm db:migrate
```

## License

[ISC](LICENSE)
