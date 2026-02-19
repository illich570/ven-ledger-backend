import { Router } from 'express';

import type { Auth } from '../../infrastructure/auth/auth.js';
import {
  createActivateUserHandler,
  createDeactivateUserHandler,
} from '../handlers/admin-users.handler.js';

export function createAdminUsersRouter(auth: Auth): Router {
  const router = Router();
  router.post('/users/:id/deactivate', createDeactivateUserHandler(auth));
  router.post('/users/:id/activate', createActivateUserHandler(auth));
  return router;
}
