declare global {
  namespace Express {
    interface Request {
      /** Set by requireSession middleware when the user is authenticated. */
      auth?: {
        user: {
          id: string;
          name: string;
          email: string;
          image?: string | null;
          role?: string | null;
        };
        session: { id: string; userId: string; expiresAt: Date; token: string };
      };
    }
  }
}

/** Ensures this file is treated as a module so global augmentation applies. */
// eslint-disable-next-line unicorn/require-module-specifiers -- declaration file needs module form
export {};
