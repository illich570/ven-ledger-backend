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

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (package manager)

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

All environment variables are **required** for the application to run. Configure
them in your `.env` file:

| Variable      | Description             | Example                                 |
| ------------- | ----------------------- | --------------------------------------- |
| `NODE_ENV`    | Application environment | `development` \| `test` \| `production` |
| `PORT`        | Server listening port   | `3000`                                  |
| `LOG_LEVEL`   | Logging verbosity level | `debug` \| `info` \| `warn` \| `error`  |
| `LOG_FILE`    | Path to log file        | `server.log`                            |
| `DB_USER`     | Database username       | `postgres`                              |
| `DB_PASSWORD` | Database password       | `postgres`                              |
| `DB_NAME`     | Database name           | `express_boilerplate`                   |
| `DB_PORT`     | Database port           | `5432`                                  |

### Example `.env` file

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
LOG_FILE=server.log

# Database configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=express_boilerplate
DB_PORT=5432
```

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

## Project Structure

```
.
├── src/
│   ├── app.ts                  # Express app configuration
│   ├── server.ts               # Server entry point
│   ├── config.ts               # Environment config with Zod validation
│   ├── utilities.ts            # Shared utilities
│   ├── utilities.test.ts       # Utility tests
│   ├── infrastructure/
│   │   ├── app-error.ts        # Custom error class
│   │   ├── validation-error.ts # Validation error class
│   │   └── logger/
│   │       └── pino-logger.ts  # Pino logger configuration
│   └── presentation/
│       ├── middleware/
│       │   ├── error-handler.ts # Global error handler
│       │   └── validate.ts     # Request validation middleware
│       ├── routes/
│       │   └── health.routes.ts # Health check routes
│       └── handlers/
│           └── health.handler.ts # Health check handlers
├── dist/                       # Compiled JavaScript output
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
├── Dockerfile                  # Docker container configuration
├── docker-compose.yml          # Docker Compose for development
├── docker-compose.prod.yml     # Docker Compose for production
├── .env.example                # Environment variables template
├── .env                        # Environment variables (git-ignored)
└── package.json                # Project dependencies and scripts
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
docker build -t express-boilerplate .
docker run -p 3000:3000 --env-file .env express-boilerplate
```

## API Endpoints

### Health Check

- `GET /health` - Returns server health status

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

- **CI Build & Push** - Automated testing and Docker image building
- **Railway Deployment** - Automated deployment to Railway platform

## License

[ISC](LICENSE)
