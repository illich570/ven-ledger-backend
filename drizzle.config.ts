import { defineConfig } from 'drizzle-kit';

import { validDatabaseConfig } from './src/config/database-config';

export default defineConfig({
  schema: './src/infrastructure/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: validDatabaseConfig.dbUrl,
  },
  verbose: true,
  strict: true,
});
