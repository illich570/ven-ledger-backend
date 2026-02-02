import { Router } from 'express';

import { healthHandler } from '../handlers/health.handler.js';

export const healthRouter = Router();

healthRouter.get('/health', healthHandler);
