import type { Document } from '../entities/document.entity.js';

export interface DocumentRepository {
  findAll(): Promise<Document[]>;
  findById(id: number): Promise<Document | undefined>;
  create(name: string): Promise<Document>;
}
