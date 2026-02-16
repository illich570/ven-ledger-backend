import { toNodeHandler } from 'better-auth/node';
import express from 'express';
import { pinoHttp } from 'pino-http';

import { createServer } from './app.js';
import { validConfig } from './config.js';
import { initializeDatabase } from './infrastructure/database/database.js';
import logger from './infrastructure/logger/pino-logger.js';
import { errorHandler } from './presentation/middleware/error-handler.js';
import { authRouter } from './presentation/routes/auth-test.routes.js';
import { healthRouter } from './presentation/routes/health.routes.js';
await initializeDatabase();

const { auth } = await import('./infrastructure/auth/auth.js');

const app = createServer();

// Better Auth handler before express.json() (per Better Auth Express docs)
// Express v5 requires named wildcard (e.g. *splat) for catch-all
app.all('/api/auth/*splat', (request, response) =>
  toNodeHandler(auth)(request, response),
);
app.use(express.json());
app.use(
  pinoHttp({
    logger,
  }),
);

// Infra routes (no /api prefix)
app.use(healthRouter);

// All business routes behind /api
const apiRouter = express.Router();
apiRouter.use(authRouter);
app.use('/api', apiRouter);

app.use(errorHandler);

const server = app.listen(validConfig.port, () => {
  console.log(`Server alive! Running on PORT: ${validConfig.port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
