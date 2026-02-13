import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { validConfig } from '../../config.js';
import { getDatabase } from '../database/database.js';
import * as schema from '../database/schema.js';

export const auth = betterAuth({
  baseURL: validConfig.betterAuthUrl,
  secret: validConfig.betterAuthSecret,
  database: drizzleAdapter(getDatabase(), {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(validConfig.googleClientId && validConfig.googleClientSecret
      ? {
          google: {
            clientId: validConfig.googleClientId,
            clientSecret: validConfig.googleClientSecret,
          },
        }
      : {}),
  },
});
