# Repository Guidelines

- If a rule is not explicitly defined here, DO NOT assume modern defaults Ask or
  follow existing project patterns instead.

## Project Structure & Module Organization

- `src/` holds the application code. Entry points are `src/server.ts` (HTTP
  server) and `src/app.ts` (Express app setup).
- Shared utilities live in `src/utilities.ts`, with tests alongside in
  `src/utilities.test.ts`.
- Build output is emitted to `dist/` via TypeScript (`tsc`).
- Tooling/config lives at the repo root (`tsconfig.json`, `eslint.config.ts`,
  `prettier.config.js`, `jest.config.js`).

## Build, Test, and Development Commands

Use `pnpm` (see `packageManager` in `package.json`).

- `pnpm dev`: run the server in watch mode via `tsx`.
- `pnpm build`: compile TypeScript to `dist/`.
- `pnpm start`: run the compiled server from `dist/server.js`.
- `pnpm test`: run Jest tests (`*.test.ts`).
- `pnpm lint` / `pnpm lint:fix`: lint the project (and auto-fix).
- `pnpm format` / `pnpm format:check`: format with Prettier (or verify).
- `pnpm typecheck`: TypeScript typecheck without emitting.

## Coding Style & Naming Conventions

- Indentation: 2 spaces; semicolons required; single quotes; trailing commas
  (Prettier enforced).
- ESM is enabled (`"type": "module"`), so use `import`/`export` and `.ts` files.
- Keep import order sorted (enforced by `eslint-plugin-simple-import-sort`).
- Test files use the `*.test.ts` suffix.

## Testing Guidelines

- Test runner: Jest with `ts-jest` ESM preset (`jest.config.js`).
- Place tests alongside the code under `src/` (example:
  `src/utilities.test.ts`).
- Run `pnpm test` locally; no explicit coverage threshold is configured.

## Commit & Pull Request Guidelines

- Recent history uses bracketed prefixes like `[FIX]` and `[REF]`. Prefer a
  short tag plus a concise subject (e.g., `[FIX] handle missing env vars`).
- If opening a PR, include a brief summary, testing notes (or “not run”), and
  any relevant config changes.

## Configuration & Environment

- Runtime config is loaded from environment variables in `src/config.ts` using
  `dotenv` + `zod`.
- Required variables: `NODE_ENV`, `PORT`, `LOG_LEVEL`. Optional: `LOG_FILE`
  (default `server.log`; only used in development). Consider using a local
  `.env` file for development.
- **Never use `process.env` directly.** All environment variables must pass
  through the config schemas validated with Zod:
  - `src/config.ts` (`validConfig`): app/server config (auth, logging, port,
    etc.). Used when the full app runs.
  - `src/config/database-config.ts` (`validDatabaseConfig`): DB connection and
    seed vars. Used for DB commands (migrate, seed, studio) and when the app
    connects to the database. Add any new env var to the appropriate schema and
    have consumers import from the config module instead of reading
    `process.env`.

## Paradigm Convention (Class vs Functional)

Follow this convention so the codebase stays consistent and scales predictably.

- **Use classes for:**
  - **Use cases** (`src/application/use-cases/`): One class per use case,
    constructor injection of domain ports, single public `execute()` method.
  - **Infrastructure adapters** (`src/infrastructure/**/`): Any service that
    implements a domain port (DB repositories, email, external APIs, etc.) must
    be a class with constructor injection (e.g. `DrizzleDocumentRepository`,
    `ResendEmailService`).
  - **Custom errors** (`src/infrastructure/`): Classes extending `Error` or
    `AppError` (e.g. `AppError`, `ValidationError`).

- **Use a functional style (no classes) for:**
  - **Domain layer**: Entities and ports are TypeScript interfaces/types only.
  - **Presentation layer**: Routes, handlers, and middleware are factory
    functions (e.g. `createXRouter(deps)`, `createXHandlers(deps)`).
  - **Configuration**: Zod schemas and validated exports in `src/config.ts` and
    `src/config/`.
  - **Infrastructure bootstrap**: Module-level setup that creates instances for
    injection (e.g. `database.ts`, `pino-logger.ts`, `auth.ts` as
    `createAuth({ emailService })`).
  - **Entry points**: `server.ts` and `app.ts` as functional composition roots.
  - **Schemas, utilities, scripts**: Pure functions and declarative definitions.

Summary: **Classes** = use cases + adapters implementing ports + errors.
**Functional** = everything else.

## Authentication & RBAC

- Auth is handled by Better Auth in `src/infrastructure/auth/auth.ts` (see also
  `.cursor/rules/auth-backend-context.mdc` for mount path, env vars, and session
  middleware).
- **Roles** are global app-level: `admin`, `accountant`, `client`. Defined in
  `src/infrastructure/auth/permissions.ts` via `createAccessControl` and passed
  into the Better Auth **admin** plugin. New signups get
  `defaultRole: 'client'`.
- The `user` table has a `role` column; `request.auth.user.role` is set after
  `requireSession` and typed in `src/presentation/types/express.d.ts`.
- To protect routes by role, use `createRequireRole(...allowedRoles)` from
  `src/presentation/middleware/require-role.ts` **after** `requireSession` (e.g.
  `requireSession, createRequireRole('admin')`). Add custom resource/actions in
  `permissions.ts` when you need permission-based checks.

## Instructions for Development & Learning

- Every question related to implement, updgrade, fix, or improve needs to be
  aimed to comply an clean archictecture + adapter/ports, in the current context
  (typescript, drizzle, expressjs)
