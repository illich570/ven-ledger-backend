import type { betterAuth } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../../infrastructure/app-error.js';

type Auth = ReturnType<typeof betterAuth>;

export function createRequireSession(auth: Auth) {
  return async function requireSession(
    request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<void> {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session) {
      next(new AppError('Unauthorized', 401));
      return;
    }
    request.auth = {
      user: session.user,
      session: session.session,
    };
    next();
  };
}
