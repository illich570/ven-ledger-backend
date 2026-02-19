import type { RequestHandler } from 'express';
import { Router } from 'express';

import {
  accountantOnlyHandler,
  adminOnlyHandler,
  privateMeHandler,
  publicPingHandler,
} from '../handlers/auth-test.handler.js';
import { createRequireRole } from '../middleware/require-role.js';

export function createAuthTestRouter(requireSession: RequestHandler): Router {
  const authRouter = Router();

  authRouter.get('/public/ping', publicPingHandler);
  authRouter.get('/private/me', requireSession, privateMeHandler);
  authRouter.get(
    '/private/admin-only',
    requireSession,
    createRequireRole('admin'),
    adminOnlyHandler,
  );
  authRouter.get(
    '/private/accountant-only',
    requireSession,
    createRequireRole('accountant'),
    accountantOnlyHandler,
  );

  return authRouter;
}
