import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { validConfig } from '../../config.js';
import type { EmailServicePort } from '../../domain/ports/email-service.port.js';
import { getDatabase } from '../database/database.js';
import * as schema from '../database/schema.js';

export function createAuth({
  emailService,
}: {
  emailService: EmailServicePort;
}) {
  return betterAuth({
    baseURL: validConfig.betterAuthUrl,
    secret: validConfig.betterAuthSecret,
    trustedOrigins: validConfig.trustedOrigins,
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
      minPasswordLength: 8,
      resetPasswordTokenExpiresIn: 1800,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await emailService.sendEmail({
          to: user.email,
          subject: 'Restablece tu contraseña',
          html: `<p>Haz clic para restablecer tu contraseña:</p><a href="${url}">${url}</a>`,
        });
      },
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
}
