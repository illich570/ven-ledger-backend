# Repository Guidelines

- If a rule is not explicitly defined here, DO NOT assume modern defaults.
- Ask or follow existing project patterns instead.

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
- Required variables: `NODE_ENV`, `PORT`, `LOG_LEVEL`, `LOG_FILE`. Consider
  using a local `.env` file for development.
- **Never use `process.env` directly.** All environment variables must pass
  through the config schemas validated with Zod:
  - `src/config.ts` (`validConfig`): app/server config (auth, logging, port,
    etc.). Used when the full app runs.
  - `src/config/database-config.ts` (`validDatabaseConfig`): DB connection and
    seed vars. Used for DB commands (migrate, seed, studio) and when the app
    connects to the database. Add any new env var to the appropriate schema and
    have consumers import from the config module instead of reading
    `process.env`.

## Instructions for Development & Learning

- Every question related to implement, updgrade, fix, or improve needs to be
  aimed to comply an clean archictecture, in the current context (typescript,
  drizzle, expressjs)
