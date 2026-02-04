import { defineConfig } from 'drizzle-kit';

import { validConfig } from './src/config';

export default defineConfig({
  schema: './src/infrastructure/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: validConfig.dbUrl,
  },
  verbose: true,
  strict: true,
});
