import type { Request, Response } from 'express';

import type { GetDocumentsUseCase } from '../../application/use-cases/get-documents.use-case.js';

export function createDocumentHandlers(getDocuments: GetDocumentsUseCase) {
  return {
    getAll: async (_request: Request, response: Response): Promise<void> => {
      const documents = await getDocuments.execute();
      response.json(documents);
    },
  };
}
