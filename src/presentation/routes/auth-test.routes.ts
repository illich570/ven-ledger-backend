import type { RequestHandler } from 'express';
import { Router } from 'express';

import {
  privateMeHandler,
  publicPingHandler,
} from '../handlers/auth-test.handler.js';

export function createAuthTestRouter(requireSession: RequestHandler): Router {
  const authRouter = Router();

  authRouter.get('/public/ping', publicPingHandler);
  authRouter.get('/private/me', requireSession, privateMeHandler);

  return authRouter;
}
