import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const ConfigSchema = z.object({
  env: z.enum(['development', 'test', 'production']),
  port: z.string().transform(Number),
  logLevel: z.string(),
  logFile: z
    .string()
    .optional()
    .transform(v => v?.trim() || 'server.log'),
  serviceName: z
    .string()
    .optional()
    .transform(v => v?.trim() || 'ven-ledger-backend'),
  appVersion: z
    .string()
    .optional()
    .transform(v => v?.trim() || '1.0.0'),
  logtailSourceToken: z
    .string()
    .optional()
    .transform(v => v?.trim() || undefined),
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
  cloudflareAccountId: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  bucketName: z.string(),
  puppeteerExecutablePath: z.string(),
  pdfMaxConcurrency: z.string().transform(Number),
  templateViewsDir: z.string().optional(),
});

const validConfig = ConfigSchema.parse({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  logFile: process.env.LOG_FILE,
  serviceName: process.env.SERVICE_NAME,
  appVersion: process.env.APP_VERSION,
  logtailSourceToken: process.env.LOGTAIL_SOURCE_TOKEN,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.BETTER_AUTH_URL,
  trustedOrigins: process.env.TRUSTED_ORIGINS,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  bucketName: process.env.BUCKET_NAME,
  puppeteerExecutablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  pdfMaxConcurrency: process.env.PDF_MAX_CONCURRENCY,
  templateViewsDir: process.env.TEMPLATE_VIEWS_DIR,
});

export { validConfig };
