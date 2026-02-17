import { eq } from 'drizzle-orm';

import type { Document } from '../../../domain/entities/document.entity.js';
import type { DocumentRepository } from '../../../domain/ports/document-repository.port.js';
import { getDatabase } from '../database.js';
import { documents } from '../schema.js';

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

  async create(name: string): Promise<Document> {
    const rows = await this.database
      .insert(documents)
      .values({ name })
      .returning();
    return this.toDomain(rows[0]!);
  }

  private toDomain(row: typeof documents.$inferSelect): Document {
    return {
      id: row.id,
      name: row.name,
      createdAt: row.createdAt ?? new Date(),
    };
  }
}
