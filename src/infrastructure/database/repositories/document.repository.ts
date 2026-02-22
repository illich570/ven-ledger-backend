import { eq } from 'drizzle-orm';

import type { Document } from '../../../domain/entities/document.entity.js';
import type {
  CreateDocumentInput,
  DocumentRepository,
} from '../../../domain/ports/document-repository.port.js';
import { getDatabase } from '../database.js';
import { documents } from '../schema/index.js';

type Database = ReturnType<typeof getDatabase>;

export class DrizzleDocumentRepository implements DocumentRepository {
  constructor(private readonly database: Database) {}

  async findAll(): Promise<Document[]> {
    const rows = await this.database.select().from(documents);
    return rows.map(row => this.toDomain(row));
  }

  async findById(id: number): Promise<Document | undefined> {
    const rows = await this.database
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    const row = rows[0];
    return row ? this.toDomain(row) : undefined;
  }

  async create(input: CreateDocumentInput): Promise<Document> {
    const rows = await this.database
      .insert(documents)
      .values(input)
      .returning();
    return this.toDomain(rows[0]!);
  }

  private toDomain(row: typeof documents.$inferSelect): Document {
    return {
      id: row.id,
      createdAt: row.createdAt,
      categoryId: row.categoryId,
      createdBy: row.createdBy,
      holderId: row.holderId,
      typeId: row.typeId,
      keyName: row.keyName,
    };
  }
}
