import type { betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import type { Logger } from 'pino';
import { pinoHttp } from 'pino-http';

import type { GetDocumentsUseCase } from './application/use-cases/get-documents.use-case.js';
import { createErrorHandler } from './presentation/middleware/error-handler.js';
import { createRequireSession } from './presentation/middleware/require-session.js';
import { createAuthTestRouter } from './presentation/routes/auth-test.routes.js';
import { createDocumentRouter } from './presentation/routes/document.routes.js';
import { healthRouter } from './presentation/routes/health.routes.js';

export type Auth = ReturnType<typeof betterAuth>;

export interface AppDependencies {
  auth: Auth;
  logger: Logger;
  trustedOrigins: string[];
  getDocuments: GetDocumentsUseCase;
}

export function createApp({
  auth,
  logger,
  trustedOrigins,
  getDocuments,
}: AppDependencies): express.Express {
  const app = express();

  app.use(
    cors({
      origin: trustedOrigins,
      credentials: true,
    }),
  );

  // Better Auth handler before express.json() (per Better Auth Express docs)
  // Express v5 requires named wildcard (e.g. *splat) for catch-all
  app.all('/api/auth/*splat', (request, response) =>
    toNodeHandler(auth)(request, response),
  );

  app.use(express.json());
  app.use(pinoHttp({ logger }));

  // Infra routes (no /api prefix)
  app.use(healthRouter);

  // All business routes behind /api
  const apiRouter = express.Router();
  const requireSession = createRequireSession(auth);
  apiRouter.use(createAuthTestRouter(requireSession));
  apiRouter.use(createDocumentRouter(getDocuments));
  app.use('/api', apiRouter);

  app.use(createErrorHandler(logger));

  return app;
}
