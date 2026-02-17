import { count } from 'drizzle-orm';

import { validDatabaseConfig } from '#config/database-config.js';

import { validConfig } from '../../config.js';
import { getDatabase } from '../database/database.js';
import { user } from '../database/schema.js';
import { ResendEmailService } from '../email/email-service.js';
import logger from '../logger/pino-logger.js';
import { createAuth } from './auth.js';

const auth = createAuth({
  emailService: new ResendEmailService(
    validConfig.resendApiKey,
    validConfig.emailFrom,
  ),
});

/**
 * Idempotent seed: creates one initial user only when the user table is empty.
 * Intended for one-shot bootstrap (e.g. `pnpm db:seed`), not server startup.
 * Uses Better Auth sign-up API so password hashing is handled by the library.
 * Skips when any user already exists. Fails with a clear message if DB is empty
 * but seed env vars are missing.
 */
export async function seedInitialUser(): Promise<void> {
  const database = getDatabase();
  const [row] = await database.select({ value: count() }).from(user);
  const userCount = Number(row?.value ?? 0);

  if (userCount > 0) {
    logger.info({ userCount }, 'auth seed skipped: users already exist');
    return;
  }

  const { seedUserEmail, seedUserPassword, seedUserName } = validDatabaseConfig;
  if (!seedUserEmail || !seedUserPassword || !seedUserName) {
    throw new Error(
      'Database has no users but seed env vars are missing. Set SEED_USER_EMAIL, SEED_USER_PASSWORD, and SEED_USER_NAME to create the initial user.',
    );
  }

  await auth.api.signUpEmail({
    body: {
      name: seedUserName,
      email: seedUserEmail,
      password: seedUserPassword,
    },
  });

  logger.info(
    { email: seedUserEmail },
    'auth seed created: initial user created',
  );
}
