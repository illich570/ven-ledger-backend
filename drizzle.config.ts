import { defineConfig } from 'drizzle-kit';

import { validDatabaseConfig } from './src/config/database-config';

export default defineConfig({
  schema: './dist/infrastructure/database/schema/*.schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: validDatabaseConfig.dbUrl,
  },
  verbose: true,
  strict: true,
});
