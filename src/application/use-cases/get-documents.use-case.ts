import type { Document } from '../../domain/entities/document.entity.js';
import type { DocumentRepository } from '../../domain/ports/document-repository.port.js';

export class GetDocumentsUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(): Promise<Document[]> {
    return this.documentRepository.findAll();
  }
}
