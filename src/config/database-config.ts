import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const DatabaseConfigSchema = z.object({
  dbUrl: z.url(),
  seedUserEmail: z
    .string()
    .optional()
    .transform(v => v?.trim() || undefined),
  seedUserPassword: z
    .string()
    .optional()
    .transform(v => v || undefined),
  seedUserName: z
    .string()
    .optional()
    .transform(v => v?.trim() || undefined),
});

const validDatabaseConfig = DatabaseConfigSchema.parse({
  dbUrl: process.env.DATABASE_URL || process.env.DB_URL,
  seedUserEmail: process.env.SEED_USER_EMAIL,
  seedUserPassword: process.env.SEED_USER_PASSWORD,
  seedUserName: process.env.SEED_USER_NAME,
});

export { validDatabaseConfig };
