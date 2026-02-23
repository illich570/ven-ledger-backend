import type { Document } from '../entities/document.entity.js';

export interface CreateDocumentInput {
  typeId: number;
  categoryId: number;
  holderId: string;
  keyName: string;
  createdBy: string;
}
export interface DocumentRepository {
  findAll(): Promise<Document[]>;
  findById(id: number): Promise<Document | undefined>;
  create(input: CreateDocumentInput): Promise<Document>;
}
