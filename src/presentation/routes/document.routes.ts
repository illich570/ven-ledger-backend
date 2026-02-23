import { Router } from 'express';

import type { GenerateDocumentUseCase } from '../../application/use-cases/generate-document.use-case.js';
import type { GetDocumentsUseCase } from '../../application/use-cases/get-documents.use-case.js';
import { createDocumentHandlers } from '../handlers/document.handler.js';
import { validate } from '../middleware/validate.js';
import { generateDocumentBodySchema } from '../schemas/document.schemas.js';

export function createDocumentRouter(
  getDocuments: GetDocumentsUseCase,
  generateDocument: GenerateDocumentUseCase,
): Router {
  const router = Router();
  const handlers = createDocumentHandlers(getDocuments, generateDocument);

  router.get('/', handlers.getAll);
  router.post(
    '/generate',
    validate({ body: generateDocumentBodySchema }),
    handlers.generateDocument,
  );

  return router;
}
