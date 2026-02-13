import { Router } from 'express';

import {
  privateMeHandler,
  publicPingHandler,
} from '../handlers/auth-test.handler.js';
import { requireSession } from '../middleware/require-session.js';

export const authRouter = Router();

authRouter.get('/api/public/ping', publicPingHandler);
authRouter.get('/api/private/me', requireSession, privateMeHandler);
