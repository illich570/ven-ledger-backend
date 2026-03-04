import { eq } from 'drizzle-orm';

import type { User } from '../../../domain/entities/user.entity.js';
import type {
  UploadLogoUserInput,
  UserRepository,
} from '../../../domain/ports/user-repository.port.js';
import type { getDatabase } from '../database.js';
import { user } from '../schema/index.js';

type Database = ReturnType<typeof getDatabase>;
interface UploadLogoUserRepositoryInput extends UploadLogoUserInput {
  userId: string;
  keyName: string;
}

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly database: Database) {}
  async uploadLogo(input: UploadLogoUserRepositoryInput): Promise<User> {
    const rows = await this.database
      .update(user)
      .set({ logoKeyName: input.keyName })
      .where(eq(user.id, input.userId))
      .returning();
    return this.toDomain(rows[0]!);
  }

  private toDomain(row: typeof user.$inferSelect): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      image: row.image,
      logoKeyName: row.logoKeyName,
    };
  }
}
