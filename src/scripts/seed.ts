/**
 * Standalone script to run the initial user seed.
 * Usage: pnpm db:seed
 * Requires DB_URL and SEED_USER_EMAIL, SEED_USER_PASSWORD, SEED_USER_NAME when DB has no users.
 */
import { initializeDatabase } from '../infrastructure/database/database.js';

await initializeDatabase();
await import('../infrastructure/auth/auth.js');
const { seedInitialUser } = await import(
  '../infrastructure/auth/seed-initial-user.js'
);
await seedInitialUser();
