import { fromNodeHeaders } from 'better-auth/node';
import type { Request, Response } from 'express';

import type { Auth } from '../../infrastructure/auth/auth.js';

export function createDeactivateUserHandler(auth: Auth) {
  return async (request: Request, response: Response): Promise<void> => {
    const userId = request.params.id;
    if (!userId) {
      response.status(400).json({ error: 'Missing user id' });
      return;
    }
    try {
      await auth.api.banUser({
        body: { userId },
        headers: fromNodeHeaders(request.headers),
      });
      response.status(200).json({ ok: true, message: 'User deactivated' });
    } catch (error) {
      const status = (error as { status?: number })?.status ?? 500;
      const message =
        (error as { message?: string })?.message ?? 'Failed to deactivate user';
      response.status(status).json({ error: message });
    }
  };
}

export function createActivateUserHandler(auth: Auth) {
  return async (request: Request, response: Response): Promise<void> => {
    const userId = request.params.id;
    if (!userId) {
      response.status(400).json({ error: 'Missing user id' });
      return;
    }
    try {
      await auth.api.unbanUser({
        body: { userId },
        headers: fromNodeHeaders(request.headers),
      });
      response.status(200).json({ ok: true, message: 'User activated' });
    } catch (error) {
      const status = (error as { status?: number })?.status ?? 500;
      const message =
        (error as { message?: string })?.message ?? 'Failed to activate user';
      response.status(status).json({ error: message });
    }
  };
}
