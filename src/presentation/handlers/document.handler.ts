import type { Request, Response } from 'express';

import type { GenerateDocumentUseCase } from '../../application/use-cases/generate-document.use-case.js';
import type { GetDocumentsUseCase } from '../../application/use-cases/get-documents.use-case.js';

export function createDocumentHandlers(
  getDocuments: GetDocumentsUseCase,
  generateDocument: GenerateDocumentUseCase,
) {
  return {
    getAll: async (_request: Request, response: Response): Promise<void> => {
      const documents = await getDocuments.execute();
      response.json(documents);
    },
    generateDocument: async (
      request: Request,
      response: Response,
    ): Promise<void> => {
      const document = await generateDocument.execute({
        documentHolderId: request.body.documentHolderId,
        createdBy: request.auth!.user.id,
        templateData: {
          title: request.body.title,
        },
      });
      response.status(201).json(document);
    },
  };
}
