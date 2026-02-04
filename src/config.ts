import dotenv from 'dotenv';
import z from 'zod';
dotenv.config();

// Startup decision: Using DB_URL instead of DATABASE_URL for internal consistency
// While DATABASE_URL is the 12-factor standard, DB_URL is already used throughout
// the codebase. Keeping DB_URL avoids unnecessary refactoring during MVP phase.
// Both variables are accepted for flexibility with PaaS platforms (Railway, Heroku).
const ConfigSchema = z.object({
  env: z.enum(['development', 'test', 'production']),
  port: z.string().transform(Number),
  logLevel: z.string(),
  logFile: z.string(),
  dbUrl: z.url(),
});

const validConfig = ConfigSchema.parse({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  logFile: process.env.LOG_FILE,
  // Accept both DATABASE_URL (standard) and DB_URL (internal) for flexibility
  dbUrl: process.env.DATABASE_URL || process.env.DB_URL,
});

export { validConfig };
