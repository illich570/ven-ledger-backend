import { Router } from 'express';

import type { UploadLogoUserUseCase } from '../../application/users/use-cases/upload-logo-user.use-case.js';
import { createUserHandlers } from '../handlers/user.handler.js';
import { uploadLogoMiddleware } from '../middleware/upload-logo.middleware.js';

export function createUsersRouter(uploadLogo: UploadLogoUserUseCase): Router {
  const router = Router();
  const handlers = createUserHandlers(uploadLogo);

  router.post('/upload-logo', uploadLogoMiddleware, handlers.uploadLogo);

  return router;
}
