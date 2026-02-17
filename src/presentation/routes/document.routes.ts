import { Router } from 'express';

import type { GetDocumentsUseCase } from '../../application/use-cases/get-documents.use-case.js';
import { createDocumentHandlers } from '../handlers/document.handler.js';

export function createDocumentRouter(
  getDocuments: GetDocumentsUseCase,
): Router {
  const router = Router();
  const handlers = createDocumentHandlers(getDocuments);

  router.get('/documents', handlers.getAll);

  return router;
}
