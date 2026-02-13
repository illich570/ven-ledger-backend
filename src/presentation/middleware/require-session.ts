import { fromNodeHeaders } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../../infrastructure/app-error.js';

export async function requireSession(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  const { auth } = await import('../../infrastructure/auth/auth.js');
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
}
