import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const ConfigSchema = z.object({
  env: z.enum(['development', 'test', 'production']),
  port: z.string().transform(Number),
  logLevel: z.string(),
  logFile: z.string(),
});

const validConfig = ConfigSchema.parse({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  logFile: process.env.LOG_FILE,
});

export { validConfig };
