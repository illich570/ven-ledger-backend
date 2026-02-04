import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const DatabaseConfigSchema = z.object({
  dbUrl: z.url(),
});

const validDatabaseConfig = DatabaseConfigSchema.parse({
  dbUrl: process.env.DATABASE_URL || process.env.DB_URL,
});

export { validDatabaseConfig };
