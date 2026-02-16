import { Router } from 'express';

import {
  privateMeHandler,
  publicPingHandler,
} from '../handlers/auth-test.handler.js';
import { requireSession } from '../middleware/require-session.js';

export const authRouter = Router();

authRouter.get('/public/ping', publicPingHandler);
authRouter.get('/private/me', requireSession, privateMeHandler);
