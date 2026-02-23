import { randomUUID } from 'node:crypto';

import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import type { Logger } from 'pino';
import { pinoHttp } from 'pino-http';

import type { GenerateDocumentUseCase } from './application/use-cases/generate-document.use-case.js';
import type { GetDocumentsUseCase } from './application/use-cases/get-documents.use-case.js';
import type { Auth } from './infrastructure/auth/auth.js';
import { createErrorHandler } from './presentation/middleware/error-handler.js';
import { createNotFoundHandler } from './presentation/middleware/not-found-handler.js';
import { createRequireRole } from './presentation/middleware/require-role.js';
import { createRequireSession } from './presentation/middleware/require-session.js';
import { createAdminUsersRouter } from './presentation/routes/admin-users.routes.js';
import { createAuthTestRouter } from './presentation/routes/auth-test.routes.js';
import { createDocumentRouter } from './presentation/routes/document.routes.js';
import { healthRouter } from './presentation/routes/health.routes.js';

export interface AppDependencies {
  auth: Auth;
  logger: Logger;
  trustedOrigins: string[];
  getDocuments: GetDocumentsUseCase;
  generateDocument: GenerateDocumentUseCase;
}

export function createApp({
  auth,
  logger,
  trustedOrigins,
  getDocuments,
  generateDocument,
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
  app.use(
    pinoHttp({
      logger,
      genReqId: request =>
        (request.headers['x-request-id'] as string) || randomUUID(),
      customProps: (request, _response) => ({ requestId: request.id }),
    }),
  );
  app.use((request, response, next) => {
    if (request.id) response.setHeader('X-Request-Id', String(request.id));
    next();
  });

  // Infra routes (no /api prefix)
  app.use(healthRouter);

  // All business routes behind /api
  const apiRouter = express.Router();
  const requireSession = createRequireSession(auth);
  apiRouter.use(createAuthTestRouter(requireSession));
  apiRouter.use(
    '/admin',
    requireSession,
    createRequireRole('admin'),
    createAdminUsersRouter(auth),
  );
  apiRouter.use(
    '/documents',
    requireSession,
    createDocumentRouter(getDocuments, generateDocument),
  );
  app.use('/api', apiRouter);

  app.use(createNotFoundHandler());
  app.use(createErrorHandler(logger));

  return app;
}
