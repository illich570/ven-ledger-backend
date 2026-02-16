import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const ConfigSchema = z.object({
  env: z.enum(['development', 'test', 'production']),
  port: z.string().transform(Number),
  logLevel: z.string(),
  logFile: z.string(),
  betterAuthSecret: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  betterAuthUrl: z
    .string()
    .optional()
    .transform(v => v?.trim() || 'http://localhost:3000'),
  trustedOrigins: z
    .string()
    .optional()
    .transform(v =>
      v
        ? v
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : [],
    ),
  googleClientId: z.string().optional(),
  googleClientSecret: z.string().optional(),
  resendApiKey: z.string().min(1, 'RESEND_API_KEY is required'),
  emailFrom: z
    .string()
    .optional()
    .transform(v => v?.trim() || 'onboarding@resend.dev'),
});

const validConfig = ConfigSchema.parse({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  logFile: process.env.LOG_FILE,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.BETTER_AUTH_URL,
  trustedOrigins: process.env.TRUSTED_ORIGINS,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
});

export { validConfig };
